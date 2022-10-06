const puppeteer = require('puppeteer');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'doanthephuc',
    database: 'userInfo',
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 0
});

let mainPage = 'https://blogtruyen.vn/';
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req)  => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });

    await page.goto(mainPage);

    let lastIdStory = await page.evaluate(() => {
        let link = document.querySelector('#top-newest-story > a').href;
        let arr = link.split("/");

        return parseInt(arr[3]);
    });

    page.close();

    for (let i = 1; i <= 10; i++) {
        let link = 'https://blogtruyen.vn/' + i + '/';

        crawl(link, browser);
    }
})();

let crawl = async (link, browser) => {
    let mangaPage = await browser.newPage();

    await mangaPage.setRequestInterception(true);
    mangaPage.on('request', (req)  => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });

    await mangaPage.goto(link);

    let mangaData = await mangaPage.evaluate(() => {
        let title = document.title;

        let arr = title.split('|');

        if (arr[0] != "") {
            let ownerDes = document.querySelectorAll('.manga-detail > .description > p');
            let ownerLink = ownerDes[4].querySelector('a').href.split('/');
            let ownerId = ownerLink[ownerLink.length-1];
            let onwerName = ownerDes[4].querySelector('a').innerText;

            return [1, ownerId, onwerName];
        } else {
            return [0, "", ""];
        }
    });

    mangaPage.close();

    let data = mangaData;
    if (data[0] == 1) {
        
    }
}