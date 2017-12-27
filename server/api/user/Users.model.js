let mongoose = require('mongoose')
let Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  email: String,
  domain: String,
  domain_email: String,
  facebookInfo: Schema.Types.Mixed,
  role: String,
  hashedPassword: String,
  salt: String,
  emailVerified: String,
  locale: String,
  gender: String,
  provider: String, // facebook
  timezone: Number,
  fbId: String,
  profilePic: String,
  fbToken: String,
  isSuperUser: {type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // tour seen variables
  getStartedSeen: {type: Boolean, default: false},
  dashboardTourSeen: {type: Boolean, default: false},
  workFlowsTourSeen: {type: Boolean, default: false},
  surveyTourSeen: {type: Boolean, default: false},
  convoTourSeen: {type: Boolean, default: false},
  pollTourSeen: {type: Boolean, default: false},
  growthToolsTourSeen: {type: Boolean, default: false},
  subscriberTourSeen: {type: Boolean, default: false},
  liveChatTourSeen: {type: Boolean, default: false},
  autoPostingTourSeen: {type: Boolean, default: false},
  mainMenuTourSeen: {type: Boolean, default: false},
  subscribeToMessengerTourSeen: {type: Boolean, default: false},
  pagesTourSeen: {type: Boolean, default: false}
})

module.exports = mongoose.model('users', userSchema)
