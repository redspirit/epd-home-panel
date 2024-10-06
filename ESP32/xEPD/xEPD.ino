#define ENABLE_GxEPD2_GFX 0

#include "GxEPD2_BW.h"
#define EPD_PWR_PIN  16

GxEPD2_BW < GxEPD2_1330_GDEM133T91, GxEPD2_1330_GDEM133T91::HEIGHT / 2> epd(GxEPD2_1330_GDEM133T91(5, 22, 21, 17)); // GDEM133T91 960x680, SSD1677, (FPC-7701 REV.B)

void drawFull(const void* pv) {
  epd.setFullWindow();
  epd.setCursor(40, 60);
  epd.print("msec: ");
}

void drawPartial(const void* pv) {
  uint16_t x = 120, y = 50, w = 130, h = 34;
  epd.setPartialWindow(x, y, w, h);
  epd.setCursor(x + 30, y + 10);
  epd.print(millis());
  epd.drawRect(x, y, w, h, GxEPD_BLACK);
}

void setup() {

  pinMode(EPD_PWR_PIN, OUTPUT);
  digitalWrite(EPD_PWR_PIN, HIGH); // power on

  epd.init(115200, true, 50, false);
  epd.setRotation(0);
  epd.setTextColor(GxEPD_BLACK);
  epd.setTextSize(2);
  epd.drawPaged(drawFull, 0);
}

void loop() {
  epd.drawPaged(drawPartial, 0);
  epd.hibernate();
}
