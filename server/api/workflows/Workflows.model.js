// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
//Zarmeen

let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const workflowSchema = new Schema({
  condition: String, // TODO ENUMS
  keywords: [String],
  reply: String,
  userId: { type: Schema.ObjectId, ref: 'users' },
  sent: Number,
  isActive: Boolean,
  datetime: { type: Date, default: Date.now },

  //  pageId: String, [discuss with sojharo, will we keep it or not]
});

module.exports = mongoose.model('workflows', workflowSchema);
