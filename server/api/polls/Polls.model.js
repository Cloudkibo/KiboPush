// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
//Zarmeen

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var pollSchema = new Schema({
    platform: String, // TODO define this as enum with values, for now value is facebook
    statement: String, 
    options: [String],
    userId: {type: Schema.ObjectId, ref: 'users'},
    datetime : {type: Date, default: Date.now },

  //  pageId: String, [discuss with sojharo, will we keep it or not]
});

module.exports = mongoose.model('polls', pollSchema);
