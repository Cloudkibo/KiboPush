let mongoose = require('mongoose')
let Schema = mongoose.Schema

const pageSchema = new Schema({
  pageId: {
    type: String
  },
  pageName: {
    type: String
  },
  pageUserName: {
    type: String
  },
  pagePic: {
    type: String
  },
  likes: {
    type: Number
  },
  accessToken: { // todo we should not give access token out
    type: String
  },
  connected: { // TODO add default value
    type: Boolean
  },
  userId: {type: Schema.ObjectId, ref: 'users'}

})

module.exports = mongoose.model('pages', pageSchema)
