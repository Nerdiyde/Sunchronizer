# 🌞 Sunchronizer
## Firmware - ESPHome Configuration (PCB v1.3)

## Overview

This is the ESPHome configuration file for the **Sunchronizer** - an intelligent dual-axis solar tracking system for solar panels. The system automates the orientation of solar panels towards the sun to achieve optimal energy generation.

## 📋 File Information

- **Configuration File**: `sunchronizer_firmware_pcb_v1.3.yaml`
- **Hardware Version**: PCB v1.3
- **Microcontroller**: ESP32-S3
- **Framework**: ESPHome
- **Purpose**: Complete firmware configuration for dual-axis solar tracking

## 🎯 Features

### Hardware Integration
- **IMU Sensor**: BNO085 (Accelerometer, Magnetometer)
- **RTC**: DS3231 (Real-time clock)
- **GNSS/GPS**: For position and time synchronization
- **Current Sensors**: INA219 (Current monitoring for both motors)
- **Motor Controller**: H-Bridge for elevation and azimuth motors
- **Display**: LED display with adjustable brightness

### Software Features
- ✅ Automatic sun tracking (elevation and azimuth axes)
- ✅ Magnetic declination calibration (manual and periodic)
- ✅ Fault detection (motor blockage, connectivity issues)
- ✅ Weather integration (OpenWeatherMap API)
- ✅ Standby mode (automatic parking at night)
- ✅ Wind and cloud protection
- ✅ Web interface for monitoring and control
- ✅ Comprehensive calibration functions
- ✅ System status monitoring (WiFi, GNSS, sensors)

## 📁 Configuration Structure

The file is organized into the following main sections:

1. **Base Configuration** - ESPHome definitions, WiFi, OTA
2. **GPIO Definitions** - Pin assignments for all hardware components
3. **Global Variables** - System state and buffers
4. **Sensor Definitions** - IMU, GNSS, RTC, current, temperature
5. **Automation & Scripting** - Tracking logic, error handling
6. **Web Interface** - User interface with sorting groups
7. **Button & Switch Controls** - Control elements
8. **External Components** - Custom ESPHome components

## 🔧 Customization for Your Projects

Before using this configuration, please adjust the following areas:

### Required Changes
1. **WiFi Credentials** - Use `secrets.yaml` or environment variables
2. **Geographic Coordinates** - Set `device_latitude` and `device_longitude`
3. **OpenWeatherMap API Key** - If weather integration is desired
4. **GPIO Pin Assignments** - Verify the actual pin numbers on your PCB

### Optional Customization
- Calibration values for angle limits
- Wind and cloud thresholds
- Standby positions
- Motor blockage thresholds
- LED brightness for day/night

## 🌐 Web Interface

The system provides a comprehensive web interface via the integrated ESPHome web server with the following categories:

- **Status Overview** - System status at a glance
- **Fault & Measurements Detection** - Fault detection status
- **Safety Features & Automations** - Automation switches
- **System Settings** - Timezones, restart, reset
- **Elevation & Azimuth Axis** - Axis control and status
- **GNSS Sensor Status** - GPS/GNSS data
- **IMU Sensor Status** - Accelerometer and magnetometer
- **Motor Status** - Current consumption and temperature
- **Network & Internet** - Connectivity status
- **Weather Settings** - OpenWeatherMap integration

## 📊 Sorting & Icons

All web interface elements are configured with:
- ✅ **Sorting Weights** - Define display order
- ✅ **Material Design Icons** - Visually descriptive icons
- ✅ **Entity Categories** - Proper categorization

## 🔐 Security & Status

- Regular system monitoring
- Automatic error handling
- Sensor readiness checks
- WiFi and internet connectivity checks
- Calibration validation

## 📚 Additional Documentation

For more information, see:
- **[Main Project README](../README.md)** - Project overview and hardware specifications
- **[PCB Documentation](../pcb/README.md)** - Schematic details and component placement
- **[Calibration Guide](../docs/CALIBRATION.md)** - Detailed calibration procedures
- **[Installation & Setup](../docs/SETUP.md)** - Step-by-step guide
- **[ESPHome Documentation](https://esphome.io/)** - Official ESPHome reference

## ⚡ System Requirements

- ESPHome 2024.x or higher
- Python 3.9+
- USB cable for initial flash
- 2.4GHz WiFi network

## 🚀 Getting Started

1. **Flash the Firmware**
   ```bash
   esphome run sunchronizer_firmware_pcb_v1.3.yaml
   ```

2. **Perform Calibration**
   - Magnetic declination calibration
   - Angle limits measurement
   - Position verification

3. **Test Configuration**
   - Open web interface (ESP32 IP address)
   - Verify sensors
   - Manual control test

4. **Start Automation**
   - Enable auto-tracking
   - Monitor status regularly

## 🔧 Troubleshooting

### Common Issues
- **Sensor not detected** → Check I2C addresses and wiring
- **Motor not moving** → Verify GPIO assignments and motor power supply
- **WiFi connection fails** → Check SSID and password in `secrets.yaml`
- **Angle measurement inaccurate** → Perform IMU calibration

For more help, refer to the project documentation files or ESPHome forums.

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

**Version**: 1.3 (PCB v1.3)  
**Last Updated**: January 2026  
**Status**: ✅ Fully configured and tested
