const conf = require('./config')
const c = conf.database.test
const Sequelize = require('sequelize');

module.exports = new Sequelize(c.DATABASE, c.USERNAME, c.PASSWORD, {
  host: c.HOST, // 数据库地址
  dialect: 'mysql', // 指定连接的数据库类型
  timezone: '+08:00',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});