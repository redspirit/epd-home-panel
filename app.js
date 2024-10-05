let {BrowserScreenshot} = require('./modules/BrowserScreenshot');
// let yandexWeather = require('./modules/yandexWeather');
let {Dashboard} = require('./modules/Dashboard');
let {DisplayApi} = require('./modules/DisplayApi');
let ImageProcessing = require('./modules/ImageProcessing');
let fs = require('fs').promises;

const ESP_URL = `http://192.168.1.49:3000`;

let browserScreenshot = new BrowserScreenshot();
let dashboard = new Dashboard();
let api = new DisplayApi(ESP_URL);

setTimeout(async () => {
    // return;

    let html = dashboard.getPage({});

    // let w = await yandexWeather.getWeather();
    // return console.log(html);

    await browserScreenshot.createBrowserPage()
    // await browserScreenshot.addCssFile(`${process.cwd()}/templates/styles.css`);
    // let scrbuf = await browserScreenshot.makeByHTML(html);
    let scrbuf = await browserScreenshot.makeByUrl('https://world-weather.ru/pogoda/russia/saint_petersburg/');

    await fs.writeFile('./tmp/s.png', scrbuf);
    // process.exit(0);

    let imProc = new ImageProcessing('./palettes/palette2.png');
    await imProc.preparePalette();
    let b = await imProc.remapImage(scrbuf);
    let out = await imProc.getImageBytes(b);

    // await api.drawGrayscale(out.grayscale.part1, out.grayscale.part2);
    await api.drawMonochrome(out.monochrome);

    console.log('ok');
    process.exit(0);
}, 100);

