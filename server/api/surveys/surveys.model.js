// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
// Zarmeen

let mongoose = require('mongoose')
let Schema = mongoose.Schema

const surveySchema = new Schema({
  title: String, // title of survey
  description: String, // description of survey
  image: String, // image url
  userId: { type: Schema.ObjectId, ref: 'users' },
  datetime: { type: Date, default: Date.now }
  //  pageId: String, [discuss with sojharo, will we keep it or not]
})

module.exports = mongoose.model('surveys', surveySchema)
