let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const pageSchema = new Schema({
  pageId: {
    type: String
  },
  pageName: {
    type: String
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
    type: Boolean
  },
  userId: { type: Schema.ObjectId, ref: 'users' }

})

module.exports = mongoose.model('pages', pageSchema)
