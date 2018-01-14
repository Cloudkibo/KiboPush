let mongoose = require('mongoose')
let Schema = mongoose.Schema

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
    type: String
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
  coverPhoto: {
    type: String
  },
  pageId: {
    type: Schema.ObjectId,
    ref: 'pages'
  },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  isSubscribed: {
    type: Boolean,
    default: true
  },
  isEnabledByPage: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model('subscribers', subscriberSchema)
