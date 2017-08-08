/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger');
const Surveys = require('./surveys.model');
const SurveyQuestions = require('./surveyquestions.model');
const SurveyResponses = require('./surveyresponse.model');
const TAG = 'api/surveys/surveys.controller.js';

const needle = require('needle');
const Pages = require('../pages/Pages.model');
const Subscribers = require('../subscribers/Subscribers.model');

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
  for (var resp in req.body.responses) {
              const surveyResponse = new SurveyResponses({
                      response: req.body.responses[resp].response, //response submitted by subscriber
                      surveyId: req.body.surveyId,
                      questionId: req.body.responses[resp].qid,
                      subscriberId: req.body.subscriberId,
                                        
                    });

              surveyResponse.save((err) => {
                 if (err) { 
                          logger.serverLog(TAG, err);
                           return res.status(404).json({ status: 'failed', description: 'Survey Response not created' });
                         }
                });
              }
  return res.status(200).json({ status: 'success', payload: 'Response submitted successfully' });
};

exports.send = function (req, res) {
  logger.serverLog(TAG, `Inside sendsurvey ${JSON.stringify(req.body)}`);
  /*
   Expected request body
   { platform: 'facebook',statement: req.body.statement,options: req.body.options,sent: 0 });
   */
  // we will send only first question to fb subsribers
        //find questions
  SurveyQuestions.find({ surveyId: req.body._id }).populate('surveyId').exec((err2, questions) => {
              if (err2) { 
                return res.status(404).json({ status: 'failed', description: 'Survey Questions not found' });
              }
            if(questions.length > 0){
               first_question = questions[0];
               //create buttons
               var buttons = [];
               var next_question_id='nil';
               if(questions.length > 1){
                next_question_id = questions[1]._id;
               }

               for(var x=0;x<first_question.options.length;x++){

                buttons.append({
                                type: 'postback',
                                title: first_question.options[x],
                                payload: JSON.stringify({ survey_id: req.body._id, option: first_question.options[x],question_id:first_question._id,next_question_id:next_question_id })
                              })
               }
                logger.serverLog(TAG, 'buttons created'+ JSON.stringify(buttons));

               Pages.find({ userId: req.user._id }, (err, pages) => {
                  if (err) {
                    logger.serverLog(TAG, `Error ${JSON.stringify(err)}`);
                    return res.status(404).json({ status: 'failed', description: 'Pages not found' });
                  }
                  logger.serverLog(TAG, `Page at Z ${JSON.stringify(pages)}`);
                  for (var z in pages) // todo this for loop doesn't work with async code
                  {
                    logger.serverLog(TAG, `Page at Z ${JSON.stringify(pages[z])}`);
                    Subscribers.find({ pageId: pages[z]._id }, (err, subscribers) => {
                      logger.serverLog(TAG, `Subscribers of page ${JSON.stringify(subscribers)}`);
                      logger.serverLog(TAG, `Page at Z ${JSON.stringify(pages[z])}`);
                      if (err) {
                        return res.status(404).json({ status: 'failed', description: 'Subscribers not found' });
                      }
                      //get accesstoken of page
                      // TODO can't we get access token from the page table???
                      needle.get(`https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${req.user.fbToken}`, (err, resp) => {
                        if (err) {
                          logger.serverLog(TAG, `Page accesstoken from graph api Error${JSON.stringify(err)}`);
                          // TODO this will do problem, res should not be in loop
                          return res.status(404).json({ status: 'failed', description: err });
                        }

                          logger.serverLog(TAG, `Page accesstoken from graph api ${JSON.stringify(resp.body)}`);


                          for (let j = 0; j < subscribers.length; j++) { // TODO again for loop is not good option
                            logger.serverLog(TAG, `At Subscriber fetched ${JSON.stringify(subscribers[j])}`);
                            logger.serverLog(TAG, `At Pages Token ${resp.body.access_token}`);
    
                             var messageData = {
                                                    attachment: {
                                                      type: 'template',
                                                      payload: {
                                                        template_type: 'button',
                                                        text: first_question.statement,
                                                        "buttons":buttons,
      
                                                        }
                                                      }
                                                  };
                            const data = {
                              recipient: { id: subscribers[j].senderId }, //this is the subscriber id
                              message: messageData,
                            };
                            logger.serverLog(TAG,messageData);
                            needle.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`, data, (err, resp) => {
                              logger.serverLog(TAG, `Sending survey to subscriber response ${JSON.stringify(resp.body)}`);
                              if (err) {
                                // TODO this will do problem, res should not be in loop
                                return res.status(404).json({ status: 'failed', description: err });
                              }

                              // return res.status(200).json({ status: 'success', payload: resp.body });
                            });
                          }
                      });
                    });
                  }
                  return res.status(200).json({ status: 'success', payload: 'Survey sent successfully.' });
              });
      }
      else{
           return res.status(404).json({ status: 'failed', description: 'Survey Questions not found' });
             
      }
});
};


