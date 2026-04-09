# Sunchronizer Home Assistant

This folder contains Home Assistant resources for Sunchronizer:

- fault/status automations
- the Sunchronizer Virtual Camera custom integration

## Contents

- `automations/sunchronizer_fault_notifications.yaml`
- `custom_components/sunchronizer_virtual_camera/`

## Automations

### Overview

The automation file provides fault and status notifications based on Sunchronizer sensors
defined in the firmware configuration, especially:

- `firmware/config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml`

### Setup (YAML include)

1. Copy `automations/sunchronizer_fault_notifications.yaml` to your Home Assistant config,
   for example:
   - `/config/automations/sunchronizer_fault_notifications.yaml`
2. Ensure automations are included in `configuration.yaml`:

```yaml
automation: !include_dir_merge_list automations/
```

3. Reload automations or restart Home Assistant.

### Alternative Setup (UI only)

1. Open `Settings -> Automations & Scenes`.
2. Create a new automation.
3. Open the menu and choose `Edit in YAML`.
4. Paste content from `sunchronizer_fault_notifications.yaml`.
5. Save.
6. Repeat per automation block if required by your setup.

### Behavior

- Critical binary sensor faults create `persistent_notification` entries.
- Calibration-required states create dedicated `persistent_notification` entries.
- Status text sensors create notifications when the state is not `Normal`.

### Optional Mobile Push

Add a notify service action to your automation, for example:

```yaml
- service: notify.mobile_app_your_phone
  data:
    title: Sunchronizer Fault
    message: "{{ trigger.event.data.new_state.attributes.friendly_name }}"
```

## Virtual Camera Integration

The custom integration creates a synthetic camera image showing:

- panel orientation (foreground)
- sun position (background)
- azimuth/elevation values
- tracking delta and quality
- optional weather context

Viewpoint is south-oriented by default.

[![Open your Home Assistant instance and open the add repository dialog with this repository pre-filled.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Nerdiyde&repository=Sunchronizer&category=integration)

### Features

- UI setup via config flow
- editable options after setup
- view modes: `south`, `top_down`, `side`, `follow_sun`
- themes and overlays via services
- trail history and calibration guides
- fixed resolution presets and `auto` mode
- multi-instance support
- diagnostic sensors for tracking quality

### Installation

#### Option 1: HACS button

1. Use the button above.
2. Add repository in HACS.
3. Install `Sunchronizer Virtual Camera`.
4. Restart Home Assistant.

#### Option 2: HACS custom repository (manual)

1. Open HACS.
2. `Custom repositories`.
3. Repository URL: `https://github.com/Nerdiyde/Sunchronizer`
4. Category: `Integration`
5. Install `Sunchronizer Virtual Camera`.
6. Restart Home Assistant.

#### Option 3: Manual (without HACS)

1. Copy `custom_components/sunchronizer_virtual_camera` to:
   - `/config/custom_components/sunchronizer_virtual_camera`
2. Restart Home Assistant.

### Setup

1. Open `Settings -> Devices & Services`.
2. Click `Add Integration`.
3. Select `Sunchronizer Virtual Camera`.
4. Enter source entities and initial options.

### Change Options Later

1. Open `Settings -> Devices & Services`.
2. Open `Sunchronizer Virtual Camera`.
3. Click `Configure`.
4. Update settings (including resolution preset).

### Resolution Presets

- `auto` (uses requested client size, fallback 1280x720)
- `640x360`
- `854x480`
- `1280x720`
- `1920x1080`

### Services

- `sunchronizer_virtual_camera.save_snapshot`
- `sunchronizer_virtual_camera.set_theme`
- `sunchronizer_virtual_camera.set_view_mode`
- `sunchronizer_virtual_camera.set_overlays`
- `sunchronizer_virtual_camera.set_resolution`
- `sunchronizer_virtual_camera.clear_trail`

### Diagnostic Sensors

- Tracking Delta Azimuth
- Tracking Delta Elevation
- Tracking Quality

### Lovelace Example

- `custom_components/sunchronizer_virtual_camera/lovelace_example.yaml`

### Notes

- If entities are unavailable, rendering continues and missing values appear as `n/a`.
- The camera entity can be used in standard Lovelace cards that support camera entities.
