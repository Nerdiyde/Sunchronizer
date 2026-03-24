# Sunchronizer Home Assistant Automations

## Overview

This directory contains Home Assistant automations for Sunchronizer fault and status notifications.

These automations are based on the fault and status sensors defined in:
- `firmware/config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml`

## Included File

- `sunchronizer_fault_notifications.yaml`

## Setup

1. Copy the automation file into your Home Assistant configuration, for example to:
   - `/config/automations/sunchronizer_fault_notifications.yaml`
2. Include the automation directory in your `configuration.yaml` if this is not already configured:

```yaml
automation: !include_dir_merge_list automations/
```

3. Reload Home Assistant automations or restart Home Assistant.

## Alternative Setup via the Home Assistant UI

If you prefer not to manage a separate YAML file, you can also copy the automation content into a newly created automation directly in Home Assistant:

1. Open `Settings -> Automations & Scenes` in Home Assistant.
2. Create a new automation.
3. Open the automation menu and switch to `Edit in YAML`.
4. Copy the contents of `sunchronizer_fault_notifications.yaml` into the editor.
5. Save the automation.
6. Repeat this for each automation block in the file if Home Assistant expects one automation per editor entry.

This approach is useful if you want to manage the automation entirely in the Home Assistant UI instead of maintaining a separate file in `/config/automations/`.

## Behavior

- Critical binary sensor faults create a `persistent_notification`.
- Calibration-required states create a dedicated `persistent_notification`.
- Status text sensors create a notification whenever the state is no longer `Normal`.

## Optional: Mobile Push Notifications

If you want mobile push notifications, add an additional service call to the automation, for example:

```yaml
- service: notify.mobile_app_your_phone
  data:
    title: Sunchronizer Fault
    message: "{{ trigger.event.data.new_state.attributes.friendly_name }}"
```
