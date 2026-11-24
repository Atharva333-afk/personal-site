# marki

ok so this is Marki.

it is my little desk computer thing that is slowly turning from boards and jumper wires into something that can actually sit next to my computer and do stuff. right now it is still very much an active build. some parts are confirmed, some parts are planned, and some parts are honestly just sitting on the breadboard looking important lol.

the point of this folder is to keep the whole story together: the firmware, the wiring notes, the photos, the Arduino screenshots, the actual build report, and the little build logs that show what was happening when things got weird.

## what marki is trying to become

the bigger idea is a desktop companion that can show status, take local commands, talk between boards later, and give me a small physical place to mess with hardware ideas.

the final version is still growing, but the direction is pretty clear:

- ESP boards doing the actual thinking
- a small OLED for status later
- local Wi-Fi controls from a phone or computer
- an LED and buzzer for the first real output tests
- cleaner wiring and a real desktop form once the breadboard stops changing every five minutes

## what is actually confirmed

- an ESP32 upload was completed with **DOIT ESP32 DEVKIT V1** selected.
- the upload reached 100%, verified the data hash, and reset the board.
- the current test firmware exposes local LED on, LED off, and buzzer test routes.
- the working firmware assigns GPIO18 to the LED and GPIO19 to the buzzer.
- the test firmware is set up to use an ESP32 access point named `Marki` and serve its controls at `192.168.4.1` after another device joins that network.

that does **not** mean every future feature is already done. OLED rendering, two-board communication, the four-digit display idea, a finished enclosure, and long-term hardware testing are still things to build or verify.

## quick safety thing before any wiring

the boards use 3.3V logic. the LED needs a series resistor, and the buzzer needs its current and voltage requirements checked before it gets a direct GPIO connection. do not treat a photo as proof of a pin map. the wiring notes are deliberately honest about what still needs checking.

## build log

these are the actual Lapse entries from this part of the build:

- [buzzer and LED wiring, first pass](https://lapse.hackclub.com/timelapse/hvsxg6gp-3WR): wiring the buzzer and LED, then hitting an error message and saving progress to try again.
- [first LED code writing sesh](https://lapse.hackclub.com/timelapse/IgunjRW6FQJi): writing the first LED test in Arduino IDE to make sure the basics were behaving.
- [firmware and hardware debugging](https://lapse.hackclub.com/timelapse/crfJcFE4N9NL): bouncing between code edits and hardware fixes because apparently both wanted attention at once.

## where everything is

```text
projects/marki/
├── firmware/                 the current cleaned ESP32 test sketch
├── docs/                     wiring, pin map, parts, verification, and build notes
└── assets/
    ├── build-photos/         original hardware photos
    ├── arduino-screenshots/  IDE and upload screenshots
    ├── diagrams/             architecture and breadboard maps
    ├── reference/            the earlier project image set
    └── build-report/         the full report in PDF and DOCX
```

## if you want to run the current test sketch

1. Open [`firmware/marki_controller_esp32.ino`](firmware/marki_controller_esp32.ino) in Arduino IDE.
2. Change the placeholder Wi-Fi password before flashing it. Keep it at least eight characters.
3. Select the ESP32 board that matches the one on your desk. The documented successful upload used **DOIT ESP32 DEVKIT V1**.
4. Check the LED resistor, buzzer requirements, and every physical connection first.
5. Flash it, join the `Marki` access point from another device, and open `http://192.168.4.1`.

the first job here is still to test safely, not pretend the breadboard is already a finished product.

## status

**active build.**

Marki is not trying to hide the messy middle. the failed uploads, rewires, tests, screenshots, and tiny wins are part of the project too. more updates when it gets less breadboard and more desk computer.
<<<<<<< HEAD
=======

>>>>>>> c0bd258 (Sync website archive and Marki documentation)
