const logger = require('../../components/logger')
const Polls = require('./Polls.model')
const PollResponse = require('./pollresponse.model')
const Subscribers = require('../subscribers/Subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const AutomationQueue = require('./../automation_queue/automation_queue.model')
const needle = require('needle')
const Pages = require('../pages/Pages.model')
const PollPage = require('../page_poll/page_poll.model')
const Lists = require('../lists/lists.model')
const Users = require('./../user/Users.model')
let _ = require('lodash')
const utility = require('./../broadcasts/broadcasts.utility')
const webhookUtility = require('./../webhooks/webhooks.utility')
const compUtility = require('../../components/utility')
const mongoose = require('mongoose')
const Webhooks = require('./../webhooks/webhooks.model')
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
    if (req.params.days === '0') {
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
    } else {
      Polls.aggregate([
        {
          $match: { companyId: companyUser.companyId,
            'datetime': {
              $gte: new Date(
                (new Date().getTime() - (req.params.days * 24 * 60 * 60 * 1000))),
              $lt: new Date(
                (new Date().getTime()))
            }
          }
        }
      ], (err, polls) => {
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
    }
  })
}

exports.allPolls = function (req, res) {
  /*
  body = {
    first_page:
    last_id:
    number_of_records:
    days:
}
  */
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
    if (req.body.first_page === 'first') {
      let startDate = new Date()  // Current date
      startDate.setDate(startDate.getDate() - req.body.days)
      startDate.setHours(0)   // Set the hour, minute and second components to 0
      startDate.setMinutes(0)
      startDate.setSeconds(0)
      let findCriteria = {
        companyId: companyUser.companyId,
        'datetime': req.body.days !== '0' ? {
          $gte: startDate
        } : {$exists: true}
      }
      Polls.aggregate([
        { $match: findCriteria },
        { $group: { _id: null, count: { $sum: 1 } } }
      ], (err, pollsCount) => {
        if (err) {
          return res.status(404)
            .json({status: 'failed', description: 'BroadcastsCount not found'})
        }
        Polls.aggregate([{$match: findCriteria}, {$sort: {datetime: -1}}]).limit(req.body.number_of_records)
        .exec((err, polls) => {
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
                payload: {polls: polls, pollpages: pollpages, responsesCount: responsesCount, count: polls.length > 0 ? pollsCount[0].count : 0}
              })
            })
          })
        })
      })
    } else if (req.body.first_page === 'next') {
      let startDate = new Date()  // Current date
      startDate.setDate(startDate.getDate() - req.body.days)
      startDate.setHours(0)   // Set the hour, minute and second components to 0
      startDate.setMinutes(0)
      startDate.setSeconds(0)
      let findCriteria = {
        companyId: companyUser.companyId,
        'datetime': req.body.days !== '0' ? {
          $gte: startDate
        } : {$exists: true}
      }
      Polls.aggregate([
        { $match: findCriteria },
        { $group: { _id: null, count: { $sum: 1 } } }
      ], (err, pollsCount) => {
        if (err) {
          return res.status(404)
            .json({status: 'failed', description: 'BroadcastsCount not found'})
        }
        Polls.aggregate([{$match: {$and: [findCriteria, {_id: {$lt: mongoose.Types.ObjectId(req.body.last_id)}}]}}, {$sort: {datetime: -1}}]).limit(req.body.number_of_records)
        .exec((err, polls) => {
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
                payload: {polls: polls, pollpages: pollpages, responsesCount: responsesCount, count: polls.length > 0 ? pollsCount[0].count : 0}
              })
            })
          })
        })
      })
    } else if (req.body.first_page === 'previous') {
      let startDate = new Date()  // Current date
      startDate.setDate(startDate.getDate() - req.body.days)
      startDate.setHours(0)   // Set the hour, minute and second components to 0
      startDate.setMinutes(0)
      startDate.setSeconds(0)
      let findCriteria = {
        companyId: companyUser.companyId,
        'datetime': req.body.days !== '0' ? {
          $gte: startDate
        } : {$exists: true}
      }
      Polls.aggregate([
        { $match: findCriteria },
        { $group: { _id: null, count: { $sum: 1 } } }
      ], (err, pollsCount) => {
        if (err) {
          return res.status(404)
            .json({status: 'failed', description: 'BroadcastsCount not found'})
        }
        Polls.aggregate([{$match: {$and: [findCriteria, {_id: {$gt: mongoose.Types.ObjectId(req.body.last_id)}}]}}, {$sort: {datetime: 1}}]).limit(req.body.number_of_records)
        .exec((err, polls) => {
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
                payload: {polls: polls.reverse(), pollpages: pollpages, responsesCount: responsesCount, count: polls.length > 0 ? pollsCount[0].count : 0}
              })
            })
          })
        })
      })
    }
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
      pollPayload.segmentationTags = (req.body.segmentationTags)
        ? req.body.segmentationTags
        : null
      pollPayload.segmentationPoll = (req.body.segmentationPoll)
        ? req.body.segmentationPoll
        : null
    }
    if (req.body.isList) {
      pollPayload.isList = true
      pollPayload.segmentationList = (req.body.segmentationList)
        ? req.body.segmentationList
        : null
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
    Pages.find(pagesFindCriteria).exec((err, pages) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      pages.forEach((page) => {
        Webhooks.findOne({pageId: page.pageId}).populate('userId').exec((err, webhook) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          if (webhook && webhook.isEnabled) {
            needle.get(webhook.webhook_url, (err, r) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              } else if (r.statusCode === 200) {
                if (webhook && webhook.optIn.POLL_CREATED) {
                  var data = {
                    subscription_type: 'POLL_CREATED',
                    payload: JSON.stringify({userId: req.user._id, companyId: companyUser.companyId, statement: req.body.statement, options: req.body.options})
                  }
                  needle.post(webhook.webhook_url, data,
                    (error, response) => {
                      if (error) {
                        // return res.status(500).json({
                        //   status: 'failed',
                        //   description: `Internal Server Error ${JSON.stringify(err)}`
                        // })
                      }
                    })
                }
              } else {
                webhookUtility.saveNotification(webhook)
              }
            })
          }
        })
      })
    })
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

