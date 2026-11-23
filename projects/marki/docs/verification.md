# verification notes

this page is here so the repo does not accidentally say more than the evidence says.

## confirmed evidence

a later Arduino IDE upload used **DOIT ESP32 DEVKIT V1** as the selected target. the upload reached 100%, showed that the data hash was verified, and reset the board through RTS. the Arduino IDE output also records a completed reset after upload.

that is real evidence that the ESP32 sketch compiled and flashed successfully.

## what still needs to be checked in a new setup

- the physical wire on GPIO18 still reaches the LED through a resistor
- the physical wire on GPIO19 still reaches a compatible buzzer
- the access point starts and the controller page opens from another device
- the OLED part, if used, has the right voltage and I2C mapping
- the exact board labels match the selected Arduino board profile
- the full build stays stable after more than one quick test

so yeah, the successful flash is a win. it is just not the same thing as saying every future feature is done forever.
