#include "DEV_Config.h"
#include "EPD_13in3k.h"
#include "GUI_Paint.h"
#include <stdlib.h>

#include <WiFi.h>
#include <WebServer.h>

const char *ssid = "Kisa";
const char *password = "elitenet";
WebServer server(3000);


void test1(UBYTE *BlackImage) {
  DEV_Delay_ms(3000);

  printf("Partial refresh\r\n");
    // If you didn't use the EPD_13IN3K_Display_Base() function to refresh the image before,
    // use the EPD_13IN3K_color_Base() function to refresh the background color,
    // otherwise the background color will be garbled
  EPD_13IN3K_Init_Part();
    // EPD_13IN3K_color_Base(WHITE);
	printf("Partial refresh\r\n");
    Paint_NewImage(BlackImage, 200, 50, 0, WHITE);
	PAINT_TIME sPaint_time;
    sPaint_time.Hour = 12;
    sPaint_time.Min = 34;
    sPaint_time.Sec = 56;
    UBYTE num = 10;
	for (;;) {
		sPaint_time.Sec = sPaint_time.Sec + 1;
		if (sPaint_time.Sec == 60) {
			sPaint_time.Min = sPaint_time.Min + 1;
			sPaint_time.Sec = 0;
			if (sPaint_time.Min == 60) {
				sPaint_time.Hour =  sPaint_time.Hour + 1;
				sPaint_time.Min = 0;
				if (sPaint_time.Hour == 24) {
					sPaint_time.Hour = 0;
					sPaint_time.Min = 0;
					sPaint_time.Sec = 0;
				}
			}
		}
		Paint_Clear(WHITE);
		EPD_13IN3K_Display_Part(BlackImage, 10, 150, 200, 50);
		DEV_Delay_ms(500);//Analog clock 1s
		num = num - 1;
		if(num == 0) {
			break;
		}
    }


    free(BlackImage);
    printf("show Gray------------------------\r\n");
    UDOUBLE Imagesize = ((EPD_13IN3K_WIDTH % 4 == 0)? (EPD_13IN3K_WIDTH / 4 ): (EPD_13IN3K_WIDTH / 4 + 1)) * EPD_13IN3K_HEIGHT;
    if((BlackImage = (UBYTE *)malloc(Imagesize/4)) == NULL) {
        printf("Failed to apply for black memory...\r\n");
        while (1);
    }
    EPD_13IN3K_Init_4GRAY();
    printf("4 grayscale display\r\n");
    Paint_NewImage(BlackImage, EPD_13IN3K_WIDTH/2, EPD_13IN3K_HEIGHT/2, 0, WHITE);
    Paint_SetScale(4);
    Paint_Clear(0xff);
    EPD_13IN3K_4GrayDisplay(BlackImage);
    DEV_Delay_ms(3000);
}

void postPart1() {
    String body = server.arg("plain");
    UBYTE *imageData = new UBYTE[81600];
    body.getBytes(imageData, 81600);

    printf("Display 1...\r\n");
    EPD_13IN3K_Init_4GRAY();

    UDOUBLE i;
    UBYTE b1;
    UBYTE b2;
    UBYTE k;
    EPD_13IN3K_SendCommand(0x24);
    for(i=0; i<81600; i++) {

      EPD_13IN3K_SendData(imageData[i]);
      // b1 = 0;
      // b2 = 0;
      // for (k = 0; k < 8; k++) {
      //     if (k >= 4) {
      //         b1 += ((imageData[i] >> k) & 1) << ((k - 4) * 2);
      //     } else {
      //         b2 += ((imageData[i] >> k) & 1) << (k * 2);
      //     }
      // }

      // EPD_13IN3K_SendData(b1);
      // EPD_13IN3K_SendData(b2);
    }

    delete[] imageData;
    printf("Display 1 done\r\n");

    server.send(200, "text/plain", "OK 1");
}

void postPart2() {
    String body = server.arg("plain");
    UBYTE *imageData = new UBYTE[81600];
    body.getBytes(imageData, 81600);

    printf("Display 2...\r\n");

    UDOUBLE i;
    UBYTE b1;
    UBYTE b2;
    UBYTE k;
    EPD_13IN3K_SendCommand(0x26);
    for(i=0; i<81600; i++) {

      EPD_13IN3K_SendData(imageData[i]);
      // b1 = 0;
      // b2 = 0;
      // for (k = 0; k < 8; k++) {
      //     if (k >= 4) {
      //         b1 += ((imageData[i] >> k) & 1) << ((k - 4) * 2);
      //     } else {
      //         b2 += ((imageData[i] >> k) & 1) << (k * 2);
      //     }
      // }

      // EPD_13IN3K_SendData(b1);
      // EPD_13IN3K_SendData(b2);
    }
    EPD_13IN3K_TurnOnDisplay_4GRAY();

    printf("Display 2 done and sleep\r\n");
    delete[] imageData; 
    EPD_13IN3K_Sleep();

    server.send(200, "text/plain", "OK 2");
}

void creareServer() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }

    printf("Server created");

    server.on("/display1", HTTP_POST, postPart1);
    server.on("/display2", HTTP_POST, postPart2);

    server.onNotFound([]() {
      server.send(404, "text/plain", "404");
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

    //printf("Clear...\r\n");
    // EPD_13IN3K_Init();
    // EPD_13IN3K_Clear();

    printf("Ready post...\r\n");
}

void loop() {
  server.handleClient();
  delay(5);
}
