/**
 * Created by sojharo on 27/07/2017.
 */

// eslint-disable-next-line no-unused-vars
const logger = require('../../components/logger')
// eslint-disable-next-line no-unused-vars
const TAG = 'api/smart_replies/bots.controller.js'
const Bots = require('./Bots.model')
const Pages = require('../pages/Pages.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const Subscribers = require('./../subscribers/Subscribers.model')
const TagsSubscribers = require('./../tags_subscribers/tags_subscribers.model')
const WaitingSubscribers = require('./waitingSubscribers.model')
const UnAnsweredQuestions = require('./unansweredQuestions.model')
let request = require('request')
const WIT_AI_TOKEN = 'RQC4XBQNCBMPETVHBDV4A34WSP5G2PYL'
let utility = require('./../broadcasts/broadcasts.utility')
const _ = require('lodash')

function transformPayload (payload) {
  var transformed = []
  for (var i = 0; i < payload.length; i++) {
    for (var j = 0; j < payload[i].questions.length; j++) {
      var sample = {}
      sample.text = payload[i].questions[j]
      sample.entities = [{
        entity: 'intent',
        value: payload[i].intent_name
      }]
      transformed.push(sample)
    }
  }
  return transformed
}

function getWitResponse (message, token, bot, pageId, senderId) {
  logger.serverLog(TAG, 'Trying to get a response from WIT AI')
  request(
    {
      'method': 'GET',
      'uri': 'https://api.wit.ai/message?v=20170307&q=' + message,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    },
    (err, witres) => {
      if (err) {
        logger.serverLog(TAG, 'Error Occured In Getting Response From WIT.AI app')
        return
      }
      if (!witres.body) {
        logger.serverLog(TAG, 'Error Occured In Getting Response From WIT.AI app')
        return
      }
      logger.serverLog(TAG, `Response from Wit AI Bot ${witres.body}`)
      let temp = JSON.parse(witres.body)
      if (Object.keys(JSON.parse(witres.body).entities).length === 0 || temp.entities.intent[0].confidence < 0.80) {
        logger.serverLog(TAG, 'No response found')
        Bots.findOneAndUpdate({_id: bot._id}, {$inc: {'missCount': 1}}).exec((err, dbRes) => {
          if (err) {
            throw err
          } else {
            // Will only run when the entities are not zero i.e. confidence is low
            let unansweredQuestion = {}
            if (!(Object.keys(JSON.parse(witres.body).entities).length === 0)) {
              console.log(dbRes)
              let temp = JSON.parse(witres.body)
              console.log({temp})

              unansweredQuestion.botId = bot._id
              unansweredQuestion.intentId = temp.entities.intent[0].value
              unansweredQuestion.Question = temp._text
              unansweredQuestion.Confidence = temp.entities.intent[0].confidence
            } else {
              unansweredQuestion.botId = bot._id
              unansweredQuestion.Question = temp._text
            }
            let obj = new UnAnsweredQuestions(unansweredQuestion)
            obj.save((err, result) => {
              if (err) {
                logger.serverLog(TAG, 'unable to insert record into Unanswered questions')
              }
              logger.serverLog(TAG, result)
            })
          }
        })
        return {found: false, intent_name: 'Not Found'}
      }
      var intent = JSON.parse(witres.body).entities.intent[0]
      if (intent.confidence > 0.80) {
        logger.serverLog(TAG, 'Responding using bot: ' + intent.value)
        Subscribers.findOne({'senderId': senderId}, (err, subscriber) => {
          if (err) {
            return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
          // Bot will not respond if a subscriber is waiting subscriber
          WaitingSubscribers.findOne({'subscriberId': subscriber._id}, (err, sub) => {
            if (err) {
              return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            }
            logger.serverLog(TAG, 'bot is ' + JSON.stringify(sub))
            // If sub not found, reply the answer
            if (!sub) {
              for (let i = 0; i < bot.payload.length; i++) {
                if (bot.payload[i].intent_name === intent.value) {
                  let postbackPayload = {
                    'action': 'waitingSubscriber',
                    'botId': bot._id,
                    'subscriberId': subscriber._id,
                    'pageId': pageId,
                    'intentId': intent.value,
                    'Question': temp._text
                  }
                  // Increase the hit count
                  Bots.findOneAndUpdate({_id: bot._id}, {$inc: {'hitCount': 1}}).exec((err, dbRes) => {
                    if (err) {
                      throw err
                    } else {
                      console.log(dbRes)
                    }
                  })
                  // send the message to sub
                  sendMessenger(bot.payload[i].answer, pageId, senderId, postbackPayload)
                }
              }
            } else {
              logger.serverLog(TAG, 'reply will no tbe send for waiting subscriber')
            }
          })
        })
      }
    })
}

function sendMessenger (message, pageId, senderId, postbackPayload) {
  Subscribers.findOne({senderId: senderId}, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      return
    }
    if (subscriber === null) {
      return
    }
    logger.serverLog(TAG, `Subscriber Info ${JSON.stringify(subscriber)}`)
    let messageData = utility.prepareSendAPIPayload(
                  senderId,
                   {'componentType': 'text', 'text': message + '  (Bot)', 'buttons': [{'type': 'postback', 'title': 'Talk to Agent', 'payload': JSON.stringify(postbackPayload)}]}, subscriber.firstName, subscriber.lastName, true)
    Pages.findOne({pageId: pageId}, (err, page) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      request(
        {
          'method': 'POST',
          'json': true,
          'formData': messageData,
          'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
                page.accessToken
        },
              (err, res) => {
                if (err) {
                  return logger.serverLog(TAG,
                    `At send message live chat ${JSON.stringify(err)}`)
                } else {
                  if (res.statusCode !== 200) {
                    logger.serverLog(TAG,
                      `At send message live chat response ${JSON.stringify(
                        res.body.error)}`)
                  } else {
                    logger.serverLog(TAG, 'Response sent to Messenger: ' + message)
                  }
                }
              })
    })
  })
}

