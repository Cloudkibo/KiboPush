let mongoose = require('mongoose')
const logger = require('../server/components/logger')
const config = require('../server/config/environment')
const Pages = require('../server/api/pages/Pages.model')
const Subscribers = require('../server/api/subscribers/Subscribers.model')
const SequenceMessagesQueue = require('../server/api/SequenceMessageQueue/SequenceMessageQueue.model')
const SequenceSubscriberMessage = require('../server/api/sequenceMessaging/sequenceSubscribersMessages.model')
const BroadcastUtility = require('../server/api/broadcasts/broadcasts.utility')
const Sequence = require('../server/api/sequenceMessaging/sequence.model')
const Company = require('../server/api/companyuser/companyuser.model')
const SequenceMessage = require('../server/api/sequenceMessaging/message.model')
const URL = require('../server/api/URLforClickedCount/URL.model')
const TAG = 'scripts/monodb_script.js'

const request = require('request')

mongoose = mongoose.connect(config.mongo.uri)

SequenceMessagesQueue.find({}, (err, data) => {
  if (err) {
    logger.serverLog(TAG, `queue messages not found ${JSON.stringify(err)}`)
  }

  if (data) {
    for (let i = 0; i < data.length; i++) {
      let message = data[i]
      if (message.isActive) {
        if (message.queueScheduledTime.getTime() < new Date().getTime()) {
          Sequence.findOne({ '_id': message.sequenceId }, (err, sequence) => {
            if (err) {
              logger.serverLog(TAG, `Sequence was not found ${JSON.stringify(err)}`)
            }

            SequenceMessage.findOne({ '_id': message.sequenceMessageId }, (err, sequenceMessage) => {
              if (err) {
                logger.serverLog(TAG, `Sequence messages not found ${JSON.stringify(err)}`)
              }

              Subscribers.findOne({ '_id': message.subscriberId }, (err, subscriber) => {
                if (err) {
                  logger.serverLog(TAG, `subscriber not found ${JSON.stringify(err)}`)
                }

                Company.findOne({ 'companyId': message.companyId }, (err, companyUser) => {
                  if (err) {
                    logger.serverLog(TAG, `Company not found ${JSON.stringify(err)}`)
                  }

                  Pages.findOne({ '_id': subscriber.pageId }, (err, page) => {
                    if (err) {
                      logger.serverLog(TAG, `Pages not found ${JSON.stringify(err)}`)
                    }
                    let newPayload = sequenceMessage.payload
                    // Appending click count url to payload
                    if (sequenceMessage.payload.length > 0) {
                      sequenceMessage.payload.forEach((payloadItem, pindex) => {
                        if (payloadItem.buttons) {
                          payloadItem.buttons.forEach((button, bindex) => {
                            if (!(button.type === 'postback')) {
                              let URLObject = new URL({
                                originalURL: button.url,
                                module: {
                                  id: sequence._id,
                                  type: 'sequence'
                                }
                              })
                              URLObject.save((err, savedurl) => {
                                if (err) logger.serverLog(TAG, err)
                                let newURL = config.domain + '/api/URL/sequence/' + savedurl._id
                                newPayload[pindex].buttons[bindex].url = newURL
                              })
                            }
                          })
                        }
                        if (payloadItem.componentType === 'media' && payloadItem.buttons) {
                          payloadItem.buttons.forEach((button, bindex) => {
                            let URLObject = new URL({
                              originalURL: button.url,
                              module: {
                                id: sequence._id,
                                type: 'sequence'
                              }
                            })
                            URLObject.save((err, savedurl) => {
                              if (err) logger.serverLog(TAG, err)
                              let newURL = config.domain + '/api/URL/sequence/' + savedurl._id
                              newPayload[pindex].buttons[bindex].url = newURL
                            })
                          })
                        }
                        if (payloadItem.componentType === 'gallery') {
                          payloadItem.cards.forEach((card, cindex) => {
                            card.buttons.forEach((button, bindex) => {
                              let URLObject = new URL({
                                originalURL: button.url,
                                module: {
                                  id: sequence._id,
                                  type: 'sequence'
                                }
                              })
                              URLObject.save((err, savedurl) => {
                                if (err) logger.serverLog(TAG, err)
                                let newURL = config.domain + '/api/URL/sequence/' + savedurl._id
                                newPayload[pindex].cards[cindex].buttons[bindex].url = newURL
                              })
                            })
                          })
                        }
                        if (payloadItem.componentType === 'list') {
                          payloadItem.listItems.forEach((element, lindex) => {
                            if (element.buttons && element.buttons.length > 0) {
                              element.buttons.forEach((button, bindex) => {
                                let URLObject = new URL({
                                  originalURL: button.url,
                                  module: {
                                    id: sequence._id,
                                    type: 'sequence'
                                  }
                                })
                                URLObject.save((err, savedurl) => {
                                  if (err) logger.serverLog(TAG, err)
                                  let newURL = config.domain + '/api/URL/sequence/' + savedurl._id
                                  newPayload[pindex].listItems[lindex].buttons[bindex].url = newURL
                                })
                              })
                            }
                            if (element.default_action) {
                              let URLObject = new URL({
                                originalURL: element.default_action.url,
                                module: {
                                  id: sequence._id,
                                  type: 'sequence'
                                }
                              })
                              URLObject.save((err, savedurl) => {
                                if (err) logger.serverLog(TAG, err)
                                let newURL = config.domain + '/api/URL/sequence/' + savedurl._id
                                newPayload[pindex].listItems[lindex].default_action.url = newURL
                              })
                            }
                          })
                        }
                      })
                    }

                    let sequenceSubMessage = new SequenceSubscriberMessage({
                      subscriberId: subscriber._id,
                      messageId: sequenceMessage._id,
                      companyId: companyUser.companyId,
                      datetime: new Date(),
                      seen: false
                    })

                    sequenceSubMessage.save((err2, result) => {
                      if (err2) {
                        logger.serverLog(TAG, {
                          status: 'failed',
                          description: 'Sequence Message Subscriber addition create failed',
                          err2
                        })
                      }

                      BroadcastUtility.getBatchData(newPayload, subscriber.senderId, page, sendBroadcast, subscriber.firstName, subscriber.lastName)
                      SequenceMessagesQueue.deleteOne({ '_id': message._id }, (err, result) => {
                        if (err) {
                          logger.serverLog(TAG, `could not delete the message from queue ${JSON.stringify(err)}`)
                        }
                      })
                    })
                    // mongoose.disconnect((err) => {
                    //   if (err) throw err
                    //   process.exit()
                    // })
                  })  // Page find ends here
                })  // Company find ends here
              })  // Subscriber find ends here
            })  // Sequence Message find ends here
          }) // Sequence Find ends here
        } // If condition for scheduled time
      }
      if (!(i + 1 < data.length)) {
        // Do work to reschedule the message
        setTimeout(function (mongoose) { closeDB(mongoose) }, 20000)
      }
    } // For loop ends here
    if (data.length === 0) {
      // Do work to reschedule the message
      setTimeout(function (mongoose) { closeDB(mongoose) }, 20000)
    }
  } // If data clause check
})  // Quence find ends here

function closeDB () {
  console.log('last index reached')
  mongoose.disconnect(function (err) {
    if (err) throw err
    console.log('disconnected')
    process.exit()
  })
}

const sendBroadcast = (batchMessages, page) => {
  const r = request.post('https://graph.facebook.com', (err, httpResponse, body) => {
    if (err) {
      return logger.serverLog(TAG, `Batch send error ${JSON.stringify(err)}`)
    }
    logger.serverLog(TAG, `Batch send response ${JSON.stringify(body)}`)
  })
  const form = r.form()
  form.append('access_token', page.accessToken)
  form.append('batch', batchMessages)
}
