# WireViz - Regenerating Wiring Diagrams

This guide explains how the wiring diagrams are generated and how to regenerate them if you make changes.

## 🔧 What is WireViz?

[WireViz](https://github.com/wireviz/WireViz) is an open-source tool that automatically generates professional wiring diagrams from human-readable YAML descriptions.

**Key features**:
- Generate diagrams from YAML source files
- Automatic BOM (Bill of Materials) generation
- Multiple output formats (HTML, PNG, SVG)
- Version control friendly (text-based source)
- Customizable diagram appearance

## 📥 Installation

### Prerequisites
- Python 3.6 or higher
- pip (Python package manager)

### Install WireViz

```bash
# Install WireViz via pip
pip install wireviz

# Verify installation
wireviz --version
```

### System Dependencies (if needed)

WireViz requires Graphviz for rendering. If not already installed:

**Ubuntu/Debian**:
```bash
sudo apt-get install graphviz
```

**macOS** (with Homebrew):
```bash
brew install graphviz
```

**Windows** (with Chocolatey):
```bash
choco install graphviz
```

Or download from: https://graphviz.org/download/

## 🚀 Generating Diagrams

### Basic Usage

```bash
# Navigate to the cable_plan directory
cd cable_plan

# Generate diagrams for v1.3
wireviz pcb_v1.3/sunchronizer_d2_v1.3_wiring_plan.yaml

# Generate diagrams for v1.4
wireviz pcb_v1.4/sunchronizer_d2_v1.4_wiring_plan.yaml
```

### Output Files

WireViz generates multiple files in the same directory as the YAML source:

| File | Description |
|------|-------------|
| `.html` | **Interactive diagram** - Open in web browser |
| `.bom.tsv` | **Bill of Materials** - Tab-separated for spreadsheet apps |
| `.png` | High-resolution raster image (if enabled) |
| `.svg` | Scalable vector graphic (if enabled) |

### Generation Options

For more control, use additional flags:

```bash
# Generate with PNG output
wireviz --format png pcb_v1.3/sunchronizer_d2_v1.3_wiring_plan.yaml

# Generate all formats
wireviz --format all pcb_v1.3/sunchronizer_d2_v1.3_wiring_plan.yaml

# List all available options
wireviz --help
```

## ✏️ Editing the YAML Files

The YAML files are the source for all diagram generation:

**File locations**:
- `pcb_v1.3/sunchronizer_d2_v1.3_wiring_plan.yaml`
- `pcb_v1.4/sunchronizer_d2_v1.4_wiring_plan.yaml`

### Basic YAML Structure

```yaml
connectors:
  # Define all connectors/components
  ESP32:
    name: "ESP32-S3 XIAO"
    type: "Breakout board"
    pinout:
      1: GND
      2: VCC
      3: GPIO1
      # ... more pins

cables:
  # Define all cable connections
  - name: "I2C Bus"
    gauge: "0.5mm²"
    length: "200mm"
    color: "Red"
    connections:
      - ESP32: pin 3    # From
      - BNO085: SDA     # To
```

### Common Modifications

1. **Add a new component**:
   - Add entry under `connectors:`
   - Define its pinout

2. **Add a connection**:
   - Add entry under `cables:`
   - Specify source and destination pins

3. **Change wire color or gauge**:
   - Modify `color:` or `gauge:` fields

4. **Update component names**:
   - Edit the component name in `connectors:`

### Validation

Before generating, validate your YAML:

```bash
# Check YAML syntax
python3 -c "import yaml; yaml.safe_load(open('pcb_v1.3/sunchronizer_d2_v1.3_wiring_plan.yaml'))"

# If it runs without error, syntax is correct
```

## 🔄 Workflow for Modifications

1. **Edit the YAML file** in your text editor
2. **Validate** the YAML syntax
3. **Generate** new diagrams: `wireviz file.yaml`
4. **Review** the output:
   - Open `.html` in browser
   - Check `.bom.tsv` in spreadsheet app
   - Verify all connections are correct
5. **Commit** changes to version control:
   - Commit the YAML source file
   - Commit the generated HTML and BOM files

## 📚 WireViz Documentation

For more detailed WireViz syntax and options:

- **[WireViz GitHub](https://github.com/wireviz/WireViz)** - Official repository
- **[WireViz Examples](https://github.com/wireviz/WireViz/tree/main/examples)** - Sample projects
- **[WireViz Wiki](https://github.com/wireviz/WireViz/wiki)** - Detailed documentation

## 🆘 Troubleshooting

### "Command not found: wireviz"
- Ensure WireViz is installed: `pip install wireviz`
- Try with full path: `python -m wireviz file.yaml`

### "Graphviz not found"
- Install Graphviz from: https://graphviz.org/download/
- On Windows, ensure installation is in PATH

### Generated diagrams look wrong
- Check YAML syntax for errors
- Validate pin names match connector definitions
- Review example files in WireViz repository

### YAML validation fails
- Check indentation (use spaces, not tabs)
- Verify all colons and dashes are properly placed
- Use a YAML validator: https://www.yamllint.com/

## 📝 Notes

- **Source of truth**: YAML files are the authoritative source
- **Generated files**: `.html`, `.bom.tsv` are generated and can be regenerated anytime
- **Version control**: Commit YAML files and generated outputs to track changes
- **Manual edits**: Avoid manually editing HTML/TSV files - they're auto-generated

---

**Last Updated**: January 2026  
**WireViz Version**: 0.3.x+  
**Status**: ✅ Complete regeneration workflow available
