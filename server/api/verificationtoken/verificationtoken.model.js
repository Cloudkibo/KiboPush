'use strict'

var mongoose = require('mongoose'),
  Schema = mongoose.Schema

var VerificationtokenSchema = new Schema({
  userId: {type: Schema.ObjectId, required: true, ref: 'users'},
  token: {type: String, required: true},
  createdAt: {type: Date, required: true, default: Date.now, expires: '4h'}
})

module.exports = mongoose.model('verificationtoken', VerificationtokenSchema)
