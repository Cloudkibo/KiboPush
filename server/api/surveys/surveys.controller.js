/* eslint-disable camelcase */
/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Surveys = require('./surveys.model')
const SurveyQuestions = require('./surveyquestions.model')
const SurveyResponses = require('./surveyresponse.model')
const SurveyPage = require('../page_survey/page_survey.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const TAG = 'api/surveys/surveys.controller.js'
const mongoose = require('mongoose')
const Lists = require('../lists/lists.model')
const Users = require('./../user/Users.model')

let _ = require('lodash')

const needle = require('needle')
const Pages = require('../pages/Pages.model')
const Subscribers = require('../subscribers/Subscribers.model')

exports.index = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    Surveys.find({companyId: companyUser.companyId}, (err, surveys) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      SurveyPage.find({companyId: companyUser.companyId}, (err, surveypages) => {
        if (err) {
          return res.status(404)
          .json({status: 'failed', description: 'Surveys not found'})
        }
        Surveys.find({}, {_id: 1, isresponded: 1}, (err2, responsesCount) => {
          if (err2) {
            return res.status(404)
            .json({status: 'failed', description: 'responses count not found'})
          }
          res.status(200).json({
            status: 'success',
            payload: {surveys, surveypages, responsesCount}
          })
        })
      })
    })
  })
}

