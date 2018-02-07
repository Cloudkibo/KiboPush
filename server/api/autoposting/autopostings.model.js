/**
 * Created by sojharo on 30/08/2017.
 */
// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
// Zarmeen

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let autoPostingSchema = new Schema({
  userId: { type: Schema.ObjectId, ref: 'users' },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  accountTitle: String,
  subscriptionUrl: String,
// TODO make it enum, possible values: facebook, youtube, twitter etc
  subscriptionType: String,
  accountUniqueName: String,
  payload: Schema.Types.Mixed,
  isActive: { type: Boolean, default: true },
  isSegmented: { type: Boolean, default: false },
  segmentationPageIds: [String],
  segmentationLocale: [String],
  segmentationGender: [String],
  segmentationTimeZone: String
})

module.exports = mongoose.model('autopostings', autoPostingSchema)
