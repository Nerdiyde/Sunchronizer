# Sunchronizer Documentation & Technical Resources

This directory contains comprehensive documentation, schematics, wiring diagrams, and technical information for the Sunchronizer project.

## 📁 Directory Structure

```
docu/
├── README.md                   # This file
├── cable_plan/                 # Wiring diagrams and connection documentation
│   ├── README.md               # How to use and regenerate cable plans
│   ├── pcb_v1.3/               # v1.3 wiring documentation
│   │   ├── sunchronizer_d2_v1.3_wiring_plan.bom.tsv    # Bill of Materials
│   │   ├── sunchronizer_d2_v1.3_wiring_plan.html       # Interactive wiring diagram
│   │   └── sunchronizer_d2_v1.3_wiring_plan.yaml       # YAML wiring configuration (WireViz source)
│   └── pcb_v1.4/               # v1.4 wiring documentation
│       ├── sunchronizer_d2_v1.4_wiring_plan.bom.tsv
│       ├── sunchronizer_d2_v1.4_wiring_plan.html
│       └── sunchronizer_d2_v1.4_wiring_plan.yaml
├── diagrams/                   # System architecture and block diagrams
└── datasheets/                 # Component datasheets for reference
```

## 🔌 Cable Plan / Wiring Diagrams

### Overview
The `cable_plan` directory contains detailed wiring diagrams for different PCB versions:

- **PCB v1.3**: Initial design
- **PCB v1.4**: Current stable version

### Using the Wiring Plans

See [cable_plan/README.md](cable_plan/README.md) for detailed instructions on how to use and regenerate the wiring documentation.

### File Formats

Each PCB version includes three formats for maximum compatibility:

1. **BOM (Bill of Materials)** - `*.bom.tsv`
   - Tab-separated values format
   - Lists all components and connections
   - Import into spreadsheet applications for reference

2. **HTML Viewer** - `*.html`
   - Interactive wiring diagram
   - Open in any web browser
   - Best for visual inspection and understanding connections

3. **YAML Configuration** - `*.yaml`
   - Machine-readable format
   - Used by tools and automation scripts
   - Source format for generating other formats

## 📊 Diagrams

Contains system architecture diagrams, block diagrams, and conceptual drawings:

- System overview
- Signal flow diagrams
- Hardware block diagrams
- Data flow architecture

## 📖 Datasheets

Reference datasheets for all major components:

- **ESP32-S3**: Microcontroller specifications
- **BNO085**: IMU sensor specifications
- **DS3231**: RTC module specifications
- **INA219**: Current sensor specifications
- **Motor drivers & H-bridges**: Control circuitry
- **Other components**: Sensors, connectors, etc.

## 🔍 Quick Reference

### For Electrical Assembly
1. Open the HTML wiring diagram for your PCB version
2. Reference the BOM for component listings
3. Check datasheets if you need detailed specifications

### For Firmware Configuration
- Review [../firmware/config/](../firmware/config/) for configuration details
- Pin assignments: See wiring diagrams and configuration files

### For PCB Design/Modification
- YAML files contain machine-readable specifications
- Datasheets provide component-level details
- HTML diagrams show all connections visually

## 🔄 PCB Version Compatibility

| Version | Status | Notes |
|---------|--------|-------|
| v1.3 | ✅ Stable | Current recommended version |
| v1.4 | ✅ Tested | Newer features and improvements |

⚠️ Always verify your PCB version before referencing the appropriate documentation!

## 📚 Related Resources

- **[Main Project README](../README.md)** - Project overview
- **[Firmware Guide](../firmware/README.md)** - Software configuration
- **[Pictures & Technical Drawings](../pictures/README.md)** - Visual documentation
- **[Full Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)** - Complete documentation

---

**Last Updated**: January 2026  
**Current PCB Versions**: v1.3 (stable), v1.4 (tested)  
**Status**: ✅ Comprehensive documentation available
