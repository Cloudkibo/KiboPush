'use strict'

const express = require('express')

const router = express.Router()
const Sessions = require('./../sessions/sessions.model')
const Subscribers = require('./../subscribers/Subscribers.model')
const LiveChat = require('../livechat/livechat.model')
const CompanyProfile = require('./../companyprofile/companyprofile.model')
const Pages = require('./../pages/Pages.model')
const Users = require('./../user/Users.model')
const Polls = require('./../polls/Polls.model')
const Surveys = require('./../surveys/surveys.model')
const Broadcasts = require('./../broadcasts/broadcasts.model')
const PagePolls = require('./../page_poll/page_poll.model')
const PageSurveys = require('./../page_survey/page_survey.model')
const PageBroadcasts = require('./../page_broadcast/page_broadcast.model')
const mongoose = require('mongoose')
const request = require('request')
const logger = require('../../components/logger')
const TAG = 'api/thing/index'
const needle = require('needle')

router.get('/', (req, res) => {
  res.status(200).json({status: 'success', payload: []})
})

router.get('/pagesAndUsers', (req, res) => {
  Pages.find({connected: true}).populate('userId').exec((err, pagesGot) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    let payload = []
    for (var i = 0; i < pagesGot.length; i++) {
      payload.push({
        pageId: pagesGot[i].pageId,
        pageUrl: 'https://m.me/' + pagesGot[i].pageId,
        pageName: pagesGot[i].pageName,
        userName: pagesGot[i].userId.name,
        userEmail: pagesGot[i].userId.email
      })
    }
    res.status(200).json(payload)
  })
})

router.get('/subscriptionDate', (req, res) => {
  Sessions.find({}, (err, sessions) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    sessions.forEach((session) => {
      Subscribers.update({_id: session.subscriber_id}, {datetime: session.request_time}, (err, subs) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
      })
    })
    res.status(200).json({status: 'success', payload: []})
  })
})

router.get('/lastSeenDate', (req, res) => {
  Subscribers.find({}, (err, subscribers) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    subscribers.forEach((subscriber) => {
      Subscribers.update({_id: subscriber._id}, {lastSeen: subscriber.datetime}, (err, subs) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
      })
    })
    res.status(200).json({status: 'success', payload: []})
  })
})

router.get('/unSubscribedBy', (req, res) => {
  Subscribers.update({}, {unSubscribedBy: 'subscriber'}, {multi: true}, (err, subs) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    res.status(200).json({status: 'success', payload: []})
  })
})

router.get('/updateSessions', (req, res) => {
  Sessions.update({}, {is_assigned: false}, {multi: true}, (err, subs) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    CompanyProfile.find({}, (err, profiles) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      profiles.forEach((profile) => {
        Users.findOne({_id: profile.ownerId}, (err, user) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
          LiveChat.update({company_id: profile._id}, {replied_by: {id: profile.ownerId, name: user.name, type: 'agent'}}, {multi: true}, (err, updated) => {
            if (err) {
              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            }
            logger.serverLog(TAG, `UPDATED ${JSON.stringify(updated)}`)
          })
        })
      })
    })
    res.status(200).json({status: 'success', payload: []})
  })
})

router.get('/updatePolls', (req, res) => {
  Polls.find({}, (err, polls) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    let pageIds = []
    let subscriberSenderIds = []
    polls.forEach((poll) => {
      PagePolls.find({pollId: poll._id}, (err, pagePolls) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        pagePolls.forEach((pagePoll) => {
          if (exists(pageIds, pagePoll.pageId) === false) {
            pageIds.push(pagePoll.pageId)
          }
          if (exists(subscriberSenderIds, pagePoll.subscriberId) === false) {
            subscriberSenderIds.push(pagePoll.subscriberId)
          }
        })
        PagePolls.aggregate([
          { $match: { pollId: mongoose.Types.ObjectId(poll._id), seen: true } },
          { $group: { _id: null, count: { $sum: 1 } } }
        ], (err, seenCount) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            // return res.status(404)
            //   .json({status: 'failed', description: 'BroadcastsCount not found'})
          }
          Polls.update({_id: poll._id}, {sent: pagePolls.length, seen: seenCount && seenCount.length > 0 ? seenCount[0].count : 0, pageIds: pageIds, subscriberSenderIds: subscriberSenderIds}, {multi: true}, (err, updated) => {
            if (err) {
              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            }
            logger.serverLog(TAG, `UPDATED ${JSON.stringify(updated)}`)
          })
        })
      })
    })
    res.status(200).json({status: 'success', payload: []})
  })
})

