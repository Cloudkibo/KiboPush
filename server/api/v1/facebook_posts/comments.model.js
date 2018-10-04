/**
 * Created by sojharo on 28/12/2017.
 */
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let commentsSchema = new Schema({
  facebook_post_id: {type: Schema.ObjectId, ref: 'facebook_posts'},
  companyId: {type: Schema.ObjectId, ref: 'companyprofile'},
  userInfo: Schema.Types.Mixed,
  datetime: {type: Date, default: Date.now}
})

module.exports = mongoose.model('comments', commentsSchema)
