let {createCanvas} = require('canvas');
let moment = require('moment');
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

const f1 = async () => {
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

    await api.drawGrayscale(out.grayscale.part1, out.grayscale.part2);
    // await api.drawMonochrome(out.monochrome);

    console.log('ok');
    process.exit(0);
}

const f11 = async () => {
    let scrbuf = await fs.readFile('./tmp/s.png');

    let imProc = new ImageProcessing('./palettes/palette2.png');
    await imProc.preparePalette();
    let b = await imProc.remapImage(scrbuf);
    let out = await imProc.getImageBytes(b);

    await api.drawGrayscale(out.grayscale.part1, out.grayscale.part2);
    // await api.drawMonochrome(out.monochrome);

    console.log('ok');
}

const f2 = async () => {
    let scrbuf = await fs.readFile('./tmp/canva.png');
    let imProc = new ImageProcessing('./palettes/palette2.png');
    await imProc.preparePalette();
    let b = await imProc.remapImage(scrbuf);
    let out = await imProc.getImageBytes(b);

    // await api.drawGrayscale(out.grayscale.part1, out.grayscale.part2);
    await api.drawPartial(200, 300, 220, 90, out.monochrome);

    console.log('ok');
}

let textCanvas = (txt) => {
    let w = 200; // 220
    let h = 100; // 90
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, w, h)
    ctx.font = '80px Arial';
    ctx.fillStyle = '#000'
    ctx.fillText(txt, 10, 80);
    return canvas.toBuffer('image/png')
}

const cnv = async () => {
    let imProc = new ImageProcessing('./palettes/palette2.png');
    await imProc.preparePalette();

    setInterval(async () => {
        let text = moment().format('mm:ss');
        let canv = textCanvas(text);
        await fs.writeFile('./tmp/canva.png', canv);

        let b = await imProc.remapImage(canv);
        let out = await imProc.getImageBytes(b);
        await api.drawPartial(100, 100, 200, 100, out.monochrome);
    }, 9000);
}

// f1().then(); // full image web
// f11().then(); // full image file
// f2().then();
cnv().then();

