const puppeteer = require('puppeteer');

const WIDTH = 680;
const HEIGHT = 960;

let browser;

puppeteer
    .launch()
    .then(async (_browser) => {
        browser = _browser;
    });

const makeByUrl = async (url, w, h) => {
    if(!browser) return;
    console.log('Make screenshot by url', url);
    let page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setViewport({
        width: w || WIDTH,
        height: h || HEIGHT,
    });
    await page.goto(url);
    await page.screenshot({ path: `${process.cwd()}/tmp/screen.png` });
    await page.close();
}

const makeByHTML = (htmlContent) => {

}

module.exports = {
    makeByUrl,
    makeByHTML,
}
