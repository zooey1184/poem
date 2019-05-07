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
  },
  desc: {
    type: Sequelize.TEXT,
  }
}, {
  // options
});

const Poem = db.define('poems', {
  // attributes
  link: {
    type: Sequelize.STRING,
  },
  dynasty: {
    type: Sequelize.STRING
  },
  author: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  tags: {
    type: Sequelize.JSON,
  }
}, {
  // options
});


const PoemType = db.define('types', {
  // attributes
  link: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING,
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
  Author,
  Poem,
  PoemType
};