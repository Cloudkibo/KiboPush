/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Broadcasts = require('./broadcasts.model')
const Pages = require('../pages/Pages.model')
const PollResponse = require('../polls/pollresponse.model')
const SurveyResponse = require('../surveys/surveyresponse.model')
const BroadcastPage = require('../page_broadcast/page_broadcast.model')
const SurveyQuestions = require('../surveys/surveyquestions.model')
const Subscribers = require('../subscribers/Subscribers.model')
const Workflows = require('../workflows/Workflows.model')
let _ = require('lodash')
const TAG = 'api/broadcast/broadcasts.controller.js'
const needle = require('needle')
const path = require('path')
const fs = require('fs')
let request = require('request')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Broadcasts get api is working')
  Broadcasts.find({userId: req.user._id}, (err, broadcasts) => {
    if (err) {
      return res.status(404)
        .json({status: 'failed', description: 'Broadcasts not found'})
    }
    logger.serverLog(TAG, `Total broadcasts ${broadcasts.length}`)
    BroadcastPage.find({userId: req.user._id}, (err, broadcastpages) => {
      if (err) {
        return res.status(404)
          .json({status: 'failed', description: 'Broadcasts not found'})
      }
      res.status(200).json({
        status: 'success',
        payload: {broadcasts: broadcasts, broadcastpages: broadcastpages}
      })
    })
  })
}

exports.deletefile = function (req, res) {
  logger.serverLog(TAG,
    `Inside deletefile file Broadcast, req body = ${JSON.stringify(req.body)}`)
  // unlink file
  fs.unlink(req.body.fileurl, function (err) {
    if (err) {
      logger.serverLog(TAG, err)
      return res.status(404)
        .json({status: 'failed', description: 'File not found'})
    } else {
      logger.serverLog(TAG, 'file deleted')
      return res.status(200)
        .json({status: 'failed', payload: 'File deleted successfully'})
    }
  })
}