exports.respond = function (pageId, senderId, text) {
  logger.serverLog(TAG, ' ' + pageId + ' ' + senderId + ' ' + text)
  Pages.find({pageId: pageId}, (err, page) => {
    if (err) {
      logger.serverLog(TAG, `ERROR PAGE ID ISSUE ${JSON.stringify(err)}`)
      return
    }
    logger.serverLog(TAG, `PAGES FETCHED ${JSON.stringify(page)}`)
    for (let i = 0; i < page.length; i++) {
      if (page[i] && page[i]._id) {
        Bots.findOne({pageId: page[i]._id}, (err, bot) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          } else {
            if (!bot) {
              logger.serverLog(TAG, `Couldnt find the bot while trying to respond ${page[i]._id}`)
            }
            if (bot && bot.isActive === 'true') {
                // Write the bot response logic here
              logger.serverLog(TAG, 'Responding using the bot as status is Active')
              getWitResponse(text, bot.witToken, bot, pageId, senderId)
            }
          }
        })
      }
    }
  })
}

// Not using this function for now we might later use it
function getEntities (payload) {
  var transformed = []
  for (var i = 0; i < payload.length; i++) {
    transformed.push(payload[i].intent_name)
  }
  logger.serverLog(TAG, `Entities extracted ${JSON.stringify(transformed)}`)
  return transformed
}

// Not using this function for now we might later use it
function trainingPipline (entities, payload, token) {
  for (let i = 0; i < entities.length; i++) {
    request(
      {
        'method': 'DELETE',
        'uri': 'https://api.wit.ai/entities/intent/values/' + entities[i] + '?v=20170307',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      },
        (err, witres) => {
          if (err) {
            logger.serverLog(TAG,
              'Error Occured In Training Pipeline in WIT.AI app')
          }
          if (i === entities.length - 1) {
            trainBot(payload, token)
          }

          logger.serverLog(TAG, `Response from Training Pipeline ${JSON.stringify(witres)}`)
        })
  }
}

function trainBot (payload, token) {
  var transformed = transformPayload(payload)
  logger.serverLog(TAG, `Payload Transformed ${JSON.stringify(transformed)}`)
  request(
    {
      'method': 'POST',
      'uri': 'https://api.wit.ai/samples?v=20170307',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: transformed,
      json: true
    },
        (err, witres) => {
          if (err) {
            return logger.serverLog(TAG,
              'Error Occured In Training WIT.AI app')
          }
          logger.serverLog(TAG,
              `WitAI bot trained successfully ${JSON.stringify(witres)}`)
        })
}

