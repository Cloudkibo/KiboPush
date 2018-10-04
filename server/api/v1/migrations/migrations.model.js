/**
 * Created by sojharo on 30/08/2017.
 */
// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
// Zarmeen

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let autoPostingSchema = new Schema({
  userId: { type: Schema.ObjectId, ref: 'users' },
  userName: String,
  link: String
})

module.exports = mongoose.model('migrations', autoPostingSchema)
