'use strict'

var mongoose = require('mongoose'),
  Schema = mongoose.Schema

var CompanyUserSchema = new Schema({

  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  userId: { type: Schema.ObjectId, ref: 'users' },
  role: String

})

module.exports = mongoose.model('companyuser', CompanyUserSchema)
