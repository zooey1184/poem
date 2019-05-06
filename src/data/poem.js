const puppeteer = require('puppeteer');

let getPoem = async (link, callback) => {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  try {
    await page.goto(link);
    const c = await page.$$eval('.main3 .left .sons', (li) => {
      let content_list = [];
      li.forEach(r => {
        let tags = r.querySelector(".tag") ? r.querySelector(".tag") : null
        let tag = []
        if (tags) {
          let tt = tags.querySelectorAll('a')
          tt.forEach(res => {
            tag.push({
              link: res.href,
              tag: res.textContent
            })
          })
        }

        content_list.push({
          title: r.querySelectorAll(".cont p")[0].querySelector('a b').textContent.replace(/\n/g, ''),
          author: r.querySelector(".source").querySelectorAll('a')[1].textContent,
          dynasty: r.querySelector(".source").querySelectorAll('a')[0].textContent,
          content: r.querySelector(".cont .contson").textContent.replace(/\n/g, ''),
          link: r.querySelectorAll(".cont p")[0].querySelector('a').href,
          tags: JSON.stringify(tag),
        });
      });
      return content_list
    });
    await callback(c)
  } catch (err) {
    console.error(err);
  }
  browser.close();
}

export {
  getPoem
}