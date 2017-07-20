var db = require('./connections').sequelize;
var Sequelize = require('sequelize');

const Subscribers = db.define('subscriber', {
  pageScopedId: {
    type: Sequelize.STRING
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  locale: {
      type: Sequelize.STRING
  },
  timezone:{
      type: Sequelize.STRING,
  },
  email: {
      type: Sequelize.STRING
  },
  gender: {
      type: Sequelize.STRING
  },
  senderId:{
      type: Sequelize.STRING
  },
  profilePic:{
      type: Sequelize.STRING
  },
  

});

exports.Subscribers = Subscribers;