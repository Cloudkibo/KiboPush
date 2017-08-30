// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
// Zarmeen

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let broadcastSchema = new Schema({
  platform: String, // TODO define this as enum with values, for now value is facebook
  type: String, // TODO define this as enum with values ['text','attachment']
  text: String, // message body
  userId: {type: Schema.ObjectId, ref: 'users'},
  datetime: {type: Date, default: Date.now}
})

module.exports = mongoose.model('broadcasts', broadcastSchema)
