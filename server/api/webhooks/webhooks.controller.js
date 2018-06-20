/* eslint-disable camelcase */
/**
 * Created by sojharo on 27/07/2017.
 */

const Webhooks = require('./webhooks.model')
const CompanyUsers = require('./../companyuser/companyuser.model')

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
      optIn: req.body.optIn
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
