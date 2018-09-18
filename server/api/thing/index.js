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

router.get('/updateSegmentationMessageSchema', (req, res) => {
  SequenceMessages.update({}, {$set: {segmentation: [], segmentationCondition: 'or'}}, {multi: true}, (err, result) => {
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

function updateSubcribersPic (pageTokens, companyId) {
  Subscribers.find({companyId: companyId}).populate('pageId').exec((err, users) => {
    if (err) {
      logger.serverLog(TAG, `Error in retrieving users: ${JSON.stringify(err)}`)
    }
    for (let i = 0; i < users.length; i++) {
      let accessToken = pageTokens.filter((item) => item.id === users[i].pageId.pageId)[0].token
      needle.get(
        `https://graph.facebook.com/v2.10/${users[i].senderId}?access_token=${accessToken}`,
        (err, resp) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
          console.log('resp.body', resp.body)
          logger.serverLog(TAG, `resp ${JSON.stringify(resp.body)}`)
          Subscribers.update({_id: users[i]._id}, {firstName: resp.body.first_name, lastName: resp.body.last_name, profilePic: resp.body.profile_pic, locale: resp.body.locale, timezone: resp.body.timezone, gender: resp.body.gender}, (err, updated) => {
            if (err) {
              logger.serverLog(TAG, `Error in updating subscriber: ${JSON.stringify(err)}`)
            }
          })
        })
    }
  })
}

function getPageAccessTokenAndUpdate (companyId) {
  let pageTokens = []
  Pages.find({companyId: companyId}).populate('userId').exec((err, pages) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    for (let i = 0; i < pages.length; i++) {
      needle.get(
      `https://graph.facebook.com/v2.10/${pages[i].pageId}?fields=access_token&access_token=${pages[i].userId.facebookInfo.fbToken}`,
      (err, resp) => {
        if (err) {
          logger.serverLog(TAG,
          `Page accesstoken from graph api Error${JSON.stringify(err)}`)
        }
        pageTokens.push({id: pages[i].pageId, token: resp.body.access_token})
        if (pageTokens.length === pages.length) {
          updateSubcribersPic(pageTokens, companyId)
        }
      })
    }
  })
}
router.get('/updateSubcribersPicture', (req, res) => {
  CompanyUsers.find({}).populate('userId').exec((err, profiles) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    profiles.forEach(profile => {
      getPageAccessTokenAndUpdate(profile.companyId)
    })
  })
  res.status(200).json({status: 'success', description: 'subscribers picture updated'})
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
router.get('/updateSkip', (req, res) => {
  Users.update({}, {skippedFacebookConnect: false}, {multi: true}, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `Error in updating user (EULA): ${JSON.stringify(err)}`)
    }
  })
  res.status(200).json({status: 'success', description: 'users updated successfully'})
})
router.get('/updatePageSubscriptionPermission', (req, res) => {
  Pages.update({}, {gotPageSubscriptionPermission: false}, {multi: true}, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `Error in updating page: ${JSON.stringify(err)}`)
    }
  })
  Broadcasts.update({}, {fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'}, {multi: true}, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `Error in updating page: ${JSON.stringify(err)}`)
    }
  })
  Surveys.update({}, {fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'}, {multi: true}, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `Error in updating page: ${JSON.stringify(err)}`)
    }
  })
  Polls.update({}, {fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'}, {multi: true}, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `Error in updating page: ${JSON.stringify(err)}`)
    }
  })
  SequenceMessages.update({}, {fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'}, {multi: true}, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `Error in updating page: ${JSON.stringify(err)}`)
    }
  })
  res.status(200).json({status: 'success', description: 'pages updated successfully'})
})

router.get('/addAgentActivityTime', (req, res) => {
  Sessions.find({}, (err, sessions) => {
    if (err) {
      logger.serverLog(TAG, `Line 569: ERROR! at getting sessions: ${JSON.stringify(err)}`)
    }
    sessions.forEach((session) => {
      if (!session.agent_activity_time) {
        Sessions.update({_id: session._id}, {agent_activity_time: session.request_time}, (err, updatedSession) => {
          if (err) {
            logger.serverLog(TAG, `Line 574: ERROR! at updating session: ${JSON.stringify(err)}`)
          }
        })
      }
    })
    res.status(200).json({status: 'success', description: 'Added successfully!'})
  })
})

router.get('/addDefaultUIMode', (req, res) => {
  Users.update({uiMode: {$exists: false}}, {uiMode: 'all'}, {multi: true}, (err, updatedUsers) => {
    if (err) {
      logger.serverLog(TAG, `Line 587: ERROR! at updating users: ${JSON.stringify(err)}`)
    }
    res.status(200).json({status: 'success', description: 'Added successfully!'})
  })
})

