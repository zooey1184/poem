function wait(t = 0) {
  return new Promise(res => {
    setTimeout(() => {
      console.log(`i am wait ${t}ms`);
      res(t)
    }, t)
  })
}

function getUrlData(url) {
  let obj = {}
  let dataArr = decodeURIComponent(url.split('?')[1]).split('&')
  dataArr.forEach(e => {
    try {
      let arr = e.split('=')
      obj[arr[0]] = arr[1]
    } catch (error) {
      console.log(e)
    }
  })
  return obj
}

export {
  wait,
  getUrlData
}