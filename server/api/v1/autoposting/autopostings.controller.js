/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../../components/logger')
const AutoPosting = require('./autopostings.model')
const TAG = 'api/autoposting/migrations.controller.js'
const TwitterUtility = require('../../../config/integrations/twitter')
const CompanyUsers = require('./../companyuser/companyuser.model')
const Page = require('./../pages/Pages.model')

const urllib = require('url')
const crypto = require('crypto')
const config = require('../../../config/environment/index')
const _ = require('lodash')
const CompanyUsage = require('./../featureUsage/companyUsage.model')
const PlanUsage = require('./../featureUsage/planUsage.model')
const CompanyProfile = require('./../companyprofile/companyprofile.model')
const callApi = require('./../api.caller.service.js')
const fs = require('fs')

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
    AutoPosting.find({companyId: companyUser.companyId}, (err, autoposting) => {
      if (err) {
        return res.status(500)
        .json({status: 'failed', description: 'Autoposting query failed'})
      }
      res.status(200).json({
        status: 'success',
        payload: autoposting
      })
    })
  })
}

exports.getPlugin = function (req, res) {
  logger.serverLog(TAG, 'Hit the getPlugin Endpoint')

  let plguinPath = `${config.root}/plugins/HookPress.zip`
  logger.serverLog(TAG, `${plguinPath} is the path`)

  fs.stat(plguinPath, (err, stat) => {
    if (err === null) {
      // File exists
      logger.serverLog(TAG, `Plugin Found and being sent`)
      return res.sendFile(plguinPath)
    } else if (err.code === 'ENOENT') {
      // File does not exists
      logger.serverLog(TAG, `Plugin File not found`)
      return res.status(404).json({status: 'failed', payload: 'Plugin Not Found'})
    } else {
      // There is some other FS error
      logger.serverLog(TAG, 'There is some error ')
      return res.status(500).json({status: 'failed', payload: err.code})
    }
  })

}

