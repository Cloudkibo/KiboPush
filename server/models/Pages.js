var db = require('./connections').sequelize;
var Sequelize = require('sequelize');

const Pages = db.define('page', {
  pageId: {
    type: Sequelize.STRING
  },
  pageName: {
      type: Sequelize.STRING
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
  access_given: {
    type: Sequelize.BOOLEAN
  }

});

exports.Pages = Pages;
