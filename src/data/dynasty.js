const puppeteer = require('puppeteer');


let getDynastyPages = async (link, callback) => {
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

let getDynasty = async (callback) => {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  try {
    await page.goto('https://so.gushiwen.org/authors/Default.aspx');
    const a = await page.$$eval('.main3 .left .son2 .sright a', (li) => {
      let li_list = [];
      li.forEach(a => {
        li_list.push({
          a: a.href,
          type: a.textContent,
        });
      });
      return li_list;
      
    });
    await callback(a)
  } catch (err) {
    console.error(err);
  }
  browser.close();
}

export {
  getDynasty,
  getDynastyPages
}