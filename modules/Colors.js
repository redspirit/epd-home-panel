const {Jimp} = require('jimp');

// console.log(Jimp);

class Colors {
    constructor() {
        this.paletteColors = null;
    }

    async preparePalette(paletteFile) {
        let {bitmap} = await Jimp.read(paletteFile);
        this.paletteColors = [];
        for(let i = 0; i < bitmap.width; i++) {
            this.paletteColors.push(bitmap.data.readUIntBE(i * 4, 3));
        }
    }

    async getImageBytes(imageFile) {
        if(!this.paletteColors) throw new Error('palette image is not loaded');
        let {bitmap} = await Jimp.read(imageFile);

        let pixelsCount = bitmap.data.length / 4;
        let indexes = [];
        for(let i = 0; i < pixelsCount; i++) {
            let color = bitmap.data.readUIntBE(i * 4, 3);
            let index = this.paletteColors.indexOf(color);
            if(index === -1) throw new Error(`image color #${color.toString(16)} not in palette`);
            indexes.push(index);
        }

        let baseArr = []; // array for black/white colors bytes
        let grayArr = [] // array for 2-grays colors bytes
        for(let i = 0; i < pixelsCount; i += 8) {
            let pixByteBase = 0;
            let pixByteGray = 0;
            let onePixel = indexes.slice(i, i + 8);
            for(let j = 0; j < 8; j++) {
                let p = onePixel[7-j];
                // if(p === 3) pixByteBase += 0;
                // if(p === 2) pixByteGray += 0;
                if(p === 1) pixByteGray += 1 << j;
                if(p === 0) pixByteBase += 1 << j;
            }
            baseArr.push(pixByteBase);
            grayArr.push(pixByteGray);
        }
        return {
            base: Buffer.from(baseArr),
            gray: Buffer.from(grayArr),
        };
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
