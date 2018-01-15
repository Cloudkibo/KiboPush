const mongoose = require('mongoose')

const Schema = mongoose.Schema

const broadcastSchema = new Schema({
  title: String,
  category: [String],
  payload: Schema.Types.Mixed,
  datetime: { type: Date, default: Date.now }

})

module.exports = mongoose.model('broadcastTemplate', broadcastSchema)
