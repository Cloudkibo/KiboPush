let mongoose = require('mongoose')
let Schema = mongoose.Schema

let teamSchema = new Schema({
  name: String,
  description: String,
  created_by: { type: Schema.ObjectId, ref: 'users' },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  creation_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('teams', teamSchema)
