var db = require('./connections').sequelize;
var Sequelize = require('sequelize');

const Users = db.define('user', {
  name: {
    type: Sequelize.STRING
  },
  email: {
      type: Sequelize.STRING
  },
  locale: {
      type: Sequelize.STRING
  },
  gender: {
      type: Sequelize.STRING
  },
  provider: {
      type: Sequelize.STRING
  },
  timezone: {
    type: Sequelize.INTEGER
  },
  fbId:{
      type: Sequelize.STRING
  },
  profilePic:{
      type: Sequelize.STRING
  },
  fbToken:{
      type: Sequelize.STRING,
  },

});

exports.Users = Users;
