const config = {
  // 启动端口
  port: 3000,

  // 这里是你数据库的配置
  database: {
    test: {
      DATABASE: 'test',
      USERNAME: 'root',
      PASSWORD: '123456', // 
      PORT: '3306',
      HOST: 'localhost'
    }
  }
}

module.exports = config