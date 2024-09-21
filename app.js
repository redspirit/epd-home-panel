
// let screenshot = require('./modules/screenshot');
let {makeRequest} = require('./modules/Http');
let Colors = require('./modules/Colors');
let {bufferImage} = require('./modules/testImage');
let fs = require('fs').promises;

setTimeout(async () => {
    // await screenshot.makeByUrl('https://lospec.com');
    // console.log('Done');
    // process.exit(0);

    let colors = new Colors();
    await colors.preparePalette('./palettes/palette1.png');
    let out = await colors.getImageBytes('./tmp/out.png');

    //return console.log(out);

    // let cols = colors.splitColors(encodedBuffer);
    // return console.log(cols);

    // await fs.writeFile('./tmp/out.bin', encodedBuffer);
    //await fs.writeFile('./tmp/baseBuf.bin', cols.baseBuf);

    console.log('make request...');
    await makeRequest(out.base);
    // await makeRequest(out.gray);
    // await makeRequest(bufferImage);
    console.log('ok');
}, 100);


