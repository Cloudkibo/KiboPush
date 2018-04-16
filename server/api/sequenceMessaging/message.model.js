
let mongoose = require('mongoose')
let Schema = mongoose.Schema

const messageSchema = new Schema({
  schedule: String,
  SequenceId: {type: Schema.ObjectId, ref: 'sequences'},
  title: String,
  payload: Schema.Types.Mixed,
  isActive: { type: Boolean, default: false }
})

module.exports = mongoose.model('sequenceMessages', messageSchema)
