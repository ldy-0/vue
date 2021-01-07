const pupp = require('puppeteer');

test();

async function test() {
  const browserConfig = {
          headless: false,
        },

        browser = await pupp.launch(browserConfig);

  let page = await browser.newPage();
  await page.goto('http://localhost:8080/web/');

  // await browser.close();
}