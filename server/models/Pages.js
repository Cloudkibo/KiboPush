var db = require('./connections').sequelize;
var Sequelize = require('sequelize');

const Pages = db.define('page', {
  pageName:{
      type: Sequelize.STRING
  },
  pagePic:{
      type: Sequelize.STRING
  },
  numberOfFollowers:{
      type: Sequelize.INTEGER
  },
  likes:{
      type: Sequelize.INTEGER
  }

});

exports.Pages = Pages;