var db = require('../../components/db').sequelize;
var Sequelize = require('sequelize');
var Pages = require('../pages/pages.model').Pages;


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

  

},{
     classMethods: {
        associate: function(Pages) {
          Users.hasMany(Pages);
        }
    },
});

exports.Users = Users;
