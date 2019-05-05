const puppeteer = require('puppeteer');

let getPoem = async (link, callback) => {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  try {
    await page.goto(link);
    const a = await page.$$eval('.main3 .left .son1 span', (li) => {
      let li_list = [];
      li.forEach(a => {
        li_list.push(a.textContent.replace('页', "").replace('1 / ', ''));
      });
      return li_list[0];
    });
    await callback(a)
  } catch (err) {
    console.error(err);
  }
  browser.close();
}

export {
  getPoem
}