let {BrowserScreenshot} = require('./modules/BrowserScreenshot');
// let yandexWeather = require('./modules/yandexWeather');
let {Dashboard} = require('./modules/Dashboard');
let {DisplayApi} = require('./modules/DisplayApi');
let Colors = require('./modules/Colors');
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
    let scrbuf = await browserScreenshot.makeByHTML(html);

    await fs.writeFile('./tmp/s.png', scrbuf);
    process.exit(0);

    let colors = new Colors('./palettes/palette2.png');
    await colors.preparePalette();
    let b = await colors.remapImage(scrbuf);
    let out = await colors.getImageBytes(b);

    await api.drawGrayscale(out.grayPart1, out.grayPart2);

    console.log('ok');
    process.exit(0);
}, 100);

