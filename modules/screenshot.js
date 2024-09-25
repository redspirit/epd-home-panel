const puppeteer = require('puppeteer');

const WIDTH = 960;
const HEIGHT = 680;
const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
];

let makeBrowser = () => {
    return puppeteer.launch({
        args: minimal_args
    });
}

const byUrl = async (browser, url, w, h) => {
    console.log('Make screenshot by url', url);
    let page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setViewport({
        width: w || WIDTH,
        height: h || HEIGHT,
    });
    await page.goto(url);
    // await page.screenshot({ path: `${process.cwd()}/tmp/screen.png` });
    let pngBuffer = await page.screenshot({ type: 'png' });
    await page.close();
    return Buffer.from(pngBuffer);
}

const byHTML = (htmlContent) => {

}

module.exports = {
    byUrl,
    byHTML,
    makeBrowser,
}
