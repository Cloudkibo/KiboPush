var db = require('./connections').sequelize;
var Sequelize = require('sequelize');

const Polls = db.define('poll', {
  statement: {
    type: Sequelize.STRING
  },
});

exports.Polls = Polls;