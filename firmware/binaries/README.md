# Sunchronizer Firmware Binaries

Firmware binaries are published as GitHub Release assets.

- Latest release download page: [GitHub Releases (latest)](https://github.com/Nerdiyde/Sunchronizer/releases/latest)
- Browser installer page: [Web Installer](../web-installer/index.html)
- Hosted browser installer: [GitHub Pages](https://nerdiyde.github.io/Sunchronizer/)

## 📦 Available Binaries

|Filename|PCB Version|Description|Status|
|---|---|---|---|
|`sunchronizer_firmware_pcb_v1.3.factory.bin`|v1.3|Factory image for serial/Web Installer flashing|✅ Tested & Stable|
|`sunchronizer_firmware_pcb_v1.3.ota.bin`|v1.3|OTA update image for in-device updates|✅ Tested & Stable|

## 🚀 Quick Start - Flashing Instructions

### Option 0: Browser-based Install (Direct from Latest Release)

1. Open: [Web Installer](../web-installer/index.html)
2. Use a Chromium-based browser (Chrome, Edge, Brave, Opera)
3. Select the detected `.factory.bin` from the latest release and click Install

### Step 0: Download the Binary

1. Open: [GitHub Releases (latest)](https://github.com/Nerdiyde/Sunchronizer/releases/latest)
2. In **Assets**, download the file matching your use case:
   - `.factory.bin` for serial/Web Installer flashing
   - `.ota.bin` for OTA updates

### Option 1: Using ESPHome Web Interface (Easiest)

1. Visit: [ESPHome Web](https://web.esphome.io/)
2. Click "Connect" and select your ESP32-S3 device
3. Select the downloaded `.bin` file
4. Click "Install" and wait for completion

### Option 2: Using esptool (Command Line)

```bash
# Install esptool if not already installed
pip install esptool

# Flash the binary
esptool.py --port /dev/ttyUSB0 write_flash 0x0 sunchronizer_firmware_pcb_v1.3.factory.bin
```

Replace `/dev/ttyUSB0` with your device's serial port:

- **Linux/macOS**: `/dev/ttyUSB0` or `/dev/ttyACM0`
- **Windows**: `COM3`, `COM4`, etc.

### Option 3: Using Arduino IDE / PlatformIO

1. Select the binary file
2. Use the firmware upload feature in your IDE
3. Select correct board: ESP32-S3

## ⚙️ After Flashing

1. **Initial WiFi Setup**
   - The device will create a WiFi access point named "Sunchronizer-XXX"
   - Connect to this AP and open `http://192.168.4.1`
   - Enter your WiFi credentials

2. **Configure Settings**
   - Access the web interface at: `http://sunchronizer.local` (after WiFi connection)
   - Set geographic coordinates (latitude/longitude)
   - Adjust other parameters as needed

3. **Calibration**
   - Follow the calibration guide in [../config/pcb_v1.3/README.md](../config/pcb_v1.3/README.md)

## 🔄 Binary vs Configuration

Release binaries are **compiled from** the configuration files in `../config/`:

- **Binary** → Pre-compiled, ready-to-flash `.bin` file
- **Configuration** → YAML source files that can be customized and recompiled

To modify the firmware, see: [../config/pcb_v1.3/README.md](../config/pcb_v1.3/README.md)

## 🛠️ Rebuilding Binaries

If you modify a configuration file, rebuild the binary:

```bash
# Install/update ESPHome
pip install -U esphome

# Compile from the configuration
esphome compile ../config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml

# Output binary will be in: build/sunchronizer_firmware_pcb_v1.3/.esphome/build/
```

## ⚠️ Important Notes

- ✅ Always verify the binary version matches your PCB hardware
- ✅ Use `.factory.bin` for USB/serial flashing and Web Installer
- ✅ Use `.ota.bin` only for OTA updates from a running device
- ✅ Back up your configuration before flashing new firmware
- ✅ Ensure USB cable provides stable power during flashing
- ⚠️ Do **NOT** use binaries on incompatible PCB versions

## 📚 Resources

- **[Firmware Configuration Guide](../config/pcb_v1.3/README.md)** - Detailed configuration
- **[Main Project README](../../README.md)** - Project overview
- **[ESPHome Documentation](https://esphome.io/)** - Official ESPHome docs
- **[GitHub Issues](https://github.com/Nerdiyde/Sunchronizer/issues)** - Problem solving

---

**Last Updated**: January 2026  
**Recommended for**: PCB v1.3 and compatible hardware  
**Status**: ✅ Stable and tested