exports.getAllResponses = function (req, res) {
  PollResponse.find()
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
                      `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                    }
                    utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                      subscribers = taggedSubscribers
                      for (let j = 0; j < subscribers.length; j++) {
                        const data = {
                          messaging_type: 'UPDATE',
                          recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                          message: messageData
                        }

                        // this calls the needle when the last message was older than 30 minutes
                        // checks the age of function using callback
                        compUtility.checkLastMessageAge(subscribers[j].senderId, (err, isLastMessage) => {
                          if (err) {
                            logger.serverLog(TAG, 'inside error')
                            return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                          }
                          if (isLastMessage) {
                            logger.serverLog(TAG, 'inside poll send')
                            needle.post(
                              `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                                      data, (err, resp) => {
                                        if (err) {
                                          logger.serverLog(TAG, err)
                                          logger.serverLog(TAG,
                                            `Error occured at subscriber :${JSON.stringify(
                                              subscribers[j])}`)
                                        }
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
                          } else {
                            logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                            let timeNow = new Date()
                            let automatedQueueMessage = new AutomationQueue({
                              automatedMessageId: req.body._id,
                              subscriberId: subscribers[j]._id,
                              companyId: companyUser.companyId,
                              type: 'poll',
                              scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                            })

                            logger.serverLog(TAG, 'scheduled time: ' + timeNow)

                            automatedQueueMessage.save((error) => {
                              if (error) {
                                logger.serverLog(TAG, {
                                  status: 'failed',
                                  description: 'Automation Queue poll Message create failed',
                                  error
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  })
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

                needle.get(
                `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                (err, resp) => {
                  if (err) {
                    logger.serverLog(TAG,
                    `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                  }
                  if (subscribers.length > 0) {
                    utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                      subscribers = taggedSubscribers
                      utility.applyPollFilterIfNecessary(req, subscribers, (repliedSubscribers) => {
                        subscribers = repliedSubscribers
                        for (let j = 0; j < subscribers.length; j++) {
                          const data = {
                            messaging_type: 'UPDATE',
                            recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                            message: messageData
                          }
                          // this calls the needle when the last message was older than 30 minutes
                          // checks the age of function using callback
                          compUtility.checkLastMessageAge(subscribers[j].senderId, (err, isLastMessage) => {
                            if (err) {
                              logger.serverLog(TAG, 'inside error')
                              return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                            }
                            if (isLastMessage) {
                              logger.serverLog(TAG, 'inside poll send')
                              needle.post(
                                `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                                data, (err, resp) => {
                                  if (err) {
                                    logger.serverLog(TAG, err)
                                    logger.serverLog(TAG,
                                      `Error occured at subscriber :${JSON.stringify(
                                        subscribers[j])}`)
                                  }
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
                            } else {
                              logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                              let timeNow = new Date()
                              let automatedQueueMessage = new AutomationQueue({
                                automatedMessageId: req.body._id,
                                subscriberId: subscribers[j]._id,
                                companyId: companyUser.companyId,
                                type: 'poll',
                                scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                              })

                              logger.serverLog(TAG, 'scheduled time: ' + timeNow)

                              automatedQueueMessage.save((error) => {
                                if (error) {
                                  logger.serverLog(TAG, {
                                    status: 'failed',
                                    description: 'Automation Queue poll Message create failed',
                                    error
                                  })
                                }
                              })
                            }
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
          .json({status: 'success', payload: 'Polls sent successfully.'})
        })
      })
    })
  })
}
exports.deletePoll = function (req, res) {
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
      PollPage.find({pollId: req.params.id}, (err, pollpages) => {
        if (err) {
          return res.status(404)
          .json({status: 'failed', description: 'Polls not found'})
        }
        pollpages.forEach(pollpage => {
          pollpage.remove((err2) => {
            if (err2) {
              return res.status(500)
                .json({status: 'failed', description: 'poll update failed'})
            }
          })
        })
        PollResponse.find({pollId: req.params.id}, (err, pollresponses) => {
          if (err) {
            return res.status(404)
            .json({status: 'failed', description: 'Polls not found'})
          }
          pollresponses.forEach(pollresponse => {
            pollresponse.remove((err2) => {
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
}
exports.sendPoll = function (req, res) {
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
      pollPayload.segmentationTags = (req.body.segmentationTags)
        ? req.body.segmentationTags
        : null
      pollPayload.segmentationPoll = (req.body.segmentationPoll)
        ? req.body.segmentationPoll
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
      }
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
          const messageData = {
            text: req.body.statement,
            quick_replies: [
              {
                'content_type': 'text',
                'title': req.body.options[0],
                'payload': JSON.stringify(
                  {poll_id: pollCreated._id, option: req.body.options[0]})
              },
              {
                'content_type': 'text',
                'title': req.body.options[1],
                'payload': JSON.stringify(
                  {poll_id: pollCreated._id, option: req.body.options[1]})
              },
              {
                'content_type': 'text',
                'title': req.body.options[2],
                'payload': JSON.stringify(
                  {poll_id: pollCreated._id, option: req.body.options[2]})
              }
            ]
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
              logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error${JSON.stringify(err)}`
              })
            }
            for (let z = 0; z < pages.length; z++) {
              Webhooks.findOne({pageId: pages[z].pageId}).populate('userId').exec((err, webhook) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
                if (webhook && webhook.isEnabled) {
                  needle.get(webhook.webhook_url, (err, r) => {
                    if (err) {
                      return res.status(500).json({
                        status: 'failed',
                        description: `Internal Server Error ${JSON.stringify(err)}`
                      })
                    } else if (r.statusCode === 200) {
                      if (webhook && webhook.optIn.POLL_CREATED) {
                        var data = {
                          subscription_type: 'POLL_CREATED',
                          payload: JSON.stringify({userId: req.user._id, companyId: companyUser.companyId, statement: req.body.statement, options: req.body.options})
                        }
                        needle.post(webhook.webhook_url, data,
                          (error, response) => {
                            if (error) {
                              // return res.status(500).json({
                              //   status: 'failed',
                              //   description: `Internal Server Error ${JSON.stringify(err)}`
                              // })
                            }
                          })
                      }
                    } else {
                      webhookUtility.saveNotification(webhook)
                    }
                  })
                }
              })
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
                        `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                      }
                      utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                        subscribers = taggedSubscribers
                        for (let j = 0; j < subscribers.length; j++) {
                          const data = {
                            messaging_type: 'UPDATE',
                            recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                            message: messageData
                          }
                          // this calls the needle when the last message was older than 30 minutes
                          // checks the age of function using callback
                          logger.serverLog(TAG, 'before direct poll send')
                          compUtility.checkLastMessageAge(subscribers[j].senderId, (err, isLastMessage) => {
                            if (err) {
                              logger.serverLog(TAG, 'inside error')
                              return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                            }

                            if (isLastMessage) {
                              logger.serverLog(TAG, 'inside direct poll send')
                              needle.post(
                                `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                                data, (err, resp) => {
                                  if (err) {
                                    logger.serverLog(TAG, err)
                                    logger.serverLog(TAG,
                                      `Error occured at subscriber :${JSON.stringify(
                                        subscribers[j])}`)
                                  }
                                  let pollBroadcast = new PollPage({
                                    pageId: pages[z].pageId,
                                    userId: req.user._id,
                                    companyId: companyUser.companyId,
                                    subscriberId: subscribers[j].senderId,
                                    pollId: pollCreated._id,
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
                            } else {
                              logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                              let timeNow = new Date()
                              let automatedQueueMessage = new AutomationQueue({
                                automatedMessageId: pollCreated._id,
                                subscriberId: subscribers[j]._id,
                                companyId: companyUser.companyId,
                                type: 'poll',
                                scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                              })

                              logger.serverLog(TAG, 'scheduled time: ' + timeNow)

                              automatedQueueMessage.save((error) => {
                                if (error) {
                                  logger.serverLog(TAG, {
                                    status: 'failed',
                                    description: 'Automation Queue poll Message create failed',
                                    error
                                  })
                                }
                              })
                            }
                          })
                        }
                      })
                    })
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

                  needle.get(
                  `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                  (err, resp) => {
                    if (err) {
                      logger.serverLog(TAG,
                      `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                    }
                    if (subscribers.length > 0) {
                      utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                        subscribers = taggedSubscribers
                        utility.applyPollFilterIfNecessary(req, subscribers, (repliedSubscribers) => {
                          subscribers = repliedSubscribers
                          for (let j = 0; j < subscribers.length; j++) {
                            const data = {
                              messaging_type: 'UPDATE',
                              recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                              message: messageData
                            }
                            // this calls the needle when the last message was older than 30 minutes
                            // checks the age of function using callback
                            logger.serverLog(TAG, 'before direct poll send')
                            compUtility.checkLastMessageAge(subscribers[j].senderId, (err, isLastMessage) => {
                              if (err) {
                                logger.serverLog(TAG, 'inside error')
                                return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                              }

                              if (isLastMessage) {
                                logger.serverLog(TAG, 'inside direct poll sendd')
                                needle.post(
                                  `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                                  data, (err, resp) => {
                                    if (err) {
                                      logger.serverLog(TAG, err)
                                      logger.serverLog(TAG,
                                        `Error occured at subscriber :${JSON.stringify(
                                          subscribers[j])}`)
                                    }
                                    let pollBroadcast = new PollPage({
                                      pageId: pages[z].pageId,
                                      userId: req.user._id,
                                      companyId: companyUser.companyId,
                                      subscriberId: subscribers[j].senderId,
                                      pollId: pollCreated._id,
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
                              } else {
                                logger.serverLog(TAG, 'agent was engagedd just 30 minutes ago ')
                                let timeNow = new Date()
                                let automatedQueueMessage = new AutomationQueue({
                                  automatedMessageId: pollCreated._id,
                                  subscriberId: subscribers[j]._id,
                                  companyId: companyUser.companyId,
                                  type: 'poll',
                                  scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                                })

                                logger.serverLog(TAG, 'scheduled time: ' + timeNow)

                                automatedQueueMessage.save((error) => {
                                  if (error) {
                                    logger.serverLog(TAG, {
                                      status: 'failed',
                                      description: 'Automation Queue poll Message create failed',
                                      error
                                    })
                                  }
                                })
                              }
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
            .json({status: 'success', payload: 'Polls sent successfully.'})
          })
        })
      })
    })
  })
}
