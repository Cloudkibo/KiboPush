
let mongoose = require('mongoose')
let Schema = mongoose.Schema

const botSchema = new Schema({
  pageId: {type: String, ref: 'pages'}, // TODO ENUMS
  userId: {type: Schema.ObjectId, ref: 'users'},
  botName: String,
  witAppId: String,
  witToken: String,
  witAppName: String,
  isActive: String,
  payload: [{
  	questions: [String],
  	answer: String
  }],
  datetime: {type: Date, default: Date.now}
})

module.exports = mongoose.model('bots', botSchema)
