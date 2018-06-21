let mongoose = require('mongoose')
let Schema = mongoose.Schema

let automationQueueSchema = new Schema({
  automatedMessageId: String,
  subscriberId: { type: Schema.ObjectId, ref: 'subscribers' },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  type: String
})

module.exports = mongoose.model('automation_queue', automationQueueSchema)
