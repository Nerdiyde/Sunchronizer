#include "bno085_rvc.h"
#include "esphome/core/log.h"

namespace esphome {
namespace bno085_rvc {

static const char *const TAG = "bno085_rvc";
static constexpr float DEGREE_SCALE = 0.01f;
static constexpr float MILLI_G_TO_MS2 = 0.0098067f;

void BNO085RVCComponent::setup() {
  ESP_LOGCONFIG(TAG, "Setting up BNO085 RVC Sensor...");
  delay(100);
}

void BNO085RVCComponent::dump_config() {
  ESP_LOGCONFIG(TAG, "BNO085 RVC Sensor:");
  LOG_SENSOR("  ", "Yaw", this->yaw_sensor_);
  LOG_SENSOR("  ", "Pitch", this->pitch_sensor_);
  LOG_SENSOR("  ", "Roll", this->roll_sensor_);
  LOG_SENSOR("  ", "X Accel", this->x_accel_sensor_);
  LOG_SENSOR("  ", "Y Accel", this->y_accel_sensor_);
  LOG_SENSOR("  ", "Z Accel", this->z_accel_sensor_);
  LOG_UPDATE_INTERVAL(this);
}

uint8_t BNO085RVCComponent::calculate_checksum_(const uint8_t *buffer, size_t length) {
  uint8_t sum = 0;
  for (size_t i = 0; i < length; i++)
    sum += buffer[i];
  return sum;
}

bool BNO085RVCComponent::read_rvc_packet_(BNO085RVCData *data) {
  // Header: 0xAA 0xAA
  //if (!this->available()) return false;

  // Flush UART buffer until first 0xAA is found
  while (this->available() > 0) {
    uint8_t byte;
    this->peek_byte(&byte);
    if (byte == 0xAA) break;
    this->read();  // Discard byte
  }

  size_t avail = this->available();  // gibt Anzahl Bytes im UART-Puffer zurück
  ESP_LOGD(TAG, ">>> available() before sync: %u", avail);
  if (avail < 2) return false;

  avail = this->available();
  ESP_LOGD(TAG, "UART bytes available: %u", avail);
  if (avail < 19) return false;  // Header (2) + 16 Daten + 1 Checksumme = 19 Bytes

  uint8_t first;
  this->read_byte(&first);
  ESP_LOGD(TAG, "First byte: 0x%02X", first);
  if (first != 0xAA) {
    ESP_LOGD(TAG, "No RVC header"); 
    return false;
  }

  // Peek auf zweiten Header-Byte
  uint8_t second;
  if (!this->peek_byte(&second) || second != 0xAA) {
    // Verwerfe unpassendes Byte
    uint8_t dummy;
    this->read_byte(&dummy);
    return false;
  }
  // Lese und verwirf das zweite 0xAA
  this->read_byte(&second);

  // Warten auf 17 Datenbytes + 1 Checksum-Byte
  avail = this->available();
  ESP_LOGD(TAG, ">>> available() after header: %u", avail);
  if (avail < 17) {
    ESP_LOGW(TAG, "Nicht genug Bytes für komplettes Paket (brauche 17, habe %u)", avail);
    return false;
  }

//  uint8_t buffer[17];
//  size_t got = this->read_array(buffer, 17);
//  ESP_LOGD(TAG, ">>> read_array returned: %u bytes", got);
//  if (got != 17) {
//    ESP_LOGW(TAG, "Paket zu kurz: erwartet 17 Bytes, gelesen %u", got);
//    return false;
//  }

   // Lese 17 Daten‑Bytes (blockierend, eins nach dem anderen)
  uint8_t buffer[17];
  for (int i = 0; i < 17; i++) {
    if (!this->read_byte(&buffer[i])) {
      ESP_LOGW(TAG, "Failed to read byte %d of RVC payload", i);
      return false;
    }
  }

  uint8_t checksum = calculate_checksum_(buffer, 16);
  if (checksum != buffer[16]) {
    ESP_LOGW(TAG, "Checksum mismatch: exp=0x%02X got=0x%02X", checksum, buffer[16]);
    return false;
  }

  ESP_LOGD(TAG, "Raw packet: ");
  for (int i = 0; i < 17; i++) {
  ESP_LOGD(TAG, " %02X", buffer[i]);
  }
  ESP_LOGD(TAG, "\\nChecksum calc=0x%02X, rec=0x%02X", checksum, buffer[16]);

  auto read_int16 = [](uint8_t hi, uint8_t lo) -> int16_t {
    return (int16_t(lo) << 0) | (int16_t(hi) << 8);
  };

  int16_t ry = read_int16(buffer[2], buffer[1]);
  int16_t rp = read_int16(buffer[4], buffer[3]);
  int16_t rr = read_int16(buffer[6], buffer[5]);
  int16_t xx = read_int16(buffer[8], buffer[7]);
  int16_t yy = read_int16(buffer[10], buffer[9]);
  int16_t zz = read_int16(buffer[12], buffer[11]);

  data->yaw     = ry * DEGREE_SCALE;
  data->pitch   = rp * DEGREE_SCALE;
  data->roll    = rr * DEGREE_SCALE;
  data->x_accel = xx * MILLI_G_TO_MS2;
  data->y_accel = yy * MILLI_G_TO_MS2;
  data->z_accel = zz * MILLI_G_TO_MS2;

  return true;
}

void BNO085RVCComponent::update() {
  BNO085RVCData d;
  if (this->read_rvc_packet_(&d)) {
    ESP_LOGD(TAG, "Yaw: %.2f°, Pitch: %.2f°, Roll: %.2f°", d.yaw, d.pitch, d.roll);
    ESP_LOGD(TAG, "Accel: X=%.3f, Y=%.3f, Z=%.3f m/s²", d.x_accel, d.y_accel, d.z_accel);

    this->yaw_sensor_->publish_state(d.yaw);
    this->pitch_sensor_->publish_state(d.pitch);
    this->roll_sensor_->publish_state(d.roll);
    this->x_accel_sensor_->publish_state(d.x_accel);
    this->y_accel_sensor_->publish_state(d.y_accel);
    this->z_accel_sensor_->publish_state(d.z_accel);

    this->status_clear_warning();
  } else {
    ESP_LOGW(TAG, "Failed to read valid RVC packet.");
    this->status_set_warning();
  }
}

}  // namespace bno085_rvc
}  // namespace esphome
