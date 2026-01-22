# Sunchronizer Firmware

## Overview

This directory contains the firmware configuration and pre-compiled binaries for the Sunchronizer dual-axis solar tracking system.

## 📁 Directory Structure

```
firmware/
├── README.md                       # This file - Overview
├── binaries/                       # Pre-compiled firmware binaries (.bin files)
│   ├── sunchronizer_firmware_pcb_v1.3.bin
│   └── [other version binaries...]
└── config/                         # ESPHome YAML configuration files
    └── pcb_v1.3/                   # Configuration for PCB v1.3
        ├── README.md               # Detailed configuration documentation
        ├── sunchronizer_firmware_pcb_v1.3.yaml
        └── secrets.yaml            # WiFi & API credentials (DO NOT COMMIT)
```

## 📦 Binaries Folder

Contains **pre-compiled firmware binaries** ready to flash onto an ESP32-S3 microcontroller. Each binary corresponds to a configuration file in the `config` folder.

### How to Use Binaries

1. **Identify Your Version**
   - Match the binary filename with your PCB version (e.g., `pcb_v1.3`)

2. **Flash to ESP32-S3**
   - Using esptool:
     ```bash
     esptool.py write_flash 0x0 binaries/sunchronizer_firmware_pcb_v1.3.bin
     ```
   - Or using ESPHome web interface:
     ```
     Open https://web.esphome.io/ and select the binary file
     ```

3. **Initial WiFi Setup**
   - Device will create an access point for initial WiFi configuration
   - Connect and enter your WiFi credentials

### Advantages of Pre-compiled Binaries

✅ **Fast Deployment** - No compilation needed  
✅ **Consistency** - Guaranteed binary matches tested configuration  
✅ **Storage** - Ready-to-use files for backups  
✅ **Distribution** - Easy to share tested versions  

## ⚙️ Config Folder

Contains **ESPHome YAML configuration files** used to generate the binaries. These files define:
- Hardware pin assignments
- Sensor configurations
- Automation logic
- Web interface settings
- Safety parameters

### Configuration Files

- **[config/pcb_v1.3/README.md](config/pcb_v1.3/README.md)** - Detailed documentation for PCB v1.3
- **[config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml](config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml)** - Main configuration file
- **[config/pcb_v1.3/secrets.yaml](config/pcb_v1.3/secrets.yaml)** - WiFi & API credentials (template provided)

## 📋 Version Compatibility

- **Binary v1.3** → Requires **PCB v1.3** hardware
- Each binary is hardware-specific and version-locked
- Do not use binaries on incompatible hardware versions

## ✅ Verification

To verify a binary matches its configuration:

1. Check filename consistency
2. Review modification dates (binary should be newer than config if recently updated)
3. Verify checksums if provided

### How to Use Configuration Files

1. **Review Configuration**
   - Check [config/pcb_v1.3/README.md](config/pcb_v1.3/README.md) for detailed documentation
   - Review [config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml](config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml)

2. **Customize for Your Setup**
   - Copy `secrets.yaml` and edit WiFi credentials
   - Adjust geographic coordinates (latitude/longitude)
   - Modify calibration values if needed

3. **Compile & Flash**
   ```bash
   esphome run config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml
   ```

## 🔄 Binary-Config Relationship

Each binary in the `binaries/` folder is compiled from the corresponding configuration in the `config/` folder:

| Binary File | Config File | PCB Version |
|------------|-------------|------------|
| `sunchronizer_firmware_pcb_v1.3.bin` | `config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml` | v1.3 |

## 🛠️ Rebuilding Binaries

If you modify a configuration file and want to rebuild the binary:

```bash
# Install/update ESPHome
pip install -U esphome

# Compile the configuration
esphome compile config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml

# Output binary will be generated in a build/ directory
```

## 📚 Additional Resources

- **[Main Project README](../README.md)** - Project overview
- **[Detailed Configuration Guide](config/pcb_v1.3/README.md)** - PCB v1.3 configuration
- **[Full Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)** - Complete documentation
- **[ESPHome Documentation](https://esphome.io/)** - ESPHome framework reference

## 🚀 Quick Start

**Option 1: Use Pre-compiled Binary (Fastest)**
```bash
esptool.py write_flash 0x0 binaries/sunchronizer_firmware_pcb_v1.3.bin
```

**Option 2: Compile from Configuration**
```bash
esphome run config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml
```


---

**Last Updated**: January 2026  
**Current PCB Version**: v1.3  
**Status**: ✅ Fully compatible and tested
