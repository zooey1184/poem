const puppeteer = require('puppeteer');
import { wait } from '../common/tool'
import { Dynasty } from '../sql'
const url = 'https://so.gushiwen.org/authors/Default.aspx'
/**
 * 获取各个朝代
 * return [{href, type}]
 * @param {*} link  获取朝代的链接
 * @param {*} callback 获取成功回调
 */

let getDynasty = async (link, callback) => {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  try {
    await page.goto(link);
    const a = await page.$$eval('.main3 .left .son2 .sright a', (li) => {
      let li_list = [];
      li.forEach(a => {
        li_list.push({
          href: a.href,
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


/**
 * 获取某个朝代的页码
 * return num
 * @param {*} link 跳转当前朝代页面的地址
 * @param {*} callback 获取成功回调
 */
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

function getAllDynasty() {
  getDynasty(url, async (list) => {
    let ll = []
    for (let i in list) {
      await getDynastyPages(list[i].href, r => {
        ll.push({
          link: list[i].href,
          dynasty: list[i].type,
          total: Number.parseInt(r)
        })
      })
    }
    // 批量导入
    await wait().then(() => {
      Dynasty.sync({
        force: true
      }).then(() => {
        Dynasty.bulkCreate(ll)
      })
    })
  })
}

export {
  getDynasty,
  getDynastyPages,
  getAllDynasty
}