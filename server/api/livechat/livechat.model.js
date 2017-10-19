/**
 * Created by sojharo on 16/10/2017.
 */
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let LiveChatSchema = new Schema({
  format: {type: String, default: 'convos'}, // values: convos, facebook
  sender_id: String, // this is the subscriber id or page id
  recipient_id: String,
  session_id: {type: Schema.ObjectId, ref: 'sessions'},
  company_id: String, // this is admin id till we have companies
  status: String, // seen or unseen
  payload: Schema.Types.Mixed, // this where message content will go
  url_meta: Schema.Types.Mixed,
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('facebook_messages', LiveChatSchema)
