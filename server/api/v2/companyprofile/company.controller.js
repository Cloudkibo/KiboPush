// const logger = require('../../../components/logger')
// const TAG = 'api/companyprofile/company.controller.js'
const utility = require('../utility')
// const logicLayer = require('./commentCapture.logiclayer')

exports.members = function (req, res) {
  utility.callApi(`companyprofile/members`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization)
    .then(members => {
      res.status(200).json({status: 'success', payload: members})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: `Failed to fetch members ${err}`})
    })
}
