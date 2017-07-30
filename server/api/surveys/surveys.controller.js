/**
 * Created by sojharo on 27/07/2017.
 */

var logger = require('../../components/logger');
var Surveys = require('./surveys.model');
var SurveyQuestions = require('./surveyquestions.model');
var SurveyResponses = require('./surveyresponse.model');
const TAG = 'api/surveys/surveys.controller.js';



exports.index = function (req, res) {
  logger.serverLog(TAG,'Surveys get api is working');
  Surveys.find(function(err, surveys){
    if(err) return res.status(404).json({status: 'failed', description: 'Surveys not found'});
    logger.serverLog(TAG,  surveys);
    res.status(200).json({status: 'success', payload: surveys});
  });
};

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Inside Create Survey, req body = '+ JSON.stringify(req.body));
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

  Surveys.create(req.body.survey, function(err, survey) {
    if(err) { 
       return res.status(404).json({status: 'failed', description: 'Survey not created'});
     }
     //after survey is created, create survey questions
    for(var question in req.body.questions){
            var options = [];
            if(req.body.questions[question].type == 'multichoice'){
              options = req.body.questions[question].options;
            }
            var surveyQuestion = new SurveyQuestions({
                    statement: req.body.questions[question].statement, // question statement
                    options: options,// array of question options
                    type:req.body.questions[question].type,//type can be text/multichoice
                    surveyId: survey._id,
                    
                  });

            surveyQuestion.save(function(err2,question){
               if(err2) { 
                         return res.status(404).json({status: 'failed', description: 'Survey Question not created'});
                       }
               logger.serverLog(TAG, 'This is the question created '+ JSON.stringify(question) );
            });

          }
    return res.status(200).json({status: 'success', payload: survey});
   
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
 logger.serverLog(TAG, 'This is body in edit survey '+ JSON.stringify(req.body) );
 Surveys.findById(req.body.survey._id, function (err, survey) {
    if(err) { 
       return res.status(404).json({status: 'failed', description: 'Survey not found'});
     }
     
     survey.title = req.body.survey.title;
     survey.description = req.body.survey.description;
     survey.image = req.body.survey.image;
     
     survey.save(function(err2){
               if(err) { 
                       return res.status(404).json({status: 'failed', description: 'Survey update failed.'});
                     }

                SurveyQuestions.remove({surveyId : survey._id}, function(err3){
                  if(err3) { 
                       return res.status(404).json({status: 'failed', description: 'Error in removing survey questions.'});
                     }
                  for(var question in req.body.questions){
                        var options = [];
                        if(req.body.questions[question].type == 'multichoice'){
                          options = req.body.questions[question].options;
                        }
                        var surveyQuestion = new SurveyQuestions({
                                statement: req.body.questions[question].statement, // question statement
                                options: options,// array of question options
                                type:req.body.questions[question].type,//type can be text/multichoice
                                surveyId: survey._id,
                                
                              });

                        surveyQuestion.save(function(err2){
                           if(err2) { 
                                     return res.status(404).json({status: 'failed', description: 'Survey Question not created'});
                                   }
                        });

                    }

                  return res.status(200).json({status: 'success', payload: req.body.survey});  

                });
             
              });
  });
}


// Get a single survey
exports.show = function(req, res) {
  Surveys.findById(req.params.id).populate('userId').exec(function (err, survey){
      if(err) { 
              return res.status(404).json({status: 'failed', description: 'Survey not found'});
              }
      //find questions
      SurveyQuestions.find({surveyId:survey._id}).populate('surveyId').exec(function (err2, questions){
              if(err2) { 
                return res.status(404).json({status: 'failed', description: 'Survey Questions not found'});
              }
             SurveyResponses.find({surveyId:survey._id}).populate('surveyId subscriberId questionId').exec(function (err3, responses){
              if(err3) { 
                return res.status(404).json({status: 'failed', description: 'Survey responses not found'});
              }
                return res.status(200).json({status: 'success', payload: {survey:survey,questions:questions,responses:responses}});  

             });
     
             });

    });
  

};


// Get a single survey
exports.showQuestions = function(req, res) {
  Surveys.findById(req.params.id).populate('userId').exec(function (err, survey){
      if(err) { 
              return res.status(404).json({status: 'failed', description: 'Survey not found'});
              }
      //find questions
      SurveyQuestions.find({surveyId:survey._id}).populate('surveyId').exec(function (err2, questions){
              if(err2) { 
                return res.status(404).json({status: 'failed', description: 'Survey Questions not found'});
              }
            
                return res.status(200).json({status: 'success', payload: {survey:survey,questions:questions}});  

            
     
             });

    });
  

};


exports.send = function (req, res) {
   //we will write here the logic to send survey
};



