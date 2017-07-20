var db = require('./connections').sequelize;
var Sequelize = require('sequelize');

const Users = db.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
      type: Sequelize.STRING
  },
  authType: {
      type: Sequelize.STRING
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