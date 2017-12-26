const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pollSchema = new Schema({
  statement: String,
  options: [String],
  category: String
})

module.exports = mongoose.model('pollTemplate', pollSchema)
