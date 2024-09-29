
let {BrowserScreenshot} = require('./modules/BrowserScreenshot');
// let yandexWeather = require('./modules/yandexWeather');
let {makeRequest} = require('./modules/displayApi');
let Colors = require('./modules/Colors');
let fs = require('fs').promises;

let browserScreenshot = new BrowserScreenshot();

setTimeout(async () => {
    // return;

    // let w = await yandexWeather.getWeather();
    // return console.log(w);

    await browserScreenshot.createBrowserPage()
    let scrbuf = await browserScreenshot.makeByUrl('https://world-weather.ru/pogoda/russia/saint_petersburg/');
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

