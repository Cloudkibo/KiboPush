/**
 * Created by sojharo on 01/08/2017.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pollSchema = new Schema({
  pageId: [String],
  userId: { type: Schema.ObjectId, ref: 'users' },
  broadcastId: { type: Schema.ObjectId, ref: 'broadcasts' },
  datetime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('page_broadcasts', pollSchema);
