let mongoose = require('mongoose')
let Schema = mongoose.Schema

const sequenceSchema = new Schema({
  name: String,
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  userId: { type: Schema.ObjectId, ref: 'users' },
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('sequences', sequenceSchema)
