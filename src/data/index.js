const Koa = require('koa');
const app = new Koa();
const chalk = require('chalk');
const Router = require('koa-router')
const router = new Router()
const bodyparser = require('koa-bodyparser')
import { getDynasty, getDynastyPages } from './dynasty.js'
import { getAuthor } from './author'

app.use(bodyparser())
const PORT = 3000

app.use(async (ctx, next) => {
  ctx.body = ctx.request.body;
  await next()
});
function wait(t=0) {
  return new Promise(res => {
    setTimeout(() => {
      console.log(`i am wait ${t}ms`);
      res(t)
    }, t)
  })
}

getDynasty((list)=> {
  router.get('/getDynasty', async (ctx , next ) => {
    ctx.body = list
    let ll = []
    
    await next()
    for (let i in list) {
      await getDynastyPages(list[i].a, r => {
        console.log(r)
        ll.push({
          link: list[i].a,
          dynasty: list[i].type,
          total: r
        })
      })
    }
    await wait().then(r => {
      console.log(ll)
    })
  })
})


getAuthor('https://so.gushiwen.org/authors/Default.aspx?p=1&c=%E5%85%88%E7%A7%A6', (r) => {
  console.log('get author');
  router.get('/author', async(ctx, next)=> {
    ctx.body = r
    await next()
  })
})

app.use(router.routes())
app.use(router.allowedMethods())
const log = console.log;
app.listen(PORT, ()=> {
  log(chalk.yellow(`listen at 127.0.0.1:${PORT}`));
});