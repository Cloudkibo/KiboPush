'use strict'

const express = require('express')

const router = express.Router()
const Sessions = require('./../sessions/sessions.model')
const Subscribers = require('./../subscribers/Subscribers.model')
const LiveChat = require('../livechat/livechat.model')
const CompanyProfile = require('./../companyprofile/companyprofile.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const Pages = require('./../pages/Pages.model')
const Users = require('./../user/Users.model')
const Polls = require('./../polls/Polls.model')
const Sequences = require('./../sequenceMessaging/sequence.model')
const SequenceMessages = require('./../sequenceMessaging/message.model')
const Surveys = require('./../surveys/surveys.model')
const Broadcasts = require('./../broadcasts/broadcasts.model')
const PagePolls = require('./../page_poll/page_poll.model')
const Bots = require('./../smart_replies/Bots.model')
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

router.get('/updateTriggerSequenceSchema', (req, res) => {
  Sequences.update({}, {$set: {trigger: {event: 'subscribe_to_sequence', value: null}}}, {multi: true}, (err, result) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    } else {
      res.status(200).json({status: 'success', payload: result})
    }
  })
})

router.get('/updateSegmentationSequenceSchema', (req, res) => {
  Sequences.update({}, {$set: {segmentation: []}}, {multi: true}, (err, result) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    } else {
      res.status(200).json({status: 'success', payload: result})
    }
  })
})