router.get('/updateSurveys', (req, res) => {
  Surveys.find({}, (err, surveys) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    let pageIds = []
    let subscriberSenderIds = []
    surveys.forEach((survey) => {
      PageSurveys.find({surveyId: survey._id}, (err, pageSurveys) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        pageSurveys.forEach((pageSurvey) => {
          if (exists(pageIds, pageSurvey.pageId) === false) {
            pageIds.push(pageSurvey.pageId)
          }
          if (exists(subscriberSenderIds, pageSurvey.subscriberId) === false) {
            subscriberSenderIds.push(pageSurvey.subscriberId)
          }
        })
        PageSurveys.aggregate([
          { $match: { surveyId: mongoose.Types.ObjectId(survey._id), seen: true } },
          { $group: { _id: null, count: { $sum: 1 } } }
        ], (err, seenCount) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            // return res.status(404)
            //   .json({status: 'failed', description: 'BroadcastsCount not found'})
          }
          Surveys.update({_id: survey._id}, {sent: pageSurveys.length, seen: seenCount && seenCount.length > 0 ? seenCount[0].count : 0, pageIds: pageIds, subscriberSenderIds: subscriberSenderIds}, {multi: true}, (err, updated) => {
            if (err) {
              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            }
            logger.serverLog(TAG, `UPDATED ${JSON.stringify(updated)}`)
          })
        })
      })
    })
    res.status(200).json({status: 'success', payload: []})
  })
})

function exists (list, content) {
  for (let i = 0; i < list.length; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(content)) {
      return true
    }
  }
  return false
}

router.get('/updateBroadcasts', (req, res) => {
  Broadcasts.find({}, (err, broadcasts) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    let pageIds = []
    let subscriberSenderIds = []
    broadcasts.forEach((broadcast) => {
      PageBroadcasts.find({broadcastId: broadcast._id}, (err, pageBroadcasts) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        pageBroadcasts.forEach((pageBroadcast) => {
          if (exists(pageIds, pageBroadcast.pageId) === false) {
            pageIds.push(pageBroadcast.pageId)
          }
          if (exists(subscriberSenderIds, pageBroadcast.subscriberId) === false) {
            subscriberSenderIds.push(pageBroadcast.subscriberId)
          }
        })
        PageBroadcasts.aggregate([
          { $match: { broadcastId: mongoose.Types.ObjectId(broadcast._id), seen: true } },
          { $group: { _id: null, count: { $sum: 1 } } }
        ], (err, seenCount) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            // return res.status(404)
            //   .json({status: 'failed', description: 'BroadcastsCount not found'})
          }
          Broadcasts.update({_id: broadcast._id}, {sent: pageBroadcasts.length, seen: seenCount && seenCount.length > 0 ? seenCount[0].count : 0, pageIds: pageIds, subscriberSenderIds: subscriberSenderIds}, {multi: true}, (err, updated) => {
            if (err) {
              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            }
            logger.serverLog(TAG, `UPDATED ${JSON.stringify(updated)}`)
          })
        })
      })
    })
    res.status(200).json({status: 'success', payload: []})
  })
})

router.get('/updateAutomatedOptions', (req, res) => {
  CompanyProfile.update({}, {$set: {automated_options: 'MIX_CHAT'}}, {multi: true}, (err, profiles) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    } else {
      res.status(200).json({status: 'success', payload: profiles})
    }
  })
})

