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

exports.updatePermissions = function (req, res) {
  Permissions.findOne({ companyId: req.body.companyId, userId: req.body.userId }, (err, permission) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!permission) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    permission.apiPermission = req.body.apiPermission
    permission.surveyPermission = req.body.surveyPermission
    permission.subscriberPermission = req.body.subscriberPermission
    permission.pollsPermission = req.body.pollsPermission
    permission.pagesPermission = req.body.pagesPermission
    permission.pagesAccessPermission = req.body.pagesAccessPermission
    permission.menuPermission = req.body.menuPermission
    permission.livechatPermission = req.body.livechatPermission
    permission.autopostingPermission = req.body.autopostingPermission
    permission.broadcastPermission = req.body.broadcastPermission
    permission.invitationsPermission = req.body.invitationsPermission
    permission.deleteAgentPermission = req.body.deleteAgentPermission
    permission.inviteAgentPermission = req.body.inviteAgentPermission
    permission.updateRolePermission = req.body.updateRolePermission
    permission.deleteAdminPermission = req.body.deleteAdminPermission
    permission.inviteAdminPermission = req.body.inviteAdminPermission
    permission.membersPermission = req.body.membersPermission
    permission.companyUpdatePermission = req.body.companyUpdatePermission
    permission.companyPermission = req.body.companyPermission
    permission.dashboardPermission = req.body.dashboardPermission
    permission.customerMatchingPermission = req.body.customerMatchingPermission
    permission.terminateService = req.body.terminateService
    permission.upgradeService = req.body.upgradeService
    permission.downgradeService = req.body.downgradeService
    permission.billingPermission = req.body.billingPermission
    permission.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'permission update failed'})
      }
      res.status(201).json({status: 'success', payload: permission})
    })
  })
}
