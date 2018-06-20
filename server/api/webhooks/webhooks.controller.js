/* eslint-disable camelcase */
/**
 * Created by sojharo on 27/07/2017.
 */

const Webhooks = require('./webhooks.model')
const CompanyUsers = require('./../companyuser/companyuser.model')

exports.index = function (req, res) {
  Webhooks.findOne({pageId: req.params.id}, (err, webhook) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    return res.status(201).json({status: 'success', payload: webhook})
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
    let webhookPayload = {
      webhook_url: req.body.webhook_url,
      companyId: companyUser.companyId,
      isEnabled: req.body.isEnabled,
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
    webhook.webhook_url = req.body.webhook_url
    webhook.isEnabled = req.body.isEnabled
    webhook.optIn = req.body.optIn
    webhook.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      res.status(201).json({status: 'success', payload: webhook})
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
    webhook.optIn = req.body.optIn
    webhook.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      res.status(201).json({status: 'success', payload: webhook})
    })
  })
}
