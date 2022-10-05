const puppeteer = require('puppeteer');

let mainPage = 'https://blogtruyen.vn/';
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(mainPage);

    let lastIdStory = await page.evaluate(() => {
        listOfNewestStories = document.querySelectorAll('#top-newest-story > a');
        
        let lastLinkStory = listOfNewestStories[0].href;

        return lastLinkStory;
    });

    console.log(lastIdStory);
})();