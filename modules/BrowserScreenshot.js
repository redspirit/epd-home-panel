const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class BrowserScreenshot {
    #minimal_args = [
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
    constructor() {
        this.browser = null;
        this.page = null;
        this.WIDTH = 960;
        this.HEIGHT = 680;
    }

    async createBrowserPage () {
        this.browser = await puppeteer.launch({
            args: this.#minimal_args
        });
        this.page = await this.browser.newPage();
        await this.page.setJavaScriptEnabled(false);
        await this.page.setViewport({
            width: this.WIDTH,
            height: this.HEIGHT,
        });
    }

    async addCssFile(path) {
        let cssContent = await fs.readFile(path);
        await this.page.addStyleTag({
            content: cssContent.toString()
        });
    }

    async makeByUrl(url) {
        await this.page.goto(url);
        let pngData = await this.page.screenshot({ type: 'png' });
        return Buffer.from(pngData);
    }

    async makeByHTML(htmlContent) {
        await this.page.setContent(htmlContent);
        await this.page.addStyleTag({
            path: './templates/styles.css'
        });
        let pngData = await this.page.screenshot({ type: 'png' });
        return Buffer.from(pngData);
    }

}

module.exports = {
    BrowserScreenshot
}
