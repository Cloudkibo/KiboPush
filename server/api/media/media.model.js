var db = require('../../components/db').sequelize;
var Sequelize = require('sequelize');

const Medias = db.define('media', {
  url: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  name: {
      type: Sequelize.STRING
  },

});

exports.Medias = Medias;
