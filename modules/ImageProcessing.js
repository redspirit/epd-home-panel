const {Jimp} = require('jimp');
const gm = require('gm').subClass({
    imageMagick: '7+',
    // appPath: 'C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\magick.exe'
});

class ImageProcessing {
    static MONOCHROME_CODING_1_3 = 1;
    static MONOCHROME_CODING_2_2 = 2;
    static MONOCHROME_CODING_3_1 = 3;

    constructor(paletteFile, monochromeCodingType=2) {
        this.paletteFile = paletteFile;
        this.paletteColors = null;
        this.mct = monochromeCodingType;
    }

    remapImage(inputImageBuffer) {
        return new Promise((resolve, reject) => {
            gm(inputImageBuffer, 'screen.png')
                .resize(960, 680, '!')
                .map(this.paletteFile)
                .toBuffer('PNG', (err, buffer) => {
                    if (err) reject(err);
                    resolve(buffer);
            });
        });
        // .write(imgPath+'test.png', (err) => {
        //     console.log('err', err);
        // });
    }

    async preparePalette() {
        let {bitmap} = await Jimp.read(this.paletteFile);
        this.paletteColors = [];
        for(let i = 0; i < bitmap.width; i++) {
            this.paletteColors.push(bitmap.data.readUIntBE(i * 4, 3));
        }
    }

    splitGrayscaleByte (b1, b2) {
        let r1 = 0;
        let r2 = 0;
        let int16 = (b1 << 8) + b2;
        for(let i = 0; i < 16; i += 2) {
            if((int16 >> i) & 1) r1 += (1 << (i / 2));
            if((int16 >> (i + 1)) & 1) r2 += (1 << (i / 2));
        }
        return [~r1, ~r2];
    }

    async getImageBytes(pngBuffer) {
        if(!this.paletteColors) throw new Error('palette image is not loaded');
        let {bitmap} = await Jimp.fromBuffer(pngBuffer);

        let pixelsCount = bitmap.data.length / 4;
        let indexes = [];
        for(let i = 0; i < pixelsCount; i++) {
            let color = bitmap.data.readUIntBE(i * 4, 3);
            let index = this.paletteColors.indexOf(color);
            if(index === -1) throw new Error(`image color #${color.toString(16)} not in palette`);
            indexes.push(3 - index);
        }
        let bytesArr = []; // 4-color buffer
        let monoBytesArr = [];  // 2-color (black/white) buffer
        for(let i = 0; i < pixelsCount; i += 4) {
            let pixByte = 0;
            let onePixel = indexes.slice(i, i + 4);
            for(let j = 0; j < 4; j++) {
                pixByte += onePixel[3 - j] << (j * 2);
            }
            bytesArr.push(pixByte);
            if((i / 4) % 2) {
                // заходим каждый второй цикл, чтобы получить сразу 8 пикселей на байт
                let mPixByte = 0;
                let mPixel = indexes.slice(i, i + 8);
                for(let j = 0; j < 8; j++) {
                    let indVal = mPixel[7 - j]; // value 0-3
                    if(this.mct === ImageProcessing.MONOCHROME_CODING_1_3) {
                        mPixByte += (indVal === 0 ? 0 : 1) << j;
                    } else if (this.mct === ImageProcessing.MONOCHROME_CODING_2_2) {
                        mPixByte += (indVal <= 1 ? 0 : 1) << j;
                    } else if(this.mct === ImageProcessing.MONOCHROME_CODING_3_1) {
                        mPixByte += (indVal === 2 ? 0 : 1) << j;
                    }
                }
                monoBytesArr.push(mPixByte);
            }
        }

        let part1Arr = [];
        let part2Arr = [];
        let bytesBuf = Buffer.from(bytesArr);
        for(let i = 0; i < bytesBuf.length; i +=2) {
            let gsByte = this.splitGrayscaleByte(bytesBuf.readUInt8(i), bytesBuf.readUInt8(i+1));
            part1Arr.push(gsByte[0]);
            part2Arr.push(gsByte[1]);
        }
        return {
            monochrome: Buffer.from(monoBytesArr),
            grayscale: {
                full: bytesBuf,
                part1: Buffer.from(part1Arr),
                part2: Buffer.from(part2Arr),
            }

        }
    }

}

module.exports = ImageProcessing;
