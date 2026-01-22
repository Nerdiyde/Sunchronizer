"""
BNO085 RVC UART Sensor Integration for ESPHome
Reads fused orientation (yaw, pitch, roll) and acceleration via UART in RVC mode.
"""

from esphome import pins, automation
import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components import sensor, uart
from esphome.const import (
    CONF_ID,
    CONF_UPDATE_INTERVAL,
    STATE_CLASS_MEASUREMENT,
)

# Definiere den Namespace für die C++-Komponente
bno085_rvc_ns = cg.esphome_ns.namespace("bno085_rvc")
BNO085RVCComponent = bno085_rvc_ns.class_(
    "BNO085RVCComponent", cg.PollingComponent, uart.UARTDevice
)

# --- Konfigurationsschema ---
CONFIG_SCHEMA = (
    cv.Schema(
        {
            cv.GenerateID(): cv.declare_id(BNO085RVCComponent),
            cv.Optional("yaw"): sensor.sensor_schema(
                unit_of_measurement="°",
                accuracy_decimals=2,
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional("pitch"): sensor.sensor_schema(
                unit_of_measurement="°",
                accuracy_decimals=2,
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional("roll"): sensor.sensor_schema(
                unit_of_measurement="°",
                accuracy_decimals=2,
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional("x_accel"): sensor.sensor_schema(
                unit_of_measurement="m/s²",
                accuracy_decimals=3,
                device_class="acceleration",
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional("y_accel"): sensor.sensor_schema(
                unit_of_measurement="m/s²",
                accuracy_decimals=3,
                device_class="acceleration",
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional("z_accel"): sensor.sensor_schema(
                unit_of_measurement="m/s²",
                accuracy_decimals=3,
                device_class="acceleration",
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional(CONF_UPDATE_INTERVAL, default="50ms"): cv.update_interval,
        }
    )
    .extend(cv.polling_component_schema(CONF_UPDATE_INTERVAL))
    .extend(uart.UART_DEVICE_SCHEMA)
)

# --- Codegenerierung ---
def to_code(config):
    var = cg.new_Pvariable(config[CONF_ID])
    yield cg.register_component(var, config)
    yield uart.register_uart_device(var, config)

    if "yaw" in config:
        sens = yield sensor.new_sensor(config["yaw"])
        cg.add(var.yaw_sensor.set(sens))
    if "pitch" in config:
        sens = yield sensor.new_sensor(config["pitch"])
        cg.add(var.pitch_sensor.set(sens))
    if "roll" in config:
        sens = yield sensor.new_sensor(config["roll"])
        cg.add(var.roll_sensor.set(sens))
    if "x_accel" in config:
        sens = yield sensor.new_sensor(config["x_accel"])
        cg.add(var.x_accel_sensor.set(sens))
    if "y_accel" in config:
        sens = yield sensor.new_sensor(config["y_accel"])
        cg.add(var.y_accel_sensor.set(sens))
    if "z_accel" in config:
        sens = yield sensor.new_sensor(config["z_accel"])
        cg.add(var.z_accel_sensor.set(sens))