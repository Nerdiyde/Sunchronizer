# Sunchronizer Measurement Overview
## Solar Panel Tracking System Performance Data

**Location:** Bochum, North Rhine-Westphalia, Germany  
**Test Setup:** 4-channel comparison with HMS 1600-4T micro-inverters  
**Last Updated:** May 8, 2026

---

## Overview

This document provides a quick summary of all solar panel tracking measurements conducted in Bochum, Germany. Each day compares four mounting configurations across 4 measurement channels using HMS 1600-4T micro-inverters.


## Test Configuration

| CH | System | Orientation | Tracking | Panel | Power |
|----|--------|-------------|----------|-------|-------|
| 1 | Static Ref. | West 30° | None | CHSM54M-HC-405 | 405 W |
| 2 | **Sunchronizer S2** | Variable | Elevation | CHSM54M-HC-405 | 405 W |
| 3 | Static Ref. | East 30° | None | JAM54S31-395 | 395 W |
| 4 | **Sunchronizer D2** | Variable | 2-Axis | JAM54S31-395 | 395 W |


### Testbench Setup

The following photos show the real testbench used for all measurement series and analysis:

<p align="center">
	<img src="../../pictures/testbench/sunchronizer_testbench_(1).jpg" width="32%" />
	<img src="../../pictures/testbench/sunchronizer_testbench_(2).jpg" width="32%" />
	<img src="../../pictures/testbench/sunchronizer_testbench_(3).jpg" width="32%" />
</p>

* Testbench for Sunchronizer S2/D2 and static reference panels (all channels measured in parallel)  

### Time-Lapse Gallery

Preview GIFs from available recording days (click for full report):

<table style="width:100%; border-collapse:collapse;">
<tr>
<td style="width:33%; padding:6px; text-align:center; vertical-align:top;">

**March 2, 2026**

<a href="2026-03-02_bochum_tracking_analysis/ANALYSIS_REPORT_2026-03-02.md">
<img src="2026-03-02_bochum_tracking_analysis/solarCam1_20260302_1020_2000_10s_preview.gif" width="100%" style="border-radius:6px">
</a>

*10:20–20:00 UTC · Clear Sky*

</td>
<td style="width:33%; padding:6px; text-align:center; vertical-align:top;">

**March 3, 2026**

<a href="2026-03-03_bochum_tracking_analysis/ANALYSIS_REPORT_2026-03-03.md">
<img src="2026-03-03_bochum_tracking_analysis/solarCam1_20260303_0720_1710_10s_preview.gif" width="100%" style="border-radius:6px">
</a>

*07:20–17:10 UTC · Clear Sky*

</td>
<td style="width:33%; padding:6px; text-align:center; vertical-align:top;">

**April 30, 2026**

<a href="2026-04-30_bochum_tracking_analysis/ANALYSIS_REPORT_2026-04-30.md">
<img src="2026-04-30_bochum_tracking_analysis/solarCam1_20260430_0000_1340_10s_preview.gif" width="100%" style="border-radius:6px">
</a>

*00:00–13:40 UTC · Clear Sky*

</td>
</tr>
</table>

> **Note:** No camera recording available for March 5 and March 18.

---

## Measurement Data

### Daily Results Overview

| Date | Weather | Duration | Temp (Avg) | CH1 West (Wh) | CH2 S2 (Wh) | CH3 East (Wh) | CH4 D2 (Wh) | D2 Avg Power | Median Elevation Deviation (D2) | Median Azimuth Deviation (D2) | Report |
|------|---------|----------|-----------|---------------|-------------|---------------|-------------|--------------|----------------------------------|--------------------------------|--------|
| Mar 2 | Clear Sky | 12.2h | 12.3°C | 1,078 | 2,183 | 866 | **2,461** | 257.3 W | 18.90° | 1.59° | [Link](2026-03-02_bochum_tracking_analysis/ANALYSIS_REPORT_2026-03-02.md) |
| Mar 3 | Clear Sky | 13.2h | 12.1°C | 1,059 | 2,073 | 852 | **2,310** | 233.9 W | 19.40° | 1.56° | [Link](2026-03-03_bochum_tracking_analysis/ANALYSIS_REPORT_2026-03-03.md) |
| Mar 5 | Clear Sky | 15.1h | 11.4°C | 1,116 | 2,136 | 903 | **2,394** | 242.7 W | 18.88° | 1.60° | [Link](2026-03-05_bochum_tracking_analysis/ANALYSIS_REPORT_2026-03-05.md) |
| Mar 18 | Clear Sky | 13.7h | 12.7°C | 1,368 | 2,324 | 1,194 | **2,731** | 271.7 W | 14.86° | 1.58° | [Link](2026-03-18_bochum_tracking_analysis/ANALYSIS_REPORT_2026-03-18.md) |
| Apr 30 | Clear Sky | 14.1h | 15.1°C | 2,308 | 2,825 | 2,032 | **3,237** | 257.4 W | n/a | n/a | [Link](2026-04-30_bochum_tracking_analysis/ANALYSIS_REPORT_2026-04-30.md) |
| **Avg** | - | **13.7h** | **12.7°C** | **1,586** | **2,308** | **1,169** | **2,627** | **252.6 W** | **18.0°** *(4 days)* | **1.58°** *(4 days)* | - |

### Performance Summary

**Sunchronizer D2 (CH4) Advantages:**
- **vs. avg. static panel** (avg of CH1/CH3): **+90.7%** average daily energy (2,627 Wh vs. avg 1,377 Wh)
- **vs. Single-Axis S2:** **+13.8%** average daily energy (2,627 Wh vs. 2,308 Wh)
- Average daily yield: **2.63 kWh** (range: 2.31–3.24 kWh)

> **Note on Apr 30:** No controller angle telemetry was available for this day; tracking deviation columns are n/a. The deviation averages cover only the 4 days with full telemetry (Mar 2–18).

**Interpretation Note (all measurement series):**
- For elevation-based tracking (especially CH2), the controller cannot always approach the solar-optimal elevation angle further because the tracker is physically constrained by minimum and maximum elevation limits.
- The median axis deviation is a practical tracking quality indicator: smaller median values indicate better typical tracking accuracy during the day.
- The median describes typical behavior, while the 95th percentile captures occasional larger deviations.

---

## Technical Information

- **Location:** Bochum, 51.4°N latitude
- **Monitoring:** HMS 1600-4T micro-inverters (±2% measurement accuracy)
- **Temperature:** 4.3-17.0°C range across measurements
- **Conditions:** Clear sky days with continuous sunshine

For detailed analysis, graphs, and technical specifications, see individual measurement reports.
