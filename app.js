
// let screenshot = require('./modules/screenshot');
let Colors = require('./modules/Colors');
let fs = require('fs').promises;


setTimeout(async () => {
    // await screenshot.makeByUrl('https://lospec.com');
    // console.log('Done');
    // process.exit(0);

    let colors = new Colors();
    await colors.preparePalette('./palettes/palette1.png');
    let encodedBuffer = await colors.getImageBytes('./tmp/out.png');

    console.log(encodedBuffer);
    // await fs.writeFile('./tmp/out.bin', encodedBuffer);

    console.log('ok');
}, 100);


