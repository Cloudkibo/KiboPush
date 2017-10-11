let mongoose = require('mongoose')
let Schema = mongoose.Schema

let phoneNumberSchema = new Schema({
  name: String,
  number: String,
  userId: { type: Schema.ObjectId, ref: 'users' },
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('phoneNumber', phoneNumberSchema)
