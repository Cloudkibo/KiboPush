'use strict'

var PageAdminSubscriptions = require('./pageadminsubscriptions.model')

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
