
let screenshot = require('./modules/screenshot');


setTimeout(async () => {
    await screenshot.makeByUrl('https://google.com/');

    console.log('Done');

    process.exit(0);

}, 1000);


