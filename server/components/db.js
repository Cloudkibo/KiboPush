var Sequelize = require('sequelize');

var logger = require('./logger');
var config = require('../config/environment/index');

const sequelize = new Sequelize(config.db.mysql.credentials.schema,
  config.db.mysql.credentials.user, config.db.mysql.credentials.password, {
  host: config.db.mysql.host,
  port: config.db.mysql.port,
  dialect: config.db.mysql.dialect,

  pool: config.db.mysql.pool,

  // SQLite only
  storage: 'path/to/database.sqlite'
});

sequelize
  .authenticate()
  .then(() => {
    logger.serverLog('/models/db.js', 'Connection has been established successfully.');
  })
  .catch(err => {
    logger.serverLog('/models/db.js', 'Unable to connect to the database:' + err);
  });


exports.sequelize = sequelize;