router.get('/updateSubcribersSource', (req, res) => {
  Subscribers.find({}, (err, subscribers) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    subscribers.forEach((subscriber) => {
      let user = JSON.parse(JSON.stringify(subscriber))
      if (user.isSubscribedByPhoneNumber === true) {
        Subscribers.update({_id: user._id}, {source: 'customer_matching'}, {multi: true}, (err, subs) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
        })
      } else {
        Subscribers.update({_id: user._id}, {source: 'direct_message'}, {multi: true}, (err, subs) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
        })
      }
    })
    res.status(200).json({status: 'success', payload: []})
  })
})

router.get('/updatePageNames', (req, res) => {
  Pages.find({}, (err, pages) => {
    if (err) {
      logger.serverLog(TAG, `Error in retrieving pages: ${JSON.stringify(err)}`)
      res.status(500).json({status: 'failed', description: `Error in retrieving pages: ${JSON.stringify(err)}`})
    }
    let updatedPages = []
    let requests = pages.map((page) => {
      return new Promise((resolve, reject) => {
        request(
          {
            'method': 'GET',
            'json': true,
            'uri': `https://graph.facebook.com/v3.0/${page.pageId}?access_token=${page.accessToken}`
          }, function (err, resp) {
          if (err) {
            logger.serverLog(TAG, `Error in retrieving Facebook page name ${JSON.stringify(err)}`)
            reject(err)
          } else {
            resolve(resp)
            if (page.pageName !== resp.body.name) {
              updatedPages.push({pageId: page.pageId, previousPageName: page.pageName, updatedPageName: resp.body.name})
              Pages.update({pageId: page.pageId}, {pageName: resp.body.name}, {multi: true}, (err, updatedPage) => {
                if (err) {
                  logger.serverLog(TAG, `Error in updating page name ${JSON.stringify(err)}`)
                } else {
                  logger.serverLog(TAG, `Updated page name. Previous page name in database: ${page.pageName}, Actual page name: ${resp.body.name}`)
                }
              })
            }
          }
        })
      })
    })
    Promise.all(requests)
      .then(() => res.status(200).json({status: 'success', payload: updatedPages}))
      .catch((err) => res.status(500).json({status: 'failed', description: `Error: ${JSON.stringify(err)}`}))
  })
})

router.get('/updateEulaField', (req, res) => {
  Users.find({}, (err, users) => {
    if (err) {
      logger.serverLog(TAG, `Error in retrieving users: ${JSON.stringify(err)}`)
      res.status(500).json({status: 'failed', description: `Error in retrieving users: ${JSON.stringify(err)}`})
    }
    users.forEach(user => {
      Users.update({_id: user._id}, {eulaAccepted: true}, (err, resp) => {
        if (err) {
          logger.serverLog(TAG, `Error in updating user (EULA): ${JSON.stringify(err)}`)
        }
      })
    })
  })
  res.status(200).json({status: 'success', payload: []})
})

router.get('/updatePicture', (req, res) => {
  Users.find({}, (err, users) => {
    if (err) {
      logger.serverLog(TAG, `Error in retrieving users: ${JSON.stringify(err)}`)
      res.status(500).json({status: 'failed', description: `Error in retrieving users: ${JSON.stringify(err)}`})
    }
    users.forEach(user => {
      if (user.facebookInfo) {
        needle.get(
          `https://graph.facebook.com/v2.10/${user.facebookInfo.fbId}?fields=picture&access_token=${user.facebookInfo.fbToken}`,
          (err, resp) => {
            if (err) {
              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            }
            Users.update({_id: user._id}, {'facebookInfo.profilePic': resp.body.picture.data.url}, (err, updated) => {
              if (err) {
                logger.serverLog(TAG, `Error in updating user (EULA): ${JSON.stringify(err)}`)
              }
            })
          })
      }
    })
  })
  res.status(200).json({status: 'success', payload: []})
})

module.exports = router