exports.create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'subscriptionUrl')) parametersMissing = true
  if (!_.has(req.body, 'subscriptionType')) parametersMissing = true
  if (!_.has(req.body, 'accountTitle')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
    .json({status: 'failed', description: 'Parameters are missing'})
  }

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
    CompanyProfile.findOne({ownerId: req.user._id}, (err, companyProfile) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      PlanUsage.findOne({planId: companyProfile.planId}, (err, planUsage) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        CompanyUsage.findOne({companyId: companyProfile._id}, (err, companyUsage) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          AutoPosting.count(
            {companyId: companyUser.companyId, subscriptionType: req.body.subscriptionType},
            (error, gotCount) => {
              if (error) {
                return res.status(500).json({
                  status: 'failed',
                  description: 'Internal Server Error'
                })
              }
              if (gotCount > 0 && !companyUser.enableMoreAutoPostingIntegration) {
                res.status(403).json({
                  status: 'Failed',
                  description: 'Cannot add more integrations. Please contact support or remove existing ones'
                })
              } else {
                AutoPosting.find(
                  {companyId: companyUser.companyId, subscriptionUrl: req.body.subscriptionUrl},
                  (error, gotData) => {
                    if (error) {
                      return res.status(500).json({
                        status: 'failed',
                        description: 'Internal Server Error'
                      })
                    }
                    if (gotData.length > 0) {
                      res.status(403).json({
                        status: 'Failed',
                        description: 'Cannot add duplicate accounts.'
                      })
                    } else {
                      let autoPostingPayload = {
                        userId: req.user._id,
                        companyId: companyUser.companyId,
                        subscriptionUrl: req.body.subscriptionUrl,
                        subscriptionType: req.body.subscriptionType,
                        accountTitle: req.body.accountTitle
                      }
                      if (req.body.isSegmented) {
                        autoPostingPayload.isSegmented = true
                        autoPostingPayload.segmentationPageIds = (req.body.segmentationPageIds)
                          ? req.body.pageIds
                          : null
                        autoPostingPayload.segmentationGender = (req.body.segmentationGender)
                          ? req.body.segmentationGender
                          : null
                        autoPostingPayload.segmentationLocale = (req.body.segmentationLocale)
                          ? req.body.segmentationLocale
                          : null
                        autoPostingPayload.segmentationTags = (req.body.segmentationTags)
                          ? req.body.segmentationTags
                          : null
                      }
                      if (req.body.subscriptionType === 'twitter') {
                        if (planUsage.twitter_autoposting !== -1 && companyUsage.twitter_autoposting >= planUsage.twitter_autoposting) {
                          return res.status(500).json({
                            status: 'failed',
                            description: `Your twitter autopostings limit has reached. Please upgrade your plan to premium in order to add more feeds`
                          })
                        }
                        let url = req.body.subscriptionUrl
                        let urlAfterDot = url.substring(url.indexOf('.') + 1)
                        let screenName = urlAfterDot.substring(urlAfterDot.indexOf('/') + 1)
                        if (screenName.indexOf('/') > -1) screenName = screenName.substring(0, screenName.length - 1)
                        TwitterUtility.findUser(screenName, (err, data) => {
                          if (err) {
                            logger.serverLog(TAG, `Twitter URL parse Error ${err}`)
                            // return res.status(403).json({
                            //   status: 'Failed',
                            //   description: err
                            // })
                          }
                          autoPostingPayload.accountUniqueName = data.screen_name
                          let payload = {
                            id: data.id,
                            name: data.name,
                            screen_name: data.screen_name,
                            profile_image_url: data.profile_image_url_https
                          }
                          autoPostingPayload.payload = payload
                          const autoPosting = new AutoPosting(autoPostingPayload)
                          autoPosting.save((err, createdRecord) => {
                            if (err) {
                              res.status(500).json({
                                status: 'Failed',
                                error: err,
                                description: 'Failed to insert record'
                              })
                            } else {
                              CompanyUsage.update({companyId: companyUser.companyId},
                                { $inc: { twitter_autoposting: 1 } }, (err, updated) => {
                                  if (err) {
                                    logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                                  }
                                })
                              //  TwitterUtility.restart()
                              callApi.callApi('twitter/restart')
                              res.status(201)
                              .json({status: 'success', payload: createdRecord})
                              require('./../../../config/socketio').sendMessageToClient({
                                room_id: companyUser.companyId,
                                body: {
                                  action: 'autoposting_created',
                                  payload: {
                                    autoposting_id: createdRecord._id,
                                    user_id: req.user._id,
                                    user_name: req.user.name,
                                    payload: createdRecord
                                  }
                                }
                              })
                            }
                          })
                        })
                      } else if (req.body.subscriptionType === 'facebook') {
                        if (planUsage.facebook_autoposting !== -1 && companyUsage.facebook_autoposting >= planUsage.facebook_autoposting) {
                          return res.status(500).json({
                            status: 'failed',
                            description: `Your facebook autopostings limit has reached. Please upgrade your plan to premium in order to add more feeds`
                          })
                        }
                        let url = req.body.subscriptionUrl
                        let urlAfterDot = url.substring(url.indexOf('.') + 1)
                        let screenName = urlAfterDot.substring(urlAfterDot.indexOf('/') + 1)
                        while (screenName.indexOf('-') > -1) screenName = screenName.substring(screenName.indexOf('-') + 1)
                        if (screenName.indexOf('/') > -1) screenName = screenName.substring(0, screenName.length - 1)
                        Page.findOne({
                          userId: req.user._id,
                          $or: [{pageId: screenName}, {pageUserName: screenName}]
                        }, (err, pageInfo) => {
                          if (err) {
                            logger.serverLog(TAG, `Facebook URL parse Error ${err}`)
                            return res.status(403).json({
                              status: 'Failed',
                              description: err
                            })
                          }
                          if (!pageInfo) {
                            return res.status(404).json({
                              status: 'Failed',
                              description: 'Cannot add this page or page not found'
                            })
                          }
                          let autoPostingPayload = {
                            userId: req.user._id,
                            companyId: companyUser.companyId,
                            subscriptionUrl: req.body.subscriptionUrl,
                            subscriptionType: req.body.subscriptionType,
                            accountTitle: req.body.accountTitle,
                            accountUniqueName: pageInfo.pageId
                          }
                          if (req.body.isSegmented) {
                            autoPostingPayload.isSegmented = true
                            autoPostingPayload.segmentationPageIds = (req.body.segmentationPageIds)
                              ? req.body.pageIds
                              : null
                            autoPostingPayload.segmentationGender = (req.body.segmentationGender)
                              ? req.body.segmentationGender
                              : null
                            autoPostingPayload.segmentationLocale = (req.body.segmentationLocale)
                              ? req.body.segmentationLocale
                              : null
                            autoPostingPayload.segmentationTags = (req.body.segmentationTags)
                              ? req.body.segmentationTags
                              : null
                          }
                          const autoPosting = new AutoPosting(autoPostingPayload)
                          autoPosting.save((err, createdRecord) => {
                            if (err) {
                              res.status(500).json({
                                status: 'Failed',
                                error: err,
                                description: 'Failed to insert record'
                              })
                            } else {
                              CompanyUsage.update({companyId: companyUser.companyId},
                                { $inc: { facebook_autoposting: 1 } }, (err, updated) => {
                                  if (err) {
                                    logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                                  }
                                })
                              res.status(201)
                              .json({status: 'success', payload: createdRecord})
                              require('./../../../config/socketio').sendMessageToClient({
                                room_id: companyUser.companyId,
                                body: {
                                  action: 'autoposting_created',
                                  payload: {
                                    autoposting_id: createdRecord._id,
                                    user_id: req.user._id,
                                    user_name: req.user.name,
                                    payload: createdRecord
                                  }
                                }
                              })
                            }
                          })
                        })
                      } else if (req.body.subscriptionType === 'youtube') {
                        // URL https://www.youtube.com/channel/UCcQnaQ0sHD9A0GXKcXBVE-Q
                        let url = req.body.subscriptionUrl
                        let urlAfterDot = url.substring(url.indexOf('.') + 1)
                        let firstParse = urlAfterDot.substring(urlAfterDot.indexOf('/') + 1)
                        let channelName = firstParse.substring(firstParse.indexOf('/') + 1)
                        let autoPostingPayload = {
                          userId: req.user._id,
                          companyId: companyUser.companyId,
                          subscriptionUrl: req.body.subscriptionUrl,
                          subscriptionType: req.body.subscriptionType,
                          accountTitle: req.body.accountTitle,
                          accountUniqueName: channelName
                        }
                        if (req.body.isSegmented) {
                          autoPostingPayload.isSegmented = true
                          autoPostingPayload.segmentationPageIds = (req.body.segmentationPageIds)
                            ? req.body.pageIds
                            : null
                          autoPostingPayload.segmentationGender = (req.body.segmentationGender)
                            ? req.body.segmentationGender
                            : null
                          autoPostingPayload.segmentationLocale = (req.body.segmentationLocale)
                            ? req.body.segmentationLocale
                            : null
                          autoPostingPayload.segmentationTags = (req.body.segmentationTags)
                            ? req.body.segmentationTags
                            : null
                        }
                        const autoPosting = new AutoPosting(autoPostingPayload)
                        autoPosting.save((err, createdRecord) => {
                          if (err) {
                            res.status(500).json({
                              status: 'Failed',
                              description: 'Failed to insert record'
                            })
                          } else {
                            res.status(201).json({status: 'success', payload: createdRecord})
                          }
                        })
                      } else if (req.body.subscriptionType === 'wordpress') {
                        if (planUsage.wordpress_autoposting !== -1 && companyUsage.wordpress_autoposting >= planUsage.wordpress_autoposting) {
                          return res.status(500).json({
                            status: 'failed',
                            description: `Your wordpress autopostings limit has reached. Please upgrade your plan to premium in order to add more feeds`
                          })
                        }
                        let url = req.body.subscriptionUrl
                        let wordpressUniqueId = url.split('/')[0] + url.split('/')[1] + '//' + url.split('/')[2]
                        let autoPostingPayload = {
                          userId: req.user._id,
                          companyId: companyUser.companyId,
                          subscriptionUrl: req.body.subscriptionUrl,
                          subscriptionType: req.body.subscriptionType,
                          accountTitle: req.body.accountTitle,
                          accountUniqueName: wordpressUniqueId
                        }

                        if (req.body.isSegmented) {
                          autoPostingPayload.isSegmented = true
                          autoPostingPayload.segmentationPageIds = (req.body.segmentationPageIds)
                            ? req.body.pageIds
                            : null
                          autoPostingPayload.segmentationGender = (req.body.segmentationGender)
                            ? req.body.segmentationGender
                            : null
                          autoPostingPayload.segmentationLocale = (req.body.segmentationLocale)
                            ? req.body.segmentationLocale
                            : null
                          autoPostingPayload.segmentationTags = (req.body.segmentationTags)
                            ? req.body.segmentationTags
                            : null
                        }

                        const autoPosting = new AutoPosting(autoPostingPayload)
                        autoPosting.save((err, createdRecord) => {
                          if (err) {
                            res.status(500).json({
                              status: 'Failed',
                              error: err,
                              description: 'Failed to insert record'
                            })
                          } else {
                            CompanyUsage.update({companyId: companyUser.companyId},
                              { $inc: { wordpress_autoposting: 1 } }, (err, updated) => {
                                if (err) {
                                  logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                                }
                              })
                            res.status(201)
                            .json({status: 'success', payload: createdRecord})
                            require('./../../../config/socketio').sendMessageToClient({
                              room_id: companyUser.companyId,
                              body: {
                                action: 'autoposting_created',
                                payload: {
                                  autoposting_id: createdRecord._id,
                                  user_id: req.user._id,
                                  user_name: req.user.name,
                                  payload: createdRecord
                                }
                              }
                            })
                          }
                        })
                      }
                    }
                  })
              }
            })
        })
      })
    })
  })
}

