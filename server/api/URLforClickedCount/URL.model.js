/**
 * Created by sojharo on 30/08/2017.
 */
// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
// Zarmeen

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let urlSchema = new Schema({
  originalURL: String,
  subscriberId: {type: Schema.ObjectId, ref: 'subscribers'},
  module: Schema.Types.Mixed
})

module.exports = mongoose.model('URL', urlSchema)
