const Koa = require('koa');
const app = new Koa();
const chalk = require('chalk');
const Router = require('koa-router')
const router = new Router()
const bodyparser = require('koa-bodyparser')
import { getAllAuthor } from './author'
import { getAllDynasty } from './dynasty'
import { getTypesFn, getAllTypes } from './type'
import { getAllPoem } from './poem'
import { finalSearchFn } from './search'
import { Author, PoemType } from '../sql'

app.use(bodyparser())
const PORT = 3000

app.use(async (ctx, next) => {
  ctx.body = ctx.request.body;
  await next()
}); 

// 已经获取了朝代的信息 暂时不执行
const hasgetDynasties = false
if (hasgetDynasties) {
  getAllDynasty()
}

/**
 * 获取作者
 * hasgetAuthor 切换关闭状态方便调试
 */
const hasgetAuthor = false
if (hasgetAuthor) {
  getAllAuthor()
}


const hasgetType = false
if(hasgetType) {
  getTypesFn()
}

const hasSearch = false
if(hasSearch) {
  finalSearchFn('严维')
}

router.get('/author', async(ctx, next)=> {
  await Author.findAll({
    where: {
      dynasty: '先秦'
    }
  }).then(r=> {
    ctx.body = r
  })
  await next()
})
router.get('/type', async (ctx, next)=> {
  await PoemType.findAll().then(res => {
    ctx.body = res
  })
  await next()
})
// getAllPoem()

getAllTypes(r=> {
  console.log(r);
})


app.use(router.routes())
app.use(router.allowedMethods())
const log = console.log;
app.listen(PORT, ()=> {
  log(chalk.yellow(`listen at 127.0.0.1:${PORT}`));
});