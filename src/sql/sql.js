const mysql = require('mysql');
const config = require('./config')

const pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
});


class Mysql {
  constructor() {

  }
  query() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * from mytest;', function (error, results, fields) {
        if (error) {
          reject(error)
        };
        resolve(results)
        // console.log('The solution is: ', results[0].solution);
      });
    })

  }
  one() {
    return new Promise((res, rej) => {
      pool.query('INSERT INTO TEST1 (NAME, COUNTRY) VALUES ("HAP", "ENG");', (e, r, f) => {
        if (e) {
          rej(e)
        } else {
          res(r)
        }
      })
    })
  }
  user() {
    return new Promise((res, rej) => {
      pool.query('SELECT * FROM USERS', (e, r, f) => {
        if (e) {
          rej(e)
        } else {
          res(r)
        }
      })
    })
  }
  deleteUser(id) {
    return new Promise((resolve, reject) => {
      console.log(id);
      pool.query(`DELETE FROM USERS WHERE ID=${id};`, (e, res, f) => {
        if (e) {
          reject(e)
        } else {
          resolve(res)
        }
      })
    })
  }
}

module.exports = new Mysql()