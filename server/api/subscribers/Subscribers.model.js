let mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

const subscriberSchema = new Schema({
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
  timezone: {
      type: String,
  },
  email: {
      type: String
  },
  gender: {
      type: String
  },
  senderId: {
      type: String
  },
  profilePic: {
      type: String
  },
  pageId: {
    type: Schema.ObjectId,
    ref: 'pages'
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'users'
  }
});

module.exports = mongoose.model('subscribers', subscriberSchema);
