const puppeteer = require('puppeteer');
import { getUrlData } from '../common/tool'
import { Dynasty, Author, } from '../sql'
const url = 'https://so.gushiwen.org/authors/Default.aspx'
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


function getAllAuthor() {
  Dynasty.findAll().then(async r => {
    let ret = JSON.parse(JSON.stringify(r, null, 4)) // 获取到了朝代相关信息
    for (let i = 0; i < ret.length; i++) {
      let item = ret[i]
      let total = item.total > 10 ? 10 : item.total // 古诗文网站仅支持前10页的数据   单独数据可以搜索框搜索    当然可以通过App抓包来实现
      let c = getUrlData(item.link).c
      for (let i = 0; i < total; i++) {
        let link = `${url}?p=${i+1}&c=${c}`
        await getAuthor(link, (r) => {
          console.log(`当前是${getUrlData(link).p}页，朝代${c}`);
          Author.findAll({
            where: {
              name: r[0].name
            }
          }).then(res => {
            if (res && res.length < 1) {
              Author.sync({
                force: false
              }).then(() => {
                Author.bulkCreate(r)
              })
            }
          }).catch(() => {
            Author.sync({
              force: false
            }).then(() => {
              Author.bulkCreate(r)
            })
          })
        })
      }
    }
  })
}

export {
  getAuthor,
  getAllAuthor
}