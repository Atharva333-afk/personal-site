#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>

const uint8_t ledPin = 18;
const uint8_t buzzerPin = 19;

const char* wifiName = "Marki";
// Replace this before flashing so a public repo does not become your real access point password.
const char* wifiPassword = "replace-this-before-flashing";

WebServer server(80);

void redirectHome() {
  server.sendHeader("Location", "/");
  server.send(303);
}

void sendHomePage() {
  const char page[] = R"HTML(
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Marki Controller</title>
  </head>
  <body>
    <h1>Marki Controller</h1>
    <p>tiny desk button time.</p>
    <p><a href="/on"><button>LED ON</button></a></p>
    <p><a href="/off"><button>LED OFF</button></a></p>
    <p><a href="/beep"><button>BUZZER TEST</button></a></p>
  </body>
</html>
)HTML";

  server.send(200, "text/html", page);
}

void setLed(bool isOn) {
  digitalWrite(ledPin, isOn ? HIGH : LOW);
  redirectHome();
}

void testBuzzer() {
  tone(buzzerPin, 2000, 250);
  redirectHome();
}

void setup() {
  Serial.begin(115200);

  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  digitalWrite(buzzerPin, LOW);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(wifiName, wifiPassword);

  server.on("/", sendHomePage);
  server.on("/on", []() { setLed(true); });
  server.on("/off", []() { setLed(false); });
  server.on("/beep", testBuzzer);
  server.begin();

  Serial.println("Marki online.");
  Serial.println(WiFi.softAPIP());
}

void loop() {
  server.handleClient();
}
<<<<<<< HEAD
=======

>>>>>>> c0bd258 (Sync website archive and Marki documentation)
