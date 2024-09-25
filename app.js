
let screenshot = require('./modules/screenshot');
let {makeRequest} = require('./modules/Http');
let Colors = require('./modules/Colors');
let fs = require('fs').promises;

setTimeout(async () => {
    // return;
    let broswer = await screenshot.makeBrowser();
    let scrbuf = await screenshot.byUrl(broswer, 'https://weather.rambler.ru/v-sankt-peterburge/today/?updated');
    console.log('Done', scrbuf);

    await fs.writeFile('./tmp/s.png', scrbuf);
    // process.exit(0);

    let colors = new Colors('./palettes/palette2.png');
    await colors.preparePalette();
    let b = await colors.remapImage(scrbuf);
    let out = await colors.getImageBytes(b);

    await makeRequest('/display1', out.grayPart1);
    await makeRequest('/display2', out.grayPart2);

    console.log('ok');
    process.exit(0);
}, 100);

