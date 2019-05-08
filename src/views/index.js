const Koa = require('koa');
const app = new Koa();
const chalk = require('chalk');
const Router = require('koa-router')
const router = new Router()
const bodyparser = require('koa-bodyparser')
// import { finalSearchFn } from './search'
const Sequelize = require('sequelize');
import { Dynasty, Author, PoemType, Poem } from '../sql'
const Op = Sequelize.Op

app.use(bodyparser())
const PORT = 3000

app.use(async (ctx, next) => {
  ctx.body = ctx.request.body;
  await next()
});

router.get('/getDynasty', async (ctx, next) => {
  await Dynasty.findAll().then(res => {
    ctx.body = res
  })
  await next()
})


router.post('/author', async (ctx, next) => {
  let query = ctx.body
  await Author.findAll({
    where: {
      dynasty: query.dynasty
    }
  }).then(r => {
    ctx.body = r
  })
  await next()
})

router.post('/getPoem', async (ctx, next) => {
  let query = ctx.body
  console.log(query)
  await Poem.findAll({
    where: {
      // title:{
      //   [Op.like]: `%${query.title}%`
      // }
      dynasty: query.dynasty,
      tags: {
        [Op.like]: `%${query.tag}%`,
      }
    }
  }).then(r => {
    ctx.body = r
  })
  await next()
})

router.get('/type', async (ctx, next) => {
  await PoemType.findAll().then(res => {
    ctx.body = {
      ret: res
    }
  })
  await next()
})



app.use(router.routes())
app.use(router.allowedMethods())
const log = console.log;
app.listen(PORT, () => {
  log(chalk.yellow(`listen at 127.0.0.1:${PORT}`));
});