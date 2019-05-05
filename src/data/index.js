const Koa = require('koa');
const app = new Koa();
const chalk = require('chalk');
const Router = require('koa-router')
const router = new Router()
const bodyparser = require('koa-bodyparser')
import { getDynasty, getDynastyPages } from './dynasty.js'
import { getAuthor } from './author'
import {wait, getUrlData} from '../common/tool'
import {Dynasty, Author} from '../sql'

const url = 'https://so.gushiwen.org/authors/Default.aspx'
const url2 = 'https://so.gushiwen.org/authors/Default.aspx?p=1&c=%E5%85%88%E7%A7%A6'
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



// getAuthor(url2, (r) => {
//   console.log(`当前是${getUrlData(url2).p}页，朝代${getUrlData(url2).c}`);
//   router.get('/author', async(ctx, next)=> {
//     ctx.body = r
//     await next()
//   })
// })
const hasgetAuthor = true
if (hasgetAuthor) {
  Dynasty.findAll().then(async r => {
    let ret = JSON.parse(JSON.stringify(r, null, 4)) // 获取到了朝代相关信息
    for(let i=0; i<ret.length; i++) {
      let item = ret[i]
      if (item.dynasty == '先秦' || item.dynasty == '两汉') {
        let total = item.total
        let arr = []
        let c = getUrlData(item.link).c
        for (let i = 0; i < total; i++) {
          let link = `${uu}?p=${i+1}&c=${c}`
          await getAuthor(link, (r) => {
            console.log(`当前是${getUrlData(link).p}页，朝代${c}`);
            // arr = [...arr, ...r]
            Author.findAll({
              where: {
                name: r[r.length-1].name
              }
            }).then(res=> {
              if(res && res.length<1) {
                Author.sync({
                  force: false
                }).then(()=> {
                  Author.bulkCreate(r)
                })
              }
            }).catch(e=> {
              Author.sync({
                force: false
              }).then(() => {
                Author.bulkCreate(r)
              })
            })
          })
        }
        // await wait().then(() => {
        //   Author.findAll({
        //     where: {
        //       name: arr[arr.length - 1].name
        //     }
        //   }).then(() => {
        //     Author.sync({
        //       force: false
        //     }).then(() => {
        //       Author.bulkCreate(arr)
        //     })
        //   })
        // })
      }
    }
    
  })
}


app.use(router.routes())
app.use(router.allowedMethods())
const log = console.log;
app.listen(PORT, ()=> {
  log(chalk.yellow(`listen at 127.0.0.1:${PORT}`));
});