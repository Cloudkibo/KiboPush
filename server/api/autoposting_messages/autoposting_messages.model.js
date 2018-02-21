/**
 * Created by sojharo on 16/10/2017.
 */
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let AutopostingMessagesSchema = new Schema({
  pageId: String, // this is the facebook page id
  companyId: {type: Schema.ObjectId, ref: 'companyprofile'}, // this is the company id
  autoposting_type: String, // facebook or twitter or youtube
  payload: Schema.Types.Mixed, // this where message content will go
  autopostingId: {type: Schema.ObjectId, ref: 'autopostings'}, // unique name for autoposting account
  subscribers: [String], // array of subscriber fb ids
  sent: Number, // sent count
  seen: Number, // seen count
  clicked: Number, // clicked count
  datetime: {type: Date, default: Date.now}
})

module.exports = mongoose.model('autoposting_messages', AutopostingMessagesSchema)
