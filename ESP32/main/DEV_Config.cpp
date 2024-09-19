
#include "DEV_Config.h"
#include <SPI.h>

SPIClass * spi = NULL;
static SPISettings spiSettings;

void GPIO_Config(void) {
    pinMode(EPD_BUSY_PIN,  INPUT);
    pinMode(EPD_RST_PIN , OUTPUT);
    pinMode(EPD_DC_PIN  , OUTPUT);
    pinMode(EPD_PWR_PIN  , OUTPUT);
    pinMode(EPD_CS_PIN , OUTPUT);

    digitalWrite(EPD_CS_PIN , HIGH); // LOW is active
    digitalWrite(EPD_PWR_PIN , HIGH); // power on
}

UBYTE DEV_Module_Init(void) {
	//gpio
	GPIO_Config();

	//serial printf
	Serial.begin(115200);

	// spi
  spi = new SPIClass(VSPI);
  spi->begin(); // default VSPI pins
  spiSettings = SPISettings(8000000, MSBFIRST, SPI_MODE0);

	return 0;
}

void DEV_SPI_WriteByte(UBYTE data) {
    spi->beginTransaction(spiSettings);
    spi->transfer(data);
    spi->endTransaction();
}

void DEV_SPI_Write_nByte(UBYTE *pData, UDOUBLE len) {
    spi->beginTransaction(spiSettings);
    for (int i = 0; i < len; i++) {
        spi->transfer(pData[i]);
    }
    spi->endTransaction();
}
