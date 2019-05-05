const puppeteer = require('puppeteer');
import { getUrlData } from '../common/tool'

/**
 * 获取作者
 * @param {*} link 某个朝代的作者 当前页
 * @param {*} callback 获取成功回调
 * 返回obj { header name desc total link dynasty}
 */
let getAuthor = async (link, callback) => {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  let dd = getUrlData(link).c
  try {
    await page.goto(link);
    const a = await page.$$eval('.main3 .left .sonspic', (li) => {
      let li_list = [];
      
      li.forEach(r => {
        li_list.push({
          header: r.querySelector(".divimg img") ? r.querySelector(".divimg img").src : null,
          name: r.querySelectorAll(".cont p")[0].querySelector('a b').textContent,
          desc: r.querySelectorAll(".cont p")[1].textContent.replace(/► .*篇诗文/g, ''),
          total: r.querySelectorAll(".cont p")[1].querySelector('a').textContent.replace(/► (.*)篇诗文/g, '$1'),
          link: r.querySelectorAll(".cont p")[1].querySelector('a').href,
        });
      });
      return li_list
    });
    await callback(a.map(item => {
      item.dynasty = dd
      return item
    }))
  } catch (err) {
    console.error(err);
  }
  browser.close();
}

export {
  getAuthor
}