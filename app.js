
let {BrowserScreenshot} = require('./modules/BrowserScreenshot');
// let yandexWeather = require('./modules/yandexWeather');
let templater = require('./modules/templater');
let {makeRequest} = require('./modules/displayApi');
let Colors = require('./modules/Colors');
let fs = require('fs').promises;

let browserScreenshot = new BrowserScreenshot();

setTimeout(async () => {
    // return;

    let html = templater.getPageHtml();

    // let w = await yandexWeather.getWeather();
    // return console.log(html);

    await browserScreenshot.createBrowserPage()
    // let scrbuf = await browserScreenshot.makeByUrl('https://world-weather.ru/pogoda/russia/saint_petersburg/');
    let scrbuf = await browserScreenshot.makeByHTML(html);

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

