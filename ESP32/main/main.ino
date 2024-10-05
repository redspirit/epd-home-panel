#include "DEV_Config.h"
#include "EPD_13in3k.h"
#include <stdlib.h>

#include <WiFi.h>
#include <WebServer.h>

const char *ssid = "Kisa";
const char *password = "elitenet";
WebServer server(3000);


void test1(UBYTE *BlackImage) {
  DEV_Delay_ms(3000);

  printf("Partial refresh\r\n");

  EPD_13IN3K_Init_Part();

	printf("Partial refresh\r\n");

	EPD_13IN3K_Display_Part(BlackImage, 10, 150, 200, 50);
}

void postGrayPart1() {
    String body = server.arg("plain");
    UBYTE *imageData = new UBYTE[81600];
    body.getBytes(imageData, 81600);

    printf("Display 1...\r\n");
    EPD_13IN3K_Init_4GRAY();

    UDOUBLE i;
    EPD_13IN3K_SendCommand(0x24);
    for(i=0; i<81600; i++) {
      EPD_13IN3K_SendData(imageData[i]);
    }

    delete[] imageData;
    printf("Display 1 done\r\n");

    server.send(200, "text/plain", "OK");
}

void postGrayPart2() {
    String body = server.arg("plain");
    UBYTE *imageData = new UBYTE[81600];
    body.getBytes(imageData, 81600);

    printf("Display 2...\r\n");

    UDOUBLE i;
    EPD_13IN3K_SendCommand(0x26);
    for(i=0; i<81600; i++) {
      EPD_13IN3K_SendData(imageData[i]);
    }
    EPD_13IN3K_TurnOnDisplay_4GRAY();

    printf("Display 2 done and sleep\r\n");
    delete[] imageData;
    EPD_13IN3K_Sleep();

    server.send(200, "text/plain", "OK");
}

void postMono() {
    String body = server.arg("plain");
    UBYTE *imageData = new UBYTE[81600];
    body.getBytes(imageData, 81600);

    printf("Display mono...\r\n");

    EPD_13IN3K_Init();

    UDOUBLE i;
    EPD_13IN3K_SendCommand(0x24);
    for(i=0; i<81600; i++) {
      EPD_13IN3K_SendData(imageData[i]);
    }
    EPD_13IN3K_TurnOnDisplay();

    printf("Display mono done and sleep\r\n");
    delete[] imageData;
    EPD_13IN3K_Sleep();

    server.send(200, "text/plain", "OK");
}

void postClear() {
	EPD_13IN3K_Init();
    EPD_13IN3K_Clear();
    EPD_13IN3K_Sleep();
    server.send(200, "text/plain", "OK");
}

void postPartial() {
    server.send(200, "text/plain", "OK");
}

void creareServer() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }

    printf("Server created");

    server.on("/display/gray1", HTTP_POST, postGrayPart1);
    server.on("/display/gray2", HTTP_POST, postGrayPart2);
    server.on("/display/mono", HTTP_POST, postMono);
    server.on("/display/part", HTTP_POST, postPartial);
    server.on("/clear", HTTP_POST, postClear);

    server.onNotFound([]() {
      server.send(404, "text/plain", "not found");
    });

    server.begin();
}

/* Entry point ----------------------------------------------------------------*/
void setup() {
    DEV_Module_Init();

    creareServer();

    printf("e-Paper Init and Clear...\r\n");

	  EPD_13IN3K_Init();
    EPD_13IN3K_Clear();

    printf("Ready post...\r\n");
}

void loop() {
  server.handleClient();
  delay(5);
}
