const puppeteer = require('puppeteer');
import { getPoem, getAllShiWen } from './poem'
import { PoemType, Poem } from '../sql'
import { wait } from '../common/tool';

let getType = async (link, callback) => {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  try {
    await page.goto(link);
    const c = await page.$$eval('#type1 .sright a', (li) => {
      let content_list = [];
      li.forEach(r => {
        content_list.push({
          type: r.textContent,
          link: r.href
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


function getTypesFn() {
  const url2 = 'https://www.gushiwen.org/shiwen/'
  getType(url2, r => {
    console.log(r, r[0].type)
    PoemType.findAll({
      where: {
        type: r[0].type
      }
    }).then(res => {
      if (res && res.length < 1) {
        PoemType.sync({
          force: false
        }).then(() => {
          PoemType.bulkCreate(r)
        })
      }
    }).catch(() => {
      PoemType.sync({
        force: false
      }).then(() => {
        PoemType.bulkCreate(r)
      })
    })
  })
}

async function getShiWen(link, callback) {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  try {
    await page.goto(link);

    const c = await page.$$eval('.main3 .left .sons .typecont', (li) => {
      let content_list = [];
      li.forEach(r => {
        let tt = r.querySelectorAll("span")
        let content = []
        tt.forEach(res => {
          content.push({
            link: res.querySelector('a').href,
            title: res.querySelector('a').textContent,
            author: res.textContent.replace(/.*(\(.*\).*)/g, '$1')
          })
        })
        content_list.push({
          tag: r.querySelector(".bookMl").textContent,
          content: JSON.stringify(content)
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

async function checkTitle(item) {
  await Poem.findAll({
    where: {
      title: item.title
    }
  }).then(res => {
    if (res && res.length < 1) {
      Poem.sync({
        force: false
      }).then(() => {
        Poem.create(item)
      })
    }
  }).catch(e=> {
    console.log(e)
  })
}

function getAllTypes() {
  PoemType.findAll({
    where: {
      type: "咏物"
    }
  }).then(async r=> {
    let ret = JSON.parse(JSON.stringify(r))

    for(let i of ret) {
      await getShiWen(i.link, async res => {
        
        if (res.length > 0) {
          console.log('深度type');
          for (let ii of res) {
            await wait(500)
            await (async (ii) => {
              let content = JSON.parse(ii.content)
              for (let iii of content) {
                console.log(iii.link);
                await getAllShiWen(iii.link, async rr => {
                  for(let iiii of rr) {
                    // await Poem.findAll({
                    //   where: {
                    //     title: iiii.title
                    //   }
                    // }).then(rrr => {
                    //   if (rrr && rrr.length < 1) {
                    //     Poem.sync({
                    //       force: false
                    //     }).then(() => {
                    //       Poem.create(iii)
                    //     })
                    //   }
                    // })
                    checkTitle(iiii)
                    console.log(iiii);
                  }
                })
              }
            })(ii)
          }
        } else {
          console.log('正常');
          let t = 1
          await getPoem(i.link, res => {
            for(let ii of res.poem) {
              checkTitle(ii)
            }
            
            t = res.page > 10 ? 10 : res.page
          })
          await wait(500).then(async() => {
            console.log(t);
            for (let ii = 2; ii <= t; ii++) {
              await (async(i, ii)=> {
                let u = i.link.replace(/A\d*.aspx/, `A${ii}.aspx`)
                console.log(u);
                await getPoem(u, res => {
                  for (let ii of res.poem) {
                    checkTitle(ii)
                  }
                })
              })(i, ii)
            }
          })
        }
      })
    }
  })
}

export {
  getTypesFn,
  getAllTypes
}