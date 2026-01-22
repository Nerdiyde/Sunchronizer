#include "ds3231_temperature.h"
#include "esphome/core/log.h"

namespace esphome {
namespace ds3231_temperature {

static const char *const TAG = "ds3231_temperature";

// DS3231 I2C address
static const uint8_t DS3231_ADDRESS = 0x68;

// DS3231 register addresses
static const uint8_t DS3231_REG_TEMPERATURE = 0x11;

void DS3231TemperatureComponent::setup() 
{
  ESP_LOGCONFIG(TAG, "Setting up DS3231 Temperature...");
  
  // Simple I2C scan approach - try to read from device
  if (!this->read_bytes(DS3231_ADDRESS, nullptr, 0)) 
  {
    this->mark_failed();
    ESP_LOGE(TAG, "Failed to communicate with DS3231 at address 0x%02X", DS3231_ADDRESS);
    return;
  }
  
  ESP_LOGCONFIG(TAG, "DS3231 Temperature setup complete");
}

void DS3231TemperatureComponent::update() 
{
  // Read temperature data
  if (!this->read_temperature_()) 
  {
    ESP_LOGE(TAG, "Failed to read temperature data");
    this->status_set_warning();
    return;
  }
  
  this->status_clear_warning();
}

void DS3231TemperatureComponent::dump_config() 
{
  ESP_LOGCONFIG(TAG, "DS3231 Temperature:");
  LOG_I2C_DEVICE(this);
  
  if (this->temperature_sensor_) 
  {
    LOG_SENSOR("  ", "Temperature", this->temperature_sensor_);
  }
  
  if (this->is_failed()) 
  {
    ESP_LOGE(TAG, "Communication with DS3231 failed!");
  }
}

bool DS3231TemperatureComponent::read_temperature_() {
  // Read 2 bytes from temperature register
  uint8_t data[2];

  if (!this->read_bytes(DS3231_REG_TEMPERATURE, data, 2)) 
  {
    ESP_LOGE(TAG, "Failed to read temperature register");
    return false;
  }
  
  // DS3231 temperature format:
  // - data[0]: integer part (signed 8-bit)
  // - data[1]: fractional part (upper 2 bits represent 0.25°C increments)
  
  int8_t temp_msb = data[0];           // Integer part
  uint8_t temp_lsb = data[1];     // Fractional part (2 bits)
  
  // Calculate temperature in Celsius
  //float temperature = temp_msb + (temp_lsb * 0.25f);
  float temperature = (temp_msb & 0x7F) + ((temp_lsb >> 6) * 0.25f);
  
 if ((temp_msb & 0x80) != 0) {
    temperature = -temperature;
  }

  // Check for valid temperature range (DS3231: -40°C to +85°C)
  if (temperature < -40.0f || temperature > 85.0f) 
  {
    ESP_LOGE(TAG, "Temperature reading out of range: %.2f°C", temperature);
    return false;
  }
  
  // Publish the temperature value if sensor is configured
  if (this->temperature_sensor_ != nullptr) 
  {
    this->temperature_sensor_->publish_state(temperature);
  }
  
  ESP_LOGV(TAG, "Temperature: %.2f°C", temperature);
  return true;
}

}  // namespace ds3231_temperature
}  // namespace esphome