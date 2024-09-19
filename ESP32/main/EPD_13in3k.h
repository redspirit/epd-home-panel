
#ifndef __EPD_13IN3K_H_
#define __EPD_13IN3K_H_

#include "DEV_Config.h"

// Display resolution
#define EPD_13IN3K_WIDTH       960
#define EPD_13IN3K_HEIGHT      680

void EPD_13IN3K_Init(void);
void EPD_13IN3K_Init_Part(void);
void EPD_13IN3K_Init_4GRAY(void);
void EPD_13IN3K_Clear(void);
void EPD_13IN3K_color_Base(UBYTE color);
void EPD_13IN3K_Display(UBYTE *Image);
void EPD_13IN3K_Display_Base(UBYTE *Image);
void EPD_13IN3K_WritePicture(UBYTE *Image, UBYTE Block);
void EPD_13IN3K_WritePicture_Base(UBYTE *Image, UBYTE Block);
void EPD_13IN3K_Display_Part(UBYTE *Image, UWORD x, UWORD y, UWORD w, UWORD l);
void EPD_13IN3K_4GrayDisplay(UBYTE *Image);
void EPD_13IN3K_Sleep(void);

#endif
