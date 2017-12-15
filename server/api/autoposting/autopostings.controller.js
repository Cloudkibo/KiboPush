/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const AutoPosting = require('./autopostings.model')
const TAG = 'api/autoposting/autopostings.controller.js'
const TwitterUtility = require('../../config/integrations/twitter')
const Page = require('./../pages/Pages.model')

const urllib = require('url')
const crypto = require('crypto')
const config = require('../../config/environment/index')
const _ = require('lodash')

exports.index = function (req, res) {
  AutoPosting.find({userId: req.user._id}, (err, autoposting) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Autoposting query failed'})
    }
    res.status(200).json({
      status: 'success',
      payload: autoposting
    })
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

  AutoPosting.find(
    {userId: req.user._id, subscriptionUrl: req.body.subscriptionUrl},
    (error, gotData) => {
      if (error) {
        res.status(500).json({
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
        }
        if (req.body.subscriptionType === 'twitter') {
          let url = req.body.subscriptionUrl
          let urlAfterDot = url.substring(url.indexOf('.') + 1)
          let screenName = urlAfterDot.substring(urlAfterDot.indexOf('/') + 1)
          if (screenName.indexOf('/') > -1) screenName = screenName.substring(0, screenName.length - 1)
          TwitterUtility.findUser(screenName, (err, data) => {
            if (err) {
              logger.serverLog(TAG, `Twitter URL parse Error ${err}`)
              return res.status(403).json({
                status: 'Failed',
                description: err
              })
            }
            logger.serverLog(TAG, `Twitter user found ${data.screen_name}`)
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
                TwitterUtility.restart()
                res.status(201)
                  .json({status: 'success', payload: createdRecord})
              }
            })
          })
        } else if (req.body.subscriptionType === 'facebook') {
          let url = req.body.subscriptionUrl
          let urlAfterDot = url.substring(url.indexOf('.') + 1)
          let screenName = urlAfterDot.substring(urlAfterDot.indexOf('/') + 1)
          if (screenName.indexOf('/') > -1) screenName = screenName.substring(0, screenName.length - 1)
          logger.serverLog(TAG, `the parse got as ${screenName}`)
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
                logger.serverLog(TAG,
                  `FB Page added ${JSON.stringify(createdRecord)}`)
                res.status(201)
                  .json({status: 'success', payload: createdRecord})
              }
            })
          })
        } else if (req.body.subscriptionType === 'youtube') {
          // URL https://www.youtube.com/channel/UCcQnaQ0sHD9A0GXKcXBVE-Q
          let url = req.body.subscriptionUrl
          let urlAfterDot = url.substring(url.indexOf('.') + 1)
          let firstParse = urlAfterDot.substring(urlAfterDot.indexOf('/') + 1)
          let channelName = firstParse.substring(firstParse.indexOf('/') + 1)
          logger.serverLog(TAG, `the parse got as ${channelName}`)
          let autoPostingPayload = {
            userId: req.user._id,
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
          }
          const autoPosting = new AutoPosting(autoPostingPayload)
          autoPosting.save((err, createdRecord) => {
            if (err) {
              res.status(500).json({
                status: 'Failed',
                description: 'Failed to insert record'
              })
            } else {
              logger.serverLog(TAG,
                `Youtube added ${JSON.stringify(createdRecord)}`)
              res.status(201).json({status: 'success', payload: createdRecord})
            }
          })
        }
      }
    })
}

exports.edit = function (req, res) {
  logger.serverLog(TAG,
    `This is body in edit autoposting ${JSON.stringify(req.body)}`)
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
    autoposting.isActive = req.body.isActive
    autoposting.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'AutoPosting update failed'})
      }
      return res.status(200).json({status: 'success', payload: autoposting})
    })
  })
}

exports.destroy = function (req, res) {
  logger.serverLog(TAG,
    `This is body in delete autoposting ${JSON.stringify(req.params)}`)
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
      TwitterUtility.restart()
      return res.status(204).end()
    })
  })
}

// todo for new twitter activity api version
exports.twitterwebhook = function (req, res) {
  logger.serverLog(TAG, 'Twitter Webhook Called')
  logger.serverLog(TAG, JSON.stringify(req.body))
  return res.status(200).json({status: 'success', description: 'got the data.'})
}

exports.twitterverify = function (req, res) {
  logger.serverLog(TAG, 'Twitter verify webhook called')
  logger.serverLog(TAG, JSON.stringify(req.params))

  const hmac = crypto.createHmac('sha256', config.twitter.consumerSecret)

  hmac.on('readable', () => {
    const data = hmac.read()
    if (data) {
      logger.serverLog(TAG, data.toString('hex'))
      return res.status(200).json({
        response_token: `sha256=${data.toString('hex')}`
      })
    }
  })

  hmac.write(req.params.crc_token)
  hmac.end()
}

exports.pubsubhook = function (req, res) {
  logger.serverLog(TAG, 'PUBSUBHUBBUB Webhook Called')
  let params = urllib.parse(req.url, true, true)

  logger.serverLog(TAG, JSON.stringify(params.query))

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
  logger.serverLog(TAG, 'PUBSUBHUBBUB Webhook Post Called')
  logger.serverLog(TAG, JSON.stringify(req.headers))
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

  logger.serverLog(TAG, 'topic found')
  logger.serverLog(TAG, topic)
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
