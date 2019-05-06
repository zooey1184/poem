const Koa = require('koa');
const app = new Koa();
const chalk = require('chalk');
const Router = require('koa-router')
const router = new Router()
const bodyparser = require('koa-bodyparser')
import { getDynasty, getDynastyPages } from './dynasty.js'
import { getAuthor } from './author'
import {wait, getUrlData} from '../common/tool'
import {Dynasty, Author, Poem} from '../sql'
import { searchFn } from './search'
import { getPoem } from './poem.js';

const url = 'https://so.gushiwen.org/authors/Default.aspx'
const uu = 'https://so.gushiwen.org/authors/Default.aspx'

app.use(bodyparser())
const PORT = 3000

app.use(async (ctx, next) => {
  ctx.body = ctx.request.body;
  await next()
}); 

// 已经获取了朝代的信息 暂时不执行
const getDynasties = false
if (getDynasties) {
  getDynasty(url, (list) => {
    router.get('/getDynasty', async (ctx, next) => {
      ctx.body = list
      let ll = []
      await next()
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
  })
}

/**
 * 获取作者
 * hasgetAuthor 切换关闭状态方便调试
 */
const hasgetAuthor = false
if (hasgetAuthor) {
  Dynasty.findAll().then(async r => {
    let ret = JSON.parse(JSON.stringify(r, null, 4)) // 获取到了朝代相关信息
    for(let i=0; i<ret.length; i++) {
      let item = ret[i]
      if (item.dynasty == '先秦' || item.dynasty == '两汉') {
        let total = item.total > 10 ? 10 : item.total // 古诗文网站仅支持前10页的数据   单独数据可以搜索框搜索    当然可以通过App抓包来实现
        let c = getUrlData(item.link).c
        for (let i = 0; i < total; i++) {
          let link = `${uu}?p=${i+1}&c=${c}`
          await getAuthor(link, (r) => {
            console.log(`当前是${getUrlData(link).p}页，朝代${c}`);
            Author.findAll({
              where: {
                name: r[0].name
              }
            }).then(res=> {
              if(res && res.length<1) {
                Author.sync({
                  force: false
                }).then(()=> {
                  Author.bulkCreate(r)
                })
              }
            }).catch(()=> {
              Author.sync({
                force: false
              }).then(() => {
                Author.bulkCreate(r)
              })
            })
          })
        }
      }
    }
    
  })
}

searchFn('白', (r) => {
  console.log(r)
  const poem = r.poem
  const author = r.author

  async function poemFn() {
    for (let i in poem.values()) {
      await Poem.findAll({
        where: {
          title: i.title
        }
      }).then(res => {
        if (res && res.length < 1) {
          Poem.sync({
            force: false
          }).then(() => {
            Poem.create(i)
          })
        }
      }).catch(e => {
        console.log(e);
      })
    }
  }

  function authorFn() {
    if(author.length>0) {
      Author.findAll({
        where: {
          name: author[0].name
        }
      }).then(res => {
        if (res && res.length < 1) {
          Author.sync({
            force: false
          }).then(() => {
            Author.create(author[0])
          })
        }
      }).catch(e => {
        console.log(e);
      })
    }
  }
})

function secPageMore(type = 'author', word, p) { // type=title
  if (p > 1) {
    let url = `https://so.gushiwen.org/search.aspx?type=${type}&p=${p}&value=${word}`
    getPoem(url, async(r)=> {
      for (let i in r.values()) {
        await Poem.findAll({
          where: {
            title: i.title
          }
        }).then(res => {
          if (res && res.length < 1) {
            Poem.sync({
              force: false
            }).then(() => {
              Poem.create(i)
            })
          }
        }).catch(e => {
          console.log(e);
        })
      }
    })
  }
}

app.use(router.routes())
app.use(router.allowedMethods())
const log = console.log;
app.listen(PORT, ()=> {
  log(chalk.yellow(`listen at 127.0.0.1:${PORT}`));
});