/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Subscribers = require('./Subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const TAG = 'api/subscribers/subscribers.controller.js'

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
    Subscribers.find({ companyId: companyUser.companyId, isEnabledByPage: true, isSubscribed: true }).populate('pageId').exec((err, subscribers) => {
      if (err) {
        logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
        return res.status(404)
        .json({status: 'failed', description: 'Subscribers not found'})
      }
      res.status(200).json(subscribers)
    })
  })
}
