"""
BNO085 RVC UART Sensor Integration for ESPHome
Reads fused orientation (yaw, pitch, roll) and acceleration via UART in RVC mode.
"""

import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components import sensor, uart
from esphome.const import (
    CONF_ID,
    CONF_UPDATE_INTERVAL,
    STATE_CLASS_MEASUREMENT,
)

# Namespace
bno085_rvc_ns = cg.esphome_ns.namespace("bno085_rvc")
BNO085RVCComponent = bno085_rvc_ns.class_(
    "BNO085RVCComponent", cg.PollingComponent, uart.UARTDevice
)

# Configuration keys
CONF_YAW = "yaw"
CONF_PITCH = "pitch"
CONF_ROLL = "roll"
CONF_X_ACCEL = "x_accel"
CONF_Y_ACCEL = "y_accel"
CONF_Z_ACCEL = "z_accel"

# Schema
CONFIG_SCHEMA = (
    cv.Schema(
        {
            cv.GenerateID(): cv.declare_id(BNO085RVCComponent),
            cv.Optional(CONF_YAW): sensor.sensor_schema(
                unit_of_measurement="°",
                accuracy_decimals=2,
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional(CONF_PITCH): sensor.sensor_schema(
                unit_of_measurement="°",
                accuracy_decimals=2,
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional(CONF_ROLL): sensor.sensor_schema(
                unit_of_measurement="°",
                accuracy_decimals=2,
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional(CONF_X_ACCEL): sensor.sensor_schema(
                unit_of_measurement="m/s²",
                accuracy_decimals=3,
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional(CONF_Y_ACCEL): sensor.sensor_schema(
                unit_of_measurement="m/s²",
                accuracy_decimals=3,
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional(CONF_Z_ACCEL): sensor.sensor_schema(
                unit_of_measurement="m/s²",
                accuracy_decimals=3,
                state_class=STATE_CLASS_MEASUREMENT,
            ),
            cv.Optional(CONF_UPDATE_INTERVAL, default="50ms"): cv.update_interval,
        }
    )
    .extend(cv.polling_component_schema(CONF_UPDATE_INTERVAL))
    .extend(uart.UART_DEVICE_SCHEMA)
)

# to_code

def to_code(config):
    var = cg.new_Pvariable(config[CONF_ID])
    # Register as component and set polling interval
    yield cg.register_component(var, config)
    cg.add(var.set_update_interval(config[CONF_UPDATE_INTERVAL]))
    # Register UART parent
    yield uart.register_uart_device(var, config)

    # Bind sensors
    if CONF_YAW in config:
        sens = yield sensor.new_sensor(config[CONF_YAW])
        cg.add(var.set_yaw_sensor(sens))
    if CONF_PITCH in config:
        sens = yield sensor.new_sensor(config[CONF_PITCH])
        cg.add(var.set_pitch_sensor(sens))
    if CONF_ROLL in config:
        sens = yield sensor.new_sensor(config[CONF_ROLL])
        cg.add(var.set_roll_sensor(sens))
    if CONF_X_ACCEL in config:
        sens = yield sensor.new_sensor(config[CONF_X_ACCEL])
        cg.add(var.set_x_accel_sensor(sens))
    if CONF_Y_ACCEL in config:
        sens = yield sensor.new_sensor(config[CONF_Y_ACCEL])
        cg.add(var.set_y_accel_sensor(sens))
    if CONF_Z_ACCEL in config:
        sens = yield sensor.new_sensor(config[CONF_Z_ACCEL])
        cg.add(var.set_z_accel_sensor(sens))
