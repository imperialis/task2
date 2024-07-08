const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize({
  dialect: 'postgres',
  username: config.development.username,
  password: config.development.password,
  database: config.development.database,
  host: config.development.host,
  port: config.development.port
  
});

const db = {
  User: require('./user')(sequelize),
  Organisation: require('./organisation')(sequelize),
  sequelize,
  Sequelize
};

db.User.belongsToMany(db.Organisation, { through: 'UserOrganisation' });
db.Organisation.belongsToMany(db.User, { through: 'UserOrganisation' });

module.exports = db;
