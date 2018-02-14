const logger = require('../../components/logger')
const Polls = require('./Polls.model')
const PollResponse = require('./pollresponse.model')
const Subscribers = require('../subscribers/Subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const needle = require('needle')
const Pages = require('../pages/Pages.model')
const PollPage = require('../page_poll/page_poll.model')
const Lists = require('../lists/lists.model')
let _ = require('lodash')

const TAG = 'api/polls/polls.controller.js'

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
    Polls.find({companyId: companyUser.companyId}, (err, polls) => {
      if (err) {
        logger.serverLog(TAG, `Error: ${err}`)
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }
      PollPage.find({companyId: companyUser.companyId}, (err, pollpages) => {
        if (err) {
          return res.status(404)
          .json({status: 'failed', description: 'Polls not found'})
        }
        PollResponse.aggregate([{
          $group: {
            _id: {pollId: '$pollId'},
            count: {$sum: 1}
          }}
        ], (err2, responsesCount1) => {
          if (err2) {
            return res.status(404)
            .json({status: 'failed', description: 'Polls not found'})
          }
          let responsesCount = []
          for (let i = 0; i < polls.length; i++) {
            responsesCount.push({
              _id: polls[i]._id,
              count: 0
            })
          }
          for (let i = 0; i < polls.length; i++) {
            for (let j = 0; j < responsesCount1.length; j++) {
              if (polls[i]._id.toString() === responsesCount1[j]._id.pollId.toString()) {
                responsesCount[i].count = responsesCount1[j].count
              }
            }
          }
          res.status(200).json({
            status: 'success',
            payload: {polls, pollpages, responsesCount}
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
    let pollPayload = {
      platform: 'facebook',
      statement: req.body.statement,
      options: req.body.options,
      companyId: companyUser.companyId,
      userId: req.user._id
    }
    if (req.body.isSegmented) {
      pollPayload.isSegmented = true
      pollPayload.segmentationPageIds = (req.body.segmentationPageIds)
        ? req.body.segmentationPageIds
        : null
      pollPayload.segmentationGender = (req.body.segmentationGender)
        ? req.body.segmentationGender
        : null
      pollPayload.segmentationLocale = (req.body.segmentationLocale)
        ? req.body.segmentationLocale
        : null
    }
    if (req.body.isList) {
      pollPayload.isList = true
      pollPayload.segmentationList = (req.body.segmentationList)
        ? req.body.segmentationList
        : null
    }
    const poll = new Polls(pollPayload)

    // save model to MongoDB
    poll.save((err, pollCreated) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          error: err,
          description: 'Failed to insert record'
        })
      } else {
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'poll_created',
            payload: {
              poll_id: pollCreated._id,
              user_id: req.user._id,
              user_name: req.user.name,
              company_id: companyUser.companyId
            }
          }
        })
        res.status(201).json({status: 'success', payload: pollCreated})
      }
    })
  })
}
exports.submitresponses = function (req, res) {
  /*
   Expected body
   {
   response:String,//response submitted by subscriber
   pollId: _id of Poll,
   subscriberId: _id of subscriber,
   }
   */

  PollResponse.create(req.body, (err, pollresponse) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    return res.status(200).json({status: 'success', payload: pollresponse})
  })
}

exports.getresponses = function (req, res) {
  PollResponse.find({pollId: req.params.id})
    .populate('pollId subscriberId')
    .exec((err, pollresponses) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }

      return res.status(200).json({status: 'success', payload: pollresponses})
    })
}

