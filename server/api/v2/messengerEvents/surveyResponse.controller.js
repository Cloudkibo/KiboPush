const logger = require('../../../components/logger')
const TAG = 'api/messengerEvents/surveyResponse.controller.js'
const Subscribers = require('../../v1/subscribers/Subscribers.model')
const mongoose = require('mongoose')
const needle = require('needle')
const webhookUtility = require('../../v1/webhooks/webhooks.utility')
const SurveyResponse = require('../../v1/surveys/surveyresponse.model')
const Surveys = require('../../v1/surveys/surveys.model')
const SurveyQuestions = require('../../v1/surveys/surveyquestions.model')
const Sessions = require('../../v1/sessions/sessions.model')
const callApi = require('../utility')

exports.surveyResponse = function (req, res) {
  res.status(200).json({
    status: 'success',
    description: `received the payload`
  })
  logger.serverLog(TAG, `in surveyResponse ${JSON.stringify(req.body)}`)
  for (let i = 0; i < req.body.entry[0].messaging.length; i++) {
    const event = req.body.entry[0].messaging[i]
    let resp = JSON.parse(event.postback.payload)
    savesurvey(event)
    Subscribers.findOne({ senderId: req.body.entry[0].messaging[0].sender.id }, (err, subscriber) => {
      if (err) {
        logger.serverLog(TAG,
          `Error occurred in finding subscriber ${JSON.stringify(
            err)}`)
      }
      if (subscriber) {
        logger.serverLog(TAG, `Subscriber Responeds to Survey ${JSON.stringify(subscriber)} ${resp.survey_id}`)
        // sequenceController.setSequenceTrigger(subscriber.companyId, subscriber._id, { event: 'responds_to_survey', value: resp.poll_id })
      }
    })
  }
}
function savesurvey (req) {
  // this is the response of survey question
  // first save the response of survey
  // find subscriber from sender id
  var resp = JSON.parse(req.postback.payload)

  Subscribers.findOne({ senderId: req.sender.id }, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG,
        `Error occurred in finding subscriber${JSON.stringify(
          err)}`)
    }

    // eslint-disable-next-line no-unused-vars
    const surveybody = {
      response: resp.option, // response submitted by subscriber
      surveyId: resp.survey_id,
      questionId: resp.question_id,
      subscriberId: subscriber._id
    }
    callApi.callApi(`webhooks/query`, 'post', { pageId: req.recipient.id })
    .then(webhook => {
      if (webhook && webhook.isEnabled) {
        needle.get(webhook.webhook_url, (err, r) => {
          if (err) {
            logger.serverLog(TAG, err)
          } else if (r.statusCode === 200) {
            if (webhook && webhook.optIn.SURVEY_RESPONSE) {
              var data = {
                subscription_type: 'SURVEY_RESPONSE',
                payload: JSON.stringify({ sender: req.sender, recipient: req.recipient, timestamp: req.timestamp, response: resp.option, surveyId: resp.survey_id, questionId: resp.question_id })
              }
              needle.post(webhook.webhook_url, data,
                (error, response) => {
                  if (error) logger.serverLog(TAG, err)
                })
            }
          } else {
            webhookUtility.saveNotification(webhook)
          }
        })
      }
    })
    .catch(err => {
      logger.serverLog(TAG, err)
    })
    SurveyResponse.update({
      surveyId: resp.survey_id,
      questionId: resp.question_id,
      subscriberId: subscriber._id
    }, { response: resp.option, datetime: Date.now() }, { upsert: true }, (err1, surveyresponse, raw) => {
      // SurveyResponse.create(surveybody, (err1, surveyresponse) => {
      if (err1) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err1)}`)
      }
      logger.serverLog(TAG,
        `Raw${JSON.stringify(
          surveyresponse)}`)
      //  Surveys.update({ _id: mongoose.Types.ObjectId(resp.survey_id) }, { $set: { isresponded: true } })
      // send the next question
      SurveyQuestions.find({
        surveyId: resp.survey_id,
        _id: { $gt: resp.question_id }
      }).populate('surveyId').exec((err2, questions) => {
        if (err2) {
          logger.serverLog(TAG, `Survey questions not found ${JSON.stringify(
            err2)}`)
        }
        if (questions.length > 0) {
          let firstQuestion = questions[0]
          // create buttons
          const buttons = []
          let nextQuestionId = 'nil'
          if (questions.length > 1) {
            nextQuestionId = questions[1]._id
          }

          for (let x = 0; x < firstQuestion.options.length; x++) {
            buttons.push({
              type: 'postback',
              title: firstQuestion.options[x],
              payload: JSON.stringify({
                survey_id: resp.survey_id,
                option: firstQuestion.options[x],
                question_id: firstQuestion._id,
                nextQuestionId,
                userToken: resp.userToken
              })
            })
          }
          needle.get(
            `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${resp.userToken}`,
            (err3, response) => {
              if (err3) {
                logger.serverLog(TAG,
                  `Page accesstoken from graph api Error${JSON.stringify(
                    err3)}`)
              }
              const messageData = {
                attachment: {
                  type: 'template',
                  payload: {
                    template_type: 'button',
                    text: firstQuestion.statement,
                    buttons

                  }
                }
              }
              const data = {
                messaging_type: 'RESPONSE',
                recipient: { id: req.sender.id }, // this is the subscriber id
                message: messageData
              }
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  if (err4) {

                  }
                  Sessions.findOne({
                    subscriber_id: subscriber._id,
                    page_id: subscriber.pageId,
                    company_id: subscriber.userId
                  }, (err, session) => {
                    if (err) {
                      return logger.serverLog(TAG,
                        `At get session ${JSON.stringify(err)}`)
                    }
                  })
                })
            })
        } else { // else send thank you message
          Surveys.update({ _id: mongoose.Types.ObjectId(resp.survey_id) },
            { $inc: { isresponded: 1 - surveyresponse.nModified } },
            (err, subscriber) => {
              if (err) {
                logger.serverLog(TAG,
                  `Error occurred in finding subscriber${JSON.stringify(
                    err)}`)
              }
              Surveys.find({}, (err, subscriber) => {
                if (err) {
                  logger.serverLog(TAG,
                    `Error occurred in finding subscriber${JSON.stringify(
                      err)}`)
                }
              })
            })
          needle.get(
            `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${resp.userToken}`,
            (err3, response) => {
              if (err3) {
                logger.serverLog(TAG,
                  `Page accesstoken from graph api Error${JSON.stringify(
                    err3)}`)
              }
              const messageData = {
                text: 'Thank you. Response submitted successfully.'
              }
              const data = {
                messaging_type: 'RESPONSE',
                recipient: { id: req.sender.id }, // this is the subscriber id
                message: messageData
              }
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  if (err4) {
                  }
                  Sessions.findOne({
                    subscriber_id: subscriber._id,
                    page_id: subscriber.pageId,
                    company_id: subscriber.companyId
                  }, (err, session) => {
                    if (err) {
                    }
                  })
                })
            })
        }
      })
    })
  })
}
