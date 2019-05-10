const Koa = require('koa');
const app = new Koa();
const chalk = require('chalk');
const Router = require('koa-router')
const router = new Router()
const bodyparser = require('koa-bodyparser')
import { finalSearchFn } from '../data/search'
const Sequelize = require('sequelize');
import { Dynasty, Author, PoemType, Poem, User } from '../sql'
const Op = Sequelize.Op
const jwt = require('jsonwebtoken');
const skey = 'ORRdSRXnUI4XrFlCxEadFjv_X25xk_ks949JCofk'

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

router.post('/search', async(ctx, next)=> {
  let query = ctx.body
  await Poem.findAll({
    where: {
      content: {
        [Op.like]: `%${query.word}%`
      }
    }
  }).then(async res=> {
    let ret = JSON.parse(JSON.stringify(res))
    if(ret && ret.length>0) {
      console.log('search from db');
      ctx.body = ret
    } else {
      await finalSearchFn(query.word, sr=> {
        console.log('search from out');
        ctx.body = sr
      })
    }
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

router.post('/register', async(ctx, next)=> {
  let body = ctx.body
  await User.findAll({
    where: {
      tel: body.tel
    }
  }).then(async (r)=> {
    if(r && r.length>0) {
      ctx.body = {
        code: 0,
        msg: "用户已存在"
      }
    }else {
      User.sync({
        force: true
      }).then(()=> {
        User.create(body)
        ctx.body = {
          code: 1,
          ret: true
        }
      })
    }
  }).catch(e=> {
    // ctx.body = 'error'
  })
  await next()
})
router.post('/login', async (ctx, next) => {
  let body = ctx.body
  await User.findAll({
    where: {
      tel: body.tel,
      pwd: body.pwd
    }
  }).then((r) => {
    if (r && r.length > 0) {
      ctx.body = {
        code: 0,
        msg: "用户名或密码不正确"
      }
    } else {
      User.sync({
        force: false
      }).then(() => {
        var token = jwt.sign({
          name: body.name,
          pwd: body.pwd
        }, skey);
        ctx.body = {
          code: 1,
          ret: token
        }
        
      })
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