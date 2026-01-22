# Pictures & Technical Drawings

This directory contains photographs, CAD drawings, technical illustrations, and visual documentation for the Sunchronizer project.

## 📁 Directory Structure

```
pictures/
├── README.md                           # This file
├── S1/                                 # Single-axis Tracker (Elevation only)
│   ├── mark1/                          # Original S1 prototype
│   │   └── anotations/                 # Annotated technical drawings
│   ├── technical_drawings/             # CAD drawings and schematics
│   └── GIFs/                           # Animated demonstrations
├── D1/                                 # Dual-axis Tracker (Elevation + Azimuth)
│   └── technical_drawings/             # CAD drawings for D1 variant
├── D2/                                 # D2 variant documentation
├── PCBs/                               # PCB layouts and board photos
│   └── v1.3/
│       └── pictures/                   # v1.3 PCB photo documentation
└── testbench/                          # Testing setup and validation photos
```

## 🎯 Tracker Variants

### S1 - Single-Axis Tracker

**Location**: `S1/`

The S1 tracks **elevation angle only** (up-down movement):

- ✅ Simpler mechanical design
- ✅ Lower component count
- ✅ Good for fixed-azimuth installations
- ⚠️ Less efficient than dual-axis in variable conditions

**Contents**:
- `mark1/` - Original prototype with annotations
- `technical_drawings/` - CAD models and engineering drawings
- `GIFs/` - Animated demonstrations of operation

### D1 - Dual-Axis Tracker

**Location**: `D1/`

The D1 tracks **both elevation and azimuth angles** (up-down and left-right):

- ✅ Maximum solar efficiency
- ✅ Optimal for any installation orientation
- ✅ Advanced control logic
- ⚠️ More complex mechanics

**Contents**:
- `technical_drawings/` - Complete CAD drawings for dual-axis mechanism

### D2 - D2 Variant

**Location**: `D2/`

Variant of the D1 with modifications and improvements.

## 🖼️ Using the Pictures

### For Assembly Reference
1. Navigate to the appropriate variant folder (S1 or D1)
2. Check `technical_drawings/` for CAD models and schematics
3. Use `mark1/anotations/` for assembly hints
4. Reference `GIFs/` for operational demonstrations

### For 3D Printing
- CAD files in `technical_drawings/` contain the 3D models
- Export as STL for slicing
- See main README for printable part specifications

### For Understanding Operation
- Watch GIFs in the variant folders to see movement sequences
- Reference annotated drawings in `mark1/anotations/`
- Cross-reference with firmware documentation

## 📊 PCB Documentation

### PCB v1.3
**Location**: `PCBs/v1.3/pictures/`

Contains photographs of:
- Assembled PCB (top and bottom views)
- Component placement guide
- Connection points highlighted

Use this for:
- Visual component verification
- Soldering reference
- Quality control checks

## 🧪 Test Setup Photos

**Location**: `testbench/`

Photographs from the testing and validation phase:
- Experimental setups
- Sensor calibration configurations
- Performance testing arrangements

## 🎬 GIF Animations

Available in the variant folders (`S1/GIFs/`, etc.):

**Benefits of GIF documentation**:
- Shows movement sequences
- Demonstrates tracking behavior
- Helps visualize operation without videos
- Lightweight for documentation viewing

**Featured GIFs**:
- `sunchronizer_timelapse_smaller_5mb.gif` - Full day tracking demonstration

## 📐 Technical Drawing Formats

The technical drawings may include:

- **CAD Files** (`.step`, `.iges`, `.dxf`) - For 3D modeling and printing
- **PDF Drawings** - For reference and printing
- **PNG/JPG Images** - For quick viewing and documentation

## 🔍 Using Technical Drawings

### For 3D Printing

1. Locate the variant folder (S1 or D1)
2. Open `technical_drawings/` 
3. Find the `.stl` or CAD model files
4. Import into your slicer software (Cura, PrusaSlicer, etc.)
5. Adjust scale if needed (default is 1:1)
6. Configure print settings:
   - **Material**: PETG or ABS recommended
   - **Layer height**: 0.2mm
   - **Supports**: Enable as needed
   - **Infill**: 15-20%

### For CAD Modifications

1. Open the CAD file in your preferred software:
   - Fusion 360 (free for makers)
   - FreeCAD (open-source)
   - SolidWorks (commercial)
   - Inventor (commercial)

2. Make your modifications
3. Export as STL for 3D printing
4. Or generate technical drawings for fabrication

### For Understanding Assembly

1. Print or display the technical drawings
2. Reference the annotated photos in `mark1/anotations/`
3. Cross-reference with the BOM in `docu/cable_plan/`
4. Check firmware pin assignments in `firmware/config/`

## 🔄 Variant Selection

Choose your reference material based on your project variant:

| Need | Reference Location |
|------|-------------------|
| S1 Assembly | `S1/technical_drawings/` + `S1/mark1/anotations/` |
| D1 Assembly | `D1/technical_drawings/` |
| PCB Assembly | `PCBs/v1.3/pictures/` |
| Operation Understanding | `S1/GIFs/` or `D1/GIFs/` |
| Component Verification | `S1/mark1/anotations/` |

## 📚 Related Resources

- **[Main Project README](../README.md)** - Project overview
- **[Cable Plans & Wiring](../docu/cable_plan/)** - Electrical connections
- **[Firmware Documentation](../firmware/)** - Software configuration
- **[Full Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)** - Complete assembly guide
- **[Blog](https://nerdiy.de/)** - Detailed build guides

## 💡 Tips

✅ Print technical drawings at 100% scale for best reference  
✅ Use multiple views (front, side, top) together for understanding  
✅ Compare prototype photos with your build for troubleshooting  
✅ Keep organized: label your prints with variant and version  
✅ Archive photos of your build for future reference  

---

**Last Updated**: January 2026  
**Variants Documented**: S1, D1, D2  
**Status**: ✅ Comprehensive visual documentation available
