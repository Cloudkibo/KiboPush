var db = require('../../components/db').sequelize;
var Sequelize = require('sequelize');
var Users = require('../user/user.model').Users;

const Pages = db.define('page', {
  pageCode: {
    type: Sequelize.STRING,
  },
  pageName: {
    type: Sequelize.STRING,
  },
  pagePic: {
    type: Sequelize.STRING
  },
  numberOfFollowers: {
    type: Sequelize.INTEGER
  },
  likes: {
    type: Sequelize.INTEGER
  },
  accessToken: {
    type: Sequelize.STRING
  },
  enabled: {
    type: Sequelize.BOOLEAN,
  },
   

},{
  classMethods: {
        associate: function(Users) {
          Pages.belongsTo(Users);
        }
    }
});

exports.Pages = Pages;
