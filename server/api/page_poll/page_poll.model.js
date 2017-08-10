/**
 * Created by sojharo on 01/08/2017.
 */

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pollSchema = new Schema({
  pageId: [String],
  userId: { type: Schema.ObjectId, ref: 'users' },
  pollId: { type: Schema.ObjectId, ref: 'polls' },
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('page_polls', pollSchema)
