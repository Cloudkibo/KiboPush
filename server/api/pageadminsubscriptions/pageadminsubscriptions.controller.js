'use strict'

var _ = require('lodash')
var PageAdminSubscriptions = require('./pageadminsubscriptions.model')
var department = require('../department/department.model')
var configuration = require('../configuration/configuration.model')
var User = require('../user/user.model')
var logger = require('../../components/logger/logger')

// Get list of companyprofiles
exports.index = function (req, res) {
  PageAdminSubscriptions.find({userId: req.user._id})
    .populate('userId pageId companyId')
    .exec(function (err, subscriptionInfo) {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      return res.status(200)
        .json({status: 'success', payload: subscriptionInfo})
    })
}