router.get('/refeshUserAccount', (req, res) => {
  const options = {
    headers: {
      'X-Custom-Header': 'CloudKibo Web Application'
    },
    json: true

  }
  // fetch users
  Users.find({}, (err, users) => {
    if (err) {
      logger.serverLog(TAG, `Line 632: ERROR! at fetching users: ${JSON.stringify(err)}`)
      res.status(500).json({status: 'success', description: err})
    }

    users.forEach((user) => {
      // get the code
      needle.get(`https://graph.facebook.com/oauth/client_code?access_token=${user.facebookInfo.fbToken}&client_secret=${config.facebook.clientSecret}&redirect_uri=${config.facebook.callbackURL}&client_id=${config.facebook.clientID}`, options, (err, resp) => {
        if (err !== null) {
          logger.serverLog(TAG, 'Line 637: ERROR! from graph api to get the code: ')
          logger.serverLog(TAG, JSON.stringify(err))
          res.status(500).json({status: 'success', description: err})
        }
        let code = resp.code
        // redeemed the code for access token
        needle.get(`https://graph.facebook.com/oauth/access_token?code=${code}&client_id=${config.facebook.clientID}&redirect_uri=${config.facebook.callbackURL}`, options, (err, respp) => {
          if (err !== null) {
            logger.serverLog(TAG, 'Line 649: ERROR! from graph api to get the access_token: ')
            logger.serverLog(TAG, JSON.stringify(err))
            res.status(500).json({status: 'success', description: err})
          }
          let accessToken = respp.access_token
          // update user
          user['facebookInfo']['fbToken'] = accessToken
          user.save((err, updatedUser) => {
            if (err) {
              logger.serverLog(TAG, `Line 658: ERROR! at updating the user: ${JSON.stringify(err)}`)
              res.status(500).json({status: 'success', description: err})
            }
            // fetch pages
            fetchPages(`https://graph.facebook.com/v2.10/${user.facebookInfo.fbId}/accounts?access_token=${user.facebookInfo.fbToken}`, updatedUser, disconnectPages)
            res.status(200).json({status: 'success', description: 'Successfully refreshed!'})
          })
        })
      })
    })
  })
})

function fetchPages (url, user, cb) {
  const options = {
    headers: {
      'X-Custom-Header': 'CloudKibo Web Application'
    },
    json: true

  }
  needle.get(url, options, (err, resp) => {
    if (err !== null) {
      logger.serverLog(TAG, 'Line 684: ERROR! from graph api to fetch pages: ')
      logger.serverLog(TAG, JSON.stringify(err))
    }
    const data = resp.body.data
    const cursor = resp.body.paging
    if (data) {
      data.forEach((item) => {
        Pages.findOne({
          pageId: item.id,
          userId: user._id
        }, (err, page) => {
          if (err) {
            logger.serverLog(TAG,
              `Internal Server Error ${JSON.stringify(err)}`)
          }
          page.pagePic = `https://graph.facebook.com/v2.10/${item.id}/picture`
          page.accessToken = item.access_token
          page.save((err) => {
            if (err) {
              logger.serverLog(TAG,
                `Internal Server Error ${JSON.stringify(err)}`)
            }
          })
        })
      })
    } else {
      logger.serverLog(TAG, 'Empty response from graph API to get pages list data')
    }
    if (cursor && cursor.next) {
      fetchPages(cursor.next, user, cb)
    } else {
      logger.serverLog(TAG, 'Undefined Cursor from graph API')
      cb(user)
    }
  })
}

function disconnectPages (user) {
  Pages.find({userId: user._id, connected: true}, (err, connectedPages) => {
    if (err) {
      logger.serverLog(TAG,
        `Internal Server Error ${JSON.stringify(err)}`)
    }
    Pages.update({userId: user._id, connected: true}, {connected: false}, {multi: true}, (err) => {
      if (err) {
        logger.serverLog(TAG, `Line 728: ERROR! at updating pages: ${JSON.stringify(err)}`)
      } else {
        connectedPages.forEach((page, index) => {
          const options = {
            url: `https://graph.facebook.com/v2.6/${page.pageId}/subscribed_apps?access_token=${page.accessToken}`,
            qs: {access_token: page.accessToken},
            method: 'DELETE'
          }

          needle.delete(options.url, options, (error, response) => {
            if (error) {
              logger.serverLog(TAG, `Line 738: ERROR! unsubscribing app from facebook: ${JSON.stringify(error)}`)
            }
            if (index === (connectedPages.length - 1)) {
              // reconnect all pages
              reconnectPages(connectedPages, user)
            }
          })
        })
      }
    })
  })
}

function reconnectPages (connectedPages, user) {
  connectedPages.forEach((page, index) => {
    Pages.update({_id: page._id}, {connected: true}, (err) => {
      if (err) {
        logger.serverLog(TAG, `Line 753: ERROR! at updating pages: ${JSON.stringify(err)}`)
      } else {
        const options = {
          url: `https://graph.facebook.com/v2.6/${page.pageId}/subscribed_apps?access_token=${page.accessToken}`,
          qs: {access_token: page.accessToken},
          method: 'POST'
        }

        needle.post(options.url, options, (error, response) => {
          if (error) {
            logger.serverLog(TAG, `Line 763: ERROR! at subscribing app to facebook: ${JSON.stringify(err)}`)
          }
        })
      }
    })
  })
}

module.exports = router
