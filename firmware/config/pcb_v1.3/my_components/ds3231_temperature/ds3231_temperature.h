#pragma once

#include "esphome/core/component.h"
#include "esphome/components/sensor/sensor.h"
#include "esphome/components/i2c/i2c.h"

namespace esphome {
namespace ds3231_temperature {

class DS3231TemperatureComponent : public PollingComponent, public i2c::I2CDevice {
 public:
  // Constructor - sets the default I2C address for DS3231
  DS3231TemperatureComponent() : I2CDevice() {}
  
  // Set the temperature sensor
  void set_temperature_sensor(sensor::Sensor *temperature_sensor) { 
    temperature_sensor_ = temperature_sensor; 
  }

  // Component override - setup the component
  void setup() override;
  
  // Component override - update the sensor values
  void update() override;
  
  // Component override - dump configuration to logs
  void dump_config() override;

 protected:
  // Read temperature from DS3231
  bool read_temperature_();
  
  // Temperature sensor pointer
  sensor::Sensor *temperature_sensor_{nullptr};
};

}  // namespace ds3231_temperature
}  // namespace esphome