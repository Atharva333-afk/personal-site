# parts and next steps

this is the running list of the stuff that has shown up in the Marki build. some parts were tested, some were part of a direction that changed, and some still need a real label check before they get treated like a final component choice.

## parts seen in the build

| part | why it is here | current note |
| --- | --- | --- |
| ESP8266 NodeMCU | early Wi-Fi controller attempt | upload troubleshooting pushed the build toward ESP32 |
| ESP32 DevKit V1 | current practical test controller | documented successful flash upload |
| 0.96-inch OLED | future small status display | likely I2C, verify voltage and controller before using |
| 5641AS four-digit display | earlier timer or clock idea | not pursued in the practical low-wiring test |
| 2 x SN74HC595N | possible GPIO expansion | driver circuit was not completed |
| blue LED | visible output test | use a series resistor |
| buzzer | sound output test | verify current and voltage requirements |
| breadboard and jumpers | no-solder prototyping | useful now, definitely not the final desk look |
| ELEGOO starter kit parts | resistor and component source | confirm the actual part value before wiring |

## what got smarter along the way

the four-digit display route was possible, but it would have meant more wiring and more things to debug at the same time. stepping back to an LED and buzzer test was not a failure. it was the normal engineering move of making the smallest test that can prove the board, the web server, and the physical outputs.

## next things to do

1. physically trace and confirm every pin in [pin-map.csv](pin-map.csv).
2. make the LED and buzzer tests repeatable after a full rewire.
3. verify the OLED model, voltage, address, and real I2C pins.
4. add OLED output only after the small test sketch is stable.
5. decide how the two boards will communicate before wiring their data lines.
6. clean up the breadboard layout enough that the next photo is easier to read.
7. think about mounting or an enclosure once the electronics stop moving around so much.

the unknowns are not a problem. they are basically the to-do list that keeps the project moving.
<<<<<<< HEAD
=======

>>>>>>> c0bd258 (Sync website archive and Marki documentation)
