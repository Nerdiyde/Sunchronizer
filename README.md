# Sunchronizer
Sunchronizer is a 3D printable single/dual axis solar tracker for "standard" solar panels

## Introduction

Since I have been working with the (here in Germany) successful "balcony power plants", I have been wondering how the energy yield of the two to four solar panels can be further improved. The outcome is the a single and dual axis version of the "Sunchronizer". The Sunchronizer uses a linear actuator and a geared motor to lift and rotate the solar panel in that way that it always points optimal to the sun. This increases energy yield over the day.

The electronics are based on an [ESP32-S3](https://www.seeedstudio.com/Seeed-Studio-XIAO-ESP32S3-Plus-p-6361.html). The firmware is based on [ESPHome](https://esphome.io/)

The Sunchronizer is designed to be used in combination with a HomeAssistant instance but could also be used independently of a connection to such systems. For example, the position and time can be obtained via a GPS receiver. Based on this data (and the configured orientation (compass direction) of the Sunchronizer), the optimal elevation angle is then calculated and set.

### Sunchronizer S1

- Can track the Sun by adapting the elevation angle of the solar panel.

### Sunchronizer D1

- Can track the Sun by adapting the elevation and azimuth angle of the solar panel.


# Further ressources

The firmware/configuration of the Sunchronizer is open source and available here in the repository in the config folder.

The STLs for the build are available for sale on my blog.

- Sunchronizer S1 (Single Axis version): https://nerdiy.de/en/product-2/sunchronizer-s1-400w-solartracker-fuer-elevation-achse-3d-druckbar-stl-dateien/
- Sunchronizer D1 (Dual Axis version): https://nerdiy.de/en/product-2/sunchronizer-d1-dual-axis-solartracker-fuer-azimut-und-elevation-achse-3d-druckbar-stl-dateien/


### Electronics

The Sunchronizer is controlled by an [ESP32-S3](https://www.seeedstudio.com/Seeed-Studio-XIAO-ESP32S3-Plus-p-6361.html). A dual H-Bridge is used to control the linear actuator for the elevation axis and the gear motor for the azimuth axis control. The circuit is powered with a 12V/3A power supply. I recommend to use a USB-C Power Delivery power supply.

#### GPS Sensor

Optionally a GPS sensor can be installed to retrieve position and time independently of a network connection.

#### Accelerometer

The accelerometer is mounted to the solar panel. It is used to measure the current elevation angle of the solar panel.

#### Magnetometer/Compass

A compass module is integrated in the electronics/sensornest to measure the current heading of the solar panel. This value is used to verify that the solar panel heads in the correct direction to the sun (azimuth angle).

#### Buttons

There are two buttons integrated in the electronics housing. These give some basic control over the possible movements for maintenance.

- The "UP/CCW" Button can be used to lift the panel (short press) or rotate the panel in CCW direction.
- The "Down/CW" Button can be used to lower the panel (short press) or rotate the panel in CW direction.

### Firmware 

The firmware of the Sunchronizer is based on [ESPHome](https://esphome.io/) and can therefore be easily integrated into HomeAssistant or many other SmartHome systems. The latest state of the configuration is available in the config folder.

### Material list

ToDo: Please check the Wiki

# Support

If you want to support me, you can do so by [donating a coffee.](https://ko-fi.com/O5O8UAX8) :)

## Pictures

### Sunchronizer S1

ToDo: Add Pictures

### Suncrhonizer D1

ToDo: Add Pictures


# Licenses

Content that is not based on software/code: Unless otherwise stated, all works presented here that are not based on software/code are subject to the CC BY-NC-SA 4.0 license (attribution – non-commercial – dissemination under the same conditions 4.0 international).

You can find a summary here: https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de

You can find the complete legal text here: https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.de

Software/code-based works Unless otherwise stated, all software/code-based works presented here are subject to the GNU Affero General Public License v3.0

You can find a summary here: https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)#summary

The complete legal text can be found here: https://www.gnu.org/licenses/agpl-3.0.de.html