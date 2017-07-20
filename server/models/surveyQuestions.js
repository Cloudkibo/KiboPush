var db = require('./connections').sequelize;
var Sequelize = require('sequelize');

const surveyQuestions = db.define('surveyQuestion', {
  statement: {
    type: Sequelize.STRING
  },
});

exports.surveyQuestions = surveyQuestions;