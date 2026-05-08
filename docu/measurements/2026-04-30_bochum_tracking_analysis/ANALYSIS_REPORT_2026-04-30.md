# Measurement Report: Solar Panel Tracking Systems
## Comparison of Different Mounting Methods Under Ideal Conditions

**Measurement Date:** April 30, 2026
**Location:** Bochum, North Rhine-Westphalia (NRW), Germany
**Conditions:** Based on recorded field data
**Recording Duration:** 14.1 hours (04:15 UTC to 18:19 UTC)
**Outside Temperature:** 7.4 degC to 20.3 degC (Average: 15.1 degC)

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
| **CH1** | West 30° (Static) | CHSM54M-HC-405 | 2308 | 2.31 | -28.7% | +13.6% | -46.8% |
| **CH2** | Sunchronizer S2 (1-Axis) | CHSM54M-HC-405 | 2825 | 2.83 | -12.7% | +39.0% | -34.9% |
| **CH3** | East 30° (Static) | JAM54S31-395 | 2032 | 2.03 | -37.2% | Reference | -53.2% |
| **CH4** | Sunchronizer D2 (2-Axis) | JAM54S31-395 | **3237** | **3.24** | **Reference** | **+59.3%** | **-25.4%** |
| **CH1+CH3** | Combined Static Baseline | CH1 + CH3 | 4340 | 4.34 | - | - | Reference |

**Important Note on Table Interpretation:** 
- **Bold values** indicate the best result in each column.
- **Rel. to Best Panel**: percentage gain/loss relative to the best-performing channel (CH4, marked **Reference**). Negative values indicate how much less energy a channel produces compared to CH4. E.g. CH2 = 2825 Wh vs. CH4 = 3237 Wh → (2825 - 3237)/3237 = -12.7%
- **Rel. to Worst Panel**: percentage gain relative to the weakest channel (marked **Reference**). E.g. +184.2% means this channel produced 184.2% more energy than the worst panel.
- **Rel. to CH1+CH3 (East+West Sum)**: percentage gain/loss relative to the combined East+West static baseline (marked **Reference**). Values above 0% mean the channel outperforms both static panels combined.

### 2. Power Statistics

| Channel | System | Panel | Min (W) | Max (W) | Average (W) | Std Dev | Measurements |
|---------|--------|-------|---------|---------|-------------|---------|--------------|
| **CH1** | West 30 deg (Static, CHSM54M-HC-405) | CHSM54M-HC-405 | 2.3 | 332.8 | 197.2 | 118.7 | 6953 |
| **CH2** | Sunchronizer S2 (1-Axis Elevation, CHSM54M-HC-405) | CHSM54M-HC-405 | 3.0 | 401.9 | 225.1 | 144.0 | 8055 |
| **CH3** | East 30 deg (Static, JAM54S31-395) | JAM54S31-395 | 2.9 | 303.3 | 179.3 | 108.0 | 6929 |
| **CH4** | Sunchronizer D2 (2-Axis, JAM54S31-395) | JAM54S31-395 | 2.2 | 369.7 | 257.4 | 134.6 | 8177 |

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

*Report generated: May 08, 2026*
