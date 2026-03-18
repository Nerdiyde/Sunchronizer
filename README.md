# 🌞 Sunchronizer

[![Licensing](https://img.shields.io/badge/licensing-multi--license-blue.svg)](#-license) [![Firmware License](https://img.shields.io/badge/firmware-AGPL%20v3.0-3DA639.svg)](https://www.gnu.org/licenses/agpl-3.0.en.html) [![Release](https://img.shields.io/github/release/Nerdiyde/Sunchronizer.svg)](https://github.com/Nerdiyde/Sunchronizer/releases)

**A 3D printable dual-axis solar tracker for maximizing photovoltaic energy yield**

> Sunchronizer automatically tracks the sun's position throughout the day to keep your solar panels optimally aligned, with measured gains of about [+12% vs. single-axis tracking and +144%](docu/measurements/MEASUREMENT_OVERVIEW.md)     vs. static east/west references.

<p align="center">
	<img src="https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/GIFs/sunchronizer_timelapse_smaller_5mb.gif" width="49%" />
	<img src="https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/D2/GIFs/Sunchronizer_03.03.2026-resize.gif" width="49%" />
</p>

<p align="center"><sub>Left GIF: Sx variants (S1/S2, single-axis) · Right GIF: Dx variants (D1/D2, dual-axis)</sub></p>

---

## 🎯 Introduction

Working with balcony power plants in Germany, I wondered how to maximize solar panel efficiency. The solution: **Sunchronizer** – a fully automated, 3D-printable solar tracker available in single-axis (S1) and dual-axis (D1) configurations.

The system uses a **linear actuator** and **geared motor** to continuously orient your solar panels toward the sun, significantly improving daily energy yield.

### Key Specifications

- **Microcontroller:** [ESP32-S3](https://www.seeedstudio.com/Seeed-Studio-XIAO-ESP32S3-Plus-p-6361.html)
- **Firmware:** [ESPHome](https://esphome.io/) (open-source, HomeAssistant-compatible)
- **Tracking Methods:** Sun position calculation (via GPS or HomeAssistant), compass-based orientation verification
- **Flexibility:** Works with HomeAssistant or standalone via GPS receiver
- **Power:** 12V/3A supply (USB-C Power Delivery recommended)

### 📊 Sunchronizer Variants

| Model | Capability | Best For |
|-------|-----------|----------|
| **S1** | Elevation angle tracking (single-axis, 1st generation) | Simpler installations, fixed azimuth |
| **S2** | Elevation angle tracking (single-axis, 2nd generation) | Refined single-axis builds with lower complexity |
| **D1** | Elevation + azimuth tracking (dual-axis, 1st generation) | Full dual-axis tracking for flexible installations |
| **D2** | Elevation + azimuth tracking (dual-axis, 2nd generation) | Maximum efficiency, most refined dual-axis variant |

---

## 🚀 Getting Started

### Quick Links

- **[Firmware & Configuration](firmware/)** - Detailed firmware configuration guide and pre-built binaries
- **[Web Installer](firmware/web-installer/index.html)** - Flash the latest release directly from a Chromium browser
- **[Public Web Installer](https://nerdiyde.github.io/Sunchronizer/)** - Browser-based installer hosted on GitHub Pages
- **[Latest Firmware Release](https://github.com/Nerdiyde/Sunchronizer/releases/latest)** - Download current firmware binaries from release assets
- **[Firmware Documentation](firmware/README.md)** - Comprehensive ESPHome firmware documentation
- **[Prototype Development History](docu/development_history/DEVELOPMENT_HISTORY.md)** - Photo gallery and timeline of mark1-mark4 plus PCB v1.3
- **[Measurement Analysis Overview](docu/measurements/MEASUREMENT_OVERVIEW.md)** - Daily performance results with links to detailed analysis reports
- **[FAQ](FAQ.md)** - Frequently asked questions about assembly, firmware, performance, and operation
- **[Full Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)** - Complete project documentation
- **[Material List](https://github.com/Nerdiyde/Sunchronizer/wiki/1.-Preparations)** - Components and BOM

### For Different Needs

- **Want to flash immediately?** → Use the [Web Installer](firmware/web-installer/index.html) or download from [Latest Release Assets](https://github.com/Nerdiyde/Sunchronizer/releases/latest)
- **Want to customize configuration?** → Review [firmware configuration guide](firmware/README.md)
- **Need detailed setup instructions?** → Check [Wiki: Firmware Section](https://github.com/Nerdiyde/Sunchronizer/wiki/4.-Firmware)
- **Want real measurement data and performance comparisons?** → Open [Measurement Analysis Overview](docu/measurements/MEASUREMENT_OVERVIEW.md)

---

## 🔧 Hardware Components

### Main Controller
- **ESP32-S3 XIAO** - Dual-core processor with WiFi
- **Dual H-Bridge** - Controls elevation and azimuth motors
- **12V/3A Power Supply** - USB-C Power Delivery compatible

### Sensors

| Sensor | Purpose | Details |
|--------|---------|---------|
| **BNO085 IMU** | Elevation angle measurement | 9-DOF accelerometer, gyro, magnetometer |
| **DS3231 RTC** | Precise timekeeping | Independent of network connection |
| **GPS Module** (optional) | Position & time retrieval | Enables standalone operation |
| **Magnetometer/Compass** | Heading verification | Ensures correct azimuth orientation |

### Controls
- **UP/CCW Button** - Lift panel or rotate counter-clockwise
- **DOWN/CW Button** - Lower panel or rotate clockwise
- Additional controls via web interface and HomeAssistant

📖 [Full Electronics Documentation](https://github.com/Nerdiyde/Sunchronizer/wiki/3.-Electronics)

---

## 📦 Available Products

STL files and detailed build information available at:

| Variant | NERDIY.DE | Printables |
|---------|-----------|------------|
| **Sunchronizer S1** (single-axis, 1st gen) | [NERDIY.DE](https://nerdiy.de/en/product-2/sunchronizer-s1-400w-solartracker-fuer-elevation-achse-3d-druckbar-stl-dateien/) | — |
| **Sunchronizer S2** (single-axis, 2nd gen) | — | [Printables](https://www.printables.com/model/1574048-sunchronizer-s2-400w-module-solartracker-for-eleva) |
| **Sunchronizer D1** (dual-axis, 1st gen) | [NERDIY.DE](https://nerdiy.de/en/product-2/sunchronizer-d1-dual-axis-solartracker-fuer-azimut-und-elevation-achse-3d-druckbar-stl-dateien/) | — |
| **Sunchronizer D2** (dual-axis, 2nd gen) | — | [Printables](https://www.printables.com/model/1574049-sunchronizer-d2-400w-module-solartracker-for-eleva) |

---

## 🛠️ Firmware & Configuration

### Technology Stack

- **Framework:** [ESPHome](https://esphome.io/) - Open-source ESPHome project
- **Integration:** Native HomeAssistant support with custom web interface
- **Source:** Fully open-source configuration files included

### External Components Required

The firmware depends on two ESPHome external components that are fetched from GitHub during the build:
- [DS3231 RTC Component](https://github.com/Nerdiyde/DS3231-RTC-component-for-ESPHome/)
- [BNO085 RVC Component](https://github.com/Nerdiyde/BNO085-RVC-component-for-ESPHome/)

### Documentation

- 📋 **[Firmware Configuration Guide](firmware/README.md)** - Comprehensive configuration reference
- 🔧 **[Firmware Configuration Details](firmware/config/pcb_v1.3/README.md)** - PCB v1.3 configuration specifics
- 🔧 **[Wiki: Firmware Section](https://github.com/Nerdiyde/Sunchronizer/wiki/4.-Firmware)** - Detailed technical documentation

---

# Further Resources

- **Full Documentation:** [GitHub Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)
- **Open-Source Firmware:** Configuration in this repository, downloadable binaries via [GitHub Releases](https://github.com/Nerdiyde/Sunchronizer/releases)

---

## 🎁 Support This Project

If you find this project valuable, consider supporting its development:

[![Ko-Fi](https://img.shields.io/badge/Ko--Fi-donate-FF5E5B?style=for-the-badge)](https://ko-fi.com/O5O8UAX8)

Every coffee helps fund research, development, and documentation! ☕

---

## 📸 Gallery

<details>
<summary><strong>Sunchronizer S1 (Single-Axis)</strong></summary>

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/mark1/anotations/11.png)

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/mark1/anotations/5.png)

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/mark1/anotations/6.png)

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/technical_drawings/single_axis_lifter_V1.2_open_incl_panel_V1.0_1.jpg)

</details>

<details>
<summary><strong>Sunchronizer D1 (Dual-Axis)</strong></summary>

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

## 📋 Directory Structure

```
Sunchronizer/
├── README.md                           # This file - Project overview
├── firmware/                           # Firmware documentation & configuration
│   ├── README.md                       # Firmware guide & quick start
│   ├── binaries/                       # Optional local/CI output folder
│   │   └── [latest downloadable binaries are attached to Releases]
│   └── config/                         # ESPHome YAML configuration files
│       ├── pcb_v1.3/                   # Configuration for PCB v1.3
│       │   ├── README.md               # v1.3 configuration documentation
│       │   ├── sunchronizer_firmware_pcb_v1.3.yaml
│       │   └── secrets.yaml            # WiFi & API credentials (use secrets.yaml.example as template)
│       └── [other PCB versions...]
├── docu/                               # Documentation & technical resources
│   ├── cable_plan/                     # Wiring diagrams & BOMs
│   │   ├── pcb_v1.3/                   # v1.3 wiring documentation
│   │   └── pcb_v1.4/                   # v1.4 wiring documentation
│   ├── diagrams/                       # System architecture diagrams
│   └── datasheets/                     # Component datasheets
├── pictures/                           # Photos & technical drawings
│   ├── S1/                             # Single-axis tracker photos
│   │   ├── mark1/                      # Original prototype
│   │   ├── technical_drawings/         # CAD drawings
│   │   └── GIFs/                       # Animated demonstrations
│   ├── D1/                             # Dual-axis tracker photos
│   │   └── technical_drawings/
│   ├── D2/                             # Variant photos
│   ├── PCBs/                           # PCB images & layouts
│   │   └── v1.3/
│   └── testbench/                      # Testing setup photos
└── .github/                            # GitHub workflows & CI/CD configuration
```

---

## 📄 License

This project uses **three separate licenses** depending on the type of content:

### 3D Print Files (STL)
All STL files are licensed under:
**[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)** (Attribution – Non-Commercial – No Derivatives)

- ✅ Print for personal use
- ✅ Share photos of your build with attribution
- ❌ Sell the STL files
- ❌ Sell printed parts or assembled trackers
- ❌ Publish modified/remixed versions of the STL files

### Documentation & Content
All documentation, guides, diagrams, and written content are licensed under:
**[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)** (Attribution – Non-Commercial – Share Alike)

### Firmware & Software
All firmware configuration files and software code are licensed under:
**[GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html)**

- ✅ Use, study, and modify freely
- ✅ Commercial use allowed
- ❌ Modifications must be published under AGPL v3.0

> See [FAQ.md](FAQ.md) for a plain-language explanation of what you can and cannot do.

- [AGPL Summary (TLDR)](https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)#summary)
- [AGPL Full Legal Text (German)](https://www.gnu.org/licenses/agpl-3.0.de.html)

---

## 👨‍💻 Contributing

Contributions are welcome! For bug reports, feature requests, or improvements:
1. Check the [GitHub Issues](https://github.com/Nerdiyde/Sunchronizer/issues)
2. Review the [Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki) for existing solutions
3. Create a new issue or pull request

---

## 🔗 Related Projects & Resources

- [DS3231 RTC Component for ESPHome](https://github.com/Nerdiyde/DS3231-RTC-component-for-ESPHome/) - ESPHome external component used by the firmware
- [BNO085 RVC Component for ESPHome](https://github.com/Nerdiyde/BNO085-RVC-component-for-ESPHome/) - ESPHome external component used by the firmware
- [ESPHome Official Documentation](https://esphome.io/)
- [Home Assistant](https://www.home-assistant.io/) - Smart home integration platform
- [NERDIY.DE Blog](https://nerdiy.de/) - Project blog and store

---

## ❓ FAQ

For answers to common questions about assembly, firmware, hardware variants, GPS setup, and more, see the **[FAQ](FAQ.md)**.

---

**Last Updated:** January 2026  
**Current PCB Version:** v1.3  
**Firmware:** ESPHome-based (open-source)

