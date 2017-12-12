/**
 * Created by sojharo on 23/10/2017.
 */
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let menuSchema = new Schema({
  pageId: {type: String, ref: 'pages'},
  userId: {type: Schema.ObjectId, ref: 'users'},
  payload: Schema.Types.Mixed
})

module.exports = mongoose.model('menu', menuSchema)
