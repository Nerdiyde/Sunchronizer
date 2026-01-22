# 🌞 Sunchronizer

**A 3D printable dual-axis solar tracker for maximizing photovoltaic energy yield**

> Sunchronizer automatically tracks the sun's position throughout the day to keep your solar panels optimally aligned, increasing energy generation by up to 40% compared to fixed installations.

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/GIFs/sunchronizer_timelapse_smaller_5mb.gif)

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
| **S1** | Elevation angle tracking (single-axis) | Simpler installations, fixed azimuth |
| **D1** | Elevation + azimuth tracking (dual-axis) | Maximum efficiency, any orientation |

---

## 🚀 Getting Started

### Quick Links

- **[Firmware & Configuration](firmware/)** - Detailed firmware configuration guide and pre-built binaries
- **[Firmware Documentation](firmware/README.md)** - Comprehensive ESPHome firmware documentation
- **[Full Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)** - Complete project documentation
- **[Material List](https://github.com/Nerdiyde/Sunchronizer/wiki/1.-Preperations)** - Components and BOM

### For Different Needs

- **Want to flash immediately?** → See [Firmware Guide](firmware/README.md) for pre-compiled binaries
- **Want to customize configuration?** → Review [firmware configuration guide](firmware/README.md)
- **Need detailed setup instructions?** → Check [Wiki: Firmware Section](https://github.com/Nerdiyde/Sunchronizer/wiki/4.-Firmware)

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
- **Sunchronizer S1** (single-axis): https://nerdiy.de/en/product-2/sunchronizer-s1-400w-solartracker-fuer-elevation-achse-3d-druckbar-stl-dateien/
- **Sunchronizer D1** (dual-axis): https://nerdiy.de/en/product-2/sunchronizer-d1-dual-axis-solartracker-fuer-azimut-und-elevation-achse-3d-druckbar-stl-dateien/

---

## 🛠️ Firmware & Configuration

### Technology Stack

- **Framework:** [ESPHome](https://esphome.io/) - Open-source ESPHome project
- **Integration:** Native HomeAssistant support with custom web interface
- **Source:** Fully open-source configuration files included

### External Components Required

The firmware depends on two custom ESPHome components:
- [DS3231 RTC Component](https://github.com/Nerdiyde/DS3231-RTC-component-for-ESPHome/)
- [BNO085 RVC Component](https://github.com/Nerdiyde/BNO085-RVC-component-for-ESPHome/)

### Documentation

- 📋 **[Firmware Configuration Guide](firmware/README.md)** - Comprehensive configuration reference
- 🔧 **[Firmware Configuration Details](firmware/config/pcb_v1.3/README.md)** - PCB v1.3 configuration specifics
- 🔧 **[Wiki: Firmware Section](https://github.com/Nerdiyde/Sunchronizer/wiki/4.-Firmware)** - Detailed technical documentation

---

# Further Resources

- **Full Documentation:** [GitHub Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)
- **Open-Source Firmware:** Configuration and compiled binaries in the repository

---

## 🎁 Support This Project

If you find this project valuable, consider supporting its development:

[![Ko-Fi](https://img.shields.io/badge/Ko--Fi-donate-FF5E5B?style=for-the-badge)](https://ko-fi.com/O5O8UAX8)

Every coffee helps fund research, development, and documentation! ☕

---

## 📸 Gallery

### Sunchronizer S1 (Single-Axis)
![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/mark1/anotations/11.png)

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/mark1/anotations/5.png)

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/mark1/anotations/6.png)

![](https://github.com/Nerdiyde/Sunchronizer/blob/main/pictures/S1/technical_drawings/single_axis_lifter_V1.2_open_incl_panel_V1.0_1.jpg)

### Sunchronizer D1 (Dual-Axis)

*Coming soon - Photos and technical drawings to be added*

---

## 📋 Directory Structure

```
Sunchronizer/
├── README.md                           # This file - Project overview
├── firmware/                           # Firmware documentation & configuration
│   ├── README.md                       # Firmware guide & quick start
│   ├── binaries/                       # Pre-compiled firmware binaries
│   │   └── [binary files for different PCB versions]
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

### Content & Documentation
Unless otherwise stated, all non-software content is licensed under:
**[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)** (Attribution – Non-Commercial – Share Alike)

### Software & Code
Unless otherwise stated, all software and code is licensed under:
**[GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html)**

- [Summary (TLDR)](https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)#summary)
- [Full Legal Text (German)](https://www.gnu.org/licenses/agpl-3.0.de.html)

---

## 👨‍💻 Contributing

Contributions are welcome! For bug reports, feature requests, or improvements:
1. Check the [GitHub Issues](https://github.com/Nerdiyde/Sunchronizer/issues)
2. Review the [Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki) for existing solutions
3. Create a new issue or pull request

---

## 🔗 Related Projects & Resources

- [DS3231 RTC Component for ESPHome](https://github.com/Nerdiyde/DS3231-RTC-component-for-ESPHome/) - Custom component required for firmware
- [BNO085 RVC Component for ESPHome](https://github.com/Nerdiyde/BNO085-RVC-component-for-ESPHome/) - Custom component required for firmware
- [ESPHome Official Documentation](https://esphome.io/)
- [Home Assistant](https://www.home-assistant.io/) - Smart home integration platform
- [NERDIY.DE Blog](https://nerdiy.de/) - Project blog and store

---

## ❓ FAQ

**Q: Can I use this without Home Assistant?**  
A: Yes! The system can operate independently using GPS for position and time data.

**Q: What's the difference between S1 and D1?**  
A: S1 tracks elevation only (single-axis). D1 tracks both elevation and azimuth (dual-axis) for maximum efficiency.

**Q: Can I modify the firmware?**  
A: Absolutely! The configuration files are fully editable. See the [firmware guide](firmware/) for customization options.

**Q: Where can I get the 3D models?**  
A: STL files are available for purchase on the [NERDIY.DE Blog](https://nerdiy.de/).

**Q: What if I have problems?**  
A: Check the [Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki) first, then open an [issue on GitHub](https://github.com/Nerdiyde/Sunchronizer/issues).

---

**Last Updated:** January 2026  
**Current PCB Version:** v1.3  
**Firmware:** ESPHome-based (open-source)

