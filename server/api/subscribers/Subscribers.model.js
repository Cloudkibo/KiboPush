var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var subscriberSchema = new Schema({
    pageScopedId: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  locale: {
      type: String
  },
  timezone:{
      type: String,
  },
  email: {
      type: String
  },
  gender: {
      type: String
  },
  senderId:{
      type: String
  },
  profilePic:{
      type: String
  },
  pageId:{
      type: String
  },
  userId:{
      type: String
  },
});

module.exports = mongoose.model('subscribers', subscriberSchema);
