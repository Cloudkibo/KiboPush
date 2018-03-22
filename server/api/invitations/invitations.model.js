/**
 * Created by sojharo on 28/12/2017.
 */
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let InvitationsSchema = new Schema({
  name: String,
  email: String,
  companyId: {type: Schema.ObjectId, ref: 'companyprofile'},
  createdAt: {type: Date, required: true, default: Date.now}
})

module.exports = mongoose.model('invitations', InvitationsSchema)