exports.uploadfile = function (req, res) {
  logger.serverLog(TAG,
    `Inside Upload file Broadcast, req body = ${JSON.stringify(req.body)}`)

  if (req.body) {
    // var serverPath = req.files.file.name
    let today = new Date()
    let uid = Math.random().toString(36).substring(7)

    let uniqueId = 'f' + uid + '' + today.getFullYear() + '' +
      (today.getMonth() + 1) + '' + today.getDate() + '' + today.getHours() +
      '' + today.getMinutes() + '' + today.getSeconds()
    let serverPath = uniqueId
    let fext = req.files.file.name.split('.')
    serverPath += '.' + fext[fext.length - 1]

    console.log(__dirname)
    var dir = path.resolve(__dirname, '../../../broadcastFiles/')

    if (req.files.file.size === 0) {
      return res.status(400).json({
        status: 'failed',
        description: 'No file submitted'
      })
    }

    fs.readFile(req.files.file.path, function (err, data) {
      var pathNew = dir + '/userfiles/' + serverPath
      if (!err) {
        fs.writeFile(pathNew, data, function (err) {
          console.log('Error' + err)

          if (!err) {
            let obj = JSON.parse(req.body.broadcast)
            logger.serverLog(TAG, `Inside Obj, obj = ${JSON.stringify(obj)}`)

            obj.fileurl = pathNew

            // save broadcast item
            let broadcastPayload = {
              platform: obj.platform,
              type: obj.type,
              text: obj.text,
              userId: req.user._id,
              fileurl: obj.fileurl,
              sent: 0,
              tapped: 0,
              attachmentType: obj.attachmentType
            }
            if (req.body.isSegmented) {
              broadcastPayload.isSegmented = true
              broadcastPayload.segmentationPageIds = (req.body.pageIds)
                ? req.body.pageIds
                : null
              broadcastPayload.segmentationGender = (req.body.gender)
                ? req.body.gender
                : null
              broadcastPayload.segmentationLocale = (req.body.locale)
                ? req.body.locale
                : null
            }
            const broadcast = new Broadcasts(broadcastPayload)
            Broadcasts.create(broadcast, (err2, broadcastt) => {
              if (err2) {
                return res.status(404).json({
                  status: 'failed',
                  description: 'Broadcasts not created'
                })
              }

              let pagesFindCriteria = {userId: req.user._id, connected: true}
              if (req.body.isSegmented) {
                if (req.body.pageIds) {
                  _.merge(pagesFindCriteria, {
                    pageId: {
                      $in: req.body.pageIds
                    }
                  })
                }
              }
              Pages.find(pagesFindCriteria, (err, pages) => {
                if (err) {
                  logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                  return res.status(404)
                    .json({status: 'failed', description: 'Pages not found'})
                }

                pages.forEach(page => {
                  logger.serverLog(TAG,
                    `Page in the loop ${JSON.stringify(page)}`)

                  let subscriberFindCriteria = {
                    pageId: page._id,
                    isSubscribed: true
                  }
                  if (req.body.isSegmented) {
                    if (req.body.gender) {
                      _.merge(subscriberFindCriteria,
                        {gender: req.body.gender.toLowerCase()})
                    }
                    if (req.body.locale) {
                      _.merge(subscriberFindCriteria, {locale: req.body.locale})
                    }
                  }
                  Subscribers.find(subscriberFindCriteria,
                    (err, subscribers) => {
                      if (err) {
                        return logger.serverLog(TAG,
                          `Error ${JSON.stringify(err)}`)
                      }

                      if (broadcastt.text !== '') {
                        subscribers.forEach(subscriber => {
                          logger.serverLog(TAG,
                            `At Subscriber fetched ${JSON.stringify(
                              subscriber)}`)
                          var messageData = {
                            'recipient': JSON.stringify({
                              'id': subscriber.senderId
                            }),
                            'message': JSON.stringify({
                              'text': broadcastt.text,
                              'metadata': 'This is a meta data'
                            })
                          }

                          request({
                            'method': 'POST',
                            'json': true,
                            'formData': messageData,
                            'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
                              page.accessToken
                          },
                            function (err, res, body) {
                              //* **
                              if (err) {
                                return logger.serverLog(TAG,
                                  `At send message broadcast ${JSON.stringify(
                                    err)}`)
                              }
                              // sent_count = sent_count + 1
                              logger.serverLog(TAG,
                                'Sent broadcast to subscriber response')
                              // update broadcast sent field
                              var pagebroadcast = new BroadcastPage({
                                pageId: page.pageId,
                                userId: req.user._id,
                                subscriberId: subscriber.senderId,
                                broadcastId: broadcastt._id,
                                seen: false
                              })
                              pagebroadcast.save((err2, pagebroadcastsaved) => {
                                if (err2) {
                                  return res.status(500).json({
                                    status: 'failed',
                                    description: 'PageBroadcast create failed'
                                  })
                                }
                                logger.serverLog(TAG,
                                  'PageBroadcast saved' +
                                  JSON.stringify(pagebroadcastsaved))
                              })
                            })
                        })
                        subscribers.forEach(subscriber => {
                          logger.serverLog(TAG,
                            `At Subscriber fetched ${JSON.stringify(
                              subscriber)}`)

                          var messageData = {}

                          if (broadcastt.type === 'attachment') {
                            var fileReaderStream = fs.createReadStream(
                              broadcastt.fileurl)

                            messageData = {
                              'recipient': JSON.stringify({
                                'id': subscriber.senderId
                              }),
                              'message': JSON.stringify({
                                'attachment': {
                                  'type': broadcastt.attachmentType,
                                  'payload': {}
                                }
                              }),
                              'filedata': fileReaderStream
                            }
                          }

                          logger.serverLog(TAG, 'Inside File READER Stream')
                          logger.serverLog(TAG, fileReaderStream[0])

                          console.log('Inside File READER Stream')
                          console.log(fileReaderStream)

                          request({
                            'method': 'POST',
                            'json': true,
                            'formData': messageData,
                            'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
                            page.accessToken
                          }, function (err, res, body) {
                            //* **
                            if (err) {
                              return logger.serverLog(TAG,
                                `At send message broadcast ${JSON.stringify(
                                  err2)}`)
                            }
                            logger.serverLog(TAG,
                              `Sent broadcast to subscriber response ${JSON.stringify(
                                body)}`)

                            // update broadcast sent field
                            // update broadcast sent field
                            var pagebroadcast = new BroadcastPage({
                              pageId: page.pageId,
                              userId: req.user._id,
                              subscriberId: subscriber.senderId,
                              broadcastId: broadcastt._id,
                              seen: false
                            })
                            pagebroadcast.save((err2, pagebroadcastsaved) => {
                              if (err2) {
                                return res.status(500).json({
                                  status: 'failed',
                                  description: 'PageBroadcast create failed'
                                })
                              }
                              logger.serverLog(TAG, 'PageBroadcast saved' +
                                JSON.stringify(pagebroadcastsaved))
                            })
                          })
                        })
                      } else {
                        subscribers.forEach(subscriber => {
                          logger.serverLog(TAG,
                            `At Subscriber fetched ${JSON.stringify(
                              subscriber)}`)

                          var messageData = {}

                          if (broadcastt.type === 'attachment') {
                            var fileReaderStream = fs.createReadStream(
                              broadcastt.fileurl)

                            messageData = {
                              'recipient': JSON.stringify({
                                'id': subscriber.senderId
                              }),
                              'message': JSON.stringify({
                                'attachment': {
                                  'type': broadcastt.attachmentType,
                                  'payload': {}
                                }
                              }),

                              'filedata': fileReaderStream
                            }
                          }
                          logger.serverLog(TAG, 'Inside File READER Stream')
                          logger.serverLog(TAG, fileReaderStream)
                          console.log('Inside File READER Stream')
                          console.log(fileReaderStream)

                          request({
                            'method': 'POST',
                            'json': true,
                            'formData': messageData,
                            'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
                            page.accessToken
                          }, function (err, res, body) {
                            //* **
                            if (err) {
                              return logger.serverLog(TAG,
                                `At send message broadcast ${JSON.stringify(
                                  err2)}`)
                            }
                            logger.serverLog(TAG,
                              `Sent broadcast to subscriber response ${JSON.stringify(
                                body)}`)

                            // update broadcast sent field
                            // update broadcast sent field
                            var pagebroadcast = new BroadcastPage({
                              pageId: page.pageId,
                              userId: req.user._id,
                              subscriberId: subscriber.senderId,
                              broadcastId: broadcastt._id,
                              seen: false
                            })
                            pagebroadcast.save((err2, pagebroadcastsaved) => {
                              if (err2) {
                                return res.status(500).json({
                                  status: 'failed',
                                  description: 'PageBroadcast create failed'
                                })
                              }
                              logger.serverLog(TAG, 'PageBroadcast saved' +
                                JSON.stringify(pagebroadcastsaved))
                            })
                          })
                        })
                      }
                    })
                })

                return res.status(200)
                  .json({status: 'success', payload: {broadcast: broadcastt}})
              })
            })
          }
        })
      }
    })
  } else {
    return res.status(400)
      .json({status: 'failed', description: 'File data empty'})
  }
}
// Get a single broadcast
exports.show = function (req, res) {
  Broadcasts.findById(req.params.id)
    .populate('userId')
    .exec((err, broadcast) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!broadcast) {
        return res.status(404)
          .json({status: 'failed', description: 'Broadcast not found'})
      }
      return res.status(200).json({status: 'success', payload: broadcast})
    })
}

