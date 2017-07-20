var db = require('./connections').sequelize;
var Sequelize = require('sequelize');

const Surveys = db.define('survey', {
  title: {
    type: Sequelize.STRING
  },
  subtitle: {
    type: Sequelize.STRING
  },
  image: {
    type: Sequelize.STRING
  },
});

exports.Surveys = Surveys;