router.get('/updateTriggerSequenceMessageSchema', (req, res) => {
  SequenceMessages.update({}, {$set: {trigger: {event: 'none', value: null}}}, {multi: true}, (err, result) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    } else {
      res.status(200).json({status: 'success', payload: result})
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

router.get('/updateBotCompanyId', (req, res) => {
  Bots.find({}, (err, bots) => {
    if (err) {
      return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    if (bots) {
      for (let i = 0, length = bots.length; i < length; i++) {
        Pages.findOne({_id: bots[i].pageId}, (err, page) => {
          if (err) {
            return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }

          if (page) {
            Bots.update({_id: bots[i]._id}, {$set: {companyId: page.companyId}}, (err, result) => {
              if (err) {
                return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }
              console.log('going to assign result: ' + JSON.stringify(result))
              if (i === (bots.length - 1)) {
                res.status(200).json({status: 'success', payload: result})
              }
            })
          }
        })
      }
    }
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
        Users.findById(page.userId, (userErr, userRes) => {
          if (userErr) {
            logger.serverLog(TAG, `Error in retrieving page owner ${JSON.stringify(userErr)}`)
            reject(userErr)
          } else {
            let accessToken = page.accessToken
            if (userRes && userRes.facebookInfo) {
              accessToken = userRes.facebookInfo.fbToken
            }
            request(
              {
                'method': 'GET',
                'json': true,
                'uri': `https://graph.facebook.com/v3.0/${page.pageId}?access_token=${accessToken}`
              }, function (err, resp) {
              if (err) {
                logger.serverLog(TAG, `Error in retrieving Facebook page name ${JSON.stringify(err)}`)
                reject(err)
              } else {
                if (!resp.body.error && page.pageName !== resp.body.name && resp.body.name) {
                  updatedPages.push({pageId: page.pageId, previousPageName: page.pageName, updatedPageName: resp.body.name})
                  Pages.update({pageId: page.pageId}, {pageName: resp.body.name}, {multi: true}, (err, updatedPage) => {
                    if (err) {
                      logger.serverLog(TAG, `Error in updating page name ${JSON.stringify(err)}`)
                    } else {
                      logger.serverLog(TAG, `Updated page name. Previous page name in database: ${page.pageName}, Actual page name: ${resp.body.name}`)
                    }
                  })
                }
                resolve(resp)
              }
            })
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
            if (resp.body.picture) {
              Users.update({_id: user._id}, {'facebookInfo.profilePic': resp.body.picture.data.url}, (err, updated) => {
                if (err) {
                  logger.serverLog(TAG, `Error in updating user (EULA): ${JSON.stringify(err)}`)
                }
              })
            }
          })
      }
    })
  })
  res.status(200).json({status: 'success', payload: []})
})
router.get('/updateSubcribersPicture', (req, res) => {
  let pages = []
  let tokens = []
  CompanyUsers.find({}).populate('userId').exec((err, profiles) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    profiles.forEach(profile => {
      Subscribers.find({companyId: profile.companyId}).populate('pageId').exec((err, users) => {
        if (err) {
          logger.serverLog(TAG, `Error in retrieving users: ${JSON.stringify(err)}`)
          res.status(500).json({status: 'failed', description: `Error in retrieving users: ${JSON.stringify(err)}`})
        }
        for (let i = 0; i < users.length; i++) {
          if (users[i].pageId && users[i].pageId.pageId && profile.userId && profile.userId.facebookInfo) {
            if (pages.indexOf(users[i].pageId.pageId) === -1) {
              pages.push(users[i].pageId.pageId)
              needle.get(
              `https://graph.facebook.com/v2.10/${users[i].pageId.pageId}?fields=access_token&access_token=${profile.userId.facebookInfo.fbToken}`,
              (err, respp) => {
                if (err) {
                  logger.serverLog(TAG,
                  `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                }
                logger.serverLog(TAG, `resp in page token ${JSON.stringify(respp.body)}`)
                tokens.push({id: users[i].pageId.pageId, key: respp.body.access_token})
                needle.get(
                  `https://graph.facebook.com/v2.10/${users[i].senderId}?access_token=${respp.body.access_token}`,
                  (err, resp) => {
                    if (err) {
                      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                    }
                    logger.serverLog(TAG, `resp ${JSON.stringify(resp.body)}`)
                    Subscribers.update({_id: users[i]._id}, {firstName: resp.body.first_name, lastName: resp.body.last_name, profilePic: resp.body.profile_pic, locale: resp.body.locale, timezone: resp.body.timezone, gender: resp.body.gender}, (err, updated) => {
                      if (err) {
                        logger.serverLog(TAG, `Error in updating subscriber: ${JSON.stringify(err)}`)
                      }
                    })
                  })
              })
            } else {
              let arr = tokens.find(() => {
                return tokens.id === users[i].pageId.pageId
              }).key
              logger.serverLog(TAG, `arr in else ${JSON.stringify(arr)}`)
              needle.get(
                `https://graph.facebook.com/v2.10/${users[i].senderId}?access_token=${arr}`,
                (err, resp) => {
                  if (err) {
                    logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                  }
                  logger.serverLog(TAG, `resp ${JSON.stringify(resp.body)}`)
                  Subscribers.update({_id: users[i]._id}, {firstName: resp.body.first_name, lastName: resp.body.last_name, profilePic: resp.body.profile_pic, locale: resp.body.locale, timezone: resp.body.timezone, gender: resp.body.gender}, (err, updated) => {
                    if (err) {
                      logger.serverLog(TAG, `Error in updating subscriber: ${JSON.stringify(err)}`)
                    }
                  })
                })
            }
          }
        }
      })
    })
  })
  res.status(200).json({status: 'success', payload: []})
})
router.get('/updateSubcribersInfo', (req, res) => {
  Subscribers.distinct('pageId').exec((err, pageIds) => {
    if (err) {
      logger.serverLog(TAG, `ERROR at distinct subscribers ${JSON.stringify(err)}`)
    }
    pageIds.forEach((pageId) => {
      Pages.findOne({_id: pageId}).populate('userId').exec((err, page) => {
        if (err) {
          logger.serverLog(TAG, `Error in retrieving page user: ${JSON.stringify(err)}`)
        }
        if (page && page.userId && page.userId.facebookInfo) {
          needle.get(
          `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
          (err, respp) => {
            if (err) {
              logger.serverLog(TAG,
              `Page accesstoken from graph api Error${JSON.stringify(err)}`)
            }
            logger.serverLog(TAG, `resp in page access ${JSON.stringify(respp.body)}`)
            let accessToken = respp.body.access_token
            Subscribers.find({pageId: pageId}).exec((err, subscribers) => {
              if (err) {
                logger.serverLog(TAG, `Error in retrieving page subscribers: ${JSON.stringify(err)}`)
              }
              subscribers.forEach((subscriber) => {
                needle.get(
                  `https://graph.facebook.com/v2.10/${subscriber.senderId}?access_token=${accessToken}`,
                  (err, resp) => {
                    if (err) {
                      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                    }
                    logger.serverLog(TAG, `resp in subscriber ${JSON.stringify(resp.body)}`)
                    if (resp.body.first_name) {
                      Subscribers.update({_id: subscriber._id}, {firstName: resp.body.first_name, lastName: resp.body.last_name, profilePic: resp.body.profile_pic, locale: resp.body.locale, timezone: resp.body.timezone, gender: resp.body.gender}, (err, updated) => {
                        if (err) {
                          logger.serverLog(TAG, `Error in updating subscriber: ${JSON.stringify(err)}`)
                        }
                      })
                    }
                  })
              })
            })
          })
        }
      })
    })
    res.status(200).json({status: 'success', description: 'subscribers updated successfully'})
  })
})
module.exports = router
