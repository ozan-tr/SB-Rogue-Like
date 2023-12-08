const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browserURL = 'ws://127.0.0.1:5858/';
    const browser = await puppeteer.connect({browserURL});

    const page = await browser.newPage();

    // Listen for errors
    page.on('pageerror', (err) => {
        fs.appendFileSync('log.txt', `Error: ${err.toString()}\n`);
    });

    // Wait for window.onload before doing anything
    await page.waitForNavigation({ waitUntil: 'load' });

    page.on('pageerror', (err) => {
        fs.appendFileSync('log.txt', `Error: ${err.toString()}\n`);
    });

    for (let i = 0; i < 100; i++) {
        await page.reload();
        await page.waitForTimeout(1000);
    }

    await browser.close();
})();