exports.index = function (req, res) {
  Bots
    .find({
      userId: req.user._id
    }).populate('pageId').exec((err, bots) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      return res.status(200).json({ status: 'success', payload: bots })
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, `Create bot payload receieved: ${JSON.stringify(req.body)}`)
  var uniquebotName = req.body.botName + req.user._id + Date.now()
  request(
    {
      'method': 'POST',
      'uri': 'https://api.wit.ai/apps?v=20170307',
      headers: {
        'Authorization': 'Bearer ' + WIT_AI_TOKEN,
        'Content-Type': 'application/json'
      },
      body: {
        'name': uniquebotName,
        'lang': 'en',
        'private': 'false'
      },
      json: true
    },
      (err, witres) => {
        if (err) {
          return logger.serverLog(TAG,
            'Error Occured In Creating WIT.AI app')
          // return res.status(500).json({status: 'failed', payload: {error: err}})
        } else {
          if (witres.statusCode !== 200) {
            logger.serverLog(TAG,
              `Error occurred in creating Wit ai app ${JSON.stringify(
                witres.body.errors)}`)
            return res.status(500).json({status: 'failed', payload: {error: witres.body.errors}})
          } else {
            logger.serverLog(TAG,
              'Wit.ai app created successfully', witres.body)

            const bot = new Bots({
              pageId: req.body.pageId, // TODO ENUMS
              userId: req.user._id,
              botName: req.body.botName,
              witAppId: witres.body.app_id,
              witToken: witres.body.access_token,
              witAppName: uniquebotName,
              isActive: req.body.isActive,
              hitCount: 0,
              missCount: 0
            })

            bot.save((err, newbot) => {
              if (err) {
                res.status(500).json({
                  status: 'Failed',
                  error: err,
                  description: 'Failed to insert record'
                })
              } else {
                return res.status(200).json({status: 'success', payload: newbot})
              }
            })
          }
        }
      })
}

exports.edit = function (req, res) {
  logger.serverLog(TAG,
              `Adding questions in edit bot ${JSON.stringify(req.body)}`)
  Bots.update({_id: req.body.botId}, {payload: req.body.payload}, (err, affected) => {
    if (err) {
      return logger.serverLog(TAG, 'Error Occured In editing the bot')
    }
    console.log('affected rows %d', affected)
    Bots
    .find({
      _id: req.body.botId
    }).populate('pageId').exec((err, bot) => {
      if (err) {
        return logger.serverLog(TAG, 'Error Occured In editing the bot')
      }
      logger.serverLog(TAG,
              `returning Bot details ${JSON.stringify(bot)}`)
      var entities = getEntities(req.body.payload)
      trainingPipline(entities, req.body.payload, bot[0].witToken)
      // trainBot(req.body.payload, bot[0].witToken)
    })

    return res.status(200).json({status: 'success'})
  })
}

exports.status = function (req, res) {
  logger.serverLog(TAG,
              `Updating bot status ${JSON.stringify(req.body)}`)
  Bots.update({_id: req.body.botId}, {isActive: req.body.isActive}, function (err, affected) {
    if (err) {
      return logger.serverLog(TAG, 'Error Occured In status')
    }
    console.log('affected rows %d', affected)
    return res.status(200).json({status: 'success'})
  })
}

