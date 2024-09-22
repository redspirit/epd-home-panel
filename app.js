
// let screenshot = require('./modules/screenshot');
let {makeRequest} = require('./modules/Http');
let Colors = require('./modules/Colors');
let {bufferImage} = require('./modules/testImage');
let fs = require('fs').promises;

setTimeout(async () => {
    // return;
    // await screenshot.makeByUrl('https://lospec.com');
    // console.log('Done');
    // process.exit(0);

    let colors = new Colors();

    console.log(colors.splitGrayscaleByte(0x05));
    // console.log(colors.splitGrayscaleByte(0xAF));
    // console.log('1var', colors.compactBuffer(Buffer.from([0x00, 0x55])));
    // console.log('2var', colors.compactBuffer(Buffer.from([0x05, 0x05])));
    // console.log('res1', colors.decomp(0x0f));
    // console.log('res2', colors.decomp(0x33));
    return;

    await colors.preparePalette('./palettes/palette1.png');
    let out = await colors.getImageBytes('./tmp/out.png');

    // return console.log(out);

    // let cols = colors.splitColors(encodedBuffer);
    // return console.log(cols);

    // await fs.writeFile('./tmp/out.bin', encodedBuffer);
    // await fs.writeFile('./tmp/baseBuf.bin', cols.baseBuf);

    // console.log(out.grayPart1)

    await makeRequest('/display1', colors.compactBuffer(out.grayPart1));
    await makeRequest('/display2', colors.compactBuffer(out.grayPart2));
    // await makeRequest('/display1', out.grayPart1);
    // await makeRequest('/display2', out.grayPart2);
    // await makeRequest(out.gray);
    // await makeRequest(bufferImage);
    console.log('ok');
}, 100);

(async () => {
    return;
    let part1 = await fs.readFile('./tmp/part1.bin');
    let part2 = await fs.readFile('./tmp/part2.bin');
    await makeRequest('/display1', part1);
    await makeRequest('/display2', part2);
})()


