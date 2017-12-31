/**
 * Created by sojharo on 01/08/2017.
 */

const logger = require('../../components/logger')
const PageBroadcasts = require('./page_broadcast.model')
const CompanyUsers = require('./../companyuser/companyuser.model')

const TAG = 'api/page_broadcast/page_broadcast.controller.js'

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
    PageBroadcasts.find({ companyId: companyUser.companyId }, (err, broadcasts) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }
      res.status(200).json({ status: 'success', payload: broadcasts })
    })
  })
}

exports.show = function (req, res) {
  PageBroadcasts.find({ broadcastId: req.params.id }, (err, broadcasts) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({ status: 'success', payload: broadcasts })
  })
}
