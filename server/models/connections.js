var Sequelize = require('sequelize');

var logger = require('../components/logger');

const sequelize = new Sequelize('kibopush', 'root', 'kibo4321', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: 'path/to/database.sqlite'
});

sequelize
  .authenticate()
  .then(() => {
    logger.serverLog('/models/connections.js', 'Connection has been established successfully.');
  })
  .catch(err => {
    logger.serverLog('/models/connections.js', 'Unable to connect to the database:' + err);
  });


exports.sequelize = sequelize;
