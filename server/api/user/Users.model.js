let mongoose = require('mongoose')
let Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  email: String,
  locale: String,
  gender: String,
  provider: String, // facebook
  timezone: Number,
  fbId: String,
  profilePic: String,
  fbToken: String,
  getStartedSeen: {type: Boolean, default: false},
  dashboardTourSeen: {type: Boolean, default: false},
  workFlowsTourSeen: {type: Boolean, default: false},
  surveyTourSeen: {type: Boolean, default: false},
  convoTourSeen: {type: Boolean, default: false},
  pollTourSeen: {type: Boolean, default: false},
  isSuperUser: {type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('users', userSchema)
