let mongoose = require('mongoose')
let Schema = mongoose.Schema

const sequenceSchema = new Schema({
  name: String, // response submitted by subscriber
  messageId: [String],
  isList: { type: Boolean, default: false },
  isSegmented: {type: Boolean, default: false},
  segmentationPageIds: [String],
  segmentationLocale: [String],
  segmentationGender: [String],
  companyId: {type: Schema.ObjectId, ref: 'companyprofile'}
})

module.exports = mongoose.model('sequences', sequenceSchema)
