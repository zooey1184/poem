const puppeteer = require('puppeteer');

let getAuthor = async (link, callback) => {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  try {
    await page.goto(link);
    const a = await page.$$eval('.main3 .left .sonspic', (li) => {
      let li_list = [];
      li.forEach(r => {
        li_list.push({
          header: r.querySelector(".divimg img").src,
          name: r.querySelectorAll(".cont p")[0].querySelector('a b').textContent,
          desc: r.querySelectorAll(".cont p")[1].textContent.replace(/► .*篇诗文/g, ''),
          total: r.querySelectorAll(".cont p")[1].querySelector('a').textContent.replace(/► (.*)篇诗文/g, '$1'),
          link: r.querySelectorAll(".cont p")[1].querySelector('a').href,
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
  getAuthor
}