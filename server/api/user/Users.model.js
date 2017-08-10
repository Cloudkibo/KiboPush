let mongoose = require('mongoose')
let Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  email: String,
  locale: String,
  gender: String,
  provider: String,
  timezone: Number,
  fbId: String,
  profilePic: String,
  fbToken: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('users', userSchema)
