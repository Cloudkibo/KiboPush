/**
 * Created by sojharo on 16/10/2017.
 */
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let FacebookSessionSchema = new Schema({
  subscriber_id: {type: Schema.ObjectId, ref: 'subscribers'},
  page_id: {type: Schema.ObjectId, ref: 'pages'},
  company_id: String, // this is admin id till we have companies
  status: {type: String, default: 'new'},
  request_time: {type: Date, default: Date.now},
  last_activity_time: {type: Date, default: Date.now}
})

module.exports = mongoose.model('sessions', FacebookSessionSchema)
