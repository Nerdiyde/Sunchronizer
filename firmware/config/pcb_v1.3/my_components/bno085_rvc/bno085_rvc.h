#pragma once

#include "esphome.h"
#include "esphome/components/sensor/sensor.h"
#include "esphome/components/uart/uart.h"      // für uart::UARTDevice

namespace esphome {
namespace bno085_rvc {

struct BNO085RVCData {
  float yaw{0.0f};
  float pitch{0.0f};
  float roll{0.0f};
  float x_accel{0.0f};
  float y_accel{0.0f};
  float z_accel{0.0f};
};

class BNO085RVCComponent : public PollingComponent, public uart::UARTDevice {
 public:
  // Setter für Code-Gen aus sensor.py
  void set_yaw_sensor(sensor::Sensor *sens)   { this->yaw_sensor_   = sens; }
  void set_pitch_sensor(sensor::Sensor *sens) { this->pitch_sensor_ = sens; }
  void set_roll_sensor(sensor::Sensor *sens)  { this->roll_sensor_  = sens; }
  void set_x_accel_sensor(sensor::Sensor *sens) { this->x_accel_sensor_ = sens; }
  void set_y_accel_sensor(sensor::Sensor *sens) { this->y_accel_sensor_ = sens; }
  void set_z_accel_sensor(sensor::Sensor *sens) { this->z_accel_sensor_ = sens; }

  void setup() override;
  void update() override;
  void dump_config() override;

 protected:
  bool read_rvc_packet_(BNO085RVCData *data);
  uint8_t calculate_checksum_(const uint8_t *buffer, size_t length);

  // Sensor-Pointer als private Member
  sensor::Sensor *yaw_sensor_{nullptr};
  sensor::Sensor *pitch_sensor_{nullptr};
  sensor::Sensor *roll_sensor_{nullptr};
  sensor::Sensor *x_accel_sensor_{nullptr};
  sensor::Sensor *y_accel_sensor_{nullptr};
  sensor::Sensor *z_accel_sensor_{nullptr};
};

}  // namespace bno085_rvc
}  // namespace esphome