exports.download = function (req, res) {
  Broadcasts.findById(req.params.id)
    .populate('userId')
    .exec((err, broadcast) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!broadcast) {
        return res.status(404)
          .json({status: 'failed', description: 'Broadcast not found'})
      }
      let dir = path.resolve(__dirname, '../../../broadcastFiles/')
      let pathNew = dir + '/userfiles/' + broadcast.fileurl

      // Check if file specified by the filePath exists
      // todo see if fs.exists is deprecated, use new one
      // eslint-disable-next-line node/no-deprecated-api
      fs.exists(pathNew, function (exists) {
        if (exists) {
          // Content-type is very interesting part that guarantee that
          // Web browser will handle response in an appropriate manner.
          res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename=' + broadcast.fileurl
          })
          fs.createReadStream(pathNew).pipe(res)
        } else {
          res.status(404)
            .json({status: 'failed', description: 'File does not exist'})
        }
      })
    })
}

exports.verifyhook = function (req, res) {
  if (req.query['hub.verify_token'] === 'VERIFY_ME') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong token')
  }
}

exports.pubsubhook = function (req, res) {
  logger.serverLog(TAG, 'PUBSUBHUBBUB Webhook Called')
  logger.serverLog(TAG, JSON.stringify(req.body))
  return res.status(200).json({status: 'success', description: 'got the data.'})
}

