/**
 * Created by sojharo on 30/08/2017.
 */
// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
// Zarmeen

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let urlSchema = new Schema({
  originalURL: String,
  shortenedURL: String,
  broadcastId: { type: Schema.ObjectId, ref: 'page_broadcasts' },
  itemId: String
})

module.exports = mongoose.model('URL', urlSchema)
