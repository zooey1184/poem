const db = require('./seq')

let t_test = db.define(
  't_test', {
    id: {
      filed: 'id',
      primaryKey: true,
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      field: 'name',
      type: Sequelize.STRING,
      allowNull: true
    },
  }, 
  {
    tableName: 't_test',
    timestamps: false,
    freezeTableName: true
  }
);


module.exports = t_test;