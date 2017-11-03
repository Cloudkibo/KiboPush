/**
 * Created by sojharo on 01/08/2017.
 */

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pollSchema = new Schema({
  pageId: String,
  userId: { type: Schema.ObjectId, ref: 'users' },
  surveyId: { type: Schema.ObjectId, ref: 'surveys' },
  subscriberId: String,
  datetime: { type: Date, default: Date.now },
  seen: {type: Boolean}
})

module.exports = mongoose.model('page_surveys', pollSchema)
