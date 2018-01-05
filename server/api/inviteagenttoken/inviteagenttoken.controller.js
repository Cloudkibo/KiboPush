'use strict'

let _ = require('lodash')
let Inviteagenttoken = require('./inviteagenttoken.model')
let config = require('./../../config/environment/index')
let path = require('path')

const logger = require('../../components/logger')

const TAG = 'api/inviteagenttoken/inviteagenttoken.controller.js'

exports.verify = function (req, res) {
  logger.serverLog(TAG, req.params)
  Inviteagenttoken.findOne({token: req.params.id}, function (err, verificationtoken) {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!verificationtoken) {
      return res.sendFile(path.join(config.root, 'client/pages/join_company_failed.html'))
    } else {
      res.cookie('email', verificationtoken.email, { expires: new Date(Date.now() + 900000) })
      res.cookie('companyId', verificationtoken.companyId, { expires: new Date(Date.now() + 900000) })
      res.cookie('companyName', verificationtoken.companyName, { expires: new Date(Date.now() + 900000) })
      res.cookie('domain', verificationtoken.domain, { expires: new Date(Date.now() + 900000) })
      return res.sendFile(path.join(config.root, 'client/pages/join_company_success.html'))
    }
  })
}