exports.create = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    let surveyPayload = {
      title: req.body.survey.title,
      description: req.body.survey.description,
      userId: req.user._id,
      companyId: companyUser.companyId,
      isresponded: 0
    }
    if (req.body.isSegmented) {
      surveyPayload.isSegmented = true
      surveyPayload.segmentationPageIds = (req.body.segmentationPageIds)
        ? req.body.segmentationPageIds
        : null
      surveyPayload.segmentationGender = (req.body.segmentationGender)
        ? req.body.segmentationGender
        : null
      surveyPayload.segmentationLocale = (req.body.segmentationLocale)
        ? req.body.segmentationLocale
        : null
    }
    if (req.body.isList) {
      surveyPayload.isList = true
      surveyPayload.segmentationList = (req.body.segmentationList)
        ? req.body.segmentationList
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
        })
      }
      require('./../../config/socketio').sendMessageToClient({
        room_id: companyUser.companyId,
        body: {
          action: 'survey_created',
          payload: {
            survey_id: survey._id,
            user_id: req.user._id,
            user_name: req.user.name,
            company_id: companyUser.companyId
          }
        }
      })
      return res.status(201).json({status: 'success', payload: survey})
    })
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
  //  Surveys.update({ _id: mongoose.Types.ObjectId(req.body.surveyId) }, { $set: { isresponded: true } })
  Surveys.update({_id: mongoose.Types.ObjectId(req.body.surveyId)}, {$inc: {isresponded: 1}})
  return res.status(200)
    .json({status: 'success', payload: 'Response submitted successfully'})
}
function exists (list, content) {
  for (let i = 0; i < list.length; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(content)) {
      return true
    }
  }
  return false
}
exports.send = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }

    /* Getting the company user who has connected the facebook account */
    Pages.findOne({companyId: companyUser.companyId, connected: true}, (err, userPage) => {
      if (err) {
        logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }

      Users.findOne({_id: userPage.userId}, (err, connectedUser) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        var currentUser
        if (req.user.facebookInfo) {
          currentUser = req.user
        } else {
          currentUser = connectedUser
        }
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
          Surveys.findOne({_id: req.body._id}, (err, survey) => {
            if (err) {
              return logger.serverLog(TAG,
              `At surveys ${JSON.stringify(err)}`)
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
                    userToken: currentUser.facebookInfo.fbToken
                  })
                })
              }

              let pagesFindCriteria = {companyId: companyUser.companyId, connected: true}
              if (req.body.isSegmented) {
                if (req.body.segmentationPageIds.length > 0) {
                  pagesFindCriteria = _.merge(pagesFindCriteria, {
                    pageId: {
                      $in: req.body.segmentationPageIds
                    }
                  })
                }
              }
              Pages.find(pagesFindCriteria).populate('userId').exec((err, pages) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
                for (let z = 0; z < pages.length; z++) {
                  if (req.body.isList === true) {
                    let ListFindCriteria = {}
                    ListFindCriteria = _.merge(ListFindCriteria,
                      {
                        _id: {
                          $in: req.body.segmentationList
                        }
                      })
                    Lists.find(ListFindCriteria, (err, lists) => {
                      if (err) {
                        return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                      }
                      let subsFindCriteria = {pageId: pages[z]._id}
                      let listData = []
                      if (lists.length > 1) {
                        for (let i = 0; i < lists.length; i++) {
                          for (let j = 0; j < lists[i].content.length; j++) {
                            if (exists(listData, lists[i].content[j]) === false) {
                              listData.push(lists[i].content[j])
                            }
                          }
                        }
                        subsFindCriteria = _.merge(subsFindCriteria, {
                          _id: {
                            $in: listData
                          }
                        })
                      } else {
                        subsFindCriteria = _.merge(subsFindCriteria, {
                          _id: {
                            $in: lists[0].content
                          }
                        })
                      }
                      Subscribers.find(subsFindCriteria, (err, subscribers) => {
                        if (err) {
                          return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                        }

                        needle.get(
                        `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                        (err, resp) => {
                          if (err) {
                            logger.serverLog(TAG,
                            `Page access token from graph api error ${JSON.stringify(
                            err)}`)
                          }

                          for (let j = 0; j < subscribers.length; j++) {
                            const messageData = {
                              attachment: {
                                type: 'template',
                                payload: {
                                  template_type: 'button',
                                  text: `${survey.description}\nPlease respond to these questions. \n${first_question.statement}`,
                                  buttons
                                }
                              }
                            }
                            const data = {
                              recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                              message: messageData
                            }
                            needle.post(
                            `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                            data, (err, resp) => {
                              if (err) {
                                return res.status(500).json({
                                  status: 'failed',
                                  description: JSON.stringify(err)
                                })
                              }
                              let surveyPage = new SurveyPage({
                                pageId: pages[z].pageId,
                                userId: req.user._id,
                                subscriberId: subscribers[j].senderId,
                                surveyId: req.body._id,
                                seen: false,
                                companyId: companyUser.companyId
                              })

                              surveyPage.save((err2) => {
                                if (err2) {
                                  logger.serverLog(TAG, {
                                    status: 'failed',
                                    description: 'PollBroadcast create failed',
                                    err2
                                  })
                                }
                              })
                            })
                          }
                        })
                      })
                    })
                  } else {
                    let subscriberFindCriteria = {
                      pageId: pages[z]._id,
                      isSubscribed: true
                    }
                    if (req.body.isSegmented) {
                      if (req.body.segmentationGender.length > 0) {
                        subscriberFindCriteria = _.merge(subscriberFindCriteria,
                          {
                            gender: {
                              $in: req.body.segmentationGender
                            }
                          })
                      }
                      if (req.body.segmentationLocale.length > 0) {
                        subscriberFindCriteria = _.merge(subscriberFindCriteria, {
                          locale: {
                            $in: req.body.segmentationLocale
                          }
                        })
                      }
                    }
                    Subscribers.find(subscriberFindCriteria, (err, subscribers) => {
                      if (err) {
                        return res.status(404)
                        .json({status: 'failed', description: 'Subscribers not found'})
                      }

                      needle.get(
                      `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                      (err, resp) => {
                        if (err) {
                          logger.serverLog(TAG,
                          `Page access token from graph api error ${JSON.stringify(
                          err)}`)
                        }

                        for (let j = 0; j < subscribers.length; j++) {
                          const messageData = {
                            attachment: {
                              type: 'template',
                              payload: {
                                template_type: 'button',
                                text: `${survey.description}\nPlease respond to these questions. \n${first_question.statement}`,
                                buttons
                              }
                            }
                          }
                          const data = {
                            recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                            message: messageData
                          }
                          needle.post(
                          `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                          data, (err, resp) => {
                            if (err) {
                              return res.status(500).json({
                                status: 'failed',
                                description: JSON.stringify(err)
                              })
                            }
                            let surveyPage = new SurveyPage({
                              pageId: pages[z].pageId,
                              userId: req.user._id,
                              subscriberId: subscribers[j].senderId,
                              surveyId: req.body._id,
                              seen: false,
                              companyId: companyUser.companyId
                            })

                            surveyPage.save((err2) => {
                              if (err2) {
                                logger.serverLog(TAG, {
                                  status: 'failed',
                                  description: 'PollBroadcast create failed',
                                  err2
                                })
                              }
                              // not using now
                              // Sessions.findOne({
                              //   subscriber_id: subscribers[j]._id,
                              //   page_id: pages[z]._id,
                              //   company_id: pages[z].userId._id
                              // }, (err, session) => {
                              //   if (err) {
                              //     return logger.serverLog(TAG,
                              //       `At get session ${JSON.stringify(err)}`)
                              //   }
                              //   if (!session) {
                              //     return logger.serverLog(TAG,
                              //       `No chat session was found for surveys`)
                              //   }
                              //   const chatMessage = new LiveChat({
                              //     sender_id: pages[z]._id, // this is the page id: _id of Pageid
                              //     recipient_id: subscribers[j]._id, // this is the subscriber id: _id of subscriberId
                              //     sender_fb_id: pages[z].pageId, // this is the (facebook) :page id of pageId
                              //     recipient_fb_id: subscribers[j].senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                              //     session_id: session._id,
                              //     company_id: pages[z].userId._id, // this is admin id till we have companies
                              //     payload: {
                              //       componentType: 'survey',
                              //       payload: messageData
                              //     }, // this where message content will go
                              //     status: 'unseen' // seen or unseen
                              //   })
                              //   chatMessage.save((err, chatMessageSaved) => {
                              //     if (err) {
                              //       return logger.serverLog(TAG,
                              //         `At save chat${JSON.stringify(err)}`)
                              //     }
                              //     logger.serverLog(TAG,
                              //       'Chat message saved for surveys sent')
                              //   })
                              // })
                            })
                          })
                        }
                      })
                    })
                  }
                }
                return res.status(200)
                .json({status: 'success', payload: 'Survey sent successfully.'})
              })
            } else {
              return res.status(404)
              .json({status: 'failed', description: 'Survey Questions not found'})
            }
          })
        })
      })
    })
  })
}
exports.sendSurvey = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    let surveyPayload = {
      title: req.body.survey.title,
      description: req.body.survey.description,
      userId: req.user._id,
      companyId: companyUser.companyId,
      isresponded: 0
    }
    if (req.body.isSegmented) {
      surveyPayload.isSegmented = true
      surveyPayload.segmentationPageIds = (req.body.segmentationPageIds)
        ? req.body.segmentationPageIds
        : null
      surveyPayload.segmentationGender = (req.body.segmentationGender)
        ? req.body.segmentationGender
        : null
      surveyPayload.segmentationLocale = (req.body.segmentationLocale)
        ? req.body.segmentationLocale
        : null
    }
    if (req.body.isList) {
      surveyPayload.isList = true
      surveyPayload.segmentationList = (req.body.segmentationList)
        ? req.body.segmentationList
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
        })
      }
      require('./../../config/socketio').sendMessageToClient({
        room_id: companyUser.companyId,
        body: {
          action: 'survey_created',
          payload: {
            survey_id: survey._id,
            user_id: req.user._id,
            user_name: req.user.name,
            company_id: companyUser.companyId
          }
        }
      })
      Pages.findOne({companyId: companyUser.companyId, connected: true}, (err, userPage) => {
        if (err) {
          logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }

        Users.findOne({_id: userPage.userId}, (err, connectedUser) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          var currentUser
          if (req.user.facebookInfo) {
            currentUser = req.user
          } else {
            currentUser = connectedUser
          }
          /*
          Expected request body
          { platform: 'facebook',statement: req.body.statement,options: req.body.options,sent: 0 });
          */
          // we will send only first question to fb subsribers
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
            Surveys.findOne({_id: survey._id}, (err, survey) => {
              if (err) {
                return logger.serverLog(TAG,
                `At surveys ${JSON.stringify(err)}`)
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
                      survey_id: survey._id,
                      option: first_question.options[x],
                      question_id: first_question._id,
                      next_question_id,
                      userToken: currentUser.facebookInfo.fbToken
                    })
                  })
                }

                let pagesFindCriteria = {companyId: companyUser.companyId, connected: true}
                if (req.body.isSegmented) {
                  if (req.body.segmentationPageIds.length > 0) {
                    pagesFindCriteria = _.merge(pagesFindCriteria, {
                      pageId: {
                        $in: req.body.segmentationPageIds
                      }
                    })
                  }
                }
                Pages.find(pagesFindCriteria).populate('userId').exec((err, pages) => {
                  if (err) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Internal Server Error ${JSON.stringify(err)}`
                    })
                  }
                  for (let z = 0; z < pages.length; z++) {
                    if (req.body.isList === true) {
                      let ListFindCriteria = {}
                      ListFindCriteria = _.merge(ListFindCriteria,
                        {
                          _id: {
                            $in: req.body.segmentationList
                          }
                        })
                      Lists.find(ListFindCriteria, (err, lists) => {
                        if (err) {
                          return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                        }
                        let subsFindCriteria = {pageId: pages[z]._id}
                        let listData = []
                        if (lists.length > 1) {
                          for (let i = 0; i < lists.length; i++) {
                            for (let j = 0; j < lists[i].content.length; j++) {
                              if (exists(listData, lists[i].content[j]) === false) {
                                listData.push(lists[i].content[j])
                              }
                            }
                          }
                          subsFindCriteria = _.merge(subsFindCriteria, {
                            _id: {
                              $in: listData
                            }
                          })
                        } else {
                          subsFindCriteria = _.merge(subsFindCriteria, {
                            _id: {
                              $in: lists[0].content
                            }
                          })
                        }
                        Subscribers.find(subsFindCriteria, (err, subscribers) => {
                          if (err) {
                            return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                          }

                          needle.get(
                          `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                          (err, resp) => {
                            if (err) {
                              logger.serverLog(TAG,
                              `Page access token from graph api error ${JSON.stringify(
                              err)}`)
                            }

                            for (let j = 0; j < subscribers.length; j++) {
                              const messageData = {
                                attachment: {
                                  type: 'template',
                                  payload: {
                                    template_type: 'button',
                                    text: `${survey.description}\nPlease respond to these questions. \n${first_question.statement}`,
                                    buttons
                                  }
                                }
                              }
                              const data = {
                                recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                                message: messageData
                              }
                              needle.post(
                              `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                              data, (err, resp) => {
                                if (err) {
                                  return res.status(500).json({
                                    status: 'failed',
                                    description: JSON.stringify(err)
                                  })
                                }
                                let surveyPage = new SurveyPage({
                                  pageId: pages[z].pageId,
                                  userId: req.user._id,
                                  subscriberId: subscribers[j].senderId,
                                  surveyId: survey._id,
                                  seen: false,
                                  companyId: companyUser.companyId
                                })

                                surveyPage.save((err2) => {
                                  if (err2) {
                                    logger.serverLog(TAG, {
                                      status: 'failed',
                                      description: 'PollBroadcast create failed',
                                      err2
                                    })
                                  }
                                })
                              })
                            }
                          })
                        })
                      })
                    } else {
                      let subscriberFindCriteria = {
                        pageId: pages[z]._id,
                        isSubscribed: true
                      }
                      if (req.body.isSegmented) {
                        if (req.body.segmentationGender.length > 0) {
                          subscriberFindCriteria = _.merge(subscriberFindCriteria,
                            {
                              gender: {
                                $in: req.body.segmentationGender
                              }
                            })
                        }
                        if (req.body.segmentationLocale.length > 0) {
                          subscriberFindCriteria = _.merge(subscriberFindCriteria, {
                            locale: {
                              $in: req.body.segmentationLocale
                            }
                          })
                        }
                      }
                      Subscribers.find(subscriberFindCriteria, (err, subscribers) => {
                        if (err) {
                          return res.status(404)
                          .json({status: 'failed', description: 'Subscribers not found'})
                        }

                        needle.get(
                        `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                        (err, resp) => {
                          if (err) {
                            logger.serverLog(TAG,
                            `Page access token from graph api error ${JSON.stringify(
                            err)}`)
                          }

                          for (let j = 0; j < subscribers.length; j++) {
                            const messageData = {
                              attachment: {
                                type: 'template',
                                payload: {
                                  template_type: 'button',
                                  text: `${survey.description}\nPlease respond to these questions. \n${first_question.statement}`,
                                  buttons
                                }
                              }
                            }
                            const data = {
                              recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                              message: messageData
                            }
                            needle.post(
                            `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                            data, (err, resp) => {
                              if (err) {
                                return res.status(500).json({
                                  status: 'failed',
                                  description: JSON.stringify(err)
                                })
                              }
                              let surveyPage = new SurveyPage({
                                pageId: pages[z].pageId,
                                userId: req.user._id,
                                subscriberId: subscribers[j].senderId,
                                surveyId: survey._id,
                                seen: false,
                                companyId: companyUser.companyId
                              })

                              surveyPage.save((err2) => {
                                if (err2) {
                                  logger.serverLog(TAG, {
                                    status: 'failed',
                                    description: 'PollBroadcast create failed',
                                    err2
                                  })
                                }
                              })
                            })
                          }
                        })
                      })
                    }
                  }
                  return res.status(200)
                  .json({status: 'success', payload: 'Survey sent successfully.'})
                })
              } else {
                return res.status(404)
                .json({status: 'failed', description: 'Survey Questions not found'})
              }
            })
          })
        })
      })
    })
  })
}

exports.deleteSurvey = function (req, res) {
  Surveys.findById(req.params.id, (err, survey) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!survey) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    survey.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'survey update failed'})
      }
      SurveyPage.find({surveyId: req.params.id}, (err, surveypages) => {
        if (err) {
          return res.status(404)
          .json({status: 'failed', description: 'Polls not found'})
        }
        surveypages.forEach(surveypage => {
          surveypage.remove((err2) => {
            if (err2) {
              return res.status(500)
                .json({status: 'failed', description: 'poll update failed'})
            }
          })
        })
        SurveyResponses.find({surveyId: req.params.id}, (err, surveyresponses) => {
          if (err) {
            return res.status(404)
            .json({status: 'failed', description: 'Polls not found'})
          }
          surveyresponses.forEach(surveyresponse => {
            surveyresponse.remove((err2) => {
              if (err2) {
                return res.status(500)
                  .json({status: 'failed', description: 'poll update failed'})
              }
            })
          })
          SurveyQuestions.find({surveyId: req.params.id}, (err, surveyquestions) => {
            if (err) {
              return res.status(404)
              .json({status: 'failed', description: 'Polls not found'})
            }
            surveyquestions.forEach(surveyquestion => {
              surveyquestion.remove((err2) => {
                if (err2) {
                  return res.status(500)
                    .json({status: 'failed', description: 'poll update failed'})
                }
              })
            })
            return res.status(200)
            .json({status: 'success'})
          })
        })
      })
    })
  })
}
