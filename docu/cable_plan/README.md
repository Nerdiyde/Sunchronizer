# Sunchronizer Cable Plans & Wiring Diagrams

This directory contains wiring diagrams, connection documentation, and component BOMs (Bills of Materials) for different Sunchronizer PCB versions.

## 📁 Available Versions

### PCB v1.3 (Current Stable)
**Directory**: `pcb_v1.3/`

Contains:
- `sunchronizer_d2_v1.3_wiring_plan.html` - Interactive wiring diagram
- `sunchronizer_d2_v1.3_wiring_plan.bom.tsv` - Bill of Materials
- `sunchronizer_d2_v1.3_wiring_plan.yaml` - Machine-readable configuration

✅ **Status**: Stable and recommended for new builds

### PCB v1.4 (Latest)
**Directory**: `pcb_v1.4/`

Contains:
- `sunchronizer_d2_v1.4_wiring_plan.html` - Interactive wiring diagram
- `sunchronizer_d2_v1.4_wiring_plan.bom.tsv` - Bill of Materials
- `sunchronizer_d2_v1.4_wiring_plan.yaml` - Machine-readable configuration

✅ **Status**: Tested and available with improvements

## 📖 How to Use This Documentation

### Step 1: Open the HTML Wiring Diagram

1. Download or open the `.html` file for your PCB version
2. Open it in any web browser (Chrome, Firefox, Safari, Edge, etc.)
3. The diagram shows all connections visually
4. You can typically:
   - Zoom in/out to see details
   - Click components for more information
   - Hover over connections for highlighting

### Step 2: Reference the BOM

1. Open the `.bom.tsv` file in a spreadsheet application:
   - **Excel**: File → Open → Select TSV file
   - **Google Sheets**: File → Import → Upload TSV file
   - **LibreOffice Calc**: File → Open → Select TSV file

2. Use the BOM to:
   - Verify all component values
   - Check component quantities
   - Identify connector types and pin counts
   - Create shopping lists for parts

### Step 3: Regenerating the Wiring Plans from YAML

The wiring diagrams are generated from YAML source files using **[WireViz](https://github.com/wireviz/WireViz)**.

If you need to regenerate or modify the wiring diagrams:

```bash
# Install WireViz (if not already installed)
pip install wireviz

# Generate diagrams from YAML (produces HTML, BOM, and other formats)
wireviz pcb_v1.3/sunchronizer_d2_v1.3_wiring_plan.yaml
wireviz pcb_v1.4/sunchronizer_d2_v1.4_wiring_plan.yaml

# Output files will be created in the same directory
```

**WireViz generates**:
- `.html` - Interactive wiring diagram
- `.bom.tsv` - Bill of Materials in TSV format
- `.png` - High-resolution diagram image (if enabled)
- `.svg` - Scalable vector graphic (if enabled)

For detailed instructions on editing YAML files and regenerating diagrams, see: **[WIREVIZ_GUIDE.md](WIREVIZ_GUIDE.md)**

### Step 3: For Advanced Users - YAML Configuration

The `.yaml` files contain machine-readable specifications:

```bash
# View the YAML file
cat pcb_v1.3/sunchronizer_d2_v1.3_wiring_plan.yaml

# Parse with tools if needed
python3 -c "import yaml; print(yaml.safe_load(open('pcb_v1.3/sunchronizer_d2_v1.3_wiring_plan.yaml')))"
```

This is useful for:
- Automated documentation generation
- Schematic verification tools
- Pin assignment validation
- Cross-referencing with firmware

## 🔌 Key Connection Points

The wiring diagrams cover:

1. **Microcontroller Connections**
   - ESP32-S3 XIAO pin assignments
   - All GPIO mappings

2. **Motor Control**
   - Elevation motor connections
   - Azimuth motor connections
   - H-bridge wiring

3. **Sensors**
   - IMU (BNO085) I2C connections
   - RTC (DS3231) I2C connections
   - GPS/GNSS module (if used)
   - Current sensors (INA219)

4. **Power Distribution**
   - 12V supply connections
   - 5V regulator
   - Ground connections
   - Protection circuits

5. **User Interface**
   - Button connections
   - LED display connections
   - Additional control inputs

## ⚠️ Important Notes

- **Always verify your PCB version** before referencing documentation
- **Follow the wiring carefully** - incorrect connections can damage components
- **Use appropriate wire gauges** for different voltages and currents
- **Check component values** - Some may vary based on design revisions
- **Test connections** with a multimeter before applying power

## 🔄 Version Differences

| Feature | v1.3 | v1.4 |
|---------|------|------|
| ESP32 Module | XIAO | XIAO S3 |
| Motor Control | Dual H-Bridge | Enhanced H-Bridge |
| Sensor Integration | Stable | Improved layout |
| Datasheets | Included | Included |

> **Recommendation**: For new builds, use v1.4. For maintenance of existing systems, use your current version's documentation.

## 📚 Related Resources

- **[WireViz Guide](WIREVIZ_GUIDE.md)** - How to regenerate and edit wiring diagrams
- **[Main Documentation](../README.md)** - Complete docu directory overview
- **[Firmware Configuration](../../firmware/config/)** - Pin assignments in code
- **[Project README](../../README.md)** - Hardware specifications
- **[Pictures & Diagrams](../../pictures/)** - Visual assembly guides
- **[Full Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)** - Detailed assembly guide

## 🆘 Troubleshooting

**Q: Can't open the HTML file**  
A: Try a different browser or download the file locally

**Q: TSV file looks corrupted in Excel**  
A: Try using Google Sheets import or LibreOffice Calc which handles TSV better

**Q: Pin numbers don't match my board**  
A: Verify you're using the correct PCB version documentation

**Q: Need high-resolution wiring diagrams**  
A: Check the `pictures/` directory for technical drawings

---

**Last Updated**: January 2026  
**PCB Versions Documented**: v1.3 (stable), v1.4 (latest)  
**Status**: ✅ Complete wiring documentation available
