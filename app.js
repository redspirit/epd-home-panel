
// let screenshot = require('./modules/screenshot');
let {makeRequest} = require('./modules/Http');
let Colors = require('./modules/Colors');
let fs = require('fs').promises;

setTimeout(async () => {
    // return;
    // await screenshot.makeByUrl('https://lospec.com');
    // console.log('Done');
    // process.exit(0);

    let colors = new Colors('./palettes/palette1.png');
    await colors.preparePalette();
    // return colors.testImg('./tmp/1.jpg');
    let b = await colors.remapImage('./tmp/test-image.png');
    let out = await colors.getImageBytes(b);

    // return console.log(out);
    // console.log(out);

    // let cols = colors.splitColors(encodedBuffer);
    // return console.log(cols);

    // await fs.writeFile('./tmp/out.bin', encodedBuffer);
    // await fs.writeFile('./tmp/baseBuf.bin', cols.baseBuf);

    // console.log(out.grayPart1)

    await makeRequest('/display1', out.grayPart1);
    await makeRequest('/display2', out.grayPart2);
    // await makeRequest('/display1', out.grayPart1);
    // await makeRequest('/display2', out.grayPart2);
    // await makeRequest(out.gray);
    // await makeRequest(bufferImage);
    console.log('ok');
}, 100);

(async () => {

})();


