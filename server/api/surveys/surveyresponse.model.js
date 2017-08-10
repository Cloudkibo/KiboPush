// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
//Zarmeen

let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const surveyResponseSchema = new Schema({
  response: String, //response submitted by subscriber
  surveyId: { type: Schema.ObjectId, ref: 'surveys' },
  questionId: { type: Schema.ObjectId, ref: 'surveyquestions' },
  subscriberId: { type: Schema.ObjectId, ref: 'subscribers' },
  datetime: { type: Date, default: Date.now },
  //  pageId: String, [discuss with sojharo, will we keep it or not]
});

/*
 [{
 response:'ans1',
 surveyId:{
 title:
 'description':

 },
 question:{
 statement:
 type:
 },
 subscriberID:{

 }
 }]
 */
module.exports = mongoose.model('surveyresponse', surveyResponseSchema);
