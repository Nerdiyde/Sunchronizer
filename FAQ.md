# Sunchronizer — Frequently Asked Questions

This document answers common questions from users and developers about the Sunchronizer project.

---

## General Questions

### Q: Can I use this without Home Assistant?

**A:** Yes! The system can operate completely independently using GPS for position data and time. GPS is sufficient to:
- Calculate sun position automatically
- Track elevation and azimuth
- Run without network connectivity

However, Home Assistant integration adds convenience and monitoring capabilities. Without HA, you control the tracker via physical buttons or the built-in web interface.

**See also:** [Firmware Configuration Guide](firmware/README.md)

---

### Q: What's the difference between S1, S2, D1, and D2?

**A:** The naming follows a simple two-part convention:

- **First letter** — tracking axes:
  - **S** = Single-axis (elevation only — tilts the panel up/down)
  - **D** = Dual-axis (elevation + azimuth — tilts up/down AND rotates left/right)

- **Number** — generation/iteration:
  - **1** = First generation
  - **2** = Improved second generation (refined mechanics, better performance)

**Overview:**

| Variant | Axes | Generation | Best For |
|---------|------|------------|----------|
| **S1** | Elevation only | 1st gen | Simple installs, fixed azimuth |
| **S2** | Elevation only | 2nd gen | Improved single-axis, lower complexity |
| **D1** | Elevation + Azimuth | 1st gen | Full dual-axis tracking |
| **D2** | Elevation + Azimuth | 2nd gen | Maximum efficiency, production-ready |

**Performance:** Dual-axis (D1/D2) yields **~12-15% more energy** than single-axis (S1/S2) over a full day.

**Current Recommendation:**
- **Maximum efficiency:** D2 — latest, most tested, full 2-axis tracking
- **Simpler build:** S2 — lower complexity, still very effective

**See also:** [Measurement Analysis Overview](docu/measurements/MEASUREMENT_OVERVIEW.md) for real performance data comparing S2 vs D2.

---

### Q: Can I modify the firmware?

