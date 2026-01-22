# Sunchronizer Firmware Binaries

This directory contains pre-compiled firmware binaries ready to flash onto the ESP32-S3 microcontroller.

## 📦 Available Binaries

| Filename | PCB Version | Description | Status |
|----------|-------------|-------------|--------|
| `sunchronizer_firmware_pcb_v1.3.bin` | v1.3 | Firmware for PCB v1.3 | ✅ Tested & Stable |

## 🚀 Quick Start - Flashing Instructions

### Option 1: Using ESPHome Web Interface (Easiest)

1. Visit: https://web.esphome.io/
2. Click "Connect" and select your ESP32-S3 device
3. Select the `.bin` file from this directory
4. Click "Install" and wait for completion

### Option 2: Using esptool (Command Line)

```bash
# Install esptool if not already installed
pip install esptool

# Flash the binary
esptool.py --port /dev/ttyUSB0 write_flash 0x0 sunchronizer_firmware_pcb_v1.3.bin
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

These binaries are **compiled from** the configuration files in `../config/`:

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
