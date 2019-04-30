const puppeteer = require('puppeteer');
const Koa = require('koa');
const app = new Koa();

(async () => {
  const browser = await (puppeteer.launch());
  const page = await browser.newPage();
  // await page.goto('http://www.29aitt.com/j_youma/index-2.html');
  // await page.screenshot({
  //   path: 'y_youma.png',
  //   type: 'png',
  //   fullPage: true,
  // });
  try {
    // 转到《海贼王》最新一话页面
    await page.goto('http://www.29aitt.com/j_youma/index-2.html');

    // 获取图片数目和高度
    const imagesLen = await page.$$eval('.movie_list img', imgs => imgs.length);
    // const imgHeight = await page.$eval('.movie_list img', img => img.getAttribute('data-h'));

    // 自动滚动，使懒加载图片加载
    const step = 1;
    for (let i = 1; i < imagesLen / step; i++) {
      await page.evaluate(`window.scrollTo(0, ${i * 220 * step})`);
      // 为确保懒加载触发，需要等待一下。实际需要的时间可能不止100ms
      await page.waitFor(200);
    }

    // 获取图片url
    const images = await page.$$eval('.movie_list img', imgs => {
      const images = [];
      imgs.forEach(img => {
        images.push(img.src);
      });
      return images;
    });
    const a = await page.$$eval('.movie_list li a', li => {
      const lilist = [];
      li.forEach(a => {
        lilist.push({
          type: 'img',
          a: a.href,
          h: a.textContent,
          s: a.querySelector('img').src
        });
      });
      return lilist;
    });
    // console.log(a);
    app.use(ctx => {
      ctx.body = a
    });
  } catch (err) {
    console.error(err);
  }

  browser.close();



  app.listen(3000);
})()
