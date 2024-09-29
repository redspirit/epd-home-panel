const {Jimp} = require('jimp');
const gm = require('gm').subClass({
    imageMagick: '7+',
    // appPath: 'C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\magick.exe'
});

class Colors {
    constructor(paletteFile) {
        this.paletteFile = paletteFile;
        this.paletteColors = null;
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
        let bytesArr = [];
        for(let i = 0; i < pixelsCount; i += 4) {
            let pixByte = 0;
            let onePixel = indexes.slice(i, i + 4);
            for(let j = 0; j < 4; j++) {
                pixByte += onePixel[3-j] << (j * 2);
            }
            bytesArr.push(pixByte);
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
            full: bytesBuf,
            grayPart1: Buffer.from(part1Arr),
            grayPart2: Buffer.from(part2Arr),
        }
    }

    splitColors(fourColorBuffer) {
        let baseArr = [];
        let grayArr = [];
        for (let i = 0; i < fourColorBuffer.length; i += 2) {
            let b1 = fourColorBuffer.readUInt8(i);
            let b2 = fourColorBuffer.readUInt8(i + 1);

            let res1 = 0;
            res1 += (b1 & 0b11) === 3 ? 0b1 : 0;
            res1 += (b1 & 0b1100) === 3 ? 0b10 : 0;
            res1 += (b1 & 0b110000) === 3 ? 0b100 : 0;
            res1 += (b1 & 0b11000000) === 3 ? 0b1000 : 0;
            res1 += (b2 & 0b11) === 3 ? 0b10000 : 0;
            res1 += (b2 & 0b1100) === 3 ? 0b100000 : 0;
            res1 += (b2 & 0b110000) === 3 ? 0b1000000 : 0;
            res1 += (b2 & 0b11000000) === 3 ? 0b10000000 : 0;
            // baseArr.push(~res1);
            baseArr.push(res1);
        }

        return {
            baseBuf: Buffer.from(baseArr)
        }
    }
}

module.exports = Colors;
