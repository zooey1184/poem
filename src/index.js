/**
 * 入口文件
 * babel转化
 */
require('babel-register')
  ({
    plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
  })

module.exports = require('./data/index.js')