**A:** Absolutely! The configuration is fully editable:
- All firmware files are open-source (AGPL-3.0)
- Configuration uses [ESPHome YAML](https://esphome.io/) — human-readable, not compiled
- Customize tracking algorithms, sensor thresholds, WiFi settings, and more
- Export and compile your own changes

**See also:** [Firmware Configuration Guide](firmware/config/pcb_v1.3/README.md)

---

### Q: Where can I get the 3D models (STLs)?

**A:** STL files are available for purchase on the official store:
- **Sunchronizer S1:** https://nerdiy.de/en/product-2/sunchronizer-s1-400w-solartracker-fuer-elevation-achse-3d-druckbar-stl-dateien/
- **Sunchronizer D1:** https://nerdiy.de/en/product-2/sunchronizer-d1-dual-axis-solartracker-fuer-azimut-und-elevation-achse-3d-druckbar-stl-dateien/

The STL files include a complete bill of materials and assembly instructions.

---

### Q: What if I have problems?

**A:** Here's where to begin:
1. **Check the [GitHub Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)** — comprehensive documentation with troubleshooting sections
2. **Review the [Firmware Guide](firmware/README.md)** — covers flashing and common setup issues
3. **Search [existing GitHub issues](https://github.com/Nerdiyde/Sunchronizer/issues)** — your question may already be answered
4. **Create a new issue** with details (setup, error messages, logs) — describe what you've tried
5. **Consult the [ESPHome documentation](https://esphome.io/)** — for firmware-specific questions

---

## Assembly & Getting Started

### Q: I'm interested in building the Sunchronizer D2. What do the STL files include? Do I get assembly instructions, component lists, and PDFs?

**A:** The **product files** available on [NERDIY.DE](https://nerdiy.de/) and [Printables](https://www.printables.com/) include:

✅ **What's Included:**
- All STL files (3D-printable parts) for D2/D1 variants
- Complete Bill of Materials (BOM) with part numbers and supplier links
- Wiring diagram (interactive HTML + YAML source)
- Firmware configuration guide
- Step-by-step assembly documentation with photos
- Component specifications and datasheets

✅ **Additional Resources** (in this GitHub repository):
- [Firmware Configuration Guide](firmware/README.md) — how to flash and configure the ESP
- [Bill of Materials](bom/BOM.md) — comprehensive component list with links
- [Cable Plan & Wiring Diagrams](docu/cable_plan/) — detailed connection documentation
- [Prototype Development History](docu/development_history/DEVELOPMENT_HISTORY.md) — see how it's built
- [Full Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki) — detailed technical documentation

**Recommendation:**
1. **Purchase the STL files** from [NERDIY.DE](https://nerdiy.de/) or [Printables](https://www.printables.com/) — includes assembly PDFs
2. **Review this GitHub repo** — additional documentation, measurement data, and firmware guides
3. **Check the [Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)** — answers common assembly questions
4. **Start with the BOM** — gather all components before printing

You will have **everything needed** to successfully assemble your tracker! 🚀

---

## Hardware & Construction

### Q: Will the construction support a 500W solar panel?
### (Dimensions: 1960 × 1134 × 30 mm, Weight: ~ 26.6 kg)

**A:** The Sunchronizer is currently **designed and tested with 400 W solar panels** (~19-20 kg weight). A 500 W panel at **26.6 kg is significantly heavier** and requires careful consideration:

**Technical Specification:**
- **Linear Actuator Capacity:** 6000 N force (approximately 612 kg at earth gravity)
- **Mechanical Advantage:** The geared motor and lever system provide significant force multiplication
- **Expected Load Tolerance:** Based on the 6000 N actuator, **500W panels (26.6 kg) will likely be supported** — the actuator has ample capacity

**However:**
⚠️ **This configuration has NOT been tested** with 500W panels — use at your own risk.

**What You Must Verify Before Building:**
1. **Structural stress test:** Mount the 500W panel at typical operating angles (30-45°) and verify:
   - Motor current during motion (should not exceed specs)
   - Actuator extension/contraction is smooth and balanced
   - No excessive flex in 3D-printed mounting brackets
2. **Temperature monitoring:** Check motor temperature under load and full sun
3. **Safety margin:** Test at angles beyond normal operation to confirm safety limits
4. **Printed parts reinforcement:** Consider reinforcing critical joints with metal inserts or printed-in supports

**Recommendation:**
- **If you proceed:** Test gradually and monitor closely during first operation
- **Structural reinforcement:** Consider printing critical parts in stronger materials (PETG, ASA) or adding metal reinforcement

**Bottom Line:** The 6000 N actuator suggests technical feasibility, but **untested configuration = use at your own risk**. Thorough testing required before leaving it unattended outdoors.

---

### Q: What about end-of-travel switches? Are they mandatory?

**A:** **Yes — end-of-travel switches are mandatory, and they are already integrated into the Sunchronizer's construction on both axes.**

- **Elevation axis:** The **linear actuator has built-in endstops**. Its internal limit switches cut motor power at both ends of travel, so the elevation axis cannot physically be driven beyond its limits.
- **Azimuth axis:** **Mechanical endstops are integrated into the Sunchronizer's physical structure** (base ring / frame). These hard stops prevent over-rotation of the azimuth axis.

Because both are mandatory and already built in, no separate external limit switches need to be sourced or wired — the protection is part of the design.


---

## Firmware & Software

### Q: Where are the binary files to flash the ESP?

**A:** Pre-compiled firmware binaries are located in:

```
firmware/binaries/
├── [pre-compiled .bin files for different PCB versions]
└── [flashing instructions]
```

**Quick Start:**
1. Download a binary matching your **PCB version** (v1.3, v1.4, etc.)
2. Install [ESPHome CLI Tool](https://esphome.io/guides/installing_esphome.html) or use [Web Tool](https://web.esphome.io)
3. Flash the binary to your ESP32-S3 XIAO microcontroller
4. Configure WiFi credentials — three options:
   - **Improv via Serial:** Configure WiFi directly over USB using the [Improv Serial protocol](https://www.improv-wifi.com/serial/) (supported out of the box)
   - **Fallback Access Point:** If no WiFi is configured, the ESP opens its own AP — connect to it and enter your credentials via the captive portal
   - **Manual:** Edit credentials in [firmware/config/pcb_v1.3/secrets.yaml](firmware/config/pcb_v1.3/secrets.yaml) before compiling, or set them in `secrets.yaml.example`

**See also:** [Firmware Guide — Flashing Section](firmware/README.md)

---

### Q: What are the custom ESPHome components?

**A:** The Sunchronizer firmware depends on two external components:

1. **[DS3231 RTC Component](https://github.com/Nerdiyde/DS3231-RTC-component-for-ESPHome/)**
   - Provides precise timekeeping independent of WiFi
   - Maintains time during network outages
   - Essential for GPS-only standalone operation

2. **[BNO085 RVC Component](https://github.com/Nerdiyde/BNO085-RVC-component-for-ESPHome/)**
   - 9-DOF IMU sensor (accelerometer, gyro, magnetometer)
   - Measures elevation angle of the tilted panel
   - Provides compass heading for azimuth verification

Both are open-source and included in the firmware configuration automatically.

---

### Q: Can I use a different microcontroller?

**A:** The **Sunchronizer is designed for the ESP32-S3 XIAO** and relies on:
- WiFi/Bluetooth (for Home Assistant integration)
- Sufficient GPIO pins for motor drivers, sensors, and buttons
- ESPHome compatibility

**Other boards may work** if they meet these requirements, but:
- PCB design would need modification
- Testing and debugging would be required
- Support cannot be guaranteed

**Recommendation:** Use the recommended ESP32-S3 XIAO to ensure compatibility and simplicity.

---

## GPS & Position Data

### Q: Do I need a GPS module? Can I run the Sunchronizer without GPS?

**A:** **No, GPS is not mandatory.** The tracker can operate without GPS by using one of several alternatives:

**Three Operating Modes:**

| Mode | GPS | Home Assistant | Configuration | Accuracy |
|------|-----|-----------------|----------------|----------|
| **GPS-Only** | ✅ Yes | ❌ Not needed | Auto-detected location/time | High |
| **Home Assistant** | ❌ Optional | ✅ Yes | HA provides location/time | High |
| **Manual Config** | ❌ No | ❌ Not needed | Hardcode lat/lon in firmware | High (if correct) |

**Details:**

**1. GPS Module (Recommended for standalone)**
- Automatically detects location (latitude/longitude) via satellite
- Provides precise time (independent of WiFi/network)
- Best for off-grid installations with no internet
- Typical GPS modules: Neo-6M, Neo-M9N, etc.

**2. Home Assistant (Easiest for connected setups)**
- HA provides your location and time automatically
- Requires WiFi and Home Assistant running
- No GPS module needed
- Simple configuration with YAML

**3. Manual Configuration (No GPS, no HA)**
- Hardcode latitude/longitude directly in firmware
- Requires accurate time (use RTC — DS3231)
- Works without WiFi or GPS
- **Limitation:** Time remains accurate only if RTC is set correctly at startup

**If You Don't Have/Use GPS:**

You **must configure** one of these in the firmware:

**Option B — Manual configuration (no HA, no GPS):**

The coordinates can be set in **three equivalent ways** — pick whichever fits your workflow:

**1. In the firmware config file (before flashing)**

Edit `sunchronizer_firmware_pcb_v1.3.yaml`, find the `coordinates:` substitution block and **change only the values** (the numbers):

```yaml
substitutions:
  coordinates:
    standard_latitude: "51.4556"     # ← Change this number to your latitude
    standard_longitude: "7.0116"     # ← Change this number to your longitude
```

The sun section uses these values automatically:
```yaml
sun:
  latitude: ${coordinates.standard_latitude}
  longitude: ${coordinates.standard_longitude}
```

**2. Via the Home Assistant / ESPHome dashboard (after flashing)**

The coordinates are exposed as configurable numbers in the dashboard. You can change them at any time without reflashing — the new values are **stored persistently in the ESP's flash memory** and survive power cycles.

**3. Hardcoded fallback**

If no dashboard is available and no GPS is connected, the firmware falls back to the `standard_latitude` / `standard_longitude` values baked into the binary at flash time.

**How to find your coordinates:**
1. Use [Google Maps](https://maps.google.com/) — right-click on your location, see decimal coordinates
2. Use [LatLong.net](https://www.latlong.net/) — enter your address
3. Format: **decimal degrees** (not DMS format)
   - **Example:** Bochum = 51.4556°N, 7.0116°E
   - **Example:** Berlin = 52.5200°N, 13.4050°E

**Required in all cases:**
- **RTC (DS3231):** Keeps time accurate even after power loss
- **Accurate initial time:** Set the RTC time correctly on first boot (via WiFi or manually)
- **Correct latitude/longitude:** Errors here = tracking errors

**Recommendation:**
- **For autonomous/off-grid:** Use GPS module (most reliable)
- **For Home Assistant users:** HA provides location — GPS optional
- **For simple installs:** Manual config + RTC works fine if you set time correctly

---

## Technical Details & Algorithms

### Q: How are elevation and azimuth angles calculated?

**A:** The Sunchronizer uses a **two-layer system** for angle calculations:

**Layer 1 — Target Angles (Sun Position)**
These are **calculated** based on sun position:
- **Input:** Latitude, Longitude, Current Time
- **Component:** ESPHome's built-in `sun` component
- **Algorithm:** Uses astronomical calculations (NORAD SGP4 model approximation)
- **Output:** Target elevation angle and azimuth angle of the sun

**Example (Bochum, 51.4556°N, 7.0116°E):**
- At noon on March 11, 2026: Sun at ~45° elevation, 180° azimuth (south)
- At 3 PM: Sun at ~40° elevation, 220° azimuth (southwest)
- These values change every minute as the sun moves

**Layer 2 — Actual/Measured Angles (Panel Orientation)**
These are **measured** from the hardware:
- **Elevation Angle:** Measured by BNO085 IMU accelerometer
  - Detects gravity's pull on the tilted panel
  - 0° = horizontal panel, 90° = vertical panel
  - Typical range: -30° to +80° (hardware limits)
- **Azimuth Angle (Compass Heading):** Measured by BNO085 IMU magnetometer
  - Detects Earth's magnetic field
  - 0°/360° = North, 90° = East, 180° = South, 270° = West
  - Typical range: 0° to 360°

**How It Works Together:**

```
┌─────────────────────────────────────────────────────┐
│ 1. Read Current Time (RTC or GPS)                   │
│ 2. Calculate Target Sun Position                    │
│    (Target Elevation, Target Azimuth)               │
│                                                     │
│ 3. Measure Current Panel Angle                      │
│    (Actual Elevation via IMU accelerometer)         │
│    (Actual Azimuth via IMU magnetometer)            │
│                                                     │
│ 4. Compare Target vs Actual                         │
│    ΔElevation = Target - Actual                     │
│    ΔAzimuth = Target - Actual                       │
│                                                     │
│ 5. Control Motors                                   │
│    If ΔElevation > threshold → move elevation       │
│    If ΔAzimuth > threshold → move azimuth           │
│                                                     │
│ 6. Loop (every few seconds)                         │
└─────────────────────────────────────────────────────┘
```

**Data Sources:**

| Component | Source | Accuracy |
|-----------|--------|----------|
| **Sun Position** | Calculated from Lat/Lon/Time | ±0.5° (excellent) |
| **Time** | RTC (DS3231) or GPS | ±1 minute (RTC), ±100ms (GPS) |
| **Location** | Manual hardcode, GPS, or HA | ±10m (GPS), exact if hardcoded |
| **Elevation Angle** | BNO085 accelerometer | ±1-2° (very good) |
| **Azimuth Angle** | BNO085 magnetometer | ±3-5° (good, affected by metal) |

**Key Dependencies:**

1. **Accurate Time** — Errors here cause errors in calculated sun position
   - 1 minute error → ~0.25° azimuth error
   - Keep RTC battery fresh or sync via GPS

2. **Accurate Location** — Errors affect elevation/azimuth targets
   - 10 km error → ~1° elevation error
   - Use GPS or hardcode your exact coordinates

3. **Clean Magnetometer** — Azimuth measurement is sensitive to magnetic interference
   - Keep tracker away from large metal objects
   - Calibrate magnetometer if readings are off
   - Test: If azimuth reads backward or sideways, check for nearby metal

**Verification:**

To verify the system is working correctly:
- **Elevation should increase** from sunrise (low) to noon (high) to sunset (low)
- **Azimuth should increase** from sunrise (~90° east) → noon (180° south) → sunset (~270° west)
- **Time synchronization** (check RTC vs phone — should match within 1 minute)
- **Magnetometer calibration** (available in web interface — follow instructions)

**See also:** [Firmware Configuration Guide](firmware/config/pcb_v1.3/README.md) for tuning parameters.

---

**A:** GPS provides location (latitude/longitude) and time, which are used to **calculate** the sun's position. **GPS accuracy is:**
- **Location:** ±5-10 meters (typical residential use)
- **Time:** ±10 milliseconds (accurate enough)

**Sun Position Calculation is very accurate:**
- The algorithm uses location + time to compute sun position
- Typical error: < 0.5° (smaller than the solar disk itself)
- This is sufficient for optimal panel tracking

**In practice:** GPS alone works very well for autonomous tracking without Home Assistant.

---

## Integration & Connectivity

### Q: Do I need WiFi for the tracker to work?

**A:** **No, WiFi is optional:**
- **With WiFi:** Can integrate with Home Assistant, receive firmware updates, monitor remotely
- **Without WiFi:** Works independently using GPS + RTC (real-time clock) for position/time
- **Hybrid:** Toggle between modes as needed

The system is designed to work offline — WiFi just adds convenience.

---

### Q: How does Home Assistant integration work?

**A:** When WiFi is available, the ESP32-S3 connects via the [ESPHome native component](https://www.home-assistant.io/integrations/esphome/) for:
- Real-time position / motor status monitoring
- Manual overrides and controls
- Automation routines (e.g., retract at night)
- Historical data logging

Without Home Assistant, the system still operates fully — WiFi integration is purely optional.

---

## Performance & Reliability

### Q: How much energy does the Sunchronizer produce?

**A:** Based on 2026 testing in Bochum, Germany (51.4°N latitude):

| Configuration | Daily Yield | vs. Static |
|---------------|-------------|-----------|
| Static East/West | ~979 Wh | Baseline |
| **Single-Axis (S1)** | ~2,131 Wh | **+118%** |
| **Dual-Axis (D2)** | **~2,388 Wh** | **+144%** |

**Real Data:** See [Measurement Analysis Overview](docu/measurements/MEASUREMENT_OVERVIEW.md) for detailed daily report examples.

**Your results will vary based on:**
- Location (latitude affects sun angle)
- Weather (cloud cover, seasons)
- Panel size & orientation

---

## Support & Community

### Q: Is there a community or forum?

**A:** The main places to connect:
1. **[GitHub Issues](https://github.com/Nerdiyde/Sunchronizer/issues)** — bug reports, feature requests, questions
2. **[NERDIY.DE Blog](https://nerdiy.de/)** — project blog, store, and community discussions
3. **[ESPHome Community Forums](https://community.home-assistant.io/)** — broad general smart-home support

---

### Q: How can I contribute or request features?

**A:** You're welcome to:
1. **Submit a pull request** on [GitHub](https://github.com/Nerdiyde/Sunchronizer/) with improvements
2. **Open a feature request** as an issue (describe use case and expected behavior)
3. **Share your own build** — photos/videos are appreciated!
4. **Help with documentation** — improvements to guides or translation are welcome

---

## Licensing & Legal

### Q: What license is this project under?

**A:** The project uses **three separate licenses** depending on content type:

| Content | License | Key Points |
|---------|---------|------------|
| **STL Files (3D Print)** | [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) | Personal use only, no resale, no derivatives |
| **Documentation & Content** | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) | Share with attribution, non-commercial, share-alike |
| **Firmware & Software** | [GNU AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html) | Open-source, modifications must be published |

---

### Q: Can I use this commercially?

**A:** It depends on what exactly you mean:

**STL Files — CC BY-NC-ND 4.0:**
- ✅ Print for personal use
- ✅ Share photos of your build with attribution
- ❌ Sell the STL files
- ❌ Sell printed parts or assembled trackers
- ❌ Publish modified/remixed versions of the STL files

**Firmware — GNU AGPL v3.0:**
- ✅ Use, study, and modify freely
- ✅ Commercial use of the firmware is allowed
- ❌ If you modify and distribute the firmware, you must publish your modifications under AGPL v3.0

**Documentation — CC BY-NC-SA 4.0:**
- ✅ Share and adapt with attribution
- ❌ No commercial use
- ❌ Derivatives must use the same license

**Recommendation:** For questions about commercial use beyond these terms, contact the project author at [NERDIY.DE](https://nerdiy.de/).

---

## Troubleshooting

### Q: The motor isn't moving. What's wrong?

**A:** Check these in order:
1. **Power:** Is the 12V supply connected and providing adequate current (3A+)?
2. **Motor direction:** Ensure motor wires are connected correctly (reverse if needed)
3. **Firmware:** Check if motor commands are being sent (monitor logs via WiFi)
4. **Actuator limit:** Has the actuator reached its mechanical limit?
5. **Motor driver:** Test with a simple DC motor test (direct power, no controller)

**See also:** [Firmware Troubleshooting Guide](firmware/README.md)

---

### Q: WiFi connection is unstable or disconnects frequently.

**A:** 
- Check signal strength (move closer to router)
- Verify WiFi credentials in `secrets.yaml`
- Reduce interference (change WiFi channel, away from microwaves)
- Update to the latest firmware
- Use 2.4 GHz WiFi (not 5 GHz — ESP32-S3 may struggle)

---

### Q: The tracker moves but doesn't face the sun accurately.

**A:** Probable causes:
1. **Sensor calibration:** IMU or compass needs recalibration
2. **Location error:** Check GPS location / manually set latitude/longitude
3. **Time sync:** Ensure RTC has correct time (for sun position calculation)
4. **Obstruction:** Check for shadows from trees, buildings
5. **Firmware config:** Review angle offsets and tracking limits

**See also:** [Firmware Configuration Guide](firmware/config/pcb_v1.3/README.md)

---

## More Questions?

Didn't find an answer?
- **[Check the GitHub Issues](https://github.com/Nerdiyde/Sunchronizer/issues)** — search for your keyword
- **[Read the Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)** — comprehensive technical documentation
- **[Create a new issue](https://github.com/Nerdiyde/Sunchronizer/issues/new)** — describe your question with details

---

**Last Updated:** March 11, 2026  
**Next Review:** June 2026
