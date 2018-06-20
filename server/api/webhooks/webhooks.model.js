// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
// Zarmeen

let mongoose = require('mongoose')
let Schema = mongoose.Schema

const webhookSchema = new Schema({
  webhook_url: {type: String},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  isEnabled: { type: Boolean, default: false },
  error_message: {type: String, default: null},
  optIn: Schema.Types.Mixed,
  pageId: { type: Schema.ObjectId, ref: 'pages' }
})

module.exports = mongoose.model('webhooks', webhookSchema)
