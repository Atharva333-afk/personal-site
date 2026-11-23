# circuit wiring and component placement

this is the current wiring note for the practical ESP32 test. it is not a promise that every wire in every photo is still in the same spot. breadboards change fast, and the safe thing is to trace the real physical wires before powering anything.

## the test version

the test sketch uses an ESP32 as a local access point and web server. the page can ask for LED on, LED off, or one short buzzer test.

| signal | firmware pin | physical job | status |
| --- | --- | --- | --- |
| LED output | GPIO18 | LED through a 220 to 330 ohm series resistor | firmware assignment documented, recheck the real wire |
| buzzer output | GPIO19 | short tone test | firmware assignment documented, confirm current and voltage requirements first |
| OLED SDA | GPIO21 | planned I2C data line | not used by the current test sketch |
| OLED SCL | GPIO22 | planned I2C clock line | not used by the current test sketch |
| power | supported 3.3V rail | board and compatible modules | check labels before power-on |
| ground | common ground | controller and modules | check continuity |

an early build log calls the LED and buzzer connections D5 and D6. do not use that label alone as a final ESP32 pin map. the current firmware is the cleaner source of truth for the test sketch: GPIO18 and GPIO19.

## bring-up checklist

1. unplug USB and any other power before moving a jumper wire.
2. check the exact controller board and the OLED voltage requirement from the board label or datasheet.
3. make sure all connected parts share ground.
4. confirm the LED has a series resistor.
5. confirm the buzzer is safe for the planned GPIO connection. if it is not a low-current compatible buzzer, use the right driver circuit instead of hoping.
6. power the controller by itself first.
7. add one output at a time and update [pin-map.csv](pin-map.csv) only after checking it.
8. leave the OLED and two-board communication until the single-board test is stable.

the photos are useful for seeing the project develop. they are not enough to prove an exact pin assignment, a safe voltage level, or that a breadboard rail is doing what it looks like it is doing.
