var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var pageSchema = new Schema({
  pageCode: {
    type: String,
  },
  pageName: {
    type: String,
  },
  pagePic: {
    type: String
  },
  numberOfFollowers: {
    type: Number
  },
  likes: {
    type: Number
  },
  accessToken: {
    type: String
  },
  connected: { // TODO add default value
    type: Boolean,
  },
  userId: {
    type: String,
  }
});

module.exports = mongoose.model('pages', pageSchema);