exports.details = function (req, res) {
  logger.serverLog(TAG,
              `Bot details are following ${JSON.stringify(req.body)}`)
  Bots
    .find({
      _id: req.body.botId
    }).populate('pageId').exec((err, bot) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      logger.serverLog(TAG,
              `returning Bot details ${JSON.stringify(bot)}`)
      return res.status(200).json({status: 'success', payload: bot[0]})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG,
              `Deleting a bot ${JSON.stringify(req.body)}`)
  Bots
    .find({
      _id: req.body.botId
    }).populate('pageId').exec((err, bot) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      logger.serverLog(TAG,
              `Deleting Bot details on WitAI ${JSON.stringify(bot)}`)
      if (bot.length === 0) {
        logger.serverLog(TAG,
              `Cannot find a bot to delete`)
        return
      }

      request(
        {
          'method': 'DELETE',
          'uri': 'https://api.wit.ai/apps/' + bot[0].witAppId,
          headers: {
            'Authorization': 'Bearer ' + WIT_AI_TOKEN
          }
        },
         (err, witres) => {
           if (err) {
             logger.serverLog(TAG,
               'Error Occured In Deleting WIT.AI app')
             return res.status(500).json({status: 'failed', payload: {error: err}})
           } else {
             if (witres.statusCode !== 200) {
               logger.serverLog(TAG,
                 `Error Occured in deleting Wit ai app ${JSON.stringify(
                   witres.body)}`)
               return res.status(500).json({status: 'failed', payload: {error: witres.body.errors}})
             } else {
               logger.serverLog(TAG,
                 'Wit.ai app deleted successfully', witres.body)

               Bots.remove({
                 _id: req.body.botId
               }, function (err, _) {
                 if (err) return res.status(500).json({status: 'failed', payload: err})
                 return res.status(200).json({status: 'success'})
               })

               logger.serverLog(TAG,
                 'Bot Deleted From Database as well')
             }
           }
         })
    })
}

exports.waitingReply = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email},
    (err, companyUser) => {
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
      Subscribers.find({
        companyId: companyUser.companyId,
        isEnabledByPage: true,
        isSubscribed: true
      }).populate('pageId').exec((err, subscribers) => {
        if (err) {
          logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
          return res.status(404)
            .json({status: 'failed', description: 'Subscribers not found'})
        }
        let subsArray = []
        let subscribersPayload = []
        for (let i = 0; i < subscribers.length; i++) {
          subsArray.push(subscribers[i]._id)
          subscribersPayload.push({
            _id: subscribers[i]._id,
            firstName: subscribers[i].firstName,
            lastName: subscribers[i].lastName,
            locale: subscribers[i].locale,
            gender: subscribers[i].gender,
            timezone: subscribers[i].timezone,
            profilePic: subscribers[i].profilePic,
            companyId: subscribers[i].companyId,
            pageScopedId: '',
            email: '',
            senderId: subscribers[i].senderId,
            pageId: subscribers[i].pageId,
            datetime: subscribers[i].datetime,
            isEnabledByPage: subscribers[i].isEnabledByPage,
            isSubscribed: subscribers[i].isSubscribed,
            phoneNumber: subscribers[i].phoneNumber,
            unSubscribedBy: subscribers[i].unSubscribedBy,
            tags: [],
            source: subscribers[i].source
          })
        }
        TagsSubscribers.find({subscriberId: {$in: subsArray}})
          .populate('tagId')
          .exec((err, tags) => {
            if (err) {
              logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
              return res.status(404)
                .json({status: 'failed', description: 'Subscribers not found'})
            }
            for (let i = 0; i < subscribers.length; i++) {
              for (let j = 0; j < tags.length; j++) {
                if (subscribers[i]._id.toString() === tags[j].subscriberId.toString()) {
                  subscribersPayload[i].tags.push(tags[j].tagId.tag)
                }
              }
            }
            res.status(200).json({ status: 'success', payload: subscribersPayload })
          })
      })
    })
}

exports.unAnsweredQueries = function (req, res) {
  logger.serverLog(TAG, `Fetching unanswered queries ${JSON.stringify(req.body)}`)
  UnAnsweredQuestions.find({botId: req.body.botId})
  .populate('botId')
  .exec((err, queries) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    if (queries) {
      return res.status(200).json({ status: 'success', payload: queries })
    }
  })
}

exports.waitSubscribers = function (req, res) {
  logger.serverLog(TAG, `Fetching waiting subscribers ${JSON.stringify(req.body)}`)
  WaitingSubscribers.find({botId: req.body.botId})
  .populate('botId pageId subscriberId')
  .exec((err, subscribers) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    if (subscribers) {
      return res.status(200).json({ status: 'success', payload: subscribers })
    }
  })
}

exports.removeWaitSubscribers = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, '_id')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }
  logger.serverLog(TAG, `going to delete waiting subscribers ${JSON.stringify(req.body)}`)
  WaitingSubscribers.deleteOne({_id: req.body._id}, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    if (result) {
      return res.status(200).json({ status: 'success', payload: result })
    }
  })
}
