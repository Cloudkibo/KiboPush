var db = require('../../components/db').sequelize;
var Sequelize = require('sequelize');

const Broadcasts = db.define('broadcast', {
  platform: { // TODO define this as enum with values, for now value is facebook
    type: Sequelize.STRING
  },
  type: { // TODO define this as enum with values
    type: Sequelize.STRING
  },

});

exports.Broadcasts = Broadcasts;