exports.report = function (req, res) {

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
  logger.serverLog(TAG, `Inside sendpoll ${JSON.stringify(req.body)}`)
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
    /*
     Expected request body
     { platform: 'facebook',statement: req.body.statement,options: req.body.options,sent: 0 });
     */
    const messageData = {
      text: req.body.statement,
      quick_replies: [
        {
          'content_type': 'text',
          'title': req.body.options[0],
          'payload': JSON.stringify(
                {poll_id: req.body._id, option: req.body.options[0]})
        },
        {
          'content_type': 'text',
          'title': req.body.options[1],
          'payload': JSON.stringify(
                {poll_id: req.body._id, option: req.body.options[1]})
        },
        {
          'content_type': 'text',
          'title': req.body.options[2],
          'payload': JSON.stringify(
                {poll_id: req.body._id, option: req.body.options[2]})
        }
      ]
    }

    logger.serverLog(TAG, `Poll to be sent ${JSON.stringify(messageData)}`)
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
        logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }
      logger.serverLog(TAG, `Total pages to receive poll are ${pages.length}`)
      for (let z = 0; z < pages.length; z++) {
        logger.serverLog(TAG, `Page at Z ${pages[z].pageName}`)
        if (req.body.isList === true) {
          logger.serverLog(TAG, `inside isList`)
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
              for (let j = 0; j < subscribers.length; j++) {
                logger.serverLog(TAG,
                  `At Subscriber fetched ${subscribers[j].firstName} ${subscribers[j].lastName}`)

                const data = {
                  recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                  message: messageData
                }

                needle.post(
                  `https://graph.facebook.com/v2.6/me/messages?access_token=${pages[z].accessToken}`,
                    data, (err, resp) => {
                      if (err) {
                        logger.serverLog(TAG, err)
                        logger.serverLog(TAG,
                          `Error occured at subscriber :${JSON.stringify(
                            subscribers[j])}`)
                      }
                      logger.serverLog(TAG,
                        `Sending poll to subscriber response ${JSON.stringify(
                          resp.body)}`)
                      let pollBroadcast = new PollPage({
                        pageId: pages[z].pageId,
                        userId: req.user._id,
                        companyId: companyUser.companyId,
                        subscriberId: subscribers[j].senderId,
                        pollId: req.body._id,
                        seen: false
                      })

                      pollBroadcast.save((err2) => {
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
        } else {
          let subscriberFindCriteria = {pageId: pages[z]._id, isSubscribed: true}

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
              return logger.serverLog(TAG, `error : ${JSON.stringify(err)}`)
            }
            if (subscribers.length > 0) {
              logger.serverLog(TAG,
                `Total Subscribers of page ${pages[z].pageName} are ${subscribers.length}`)

              for (let j = 0; j < subscribers.length; j++) {
                logger.serverLog(TAG,
                  `At Subscriber fetched ${subscribers[j].firstName} ${subscribers[j].lastName}`)

                const data = {
                  recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                  message: messageData
                }

                needle.post(
                  `https://graph.facebook.com/v2.6/me/messages?access_token=${pages[z].accessToken}`,
                    data, (err, resp) => {
                      if (err) {
                        logger.serverLog(TAG, err)
                        logger.serverLog(TAG,
                          `Error occured at subscriber :${JSON.stringify(
                            subscribers[j])}`)
                      }
                      logger.serverLog(TAG,
                        `Sending poll to subscriber response ${JSON.stringify(
                          resp.body)}`)
                      let pollBroadcast = new PollPage({
                        pageId: pages[z].pageId,
                        userId: req.user._id,
                        companyId: companyUser.companyId,
                        subscriberId: subscribers[j].senderId,
                        pollId: req.body._id,
                        seen: false
                      })

                      pollBroadcast.save((err2) => {
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
                          //       `No chat session was found for polls`)
                          //   }
                          //   const chatMessage = new LiveChat({
                          //     sender_id: pages[z]._id, // this is the page id: _id of Pageid
                          //     recipient_id: subscribers[j]._id, // this is the subscriber id: _id of subscriberId
                          //     sender_fb_id: pages[z].pageId, // this is the (facebook) :page id of pageId
                          //     recipient_fb_id: subscribers[j].senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                          //     session_id: session._id,
                          //     company_id: pages[z].userId._id, // this is admin id till we have companies
                          //     payload: {
                          //       componentType: 'poll',
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
                          //       'Chat message saved for poll sent')
                          //   })
                          // })
                      })
                    })
              }
            }
          })
        }
      }
      return res.status(200)
      .json({status: 'success', payload: 'Polls sent successfully.'})
    })
  })
}
exports.deletePoll = function (req, res) {
  logger.serverLog(TAG,
    `This is body in delete autoposting ${JSON.stringify(req.params)}`)
  Polls.findById(req.params.id, (err, poll) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!poll) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    poll.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'poll update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
