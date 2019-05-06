const puppeteer = require('puppeteer');
import {
  wait
} from '../common/tool'
const url = 'https://www.gushiwen.org/'
const searchurl = 'https://so.gushiwen.org/search.aspx'

/**
 * 搜索并获取作者方式一: 模拟用户行为
 * @param {*} word 搜索关键词
 * @param {*} callback 获取成功回调
 * 返回obj { header name desc total link dynasty}
 */
let searchAuthor = async (word, callback) => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.type('#txtKey', word, {
    delay: 100
  });
  page.click('.search [type=submit]')
  await wait(3000);
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
  await callback(a)
  browser.close();
}
/**
 * 搜索并获取作者方式二
 * @param {*} word 搜索关键词
 * @param {*} callback 获取成功回调
 * 返回obj { header name desc total link dynasty}
 */
let searchFn = async (word, callback) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `${searchurl}?value=${word}`
  await page.goto(url);
  // 获取总数
  
  const p = await page.$$eval('.main3 #FromPage .pagesright', (li) => {
    let li_list = [];
    li.forEach(r => {
      li_list.push({
        page: r.querySelectorAll("span")[0].textContent.replace(/\/ (.*)页/g, '$1')
      });
    });
    return li_list
  });
  // 获取author
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
  // 获取poem
  const poem = await page.$$eval('.main3 .left .sons', (li) => {
    let content_list = [];
    li.forEach(r => {
      let tags = r.querySelector(".tag") ? r.querySelector(".tag") : null
      let tag = []
      if(tags) {
        let tt = tags.querySelectorAll('a')
        tt.forEach(res=> {
          tag.push({
            tag: res.textContent,
            link: res.href
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
  // 加工author，添加dynasty
  let author = a.map(item=> {
    item.dynasty = poem[0].dynasty
    return item
  })
  await callback({
    author,
    poem,
    page: p[0]
  })
  browser.close();
}

export {
  searchAuthor,
  searchFn
}