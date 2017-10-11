/* eslint-disable camelcase */
/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Surveys = require('./surveys.model')
const SurveyQuestions = require('./surveyquestions.model')
const SurveyResponses = require('./surveyresponse.model')
const TAG = 'api/surveys/surveys.controller.js'
let _ = require('lodash')

const needle = require('needle')
const Pages = require('../pages/Pages.model')
const Subscribers = require('../subscribers/Subscribers.model')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Surveys get api is working')
  Surveys.find({userId: req.user._id}, (err, surveys) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, surveys)
    res.status(200).json({status: 'success', payload: surveys})
  })
}

exports.create = function (req, res) {
  logger.serverLog(TAG,
    `Inside Create Survey, req body = ${JSON.stringify(req.body)}`)
  /* expected request body{
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
   } */
  let surveyPayload = {
    title: req.body.survey.title,
    description: req.body.survey.description,
    userId: req.user._id
  }
  if (req.body.isSegmented) {
    surveyPayload.isSegmented = true
    surveyPayload.segmentationPageIds = (req.body.pageIds)
      ? req.body.pageIds
      : null
    surveyPayload.segmentationGender = (req.body.gender)
      ? req.body.gender
      : null
    surveyPayload.segmentationLocale = (req.body.locale)
      ? req.body.locale
      : null
  }
  const survey = new Surveys(surveyPayload)

  Surveys.create(survey, (err, survey) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    // after survey is created, create survey questions
    for (let question in req.body.questions) {
      let options = []
      if (req.body.questions[question].type === 'multichoice') {
        options = req.body.questions[question].options
      }
      const surveyQuestion = new SurveyQuestions({
        statement: req.body.questions[question].statement, // question statement
        options, // array of question options
        type: req.body.questions[question].type, // type can be text/multichoice
        surveyId: survey._id
      })

      surveyQuestion.save((err2, question1) => {
        if (err2) {
          // return res.status(404).json({ status: 'failed', description: 'Survey Question not created' });
        }
        logger.serverLog(TAG,
          `This is the question created ${JSON.stringify(question1)}`)
      })
    }
    return res.status(201).json({status: 'success', payload: survey})
  })
}

exports.edit = function (req, res) {
  /* expected request body{
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
   } */
  logger.serverLog(TAG,
    `This is body in edit survey ${JSON.stringify(req.body)}`)
  Surveys.findById(req.body.survey._id, (err, survey) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    survey.title = req.body.survey.title
    survey.description = req.body.survey.description
    survey.image = req.body.survey.image

    survey.save((err2) => {
      if (err2) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err2)}`
        })
      }

      SurveyQuestions.remove({surveyId: survey._id}, (err3) => {
        if (err3) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err3)}`
          })
        }
        for (let question in req.body.questions) {
          let options = []
          if (req.body.questions[question].type === 'multichoice') {
            options = req.body.questions[question].options
          }
          const surveyQuestion = new SurveyQuestions({
            statement: req.body.questions[question].statement, // question statement
            options, // array of question options
            type: req.body.questions[question].type, // type can be text/multichoice
            surveyId: survey._id

          })

          surveyQuestion.save((err2) => {
            if (err2) {
              // return res.status(404).json({ status: 'failed', description: 'Survey Question not created' });
            }
          })
        }

        return res.status(200)
          .json({status: 'success', payload: req.body.survey})
      })
    })
  })
}

// Get a single survey
exports.show = function (req, res) {
  Surveys.findById(req.params.id).populate('userId').exec((err, survey) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    // find questions
    SurveyQuestions.find({surveyId: survey._id})
      .populate('surveyId')
      .exec((err2, questions) => {
        if (err2) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err2)}`
          })
        }
        SurveyResponses.find({surveyId: survey._id})
          .populate('surveyId subscriberId questionId')
          .exec((err3, responses) => {
            if (err3) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err3)}`
              })
            }
            return res.status(200)
              .json({status: 'success', payload: {survey, questions, responses}})
          })
      })
  })
}

