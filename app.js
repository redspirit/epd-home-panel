
// let screenshot = require('./modules/screenshot');
let {makeRequest} = require('./modules/Http');
let Colors = require('./modules/Colors');
let {bufferImage} = require('./modules/testImage');
let fs = require('fs').promises;
let colors = new Colors();

setTimeout(async () => {
    // return;
    // await screenshot.makeByUrl('https://lospec.com');
    // console.log('Done');
    // process.exit(0);

    // console.log(colors.splitGrayscaleByte(0xFF, 0x00));
    // console.log(colors.splitGrayscaleByte(0x00, 0x2E));
    // console.log(colors.splitGrayscaleByte(0x07, 0x40));
    // console.log('1var', colors.compactBuffer(Buffer.from([0x00, 0x55])));
    // console.log('2var', colors.compactBuffer(Buffer.from([0x05, 0x05])));
    // console.log('res1', colors.decomp(0x0f));
    // console.log('res2', colors.decomp(0x33));
    // return;

    await colors.preparePalette('./palettes/palette1.png');
    let out = await colors.getImageBytes('./tmp/out.png');

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
    return;
    // let part1 = await fs.readFile('./tmp/part1.bin');
    // let part2 = await fs.readFile('./tmp/part2.bin');
    // await makeRequest('/display1', part1);
    // await makeRequest('/display2', part2);

    let allGray = await fs.readFile('./tmp/all.bin');
    let part1Arr = [];
    let part2Arr = [];
    for(let i = 0; i < allGray.length; i +=2) {
        let gsByte = colors.splitGrayscaleByte(allGray.readUInt8(i), allGray.readUInt8(i+1));
        part1Arr.push(gsByte[0]);
        part2Arr.push(gsByte[1]);
    }
    let part1 = Buffer.from(part1Arr);
    let part2 = Buffer.from(part2Arr);

    console.log('allGray', allGray);
    console.log('part1', part1);
    console.log('part2', part2);

    await makeRequest('/display1', part1);
    await makeRequest('/display2', part2);
})();