// webhook for facebook
exports.getfbMessage = function (req, res) {
  // This is body in chatwebhook {"object":"page","entry":[{"id":"1406610126036700","time":1501650214088,"messaging":[{"recipient":{"id":"1406610126036700"},"timestamp":1501650214088,"sender":{"id":"1389982764379580"},"postback":{"payload":"{\"poll_id\":121212,\"option\":\"option1\"}","title":"Option 1"}}]}]}

// {"sender":{"id":"1230406063754028"},"recipient":{"id":"272774036462658"},"timestamp":1504089493225,"read":{"watermark":1504089453074,"seq":0}}

  logger.serverLog(TAG, 'message received from FB Subscriber')
  logger.serverLog(TAG, 'Payload of webhook is ' + JSON.stringify(req.body))

  if (req.body.object) {
    if (req.body.object === 'page') {
      let payload = req.body.entry[0]
      if (payload.messaging[0].optin) {
        Pages.update({pageId: payload.id, userId: payload.messaging[0].optin.ref},
          {adminSubscriberId: payload.messaging[0].sender.id},
          {multi: false}, (err, updated) => {
            if (err) {
              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            }
            logger.serverLog(TAG,
              `The subscriber id of admin is added to the page ${JSON.stringify(
                updated)}`)
          })
        return
      }
    }
  }

  const messagingEvents = req.body.entry[0].messaging

  for (let i = 0; i < messagingEvents.length; i++) {
    const event = req.body.entry[0].messaging[i]
    logger.serverLog(TAG, JSON.stringify(event))
    if (event.message &&
      (event.message.is_echo === false || !event.message.is_echo)) {
      const sender = event.sender.id
      const page = event.recipient.id
      // get accesstoken of page
      Pages.findOne({pageId: page}).populate('userId').exec((err, page) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        // fetch subsriber info from Graph API
        // fetch customer details
        const options = {
          url: `https://graph.facebook.com/v2.6/${sender}?access_token=${page.accessToken}`,
          qs: {access_token: page.accessToken},
          method: 'GET'

        }

        needle.get(options.url, options, (error, response) => {
          const subsriber = response.body

          if (!error) {
            const payload = {
              firstName: subsriber.first_name,
              lastName: subsriber.last_name,
              locale: subsriber.locale,
              gender: subsriber.gender,
              userId: page.userId,
              provider: 'facebook',
              timezone: subsriber.timezone,
              profilePic: subsriber.profile_pic,
              pageScopedId: '',
              email: '',
              senderId: sender,
              pageId: page._id,
              isSubscribed: true
            }

            Subscribers.findOne({senderId: sender}, (err, subscriber) => {
              if (err) logger.serverLog(TAG, err)
              if (subscriber === null) {
                // subsriber not found, create subscriber
                Subscribers.create(payload, (err2) => {
                  if (err2) {
                    logger.serverLog(TAG, err2)
                  }
                  logger.serverLog(TAG, 'new Subscriber added')
                })
              }
            })
          } else {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(error)}`)
          }
        })
        sendautomatedmsg(event, page)
      })
    }

    // if event.post, the response will be of survey or poll. writing a logic to save response of poll
    if (event.postback) {
      var resp = JSON.parse(event.postback.payload)
      logger.serverLog(TAG, resp)
      logger.serverLog(TAG, ` payload ${resp.poll_id}`)
      if (resp.poll_id) {
        savepoll(event)
      } else if (resp.survey_id) {
        savesurvey(event)
      } else {
      }
    }

    // if this is a read receipt
    if (event.read) {
      updateseenstatus(event)
    }
  }

  return res.status(200).json({status: 'success', description: 'got the data.'})
}

function updateseenstatus (req) {
  logger.serverLog(TAG, `Inside updateseenstatus ${JSON.stringify(req)}`)
  BroadcastPage.find({pageId: req.recipient.id, subscriberId: req.sender.id},
    (err, pagebroadcasts) => {
      if (err) {
        logger.serverLog(TAG, `Inside updateseenstatus Error ${err}`)
      }
      pagebroadcasts.forEach(pagebroadcast => {
        pagebroadcast.seen = true
        pagebroadcast.save((err2) => {
          if (err2) {
            logger.serverLog(TAG, `Inside updateseenstatus Error ${err2}`)
          }
        })
      })
    })
}
function savepoll (req) {
  // find subscriber from sender id
  logger.serverLog(TAG, `Inside savepoll ${JSON.stringify(req)}`)
  var resp = JSON.parse(req.postback.payload)
  Subscribers.findOne({senderId: req.sender.id}, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG,
        `Error occurred in finding subscriber ${JSON.stringify(
          err)}`)
    }

    const pollbody = {
      response: resp.option, // response submitted by subscriber
      pollId: resp.poll_id,
      subscriberId: subscriber._id

    }
    PollResponse.create(pollbody, (err, pollresponse) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      } else {
        logger.serverLog(TAG, `Poll created ${JSON.stringify(pollresponse)}`)
      }
    })
  })
}

function sendautomatedmsg (req, page) {
  logger.serverLog(TAG, 'send_automated_msg called')
  Workflows.find({userId: page.userId._id, isActive: true})
    .populate('userId')
    .exec((err, workflows) => {
      if (err) {
        logger.serverLog(TAG, 'Workflows not found')
      }
      // const sender = req.sender.id
      // const page = req.recipient.id
      //  'message_is'
      //  'message_contains'
      //  'message_begins'
      if (req.message.text) {
        var index = -3
        for (let i = 0; i < workflows.length; i++) {
          var userMsg = req.message.text
          var words = userMsg.trim().split(' ')

          if (userMsg.toLowerCase() === 'stop' ||
            userMsg.toLowerCase() === 'unsubscribe') {
            index = -101
            break
          }
          if (userMsg.toLowerCase() === 'start' ||
            userMsg.toLowerCase() === 'subscribe') {
            index = -111
            break
          }

          logger.serverLog(TAG,
            `User message is ${userMsg} compared with ${JSON.stringify(
              workflows[i].keywords)}`)

          if (workflows[i].condition === 'message_is' &&
            _.indexOf(workflows[i].keywords, userMsg) !== -1) {
            index = i
            break
          } else if (workflows[i].condition === 'message_contains' &&
            _.intersection(words, workflows[i].keywords).length > 0) {
            index = i
            break
          } else if (workflows[i].condition === 'message_begins' &&
            _.indexOf(workflows[i].keywords, words[0]) !== -1) {
            index = i
            break
          }
        }

        // user query matched with keywords, send response
        // sending response to sender
        needle.get(
          `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${page.userId.fbToken}`,
          (err3, response) => {
            if (err3) {
              logger.serverLog(TAG,
                `Page token error from graph api ${JSON.stringify(err3)}`)
            }

            logger.serverLog(TAG, `value of index is ${index}`)
            index++
            if (index) {
              index--
              logger.serverLog(TAG, `value of index is ${index}`)
              let messageData = {}
              if (index === -101) {
                messageData = {
                  text: 'You have unsubscribed from our broadcasts. Send "Start" to subscribe again.'
                }
                Subscribers.update({senderId: req.sender.id},
                  {isSubscribed: false}, (err) => {
                    if (err) {
                      logger.serverLog(TAG,
                        `Subscribers update subscription: ${JSON.stringify(
                          err)}`)
                    }
                    logger.serverLog(TAG,
                      `subscription removed for ${req.sender.id}`)
                  })
              } else if (index === -111) {
                messageData = {
                  text: 'You have subscribed to our broadcasts. Send "stop" to unsubscribe'
                }
                Subscribers.update({senderId: req.sender.id},
                  {isSubscribed: true}, (err) => {
                    if (err) {
                      logger.serverLog(TAG,
                        `Subscribers update subscription: ${JSON.stringify(
                          err)}`)
                    }
                    logger.serverLog(TAG,
                      `subscription renewed for ${req.sender.id}`)
                  })
              } else if (index > -1) {
                logger.serverLog(TAG,
                  `workflow reply being sent ${workflows[index].reply}`)
                messageData = {
                  text: workflows[index].reply
                }
              }

              const data = {
                recipient: {id: req.sender.id}, // this is the subscriber id
                message: messageData
              }
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  logger.serverLog(TAG,
                    `Sending workflow response to subscriber response ${JSON.stringify(
                      respp.body)}`)
                })
            }
          })
      }
    })
}
function savesurvey (req) {
  // this is the response of survey question
  // first save the response of survey
  // find subscriber from sender id
  var resp = JSON.parse(req.postback.payload)

  Subscribers.findOne({senderId: req.sender.id}, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG,
        `Error occurred in finding subscriber${JSON.stringify(
          err)}`)
    }

    const surveybody = {
      response: resp.option, // response submitted by subscriber
      surveyId: resp.survey_id,
      questionId: resp.question_id,
      subscriberId: subscriber._id

    }
    SurveyResponse.create(surveybody, (err1, surveyresponse) => {
      if (err1) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err1)}`)
      }

      // send the next question
      SurveyQuestions.find({
        surveyId: resp.survey_id,
        _id: {$gt: resp.question_id}
      }).populate('surveyId').exec((err2, questions) => {
        if (err2) {
          logger.serverLog(TAG, `Survey questions not found ${JSON.stringify(
            err2)}`)
        }
        logger.serverLog(TAG,
          `Questions are ${JSON.stringify(questions)}`)
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
          logger.serverLog(TAG,
            `buttons created${JSON.stringify(buttons)}`)
          needle.get(
            `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${resp.userToken}`,
            (err3, response) => {
              if (err3) {
                logger.serverLog(TAG,
                  `Page accesstoken from graph api Error${JSON.stringify(
                    err3)}`)
              }

              logger.serverLog(TAG,
                `Page accesstoken from graph api ${JSON.stringify(
                  response.body)}`)
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
                recipient: {id: req.sender.id}, // this is the subscriber id
                message: messageData
              }
              logger.serverLog(TAG, messageData)
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  logger.serverLog(TAG,
                    `Sending survey to subscriber response ${JSON.stringify(
                      respp.body)}`)
                  if (err4) {

                  }
                })
            })
        } else { // else send thank you message
          needle.get(
            `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${resp.userToken}`,
            (err3, response) => {
              if (err3) {
                logger.serverLog(TAG,
                  `Page accesstoken from graph api Error${JSON.stringify(
                    err3)}`)
              }

              logger.serverLog(TAG,
                `Page accesstoken from graph api ${JSON.stringify(
                  response.body)}`)
              const messageData = {
                text: 'Thank you. Response submitted successfully.'
              }
              const data = {
                recipient: {id: req.sender.id}, // this is the subscriber id
                message: messageData
              }
              logger.serverLog(TAG, messageData)
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  logger.serverLog(TAG,
                    `Sending survey to subscriber response ${JSON.stringify(
                      respp.body)}`)
                  if (err4) {
                  }
                })
            })
        }
      })
    })
  })
}