// Get a single survey
exports.showQuestions = function (req, res) {
  Surveys.findById(req.params.id).populate('userId').exec((err, survey) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    // find questions
    SurveyQuestions.find({surveyId: survey._id})
      .populate('surveyId')
      .exec((err2, questions) => {
        if (err2) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err2)}`
          })
        }

        return res.status(200)
          .json({status: 'success', payload: {survey, questions}})
      })
  })
}

// Submit response of survey
exports.submitresponse = function (req, res) {
  logger.serverLog(TAG,
    `This is body in submit survey response ${JSON.stringify(req.body)}`)
  // expected body will be

  /*
   body:{
   responses:[{qid:_id of question,response:''}],//array of json responses
   surveyId: _id of survey,
   subscriberId: _id of subscriber,
   }
   */
  for (const resp in req.body.responses) {
    const surveyResponse = new SurveyResponses({
      response: req.body.responses[resp].response, // response submitted by subscriber
      surveyId: req.body.surveyId,
      questionId: req.body.responses[resp].qid,
      subscriberId: req.body.subscriberId

    })

    surveyResponse.save((err) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
    })
  }
  return res.status(200)
    .json({status: 'success', payload: 'Response submitted successfully'})
}

exports.send = function (req, res) {
  logger.serverLog(TAG, `Inside sendsurvey ${JSON.stringify(req.body)}`)
  /*
   Expected request body
   { platform: 'facebook',statement: req.body.statement,options: req.body.options,sent: 0 });
   */
  // we will send only first question to fb subsribers
  // find questions
  SurveyQuestions.find({surveyId: req.body._id})
    .populate('surveyId')
    .exec((err2, questions) => {
      if (err2) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err2)}`
        })
      }
      if (questions.length > 0) {
        let first_question = questions[0]
        // create buttons
        const buttons = []
        let next_question_id = 'nil'
        if (questions.length > 1) {
          next_question_id = questions[1]._id
        }

        for (let x = 0; x < first_question.options.length; x++) {
          buttons.push({
            type: 'postback',
            title: first_question.options[x],
            payload: JSON.stringify({
              survey_id: req.body._id,
              option: first_question.options[x],
              question_id: first_question._id,
              next_question_id,
              userToken: req.user.fbToken
            })
          })
        }
        logger.serverLog(TAG, `buttons created${JSON.stringify(buttons)}`)

        let pagesFindCriteria = {userId: req.user._id, connected: true}
        if (req.body.isSegmented) {
          if (req.body.segmentationPageIds) {
            pagesFindCriteria = _.merge(pagesFindCriteria, {
              pageId: {
                $in: req.body.segmentationPageIds
              }
            })
          }
        }
        Pages.find(pagesFindCriteria, (err, pages) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          logger.serverLog(TAG, `Page at Z ${JSON.stringify(pages)}`)
          for (let z = 0; z < pages.length; z++) {
            logger.serverLog(TAG, `Page at Z ${JSON.stringify(pages[z])}`)
            let subscriberFindCriteria = {
              pageId: pages[z]._id,
              isSubscribed: true
            }
            if (req.body.isSegmented) {
              if (req.body.segmentationGender) {
                subscriberFindCriteria = _.merge(subscriberFindCriteria,
                  {
                    gender: {
                      $in: req.body.segmentationGender
                    }
                  })
              }
              if (req.body.segmentationLocale) {
                subscriberFindCriteria = _.merge(subscriberFindCriteria, {
                  locale: {
                    $in: req.body.segmentationLocale
                  }
                })
              }
            }
            Subscribers.find(subscriberFindCriteria, (err, subscribers) => {
              logger.serverLog(TAG,
                `Subscribers of page ${JSON.stringify(subscribers)}`)
              logger.serverLog(TAG, `Page at Z ${JSON.stringify(pages[z])}`)
              if (err) {
                return res.status(404)
                  .json({status: 'failed', description: 'Subscribers not found'})
              }
              // get accesstoken of page
              needle.get(
                `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${req.user.fbToken}`,
                (err, resp) => {
                  if (err) {
                    logger.serverLog(TAG,
                      `Page access token from graph api error ${JSON.stringify(
                        err)}`)
                  }

                  logger.serverLog(TAG,
                    `Page accesstoken from graph api ${JSON.stringify(
                      resp.body)}`)

                  for (let j = 0; j < subscribers.length; j++) {
                    logger.serverLog(TAG,
                      `At Subscriber fetched ${JSON.stringify(subscribers[j])}`)
                    logger.serverLog(TAG,
                      `At Pages Token ${resp.body.access_token}`)

                    const messageData = {
                      attachment: {
                        type: 'template',
                        payload: {
                          template_type: 'button',
                          text: `Please respond to these questions. \n${first_question.statement}`,
                          buttons

                        }
                      }
                    }
                    const data = {
                      recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                      message: messageData
                    }
                    logger.serverLog(TAG, messageData)
                    needle.post(
                      `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                      data, (err, resp) => {
                        if (err) {
                          return res.status(500).json({
                            status: 'failed',
                            description: JSON.stringify(err)
                          })
                        }
                        logger.serverLog(TAG,
                          `Sending survey to subscriber response ${JSON.stringify(
                            resp.body)}`)
                      })
                  }
                })
            })
          }
          return res.status(200)
            .json({status: 'success', payload: 'Survey sent successfully.'})
        })
      } else {
        return res.status(404)
          .json({status: 'failed', description: 'Survey Questions not found'})
      }
    })
}
