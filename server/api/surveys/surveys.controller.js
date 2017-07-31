/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger');
const Surveys = require('./surveys.model');
const SurveyQuestions = require('./surveyquestions.model');
const SurveyResponses = require('./surveyresponse.model');
const TAG = 'api/surveys/surveys.controller.js';


exports.index = function (req, res) {
  logger.serverLog(TAG, 'Surveys get api is working');
  Surveys.find((err, surveys) => {
    if (err) return res.status(404).json({ status: 'failed', description: 'Surveys not found' });
    logger.serverLog(TAG, surveys);
    res.status(200).json({ status: 'success', payload: surveys });
  });
};

exports.create = function (req, res) {
  logger.serverLog(TAG, `Inside Create Survey, req body = ${JSON.stringify(req.body)}`);
  /*expected request body{
    survey:{
    title: String, // title of survey
    description: String, // description of survey
    image: String, //image url
    userId: {type: Schema.ObjectId, ref: 'users'},
    },
    questions:[{
        statement: String
        options: Array of String,
        type: String,
    },...]
  }*/

  Surveys.create(req.body.survey, (err, survey) => {
    if (err) { 
       return res.status(404).json({ status: 'failed', description: 'Survey not created' });
     }
     //after survey is created, create survey questions
    for (const question in req.body.questions) {
            let options = [];
            if (req.body.questions[question].type == 'multichoice') {
              options = req.body.questions[question].options;
            }
            const surveyQuestion = new SurveyQuestions({
                    statement: req.body.questions[question].statement, // question statement
                    options, // array of question options
                    type: req.body.questions[question].type, //type can be text/multichoice
                    surveyId: survey._id,
                    
                  });

            surveyQuestion.save((err2, question) => {
               if (err2) { 
                         return res.status(404).json({ status: 'failed', description: 'Survey Question not created' });
                       }
               logger.serverLog(TAG, `This is the question created ${JSON.stringify(question)}`);
            });
          }
    return res.status(200).json({ status: 'success', payload: survey });
  });
};

exports.edit = function (req, res) {
  /*expected request body{
    survey:{
    title: String, // title of survey
    description: String, // description of survey
    image: String, //image url
    userId: {type: Schema.ObjectId, ref: 'users'},
    },
    questions:[{
        statement: String
        options: Array of String
    },...]
  }*/
 logger.serverLog(TAG, `This is body in edit survey ${JSON.stringify(req.body)}`);
 Surveys.findById(req.body.survey._id, (err, survey) => {
    if (err) { 
       return res.status(404).json({ status: 'failed', description: 'Survey not found' });
     }
     
     survey.title = req.body.survey.title;
     survey.description = req.body.survey.description;
     survey.image = req.body.survey.image;
     
     survey.save((err2) => {
               if (err) { 
                       return res.status(404).json({ status: 'failed', description: 'Survey update failed.' });
                     }

                SurveyQuestions.remove({ surveyId: survey._id }, (err3) => {
                  if (err3) { 
                       return res.status(404).json({ status: 'failed', description: 'Error in removing survey questions.' });
                     }
                  for (const question in req.body.questions) {
                        let options = [];
                        if (req.body.questions[question].type == 'multichoice') {
                          options = req.body.questions[question].options;
                        }
                        const surveyQuestion = new SurveyQuestions({
                                statement: req.body.questions[question].statement, // question statement
                                options, // array of question options
                                type: req.body.questions[question].type, //type can be text/multichoice
                                surveyId: survey._id,
                                
                              });

                        surveyQuestion.save((err2) => {
                           if (err2) { 
                                     return res.status(404).json({ status: 'failed', description: 'Survey Question not created' });
                                   }
                        });
                    }

                  return res.status(200).json({ status: 'success', payload: req.body.survey });
                });
              });
  });
};


// Get a single survey
exports.show = function (req, res) {
  Surveys.findById(req.params.id).populate('userId').exec((err, survey) => {
      if (err) { 
              return res.status(404).json({ status: 'failed', description: 'Survey not found' });
              }
      //find questions
      SurveyQuestions.find({ surveyId: survey._id }).populate('surveyId').exec((err2, questions) => {
              if (err2) { 
                return res.status(404).json({ status: 'failed', description: 'Survey Questions not found' });
              }
             SurveyResponses.find({ surveyId: survey._id }).populate('surveyId subscriberId questionId').exec((err3, responses) => {
              if (err3) { 
                return res.status(404).json({ status: 'failed', description: 'Survey responses not found' });
              }
                return res.status(200).json({ status: 'success', payload: { survey, questions, responses } });
             });
             });
    });
};


// Get a single survey
exports.showQuestions = function (req, res) {
  Surveys.findById(req.params.id).populate('userId').exec((err, survey) => {
      if (err) { 
              return res.status(404).json({ status: 'failed', description: 'Survey not found' });
              }
      //find questions
      SurveyQuestions.find({ surveyId: survey._id }).populate('surveyId').exec((err2, questions) => {
              if (err2) { 
                return res.status(404).json({ status: 'failed', description: 'Survey Questions not found' });
              }
            
                return res.status(200).json({ status: 'success', payload: { survey, questions } });
             });
    });
};


// Submit response of survey
exports.submitresponse = function (req, res) {
  logger.serverLog(TAG, `This is body in submit survey response ${JSON.stringify(req.body)}`);
  //expected body will be

  /*
    body:{
    responses:[{qid:_id of question,response:''}],//array of json responses
    surveyId: _id of survey,
    subscriberId: _id of subscriber,
    }
  */
  for (const resp in req.body.responses) {
              const surveyResponse = new SurveyResponses({
                      response: req.body.responses[resp].response, //response submitted by subscriber
                      surveyId: req.body.surveyId,
                      questionId: req.body.responses[resp].qid,
                      subscriberId: req.body.subscriberId,
                                        
                    });

              surveyResponse.save((err) => {
                 if (err) { 
                           return res.status(404).json({ status: 'failed', description: 'Survey Response not created' });
                         }
                });
              }
  return res.status(200).json({ status: 'success', payload: 'Response submitted successfully' });
};

exports.send = function (req, res) {
   //we will write here the logic to send survey
};

