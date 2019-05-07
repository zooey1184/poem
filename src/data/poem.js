const puppeteer = require('puppeteer');
import {Author, Poem} from '../sql'
import { wait } from '../common/tool';

let getPoem = async (link, callback) => {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  try {
    await page.goto(link);

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


    await callback({poem: c, page: p[0].page})
  } catch (err) {
    console.error(err);
  }
  browser.close();
}


let getAllShiWen = async (link, callback) => {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  try {
    await page.goto(link);
    const c = await page.$$eval('.main3 .left .sons', (li) => {
      let content_list = [];
      let r = li[0]
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
        title: r.querySelector(".cont h1").textContent.replace(/\n/g, ''),
        author: r.querySelector(".source").querySelectorAll('a')[1].textContent,
        dynasty: r.querySelector(".source").querySelectorAll('a')[0].textContent,
        content: r.querySelector(".cont .contson").textContent.replace(/\n/g, ''),
        link: '',
        tags: JSON.stringify(tag),
      });
      return content_list
    });


    await callback(c)
  } catch (err) {
    console.error(err);
  }
  browser.close();
}

function getAllPoem() {
  Author.findAll({
    where: {
      dynasty: '两汉'
    }
  }).then(async r=> {
    let res = JSON.parse(JSON.stringify(r))
    for(let i of res) {
      let t = Math.ceil(i.total / 10) > 10 ? 10 : Math.ceil(i.total / 10)
      if(t>0) {
        await (async(i) => {
          for (let ii = 1; ii <= t; ii++) {
            let u = i.link.replace(/A\d*.aspx/, `A${ii}.aspx`)
            // console.log(u);
            await wait(1000)
            await getPoem(u, poem=> {
              for(let iii of poem.poem) {
                console.log(iii.title);
                Poem.findAll({
                  where: {
                    title: iii.title
                  }
                }).then(rp=> {
                  if(rp && rp.length<1) {
                    Poem.sync({
                      force: false
                    }).then(()=> {
                      Poem.create(iii)
                    })
                  }
                })
              }
            })
          }
        })(i)
      }
    }
  })
}

export {
  getPoem,
  getAllPoem,
  getAllShiWen
}