#!/usr/bin/env python3
"""Create daily tracking analysis report and charts from measurement CSV."""

from __future__ import annotations

import re
from datetime import datetime
from pathlib import Path

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


plt.rcParams["figure.figsize"] = (14, 8)
plt.rcParams["font.size"] = 10
plt.rcParams["axes.labelsize"] = 11
plt.rcParams["axes.titlesize"] = 12
plt.rcParams["xtick.labelsize"] = 9
plt.rcParams["ytick.labelsize"] = 9
plt.rcParams["legend.fontsize"] = 10
plt.rcParams["lines.linewidth"] = 2


def discover_csv(measurement_dir: Path) -> Path:
    candidates = sorted(measurement_dir.glob("*_verlauf_incl_yield_today_and_outside_temp.csv"))
    if not candidates:
        raise FileNotFoundError("No *_verlauf_incl_yield_today_and_outside_temp.csv found.")
    return candidates[0]


def parse_measurement_date(csv_name: str, folder_name: str) -> tuple[str, str]:
    # Human date label and ISO date for filenames
    m_csv = re.match(r"(?P<dd>\d{2})\.(?P<mm>\d{2})\.(?P<yyyy>\d{4})", csv_name)
    if m_csv:
        dt = datetime(int(m_csv.group("yyyy")), int(m_csv.group("mm")), int(m_csv.group("dd")))
        return f"{dt.strftime('%B')} {dt.day}, {dt.year}", dt.strftime("%Y-%m-%d")

    m_folder = re.match(r"(?P<yyyy>\d{4})-(?P<mm>\d{2})-(?P<dd>\d{2})", folder_name)
    if m_folder:
        dt = datetime(int(m_folder.group("yyyy")), int(m_folder.group("mm")), int(m_folder.group("dd")))
        return f"{dt.strftime('%B')} {dt.day}, {dt.year}", dt.strftime("%Y-%m-%d")

    now = datetime.now()
    return now.strftime("%B %d, %Y"), now.strftime("%Y-%m-%d")


def to_number(series: pd.Series) -> pd.Series:
    return pd.to_numeric(series, errors="coerce")


def channel_map(entity_ids: pd.Series) -> dict[str, str]:
    channels: dict[str, str] = {}
    for sensor in entity_ids.unique():
        s = sensor.lower()
        if "ch1" in s and "power" in s:
            channels["ch1_power"] = sensor
        elif "ch2" in s and "power" in s:
            channels["ch2_power"] = sensor
        elif "ch3" in s and "power" in s:
            channels["ch3_power"] = sensor
        elif "ch4" in s and "power" in s:
            channels["ch4_power"] = sensor
        elif "ch1" in s and "yield" in s:
            channels["ch1_yield"] = sensor
        elif "ch2" in s and "yield" in s:
            channels["ch2_yield"] = sensor
        elif "ch3" in s and "yield" in s:
            channels["ch3_yield"] = sensor
        elif "ch4" in s and "yield" in s:
            channels["ch4_yield"] = sensor
        elif "temperature" in s or "temp" in s:
            channels["temperature"] = sensor
    return channels


