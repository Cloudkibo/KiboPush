var db = require('../../components/db').sequelize;
var Sequelize = require('sequelize');

const Pages = db.define('page', {
  pageId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pageName: {
    type: Sequelize.STRING,
    allowNull: false
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
    allowNull: false,
    defaultValue: false
  }

});

exports.Pages = Pages;
