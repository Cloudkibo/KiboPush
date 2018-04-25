
let mongoose = require('mongoose')
let Schema = mongoose.Schema

const messageSchema = new Schema({
  schedule: String,
  sequenceId: {type: Schema.ObjectId, ref: 'sequences'},
  title: String,
  payload: Schema.Types.Mixed,
  isActive: { type: Boolean, default: false },
  sent: {type: Number, default: 0},
  seen: {type: Number, default: 0},
  clicks: {type: Number, default: 0}
})

module.exports = mongoose.model('sequenceMessages', messageSchema)
