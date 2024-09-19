
// let screenshot = require('./modules/screenshot');
let Colors = require('./modules/Colors');
let {bufferImage} = require('./modules/testImage');
let fs = require('fs').promises;

setTimeout(async () => {
    // await screenshot.makeByUrl('https://lospec.com');
    // console.log('Done');
    // process.exit(0);

    let colors = new Colors();
    await colors.preparePalette('./palettes/palette1.png');
    let encodedBuffer = await colors.getImageBytes('./tmp/out.png');

    // console.log(encodedBuffer);

    let cols = colors.splitColors(encodedBuffer);

    console.log(cols);

    // await fs.writeFile('./tmp/out.bin', encodedBuffer);
    //await fs.writeFile('./tmp/baseBuf.bin', cols.baseBuf);
    await fs.writeFile('./tmp/testImg.bin', bufferImage);

    console.log('ok');
}, 100);