exports.edit = function (req, res) {
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

    AutoPosting.findById(req.body._id, (err, autoposting) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!autoposting) {
        return res.status(404)
          .json({status: 'failed', description: 'Record not found'})
      }

      autoposting.accountTitle = req.body.accountTitle
      autoposting.isSegmented = req.body.isSegmented
      autoposting.segmentationPageIds = req.body.segmentationPageIds
      autoposting.segmentationGender = req.body.segmentationGender
      autoposting.segmentationLocale = req.body.segmentationLocale
      autoposting.segmentationTags = req.body.segmentationTags
      autoposting.isActive = req.body.isActive
      autoposting.save((err2) => {
        if (err2) {
          return res.status(500)
            .json({status: 'failed', description: 'AutoPosting update failed'})
        }
        res.status(200).json({status: 'success', payload: autoposting})
        require('./../../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'autoposting_updated',
            payload: {
              autoposting_id: autoposting._id,
              user_id: req.user._id,
              user_name: req.user.name,
              payload: autoposting
            }
          }
        })
      })
    })
  })
}

exports.destroy = function (req, res) {
  AutoPosting.findById(req.params.id, (err, autoposting) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!autoposting) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    autoposting.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'AutoPosting update failed'})
      }
      //  TwitterUtility.restart()
      callApi.callApi('twitter/restart')
      require('./../../../config/socketio').sendMessageToClient({
        room_id: autoposting.companyId,
        body: {
          action: 'autoposting_removed',
          payload: {
            autoposting_id: autoposting._id,
            user_id: req.user._id,
            user_name: req.user.name
          }
        }
      })
      return res.status(204).end()
    })
  })
}

