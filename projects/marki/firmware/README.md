# firmware

this is the small test sketch that got the ESP32 part of Marki moving.

it is intentionally not trying to do every future Marki idea at once. it starts a local Wi-Fi access point, serves a tiny page, turns an LED on and off, and gives the buzzer a quick test. that is enough to prove a lot before adding displays, two-board communication, timers, or more complicated stuff.

## current behavior

| route | what it does |
| --- | --- |
| `/` | opens the Marki controller page |
| `/on` | sets the LED output high |
| `/off` | sets the LED output low |
| `/beep` | plays a short 2 kHz buzzer test |

## current pin assignments

| part | ESP32 pin | note |
| --- | --- | --- |
| LED | GPIO18 | use a series resistor |
| buzzer | GPIO19 | only connect directly after checking its electrical requirements |
| OLED SDA | GPIO21 | planned I2C mapping, not rendered by the current test sketch |
| OLED SCL | GPIO22 | planned I2C mapping, not rendered by the current test sketch |

## before flashing

- replace the placeholder access-point password in the sketch.
- use a password with at least eight characters.
- select the board that actually matches your hardware. the documented successful upload used **DOIT ESP32 DEVKIT V1**.
- do not power a 3.3V-only device from 5V just because a jumper fits.
- check the wiring notes in [`../docs/circuit-wiring.md`](../docs/circuit-wiring.md) before turning anything on.

## code cleanup note

the published sketch keeps the real route behavior and pin choices, but removes narrating comments, the accidental personal serial message, and the working access-point password. the small `redirectHome` helper is there because all three controls do the same redirect. nothing here is trying to be a huge framework for a three-button page.
<<<<<<< HEAD
=======

>>>>>>> c0bd258 (Sync website archive and Marki documentation)
