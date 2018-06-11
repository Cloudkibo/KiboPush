const logger = require('../../components/logger')
const Permissions = require('./permissions.model')
const TAG = 'api/permissions/permissions.controller.js'
const CompanyUsers = require('./../companyuser/companyuser.model')

exports.fetchPermissions = function (req, res) {
  CompanyUsers.findOne({ domain_email: req.user.domain_email },
        (err, companyUser) => {
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
          Permissions
          .find({ companyId: companyUser.companyId })
          .populate('companyId')
          .populate('userId')
          .exec(
                (err, permissions) => {
                  if (err) {
                    logger.serverLog(TAG, `Error: ${err}`)
                    return res.status(500).json({
                      status: 'failed',
                      description: `Internal Server Error${JSON.stringify(err)}`
                    })
                  }
                  res.status(200).json({ status: 'success', payload: permissions })
                })
        })
}
