/**
 * Created by sojharo on 01/08/2017.
 */

const logger = require('../../components/logger')
const PagePolls = require('./page_poll.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const TAG = 'api/page_poll/page_poll.controller.js'

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
    PagePolls.find({ companyId: companyUser.companyId }, (err, polls) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }
      res.status(200).json({ status: 'success', payload: polls })
    })
  })
}

exports.show = function (req, res) {
  PagePolls.find({ pollId: req.params.id }, (err, polls) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({ status: 'success', payload: polls })
  })
}
