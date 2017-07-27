var db = require('../../components/db').sequelize;
var Sequelize = require('sequelize');

const pollOptions = db.define('pollOption', {
  item: {
    type: Sequelize.STRING
  },
});

exports.pollOptions = pollOptions;
