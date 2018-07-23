const logger = require('../../components/logger')
const UserPermissions = require('./permissions.model')
const RolePermissions = require('./rolePermissions.model')
const TAG = 'api/permissions/permissions.controller.js'
const CompanyUsers = require('./../companyuser/companyuser.model')
const _ = require('lodash')

exports.index = function (req, res) {
  RolePermissions.findOne({role: req.params.role}, (err, permissions) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: permissions
    })
  })
}

exports.update = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'permissions')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  RolePermissions.findOne({role: req.body.permissions.role}, (err, permissions) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    permissions = req.body.permissions
    permissions.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Permissions update failed'})
      }
      res.status(200).json({
        status: 'success',
        description: 'Permissions have been updated successfully!'
      })
    })
  })
}

exports.create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'name')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  var temp = req.body.name.split(' ')
  for (var i = 1; i < temp.length; i++) {
    temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1)
  }
  var permission = temp.toString().replace(new RegExp(',', 'g'), '')
  let query = {}
  query[permission] = false

  RolePermissions.update({}, {$set: query}, {multi: true}, (err, updated) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    UserPermissions.update({}, {$set: query}, {multi: true}, (err, updated) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      res.status(200).json({
        status: 'success',
        description: 'Permission has been added successfully!'
      })
    })
  })
}

exports.populateRolePermissions = function (req, res) {
  let buyerPermissions = {
    role: 'buyer',
    billingPermission: true,
    downgradeService: true,
    upgradeService: true,
    terminateService: true,
    customerMatchingPermission: true,
    dashboardPermission: true,
    companyPermission: true,
    companyUpdatePermission: true,
    membersPermission: true,
    inviteAdminPermission: true,
    deleteAdminPermission: true,
    updateRolePermission: true,
    inviteAgentPermission: true,
    deleteAgentPermission: true,
    invitationsPermission: true,
    broadcastPermission: true,
    autopostingPermission: true,
    livechatPermission: true,
    menuPermission: true,
    pagesAccessPermission: true,
    pagesPermission: true,
    pollsPermission: true,
    subscriberPermission: true,
    surveyPermission: true,
    apiPermission: true
  }
  let buyer = new RolePermissions(buyerPermissions)
  buyer.save((err) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Failed to insert buyer record'})
    }
    let adminPermissions = {
      role: 'admin',
      billingPermission: false,
      downgradeService: false,
      upgradeService: false,
      terminateService: false,
      customerMatchingPermission: true,
      dashboardPermission: true,
      companyPermission: true,
      companyUpdatePermission: false,
      membersPermission: true,
      inviteAdminPermission: true,
      deleteAdminPermission: true,
      promoteToAdminPermission: true,
      inviteAgentPermission: true,
      deleteAgentPermission: true,
      updateRolePermission: true,
      invitationsPermission: true,
      broadcastPermission: true,
      autopostingPermission: true,
      livechatPermission: true,
      menuPermission: true,
      pagesAccessPermission: true,
      pagesPermission: true,
      pollsPermission: true,
      subscriberPermission: true,
      surveyPermission: true,
      apiPermission: false
    }
    let admin = new RolePermissions(adminPermissions)
    admin.save((err) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Failed to insert admin record'})
      }
      let agentPermissions = {
        role: 'agent',
        billingPermission: false,
        downgradeService: false,
        upgradeService: false,
        terminateService: false,
        customerMatchingPermission: false,
        dashboardPermission: true,
        companyPermission: true,
        companyUpdatePermission: false,
        membersPermission: true,
        inviteAdminPermission: false,
        deleteAdminPermission: false,
        updateRolePermission: false,
        inviteAgentPermission: false,
        deleteAgentPermission: false,
        invitationsPermission: false,
        broadcastPermission: true,
        autopostingPermission: true,
        livechatPermission: true,
        menuPermission: true,
        pagesAccessPermission: true,
        pagesPermission: false,
        pollsPermission: true,
        subscriberPermission: true,
        surveyPermission: true,
        apiPermission: false
      }
      let agent = new RolePermissions(agentPermissions)
      agent.save((err) => {
        if (err) {
          return res.status(500)
            .json({status: 'failed', description: 'Failed to insert admin record'})
        }
        res.status(200).json({
          status: 'success',
          description: 'Successfuly populated!'
        })
      })
    })
  })
}

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
          UserPermissions
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
  UserPermissions.findOne({ companyId: req.body.companyId, userId: req.body.userId })
  .populate('userId')
  .exec(
    (err, permission) => {
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
