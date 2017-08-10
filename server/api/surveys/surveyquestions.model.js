// WE are referring Messages as Broadcasts, broadcasts and messages will be same thing
//Zarmeen

let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const surveyQuestionSchema = new Schema({
  statement: String, // question statement
  options: { type: Array }, // array of question options
  type: String, //type can be text/multichoice
  surveyId: { type: Schema.ObjectId, ref: 'surveys' },
  datetime: { type: Date, default: Date.now },
  //  pageId: String, [discuss with sojharo, will we keep it or not]
});

module.exports = mongoose.model('surveyquestions', surveyQuestionSchema);
