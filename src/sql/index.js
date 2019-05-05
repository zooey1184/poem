const db = require('./db')
const Sequelize = require('sequelize');
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

const Dynasty = db.define('dynasties', {
  // attributes
  link: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dynasty: {
    type: Sequelize.STRING
  },
  total: {
    type: Sequelize.INTEGER
  }
}, {
  // options
});

const Author = db.define('authories', {
  // attributes
  link: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dynasty: {
    type: Sequelize.STRING
  },
  total: {
    type: Sequelize.INTEGER
  },
  header: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  desc: {
    type: Sequelize.TEXT,
  }
}, {
  // options
});

db.authenticate()
.then(() => {
  console.log('数据库连接成功.');
})
.catch(err => {
  console.error('数据库连接失败:', err);
});

export {
  Dynasty,
  Author
};