// todo for new twitter activity api version
exports.twitterwebhook = function (req, res) {
  return res.status(200).json({status: 'success', description: 'got the data.'})
}

exports.twitterverify = function (req, res) {
  const hmac = crypto.createHmac('sha256', config.twitter.consumerSecret)

  hmac.on('readable', () => {
    const data = hmac.read()
    if (data) {
      return res.status(200).json({
        response_token: `sha256=${data.toString('hex')}`
      })
    }
  })

  hmac.write(req.params.crc_token)
  hmac.end()
}

exports.pubsubhook = function (req, res) {
  let params = urllib.parse(req.url, true, true)

  // Does not seem to be a valid PubSubHubbub request
  if (!params.query['hub.topic'] || !params.query['hub.mode']) {
    return res.status(400).json({status: 'failed', description: 'bad request'})
  }

  switch (params.query['hub.mode']) {
    case 'denied':
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end(params.query['hub.challenge'] || 'ok')
      break
    case 'subscribe':
    case 'unsubscribe':
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end(params.query['hub.challenge'])
      break
    default:
      // Not a valid mode
      return res.status(403).json({status: 'failed', description: 'forbidden'})
  }
  // return res.status(200).json({status: 'success', description: 'got the data.'})
}

exports.pubsubhookPost = function (req, res) {
  let bodyChunks = []
  let params = urllib.parse(req.url, true, true)
  let topic = params && params.query && params.query.topic
  let hub = params && params.query && params.query.hub
  let bodyLen = 0
  let tooLarge = false
  let signatureParts
  let algo
  let signature
  let hmac

  // v0.4 hubs have a link header that includes both the topic url and hub url
  ((req.headers && req.headers.link) || '').replace(
    /<([^>]+)>\s*(?:;\s*rel=['"]([^'"]+)['"])?/gi,
    function (o, url, rel) {
      switch ((rel || '').toLowerCase()) {
        case 'self':
          topic = url
          break
        case 'hub':
          hub = url
          break
      }
    })
  if (!topic) {
    return _sendError(req, res, 400, 'Bad Request')
  }

  // Hub must notify with signature header if secret specified.
  if (this.secret && !req.headers['x-hub-signature']) {
    return _sendError(req, res, 403, 'Forbidden')
  }

  if (this.secret) {
    signatureParts = req.headers['x-hub-signature'].split('=')
    algo = (signatureParts.shift() || '').toLowerCase()
    signature = (signatureParts.pop() || '').toLowerCase()

    try {
      hmac = crypto.createHmac(algo,
        crypto.createHmac('sha1', this.secret).update(topic).digest('hex'))
    } catch (E) {
      return _sendError(req, res, 403, 'Forbidden')
    }
  }

  req.on('data', function (chunk) {
    if (!chunk || !chunk.length || tooLarge) {
      return
    }

    if (bodyLen + chunk.length <= this.maxContentSize) {
      bodyChunks.push(chunk)
      bodyLen += chunk.length
      if (this.secret) {
        hmac.update(chunk)
      }
    } else {
      tooLarge = true
    }

    chunk = null
  }.bind(this))

  req.on('end', function () {
    if (tooLarge) {
      return _sendError(req, res, 413, 'Request Entity Too Large')
    }

    // Must return 2xx code even if signature doesn't match.
    if (this.secret && hmac.digest('hex').toLowerCase() !== signature) {
      res.writeHead(202, {'Content-Type': 'text/plain; charset=utf-8'})
      return res.end()
    }

    res.writeHead(204, {'Content-Type': 'text/plain; charset=utf-8'})
    res.end()

    logger.serverLog(TAG, {
      topic: topic,
      hub: hub,
      callback: 'http://' + req.headers.host + req.url,
      feed: Buffer.concat(bodyChunks, bodyLen),
      headers: req.headers
    })

    this.emit('feed', {
      topic: topic,
      hub: hub,
      callback: 'http://' + req.headers.host + req.url,
      feed: Buffer.concat(bodyChunks, bodyLen),
      headers: req.headers
    })
  }.bind(this))
  // return res.status(200).json({status: 'success', description: 'got the data.'})
}

function _sendError (req, res, code, message) {
  res.writeHead(code, {'Content-Type': 'text/html'})
  res.end('<!DOCTYPE html>\n' +
    '<html>\n' +
    '    <head>\n' +
    '        <meta charset="utf-8"/>\n' +
    '        <title>' + code + ' ' + message + '</title>\n' +
    '    </head>\n' +
    '    <body>\n' +
    '        <h1>' + code + ' ' + message + '</h1>\n' +
    '    </body>\n' +
    '</html>')
}