def main() -> int:
    measurement_dir = Path(__file__).resolve().parent
    csv_path = discover_csv(measurement_dir)

    date_label, date_iso = parse_measurement_date(csv_path.name, measurement_dir.name)
    title_suffix = f"Bochum, Germany - {date_label}"

    print("Loading:", csv_path.name)
    df = pd.read_csv(csv_path)
    df["last_changed"] = pd.to_datetime(df["last_changed"])
    df["state_numeric"] = to_number(df["state"])

    channels = channel_map(df["entity_id"])
    print("Channels found:", len(channels))

    t_start = df["last_changed"].min()
    t_end = df["last_changed"].max()
    duration_hours = (t_end - t_start).total_seconds() / 3600.0

    ch_order = ["ch1", "ch2", "ch3", "ch4"]
    ch_descriptions = {
        "ch1": "West 30 deg (Static, CHSM54M-HC-405)",
        "ch2": "Sunchronizer S2 (1-Axis Elevation, CHSM54M-HC-405)",
        "ch3": "East 30 deg (Static, JAM54S31-395)",
        "ch4": "Sunchronizer D2 (2-Axis, JAM54S31-395)",
    }
    ch_models = {
        "ch1": ("CHSM54M-HC-405", 405),
        "ch2": ("CHSM54M-HC-405", 405),
        "ch3": ("JAM54S31-395", 395),
        "ch4": ("JAM54S31-395", 395),
    }
    colors = {"ch1": "#FF6B6B", "ch2": "#4ECDC4", "ch3": "#FFD93D", "ch4": "#6BCB77"}

    power_data: dict[str, pd.DataFrame] = {}
    yield_data: dict[str, pd.DataFrame] = {}

    for ch in ch_order:
        p_key = f"{ch}_power"
        y_key = f"{ch}_yield"
        if p_key in channels:
            pdata = df[df["entity_id"] == channels[p_key]].copy().sort_values("last_changed")
            pdata["state_numeric"] = to_number(pdata["state"])
            power_data[ch] = pdata
        if y_key in channels:
            ydata = df[df["entity_id"] == channels[y_key]].copy().sort_values("last_changed")
            ydata["state_numeric"] = to_number(ydata["state"])
            yield_data[ch] = ydata

    power_stats: dict[str, dict[str, float]] = {}
    for ch, pdata in power_data.items():
        valid = pdata["state_numeric"].dropna()
        if len(valid) > 0:
            power_stats[ch] = {
                "min": float(valid.min()),
                "max": float(valid.max()),
                "mean": float(valid.mean()),
                "std": float(valid.std()),
                "count": int(len(valid)),
            }

    final_yields: dict[str, float] = {}
    for ch, ydata in yield_data.items():
        valid = ydata[(ydata["state_numeric"].notna()) & (ydata["state_numeric"] > 0)]
        if len(valid) > 0:
            final_yields[ch] = float(valid["state_numeric"].max())

    temp_stats = {"min": float("nan"), "max": float("nan"), "mean": float("nan"), "count": 0}
    if "temperature" in channels:
        tdata = df[df["entity_id"] == channels["temperature"]].copy()
        tdata["state_numeric"] = to_number(tdata["state"])
        tvalid = tdata["state_numeric"].dropna()
        if len(tvalid) > 0:
            temp_stats = {
                "min": float(tvalid.min()),
                "max": float(tvalid.max()),
                "mean": float(tvalid.mean()),
                "count": int(len(tvalid)),
            }

    # Graph 1
    fig, ax = plt.subplots(figsize=(15, 7))
    for ch in ch_order:
        if ch in power_data:
            d = power_data[ch]
            ax.plot(d["last_changed"], d["state_numeric"], label=f"{ch.upper()}: {ch_descriptions[ch]}", color=colors[ch], alpha=0.85)
    ax.set_xlabel("Time of Day (UTC)")
    ax.set_ylabel("Power (W)")
    ax.set_title(f"Solar Panel Power Comparison\n{title_suffix}", fontweight="bold")
    ax.grid(True, alpha=0.3)
    ax.legend(loc="upper left")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M"))
    ax.xaxis.set_major_locator(mdates.HourLocator(interval=1))
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(measurement_dir / "graph_1_power_profile.png", dpi=150, bbox_inches="tight")
    plt.close()

    # Graph 2
    fig, ax = plt.subplots(figsize=(15, 7))
    for ch in ch_order:
        if ch in yield_data:
            d = yield_data[ch]
            d = d[d["state_numeric"].notna()]
            ax.plot(d["last_changed"], d["state_numeric"], label=f"{ch.upper()}: {ch_descriptions[ch]}", color=colors[ch], alpha=0.85)
    ax.set_xlabel("Time of Day (UTC)")
    ax.set_ylabel("Daily Energy Yield (Wh)")
    ax.set_title(f"Cumulative Daily Yield\n{title_suffix}", fontweight="bold")
    ax.grid(True, alpha=0.3)
    ax.legend(loc="upper left")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M"))
    ax.xaxis.set_major_locator(mdates.HourLocator(interval=1))
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(measurement_dir / "graph_2_cumulative_yield.png", dpi=150, bbox_inches="tight")
    plt.close()

    # Graph 3
    fig, ax = plt.subplots(figsize=(12, 7))
    values = [final_yields.get(ch, 0.0) for ch in ch_order]
    labels = [ch_descriptions[ch] for ch in ch_order]
    bars = ax.barh(labels, values, color=[colors[ch] for ch in ch_order], alpha=0.85, edgecolor="black", linewidth=1.5)
    for i, (bar, val) in enumerate(zip(bars, values)):
        ax.text(val + max(values) * 0.01 if max(values) > 0 else 0.5, i, f"{val:.0f} Wh ({val/1000:.2f} kWh)", va="center", fontsize=10)
    ax.set_xlabel("Energy Yield (Wh)")
    ax.set_title(f"Daily Total Energy Output\n{title_suffix}", fontweight="bold")
    ax.grid(True, alpha=0.3, axis="x")
    plt.tight_layout()
    plt.savefig(measurement_dir / "graph_3_comparison_bars.png", dpi=150, bbox_inches="tight")
    plt.close()

    # Graph 4
    fig, ax = plt.subplots(figsize=(12, 7))
    adv = {}
    if final_yields.get("ch4", 0) > 0:
        ch4 = final_yields["ch4"]
        for ch in ["ch1", "ch2", "ch3"]:
            if final_yields.get(ch, 0) > 0:
                adv[ch] = ((ch4 - final_yields[ch]) / final_yields[ch]) * 100.0
    if adv:
        bars = ax.bar([f"{k.upper()}\n{ch_descriptions[k]}" for k in adv.keys()], list(adv.values()), color=[colors[k] for k in adv.keys()], alpha=0.85, edgecolor="black")
        for b, v in zip(bars, adv.values()):
            ax.text(b.get_x() + b.get_width() / 2, b.get_height(), f"+{v:.1f}%", ha="center", va="bottom")
    ax.set_ylabel("Advantage vs alternatives (%)")
    ax.set_title(f"Energy Yield Advantage of CH4\n{title_suffix}", fontweight="bold")
    ax.grid(True, alpha=0.3, axis="y")
    plt.tight_layout()
    plt.savefig(measurement_dir / "graph_4_advantage_analysis.png", dpi=150, bbox_inches="tight")
    plt.close()

    # Graph 5
    fig, ax = plt.subplots(figsize=(15, 7))
    for ch in ch_order:
        if ch in power_data:
            d = power_data[ch].copy()
            d["smoothed"] = d["state_numeric"].rolling(window=20, center=True).mean()
            ax.fill_between(d["last_changed"], 0, d["smoothed"], label=f"{ch.upper()}: {ch_descriptions[ch]}", color=colors[ch], alpha=0.45)
    ax.set_xlabel("Time of Day (UTC)")
    ax.set_ylabel("Power (W)")
    ax.set_title(f"Power Profile (Smoothed)\n{title_suffix}", fontweight="bold")
    ax.grid(True, alpha=0.3)
    ax.legend(loc="upper left")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M"))
    ax.xaxis.set_major_locator(mdates.HourLocator(interval=1))
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(measurement_dir / "graph_5_performance_area.png", dpi=150, bbox_inches="tight")
    plt.close()

    # Graph 6
    if "temperature" in channels:
        tdata = df[df["entity_id"] == channels["temperature"]].copy().sort_values("last_changed")
        tdata["state_numeric"] = to_number(tdata["state"])
        tdata = tdata[tdata["state_numeric"].notna()]
        if len(tdata) > 0:
            fig, ax = plt.subplots(figsize=(15, 5))
            ax.plot(tdata["last_changed"], tdata["state_numeric"], color="#FF8C42", linewidth=2.2)
            ax.fill_between(tdata["last_changed"], tdata["state_numeric"], alpha=0.2, color="#FF8C42")
            ax.set_xlabel("Time of Day (UTC)")
            ax.set_ylabel("Temperature (degC)")
            ax.set_title(f"Outside Temperature Progression\n{title_suffix}", fontweight="bold")
            ax.grid(True, alpha=0.3)
            ax.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M"))
            ax.xaxis.set_major_locator(mdates.HourLocator(interval=1))
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.savefig(measurement_dir / "graph_6_temperature_progression.png", dpi=150, bbox_inches="tight")
            plt.close()

    # Keep compatibility with existing report structure.
    for optional_graph in ["graph_7_tracking_deviation.png", "graph_8_performance_ratio_vs_east_west_sum.png"]:
        path = measurement_dir / optional_graph
        if not path.exists():
            fig, ax = plt.subplots(figsize=(8, 3))
            ax.axis("off")
            ax.text(0.5, 0.5, "Not enough telemetry for this graph in this dataset.", ha="center", va="center")
            plt.tight_layout()
            plt.savefig(path, dpi=120)
            plt.close()

    def _fmt_gain(val: float) -> str:
        if not np.isfinite(val):
            return "n/a"
        return f"+{val:.1f}%" if val > 0 else f"{val:.1f}%"

    ch4_reference = final_yields.get("ch4", float("nan"))
    worst_panel_yield = min(final_yields.values()) if final_yields else float("nan")
    east_west_sum_yield = final_yields.get("ch1", 0) + final_yields.get("ch3", 0)
    worst_panel_key = min(final_yields, key=final_yields.get) if final_yields else None

    rel_to_ch4: dict[str, float] = {}
    rel_to_worst: dict[str, float] = {}
    rel_to_east_west_sum: dict[str, float] = {}
    display_rel_to_worst: dict[str, str] = {}
    for _ch in ["ch1", "ch2", "ch3", "ch4"]:
        _v = final_yields.get(_ch, float("nan"))
        rel_to_ch4[_ch] = ((_v - ch4_reference) / ch4_reference * 100) if (np.isfinite(_v) and np.isfinite(ch4_reference) and ch4_reference != 0) else float("nan")
        rel_to_worst[_ch] = ((_v - worst_panel_yield) / worst_panel_yield * 100) if (np.isfinite(_v) and np.isfinite(worst_panel_yield) and worst_panel_yield != 0) else float("nan")
        rel_to_east_west_sum[_ch] = ((_v - east_west_sum_yield) / east_west_sum_yield * 100) if (np.isfinite(_v) and east_west_sum_yield != 0) else float("nan")
        display_rel_to_worst[_ch] = "Reference" if _ch == worst_panel_key else _fmt_gain(rel_to_worst.get(_ch, float("nan")))

    ch4_vs_ch1 = rel_to_ch4.get("ch1", float("nan")) * -1 if np.isfinite(rel_to_ch4.get("ch1", float("nan"))) else float("nan")
    ch4_vs_ch2 = rel_to_ch4.get("ch2", float("nan")) * -1 if np.isfinite(rel_to_ch4.get("ch2", float("nan"))) else float("nan")
    ch4_vs_ch3 = rel_to_ch4.get("ch3", float("nan")) * -1 if np.isfinite(rel_to_ch4.get("ch3", float("nan"))) else float("nan")

    power_rows = []
    for ch in ch_order:
        if ch in power_stats:
            model, _ = ch_models[ch]
            s = power_stats[ch]
            power_rows.append(
                f"| **{ch.upper()}** | {ch_descriptions[ch]} | {model} | {s['min']:.1f} | {s['max']:.1f} | {s['mean']:.1f} | {s['std']:.1f} | {s['count']} |"
            )

    report = f"""# Measurement Report: Solar Panel Tracking Systems
## Comparison of Different Mounting Methods Under Ideal Conditions

**Measurement Date:** {date_label}
**Location:** Bochum, North Rhine-Westphalia (NRW), Germany
**Conditions:** Based on recorded field data
**Recording Duration:** {duration_hours:.1f} hours ({t_start.strftime('%H:%M')} UTC to {t_end.strftime('%H:%M')} UTC)
**Outside Temperature:** {temp_stats['min']:.1f} degC to {temp_stats['max']:.1f} degC (Average: {temp_stats['mean']:.1f} degC)

---

### Tracking Overview (Video + Testbench)

<table style="width:100%; border-collapse:collapse;">
<tr>
<td style="width:70%; padding:6px; vertical-align:top;">

**Time-lapse footage of the tracking system (April 30, 2026):**

<video width="100%" controls style="border-radius:6px">
  <source src="solarCam1_20260430_0000_1340_10s.webm" type="video/webm">
</video>

*Preview GIF (click video above for full playback):*
<img src="solarCam1_20260430_0000_1340_10s_preview.gif" width="100%" style="border-radius:6px">

</td>
<td style="width:30%; padding:6px; vertical-align:top;">

**Testbench setup:**
<img src="../../../pictures/testbench/testbench_v1.jpg" width="100%" style="border-radius:6px">

</td>
</tr>
</table>

---

### Quick Graph Gallery (Click to Enlarge)

<table style="width:100%; border-collapse:collapse;"><tr>
<td style="width:24%; padding:4px; text-align:center;"><a href="graph_1_power_profile.png"><img src="graph_1_power_profile.png" width="100%" style="border-radius:4px"></a><br><small>Graph 1: Power Profile</small></td>
<td style="width:24%; padding:4px; text-align:center;"><a href="graph_2_cumulative_yield.png"><img src="graph_2_cumulative_yield.png" width="100%" style="border-radius:4px"></a><br><small>Graph 2: Cumulative Yield</small></td>
<td style="width:24%; padding:4px; text-align:center;"><a href="graph_3_comparison_bars.png"><img src="graph_3_comparison_bars.png" width="100%" style="border-radius:4px"></a><br><small>Graph 3: Daily Output</small></td>
<td style="width:24%; padding:4px; text-align:center;"><a href="graph_4_advantage_analysis.png"><img src="graph_4_advantage_analysis.png" width="100%" style="border-radius:4px"></a><br><small>Graph 4: Advantage</small></td>
</tr><tr>
<td style="width:24%; padding:4px; text-align:center;"><a href="graph_5_performance_area.png"><img src="graph_5_performance_area.png" width="100%" style="border-radius:4px"></a><br><small>Graph 5: Smoothed Profile</small></td>
<td style="width:24%; padding:4px; text-align:center;"><a href="graph_6_temperature_progression.png"><img src="graph_6_temperature_progression.png" width="100%" style="border-radius:4px"></a><br><small>Graph 6: Temperature</small></td>
<td style="width:24%; padding:4px; text-align:center;"><a href="graph_7_tracking_deviation.png"><img src="graph_7_tracking_deviation.png" width="100%" style="border-radius:4px"></a><br><small>Graph 7: Tracking Deviation</small></td>
<td style="width:24%; padding:4px; text-align:center;"><a href="graph_8_performance_ratio_vs_east_west_sum.png"><img src="graph_8_performance_ratio_vs_east_west_sum.png" width="100%" style="border-radius:4px"></a><br><small>Graph 8: Performance Ratio</small></td>
</tr></table>

---

## Summary

This analysis compares four mounting concepts using synchronized power and yield telemetry:
- CH1: Static West 30 deg
- CH2: Sunchronizer S2 (single-axis elevation)
- CH3: Static East 30 deg
- CH4: Sunchronizer D2 (dual-axis)

---

## Measurement Results

### 1. Daily Energy Yield (Cumulative Maximum during Day)

| Channel | System | Panel | Yield (Wh) | Yield (kWh) | Rel. to Best Panel | Rel. to Worst Panel | Rel. to CH1+CH3 (East+West Sum) |
|---------|--------|-------|------------|------------|---------------------|---------------------|----------------------------------|
| **CH1** | West 30° (Static) | CHSM54M-HC-405 | {final_yields.get('ch1', 0):.0f} | {final_yields.get('ch1', 0)/1000:.2f} | {rel_to_ch4.get('ch1', float('nan')):.1f}% | {display_rel_to_worst.get('ch1', 'n/a')} | {_fmt_gain(rel_to_east_west_sum.get('ch1', float('nan')))} |
| **CH2** | Sunchronizer S2 (1-Axis) | CHSM54M-HC-405 | {final_yields.get('ch2', 0):.0f} | {final_yields.get('ch2', 0)/1000:.2f} | {rel_to_ch4.get('ch2', float('nan')):.1f}% | {display_rel_to_worst.get('ch2', 'n/a')} | {_fmt_gain(rel_to_east_west_sum.get('ch2', float('nan')))} |
| **CH3** | East 30° (Static) | JAM54S31-395 | {final_yields.get('ch3', 0):.0f} | {final_yields.get('ch3', 0)/1000:.2f} | {rel_to_ch4.get('ch3', float('nan')):.1f}% | {display_rel_to_worst.get('ch3', 'n/a')} | {_fmt_gain(rel_to_east_west_sum.get('ch3', float('nan')))} |
| **CH4** | Sunchronizer D2 (2-Axis) | JAM54S31-395 | **{final_yields.get('ch4', 0):.0f}** | **{final_yields.get('ch4', 0)/1000:.2f}** | **Reference** | **{_fmt_gain(rel_to_worst.get('ch4', float('nan')))}** | **{_fmt_gain(rel_to_east_west_sum.get('ch4', float('nan')))}** |
| **CH1+CH3** | Combined Static Baseline | CH1 + CH3 | {east_west_sum_yield:.0f} | {east_west_sum_yield/1000:.2f} | - | - | Reference |

**Important Note on Table Interpretation:** 
- **Bold values** indicate the best result in each column.
- **Rel. to Best Panel**: percentage gain/loss relative to the best-performing channel (CH4, marked **Reference**). Negative values indicate how much less energy a channel produces compared to CH4. E.g. CH2 = {final_yields.get('ch2', 0):.0f} Wh vs. CH4 = {final_yields.get('ch4', 0):.0f} Wh → ({final_yields.get('ch2', 0):.0f} - {final_yields.get('ch4', 0):.0f})/{final_yields.get('ch4', 0):.0f} = {rel_to_ch4.get('ch2', float('nan')):.1f}%
- **Rel. to Worst Panel**: percentage gain relative to the weakest channel (marked **Reference**). E.g. +184.2% means this channel produced 184.2% more energy than the worst panel.
- **Rel. to CH1+CH3 (East+West Sum)**: percentage gain/loss relative to the combined East+West static baseline (marked **Reference**). Values above 0% mean the channel outperforms both static panels combined.

### 2. Power Statistics

| Channel | System | Panel | Min (W) | Max (W) | Average (W) | Std Dev | Measurements |
|---------|--------|-------|---------|---------|-------------|---------|--------------|
{chr(10).join(power_rows)}

---

## Graphical Analysis

### Graph 1: Power Profile During the Day
![Power Profile](graph_1_power_profile.png)

### Graph 2: Cumulative Energy Yield
![Cumulative Yield](graph_2_cumulative_yield.png)

### Graph 3: Daily Final Energy Output
![Final Yield](graph_3_comparison_bars.png)

### Graph 4: Advantage Analysis
![Advantage Analysis](graph_4_advantage_analysis.png)

### Graph 5: Power Profile (Smoothed)
![Performance Area](graph_5_performance_area.png)

### Graph 6: Outside Temperature Progression
![Outside Temperature](graph_6_temperature_progression.png)

### Graph 7: Tracking Deviation
![Tracking Deviation](graph_7_tracking_deviation.png)

### Graph 8: Time-Series Performance Ratio
![Performance Ratio](graph_8_performance_ratio_vs_east_west_sum.png)

---

## Notes

- This report is generated directly from the CSV telemetry in this folder.
- If additional controller telemetry is available, graphs 7 and 8 can be regenerated with richer detail.

---

*Report generated: {datetime.now().strftime('%B %d, %Y')}*
"""

    report_path = measurement_dir / f"ANALYSIS_REPORT_{date_iso}.md"
    report_path.write_text(report, encoding="utf-8")

    print("Done. Generated:")
    print("-", report_path.name)
    print("- graph_1_power_profile.png")
    print("- graph_2_cumulative_yield.png")
    print("- graph_3_comparison_bars.png")
    print("- graph_4_advantage_analysis.png")
    print("- graph_5_performance_area.png")
    print("- graph_6_temperature_progression.png")
    print("- graph_7_tracking_deviation.png")
    print("- graph_8_performance_ratio_vs_east_west_sum.png")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
