/**
 * Created by sojharo on 27/07/2017.
 */

// eslint-disable-next-line no-unused-vars
const logger = require('../../components/logger')
// eslint-disable-next-line no-unused-vars
const TAG = 'api/smart_replies/bots.controller.js'
const Bots = require('./Bots.model')
const Pages = require('../pages/Pages.model')
let request = require('request')
const WIT_AI_TOKEN = 'RQC4XBQNCBMPETVHBDV4A34WSP5G2PYL'
let utility = require('./../broadcasts/broadcasts.utility')

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
        logger.serverLog(TAG,
          'Error Occured In Getting Response From WIT.AI app')
      }

      logger.serverLog(TAG, `Response from Wit AI Bot ${JSON.stringify(JSON.parse(witres.body))}`)
      if (Object.keys(JSON.parse(witres.body).entities).length == 0) {
        logger.serverLog(TAG, 'No response found')
        Bots.findOneAndUpdate({_id: bot._id}, {$inc : {'missCount' : 1}}).exec((err, db_res) => {
            if (err) {
              throw err;
            }
            else {
              console.log(db_res);
            }
          })
        return {found: false, intent_name: 'Not Found'}
      }
      var intent = JSON.parse(witres.body).entities.intent[0]
      if (intent.confidence > 0.55) {
        logger.serverLog(TAG, 'Responding using bot: ' + intent.value)
        Bots.findOneAndUpdate({_id: bot._id}, {$inc : {'hitCount' : 1}}).exec((err, db_res) => {
            if (err) {
              throw err;
            }
            else {
              console.log(db_res);
            }
          })
        for (let i = 0; i < bot.payload.length; i++) {
          if (bot.payload[i].intent_name == intent.value) {
            sendMessenger(bot.payload[i].answer, pageId, senderId)
          }
        }
      }
    })
}

function sendMessenger (message, pageId, senderId) {
  let messageData = utility.prepareSendAPIPayload(
                senderId,
                 {'componentType': 'text', 'text': message + '  (This is an auto-generated message)'}, true)
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
}

exports.respond = function (payload) {
  // Need to extract the pageID and message from facebook and also the senderID
  // logger.serverLog(TAG, `Getting this in respond ${JSON.stringify(payload)}`)
  if (payload.object && payload.object !== 'page') {
    logger.serverLog(TAG, `Payload received is not for bot`)
    return
  }
  if(!payload.entry){
    logger.serverLog(TAG, `Payload received is not for bot does not contain entry`)
  	return
  }
  if(!payload.entry[0].messaging){
    logger.serverLog(TAG, `Payload received is not for bot does contain messaging field`)
  	return
  }
  if(!payload.entry[0].messaging[0]){
    logger.serverLog(TAG, `Payload received is not for bot does not contain messaging array`)
  	return
  }
  var messageDetails = payload.entry[0].messaging[0]
  var pageId = messageDetails.recipient.id
  var senderId = messageDetails.sender.id

  if(!messageDetails.message){
  	return
  }
  if (messageDetails.message.is_echo) {
    return
  }
  var text = messageDetails.message.text
  logger.serverLog(TAG, ' ' + pageId + ' ' + senderId + ' ' + text)
  Pages.findOne({pageId: pageId}, (err, page) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    Bots.findOne({pageId: page._id}, (err, bot) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
		// logger.serverLog(TAG, `Response for does bot exist ${JSON.stringify(bot)}`)
		// Return if no bot found
		if(!bot){
			return
		}
      if (bot.isActive === 'true') {
            // Write the bot response logic here
        logger.serverLog(TAG, 'Responding using the bot as status is Active')
        getWitResponse(text, bot.witToken, bot, pageId, senderId)
      }
    })
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
      return res.status(200).json({status: 'success', payload: bots })
    })
}

exports.create = function (req, res) {
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
              missCount: 0,
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
    console.log('affected rows %d', affected)
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
      if(bot.length == 0){
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
