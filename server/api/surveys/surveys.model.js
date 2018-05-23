// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
// Zarmeen

let mongoose = require('mongoose')
let Schema = mongoose.Schema

const surveySchema = new Schema({
  title: String, // title of survey
  description: String, // description of survey
  image: String, // image url
  userId: { type: Schema.ObjectId, ref: 'users' },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  datetime: { type: Date, default: Date.now },
  isSegmented: { type: Boolean, default: false },
  segmentationPageIds: [String],
  segmentationLocale: [String],
  segmentationGender: [String],
  segmentationTimeZone: String,
  segmentationTags: [String],
  segmentationSurvey: [String],
  isList: { type: Boolean, default: false },
  segmentationList: [String],
  isresponded: { type: Number, default: 0 },
  sent: {type: Number, default: 0}, // sent count
  seen: {type: Number, default: 0},
  subscriberSenderIds: [String],
  pageIds: [String]
})

module.exports = mongoose.model('surveys', surveySchema)
