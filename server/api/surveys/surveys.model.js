// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
//Zarmeen

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var surveySchema = new Schema({
    title: String, // title of survey
    description: String, // description of survey
    image: String, //image url
    userId: {type: Schema.ObjectId, ref: 'users'},
    datetime : {type: Date, default: Date.now },
  //  pageId: String, [discuss with sojharo, will we keep it or not]
});

module.exports = mongoose.model('surveys', surveySchema);
