const puppeteer = require('puppeteer');
const Koa = require('koa');
const app = new Koa();
const chalk = require('chalk')

// (async () => {
//   const browser = await (puppeteer.launch());
//   const page = await browser.newPage();
//   try {
//     await page.goto('https://www.gushiwen.org/gushi/');
//     const a = await page.$$eval('.main3 .left .sons a', li => {
//       let lilist = [];
//       li.forEach(a => {
//         lilist.push({
//           type: 'ii',
//           a: a.href,
//           h: a.textContent,
//         });
//       });
//       return lilist;
//     });
//     // console.log(a);
//     app.use(ctx => {
//       ctx.body = a
//     });
//   } catch (err) {
//     console.error(err);
//   }
//   browser.close();
// })()
function waitFor(time) {
  return new Promise((resolve)=> {
    setTimeout(()=> {
      resolve('true');
    }, time);
  })
}

const searchFn = (s, k)=> {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://baidu.com');
    await page.type('#kw', s, {
      delay: 100
    });
    page.click('#su')
    await waitFor(1000);
    const targetLink = await page.evaluate(() => {
      console.log('hello')
      return [...document.querySelectorAll('.result a')].filter(item => {
        
        return item.innerText && item.innerText.includes('爬虫利器')
      }).toString()
    });
    await waitFor(1000).then(r => {
      console.log(targetLink);
    })
    await page.goto(targetLink);
    // await waitFor(5000);
    // await page.screenshot({
    //   path: 'y_youma.png',
    //   type: 'png',
    //   fullPage: true,
    // })
    browser.close();
  })()
}

searchFn('puppeteer', '爬虫利器')


app.listen(3000, function () {
  console.log('listen at 127.0.0.1:3000');
});
