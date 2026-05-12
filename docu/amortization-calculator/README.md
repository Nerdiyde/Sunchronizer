# Sunchronizer ROI & Amortization Calculator

An interactive web-based tool to calculate the return on investment (ROI) and payback period for a Sunchronizer dual-axis solar tracking system.

## Overview

This calculator helps users determine:
- **Payback Period**: How long until the system pays for itself through energy savings
- **Annual Savings**: Expected yearly energy generation and monetary savings
- **30-Year ROI**: Long-term investment return over system lifetime
- **Energy Generation**: Total kWh production based on location and configuration

## Features

- **Interactive Input Parameters**:
  - System cost (EUR, USD, or custom currency)
  - Geographic location (latitude/longitude or preset locations)
  - Number of PV modules and their capacity (W per module)
  - Local electricity price (€/kWh or $/kWh)
  - System efficiency and tracking performance
  - Annual module degradation rate
  - Installation overhead and maintenance costs

- **Real-time Calculations**:
  - Comparative irradiance data based on location
  - Tracking efficiency bonus vs. fixed installations
  - Annual energy yield estimation
  - Break-even analysis with visual timeline
  - Sensitivity analysis for key parameters

- **Visualizations**:
  - Payback timeline chart
  - Cumulative savings graph
  - Parameter sensitivity analysis
  - Performance comparison: Sunchronizer vs. fixed installation

## Usage

1. Open `index.html` in a web browser (local or GitLab Pages)
2. Enter your system configuration:
   - Select a location or enter coordinates
   - Set system cost and module specifications
   - Adjust electricity prices and efficiency assumptions
3. View real-time calculations and charts
4. Export or share your analysis

## Technical Details

### Calculation Method

**Annual Energy Yield (kWh/year):**
```
E_annual = (POA_irradiance × Module_count × Module_power × System_efficiency × Tracking_bonus) / 1000
```

Where:
- `POA_irradiance`: Plane-of-Array irradiance (kWh/m²/day) at location
- `Module_count`: Number of PV modules
- `Module_power`: Capacity per module (W)
- `System_efficiency`: Combined inverter, wiring, and temperature losses (~85%)
- `Tracking_bonus`: Dual-axis tracking improves output by ~25-40% (default: 30%)

**Annual Savings (EUR/year):**
```
Savings_annual = E_annual × Electricity_price
```

**Payback Period (years):**
```
Payback_period = System_cost / Savings_annual
```

**30-Year ROI (%):**
```
ROI_30yr = ((Cumulative_savings_30yr - System_cost) / System_cost) × 100
```

### Irradiance Data

The calculator uses annual average Global Horizontal Irradiance (GHI) data for major world locations. Values are based on:
- NASA POWER Database (https://power.larc.nasa.gov/)
- PVGIS (https://pvgis.cm.jrc.ec.europa.eu/)
- Location-specific climate normals

### Tracking Efficiency Bonus

Dual-axis solar trackers provide additional energy yield compared to fixed south-facing systems:
- **Typical Range**: 25-40% additional yield
- **Default Conservative Estimate**: 30% bonus
- **Factors Affecting**: Latitude, climate seasonality, local obstructions, system reliability

## Customization

To add new locations or adjust assumptions:
1. Edit the `locations` array in `calculator.js`
2. Update irradiance values from PVGIS
3. Modify `SYSTEM_EFFICIENCY` and `TRACKING_BONUS` constants as needed
4. Rebuild and redeploy to GitLab Pages

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This tool is part of the Sunchronizer project and follows the same GNU General Public License v3.0.

## References

- PVGIS: https://pvgis.cm.jrc.ec.europa.eu/
- NASA POWER: https://power.larc.nasa.gov/
- Sunchronizer: https://nerdiy.de/
