/* eslint-disable camelcase */
/**
 * Created by sojharo on 27/07/2017.
 */

const Webhooks = require('./webhooks.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const needle = require('needle')
//  var http = require('http')
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
    Webhooks.find({companyId: companyUser.companyId}, (err, webhooks) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      return res.status(201).json({status: 'success', payload: webhooks})
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
    Webhooks.find({companyId: companyUser.companyId, pageId: req.body.pageId}, (err, webhooks) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      if (webhooks && webhooks.length > 0) {
        return res.status(403).json({status: 'failed', description: 'Webhook for this page is already set'})
      } else {
        // var url = req.body.webhook_url
        // if (url.indexOf('//') > -1) {
        //   url = url.substring(url.indexOf('//') + 2)
        // }
        // if (url[url.length - 1] === '/') {
        //   url = url.substring(0, url.length - 1)
        // }
        // var options = {method: 'HEAD', host: url, port: 80}
        // var validUrl = http.request(options, function (err, r) {
        //   if (err) {}
        // })
        // validUrl.end()
        var url = req.body.webhook_url + '?token=' + req.body.token
        needle.get(url, (err, r) => {
          if (err) {
            return res.status(404).json({status: 'failed', description: 'This URL contains an invalid domain or the server at the given URL is not live.'})
          } else {
            if (r.statusCode === 200) {
              let webhookPayload = {
                webhook_url: req.body.webhook_url,
                companyId: companyUser.companyId,
                userId: req.user._id,
                isEnabled: true,
                optIn: req.body.optIn,
                pageId: req.body.pageId
              }

              const webhook = new Webhooks(webhookPayload)

              Webhooks.create(webhook, (err, webhook) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
                return res.status(201).json({status: 'success', payload: webhook})
              })
            } else {
              return res.status(404).json({status: 'failed', description: 'This URL contains an invalid domain or the server at the given URL is not live.'})
            }
          }
        })
      }
    })
  })
}

exports.edit = function (req, res) {
  Webhooks.findById(req.body._id, (err, webhook) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!webhook) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    var url = req.body.webhook_url + '?token=' + req.body.token
    needle.get(url, (err, r) => {
      if (err) {
        return res.status(404).json({status: 'failed', description: 'This URL contains an invalid domain or the server at the given URL is not live.'})
      } else if (r.statusCode === 200) {
        webhook.webhook_url = req.body.webhook_url
        webhook.optIn = req.body.optIn
        webhook.userId = req.user._id
        webhook.save((err2) => {
          if (err2) {
            return res.status(500)
              .json({status: 'failed', description: 'Poll update failed'})
          }
          res.status(201).json({status: 'success', payload: webhook})
        })
      } else {
        return res.status(404).json({status: 'failed', description: 'This URL contains an invalid domain or the server at the given URL is not live.'})
      }
    })
  })
}

exports.enabled = function (req, res) {
  Webhooks.findById(req.body._id, (err, webhook) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!webhook) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    webhook.isEnabled = req.body.isEnabled
    webhook.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      res.status(201).json({status: 'success', payload: webhook})
    })
  })
}
