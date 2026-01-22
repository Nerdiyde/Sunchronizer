import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components import i2c, sensor
from esphome.const import (
    CONF_ID,
    CONF_TEMPERATURE,
    DEVICE_CLASS_TEMPERATURE,
    STATE_CLASS_MEASUREMENT,
    UNIT_CELSIUS,
)

DEPENDENCIES = ["i2c"]

# Declare the C++ namespace and class
ds3231_temperature_ns = cg.esphome_ns.namespace("ds3231_temperature")
DS3231TemperatureComponent = ds3231_temperature_ns.class_(
    "DS3231TemperatureComponent", cg.PollingComponent, i2c.I2CDevice
)

# Configuration schema
CONFIG_SCHEMA = (
    cv.Schema(
        {
            cv.GenerateID(): cv.declare_id(DS3231TemperatureComponent),
            cv.Optional(CONF_TEMPERATURE): sensor.sensor_schema(
                unit_of_measurement=UNIT_CELSIUS,
                accuracy_decimals=2,
                device_class=DEVICE_CLASS_TEMPERATURE,
                state_class=STATE_CLASS_MEASUREMENT,
            ),
        }
    )
    .extend(cv.polling_component_schema("60s"))
    .extend(i2c.i2c_device_schema(0x68))
)

async def to_code(config):
    # Create the component instance
    var = cg.new_Pvariable(config[CONF_ID])
    
    # Setup I2C device
    await i2c.register_i2c_device(var, config)
    
    # Setup polling component
    await cg.register_component(var, config)
    
    # Setup temperature sensor if configured
    if CONF_TEMPERATURE in config:
        sens = await sensor.new_sensor(config[CONF_TEMPERATURE])
        cg.add(var.set_temperature_sensor(sens))