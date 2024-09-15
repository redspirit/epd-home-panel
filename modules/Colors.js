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

        let byteArr = [];
        let pixelsCount = bitmap.data.length / 4;
        let encodedBuf = Buffer.alloc(pixelsCount / 4); // pack 4 pixels in 1 byte, each pixel is 2bit info (4-colors)
        for(let i = 0; i < pixelsCount; i++) {
            let color = bitmap.data.readUIntBE(i * 4, 3);
            let index = this.paletteColors.indexOf(color);
            if(index === -1) throw new Error(`image color #${color.toString(16)} not in palette`);
            byteArr.push(index);
            if(byteArr.length === 4) {
                let b = byteArr[3];
                b += byteArr[2] << 2;
                b += byteArr[1] << 4;
                b += byteArr[0] << 6;
                let bIndex = (i + 1) / 4 - 1;
                encodedBuf.writeUInt8(b, bIndex);
                byteArr = [];
            }
        }
        return encodedBuf;
    }
}

module.exports = Colors;
