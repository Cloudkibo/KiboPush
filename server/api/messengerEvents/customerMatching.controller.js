const logger = require('../../components/logger')
const TAG = 'api/messengerEvents/customerMatching.controller.js'
const Subscribers = require('../subscribers/Subscribers.model')
const Webhooks = require(
  './../webhooks/webhooks.model')
const needle = require('needle')
const webhookUtility = require('./../webhooks/webhooks.utility')
const Lists = require('../lists/lists.model')
const CompanyUsage = require('./../featureUsage/companyUsage.model')
const PlanUsage = require('./../featureUsage/planUsage.model')
const Pages = require('../pages/Pages.model')
const PhoneNumber = require('../growthtools/growthtools.model')
const CompanyProfile = require('../companyprofile/companyprofile.model')
const utility = require('./utility')

exports.customerMatching = function (req, res) {
  logger.serverLog(TAG, `body ${JSON.stringify(req.body)}`)
  for (let i = 0; i < req.body.entry[0].messaging.length; i++) {
    const event = req.body.entry[0].messaging[i]
    let phoneNumber = event.prior_message.identifier
    const sender = event.sender.id
    const pageId = event.recipient.id
    Pages.find({ pageId: pageId, connected: true }).populate('userId')
      .exec((err, pages) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        pages.forEach((page) => {
          PhoneNumber.update({
            number: req.body.entry[0].messaging[0].prior_message.identifier,
            pageId: page._id,
            companyId: page.companyId
          }, {
            hasSubscribed: true
          }, (err2, phonenumbersaved) => {
            if (err2) {
              logger.serverLog(TAG, err2)
            }
          })
          needle.get(
            `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
            (err, resp2) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }
              let pageAccessToken = resp2.body.access_token
              const options = {
                url: `https://graph.facebook.com/v2.6/${sender}?access_token=${pageAccessToken}`,
                qs: { access_token: page.accessToken },
                method: 'GET'

              }
              needle.get(options.url, options, (error, response) => {
                logger.serverLog(TAG, `Subscriber response git from facebook: ${JSON.stringify(response.body)}`)
                const subsriber = response.body
                if (!error && !response.error) {
                  const payload = {
                    firstName: subsriber.first_name,
                    lastName: subsriber.last_name,
                    locale: subsriber.locale,
                    gender: subsriber.gender,
                    userId: page.userId,
                    provider: 'facebook',
                    timezone: subsriber.timezone,
                    profilePic: subsriber.profile_pic,
                    companyId: page.companyId,
                    pageScopedId: '',
                    email: '',
                    senderId: sender,
                    pageId: page._id,
                    isSubscribed: true,
                    phoneNumber: phoneNumber,
                    source: 'customer_matching'
                  }
                  Pages.findOne({ _id: page._id, connected: true },
                    (err, pageFound) => {
                      if (err) logger.serverLog(TAG, err)
                      if (subsriber === null) {
                        // subsriber not found, create subscriber
                        CompanyProfile.findOne({ _id: page.companyId },
                          function (err, company) {
                            if (err) {
                            }
                            PlanUsage.findOne({planId: company.planId}, (err, planUsage) => {
                              if (err) {
                              }
                              CompanyUsage.findOne({companyId: page.companyId}, (err, companyUsage) => {
                                if (err) {
                                }
                                if (planUsage.subscribers !== -1 && companyUsage.subscribers >= planUsage.subscribers) {
                                  webhookUtility.limitReachedNotification('subscribers', company)
                                } else {
                                  Subscribers.create(payload,
                                    (err2, subscriberCreated) => {
                                      if (err2) {
                                        logger.serverLog(TAG, err2)
                                      }
                                      CompanyUsage.update({companyId: page.companyId},
                                        { $inc: { subscribers: 1 } }, (err, updated) => {
                                          if (err) {
                                            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                                          }
                                        })
                                      Webhooks.findOne({ pageId: pageId }).populate('userId').exec((err, webhook) => {
                                        if (err) logger.serverLog(TAG, err)
                                        if (webhook && webhook.isEnabled) {
                                          needle.get(webhook.webhook_url, (err, r) => {
                                            if (err) {
                                              logger.serverLog(TAG, err)
                                            } else if (r.statusCode === 200) {
                                              if (webhook && webhook.optIn.NEW_SUBSCRIBER) {
                                                var data = {
                                                  subscription_type: 'NEW_SUBSCRIBER',
                                                  payload: JSON.stringify({ subscriber: subsriber, recipient: pageId, sender: sender })
                                                }
                                                needle.post(webhook.webhook_url, data,
                                                  (error, response) => {
                                                    if (error) logger.serverLog(TAG, err)
                                                  })
                                              }
                                            } else {
                                              webhookUtility.saveNotification(webhook)
                                            }
                                          })
                                        }
                                      })
                                      updateList(phoneNumber, sender, page)
                                      if (!(event.postback &&
                                        event.postback.title === 'Get Started')) {
                                        utility.createSession(page, subscriberCreated,
                                          event)
                                      }
                                      require('./../../config/socketio')
                                        .sendMessageToClient({
                                          room_id: page.companyId,
                                          body: {
                                            action: 'dashboard_updated',
                                            payload: {
                                              subscriber_id: subscriberCreated._id,
                                              company_id: page.companyId
                                            }
                                          }
                                        })
                                    })
                                }
                              })
                            })
                          })
                      } else {
                        if (!subsriber.isSubscribed) {
                          // subscribing the subscriber again in case he
                          // or she unsubscribed and removed chat
                          Subscribers.update({ senderId: sender }, {
                            isSubscribed: true,
                            isEnabledByPage: true
                          }, (err, subscriber) => {
                            if (err) return logger.serverLog(TAG, err)
                            logger.serverLog(TAG, subscriber)
                          })
                        }
                        if (!(event.postback &&
                          event.postback.title === 'Get Started')) {
                          utility.createSession(page, subsriber, event)
                        }
                      }
                    })
                } else {
                  if (error) {
                    logger.serverLog(TAG, `ERROR in fetching subscriber info ${JSON.stringify(error)}`)
                  }
                }
              })
            })
        })
      })
  }
}
function updateList (phoneNumber, sender, page) {
  PhoneNumber.find({
    number: phoneNumber,
    hasSubscribed: true,
    pageId: page,
    companyId: page.companyId
  }, (err, number) => {
    if (err) {
    }
    if (number.length > 0) {
      let subscriberFindCriteria = {
        source: 'customer_matching',
        senderId: sender,
        isSubscribed: true,
        phoneNumber: phoneNumber,
        pageId: page._id
      }
      Subscribers.find(subscriberFindCriteria)
        .populate('pageId')
        .exec((err, subscribers) => {
          if (err) {
          }
          let temp = []
          for (let i = 0; i < subscribers.length; i++) {
            temp.push(subscribers[i]._id)
          }
          Lists.update(
            { listName: number[0].fileName, companyId: page.companyId }, {
              content: temp
            }, (err2, savedList) => {
              if (err) {
              }
            })
        })
    }
  })
}
