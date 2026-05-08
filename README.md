# 🌞 Sunchronizer - 3D printable dual-axis solar tracker


[![Licensing](https://img.shields.io/badge/licensing-multi--license-blue.svg)](#-license) [![Firmware License](https://img.shields.io/badge/firmware-AGPL%20v3.0-3DA639.svg)](https://www.gnu.org/licenses/agpl-3.0.en.html) [![Release](https://img.shields.io/github/release/Nerdiyde/Sunchronizer.svg)](https://github.com/Nerdiyde/Sunchronizer/releases)


> Sunchronizer tracks the sun automatically to keep your panel aligned throughout the day. Current field measurements show about [+13.8% vs. single-axis tracking and +90.7% vs. the average static east/west references](docu/measurements/MEASUREMENT_OVERVIEW.md).

- **What it is:** A 3D-printable solar tracker platform with single-axis (**S2**) and dual-axis (**D2**) variants.
- **Who it is for:** DIY builders who want higher yield from limited panel area (for example balcony PV or space-constrained installs).
- **Why it matters:** Better morning/evening generation, higher self-consumption, and measurable real-world yield gains.
- **Start now:** [FAQ](FAQ.md) | [Is Sunchronizer useful for my use case?](FAQ.md#q-in-which-cases-can-the-sunchronizer-be-useful-for-me) | [Firmware Documentation](firmware/README.md) | [Web Installer](firmware/web-installer/index.html)

<p align="center">
	<img src="https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/GIFs/sunchronizer_timelapse_smaller_5mb.gif" width="49%" />
	<img src="https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/D2/GIFs/Sunchronizer_03.03.2026-resize.gif" width="49%" />
</p>

<p align="center"><sub>Left GIF: Sx variants (S1/S2, single-axis) · Right GIF: Dx variants (D1/D2, dual-axis)</sub></p>

---

## Overview

Sunchronizer is a fully automated, 3D-printable solar tracker for balcony and small-scale PV systems. It continuously adjusts elevation (and optionally azimuth) using a linear actuator and a geared motor to improve real-world daily yield.

The project supports two actively maintained variants:
- **S2:** single-axis (elevation)
- **D2:** dual-axis (elevation + azimuth)

### Key Specifications

- **Microcontroller:** [ESP32-S3](https://www.seeedstudio.com/Seeed-Studio-XIAO-ESP32S3-Plus-p-6361.html)
- **Firmware:** [ESPHome](https://esphome.io/) (open-source, HomeAssistant-compatible)
- **Tracking Methods:** Sun position calculation (via GPS or HomeAssistant), compass-based orientation verification
- **Flexibility:** Works with HomeAssistant or standalone via GPS receiver
- **Power:** 12V/3A supply (USB-C Power Delivery recommended)

---

## Quick Start

### Essential Links

- **[FAQ](FAQ.md)** - Assembly, operation, troubleshooting, and practical decisions
- **[Web Installer](firmware/web-installer/index.html)** - Flash firmware from a Chromium-based browser
- **[Firmware Documentation](firmware/README.md)** - Configuration and firmware details
- **[Measurement Analysis Overview](docu/measurements/MEASUREMENT_OVERVIEW.md)** - Real daily performance data and reports
- **[Project Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)** - Full project documentation

### Typical Paths

- **Flash and run quickly:** [Web Installer](firmware/web-installer/index.html)
- **Tune for your setup:** [Firmware Documentation](firmware/README.md)
- **Compare measured performance:** [Measurement Analysis Overview](docu/measurements/MEASUREMENT_OVERVIEW.md)
- **Check if it fits your scenario:** [In which cases can the Sunchronizer be useful for me?](FAQ.md#q-in-which-cases-can-the-sunchronizer-be-useful-for-me)

### Additional Resources

- **[Public Web Installer](https://nerdiyde.github.io/Sunchronizer/)**
- **[Latest Firmware Release](https://github.com/Nerdiyde/Sunchronizer/releases/latest)**
- **[Prototype Development History](docu/development_history/DEVELOPMENT_HISTORY.md)**
- **[Materials and BOM](https://github.com/Nerdiyde/Sunchronizer/wiki/1.-Preparations)**

---

## Variants

| Model | Capability | Best For |
|-------|-----------|----------|
| **S2** | Elevation angle tracking (single-axis, 2nd generation) | Refined single-axis builds with lower complexity |
| **D2** | Elevation + azimuth tracking (dual-axis, 2nd generation) | Maximum efficiency, most refined dual-axis variant |

---

## Hardware At A Glance

- **ESP32-S3 XIAO** for control and connectivity
- **Dual H-Bridge** for elevation and azimuth motor control
- **BNO085 IMU** for orientation feedback
- **DS3231 RTC** for robust timekeeping
- **Optional GPS** for standalone location and time
- **12V/3A supply** (USB-C Power Delivery recommended)

For wiring, electronics details, and build-specific hardware notes, see [Electronics Documentation](https://github.com/Nerdiyde/Sunchronizer/wiki/3.-Electronics).

---

## Performance Data

Measured multi-day analysis is documented in [Measurement Analysis Overview](docu/measurements/MEASUREMENT_OVERVIEW.md), including day-by-day reports and setup details.

---

## Available STL Products

STL files and detailed build information available at:

| Variant | Nerdiy.de | Printables.com | Cults3d.com |
|---------|-----------|------------|--------|
| **Sunchronizer S2** (single-axis, 2nd gen) | — | [Printables](https://www.printables.com/model/1574048-sunchronizer-s2-400w-module-solartracker-for-eleva) | [Cults](https://cults3d.com/de/modell-3d/gadget/sunchronizer-s2-400w-module-solartracker-for-elevation-axis-by-nerdiy-de-new) |
| **Sunchronizer D2** (dual-axis, 2nd gen) | — | [Printables](https://www.printables.com/model/1574049-sunchronizer-d2-400w-module-solartracker-for-eleva) | [Cults](https://cults3d.com/de/modell-3d/gadget/sunchronizer-d2-400w-module-solartracker-for-elevation-azimuth-axis-by-nerdi) |

---

## Legacy Variants

S1 and D1 are first-generation variants and are no longer recommended for new builds.

- **Legacy S1:** [Nerdiy.de](https://nerdiy.de/en/product-2/sunchronizer-s1-400w-solartracker-fuer-elevation-achse-3d-druckbar-stl-dateien/)
- **Legacy D1:** [Nerdiy.de](https://nerdiy.de/en/product-2/sunchronizer-d1-dual-axis-solartracker-fuer-azimut-und-elevation-achse-3d-druckbar-stl-dateien/)

Use **S2** or **D2** for all new installations.

---

## Firmware

### Technology Stack

- **Framework:** [ESPHome](https://esphome.io/) - Open-source ESPHome project
- **Integration:** Native HomeAssistant support with custom web interface
- **Source:** Fully open-source configuration files included

### External Components Required

The firmware depends on two ESPHome external components that are fetched from GitHub during the build:
- [DS3231 RTC Component](https://github.com/Nerdiyde/DS3231-RTC-component-for-ESPHome/)
- [BNO085 RVC Component](https://github.com/Nerdiyde/BNO085-RVC-component-for-ESPHome/)

### Documentation

- **[Firmware Documentation](firmware/README.md)** - Configuration reference
- **[Firmware Config Details](firmware/config/pcb_v1.3/README.md)** - PCB v1.3 specifics
- **[Wiki Firmware Section](https://github.com/Nerdiyde/Sunchronizer/wiki/4.-Firmware)** - Additional implementation details

---

## FAQ

For answers to common questions about assembly, firmware, variants, GPS setup, reliability, and operation, see [FAQ](FAQ.md).

---

## Support

If you find this project valuable, consider supporting its development:

[![Ko-Fi](https://img.shields.io/badge/Ko--Fi-donate-FF5E5B?style=for-the-badge)](https://ko-fi.com/O5O8UAX8)

Every coffee helps fund research, development, and documentation! ☕

---

## Gallery

<details>
<summary><strong>~~Sunchronizer S1 (Single-Axis)~~ ⚠️ deprecated — use S2 instead</strong></summary>

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/mark1/anotations/11.png)

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/mark1/anotations/5.png)

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/mark1/anotations/6.png)

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/technical_drawings/single_axis_lifter_V1.2_open_incl_panel_V1.0_1.jpg)

</details>

<details>
<summary><strong>~~Sunchronizer D1 (Dual-Axis)~~ ⚠️ deprecated — use D2 instead</strong></summary>

*Coming soon — photos and technical drawings to be added.*

</details>

<details>
<summary><strong>Sunchronizer S2 (Single-Axis, 2nd gen)</strong></summary>

*Coming soon — photos and technical drawings to be added.*

</details>

<details>
<summary><strong>Sunchronizer D2 (Dual-Axis, 2nd gen)</strong></summary>

*Coming soon — photos and technical drawings to be added.*

</details>

---

## License

This project uses separate licenses by content type:

| Content Type | License | Practical Summary |
|---|---|---|
| 3D print files (STL) | [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) | Personal use and sharing with attribution; no commercial use or derivatives |
| Documentation and content | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) | Attribution required; non-commercial; share alike |
| Firmware and software | [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html) | Use/modify allowed; distributed modifications must remain AGPL |

> See [FAQ](FAQ.md) for a plain-language explanation.

<details>
<summary><strong>License Details</strong></summary>

### 3D Print Files (STL)

All STL files are licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).

- ✅ Print for personal use
- ✅ Share photos of your build with attribution
- ❌ Sell the STL files
- ❌ Sell printed parts or assembled trackers
- ❌ Publish modified/remixed versions of the STL files

### Documentation & Content

All documentation, guides, diagrams, and written content are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

### Firmware & Software

All firmware configuration files and software code are licensed under [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html).

- ✅ Use, study, and modify freely
- ✅ Commercial use allowed
- ❌ Modifications must be published under AGPL v3.0

- [AGPL Summary (TLDR)](https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)#summary)
- [AGPL Full Legal Text (German)](https://www.gnu.org/licenses/agpl-3.0.de.html)

</details>

---

## Related Projects & Resources

- [DS3231 RTC Component for ESPHome](https://github.com/Nerdiyde/DS3231-RTC-component-for-ESPHome/) - ESPHome external component used by the firmware
- [BNO085 RVC Component for ESPHome](https://github.com/Nerdiyde/BNO085-RVC-component-for-ESPHome/) - ESPHome external component used by the firmware
- [ESPHome Official Documentation](https://esphome.io/)
- [Home Assistant](https://www.home-assistant.io/) - Smart home integration platform
- [Nerdiy.de Blog](https://nerdiy.de/) - Project blog and store

---

**Last Updated:** May 2026  

