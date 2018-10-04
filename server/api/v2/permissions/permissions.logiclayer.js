exports.prepareUpdatePayload = function (dbPayload, clientPayload, exceptProperty) {
  for (let property in clientPayload) {
    if (property !== exceptProperty) {
      dbPayload[property] = clientPayload[property]
    }
  }
  return dbPayload
}
exports.prepareBuyerPermissions = function () {
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
  return buyerPermissions
}

exports.prepareAdminPermissions = function () {
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
  return adminPermissions
}

exports.prepareAgentPermissions = function () {
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
  return agentPermissions
}

exports.setPermissions = function (permission, perm) {
  permission.apiPermission = perm.apiPermission
  permission.surveyPermission = perm.surveyPermission
  permission.subscriberPermission = perm.subscriberPermission
  permission.pollsPermission = perm.pollsPermission
  permission.pagesPermission = perm.pagesPermission
  permission.pagesAccessPermission = perm.pagesAccessPermission
  permission.menuPermission = perm.menuPermission
  permission.livechatPermission = perm.livechatPermission
  permission.autopostingPermission = perm.autopostingPermission
  permission.broadcastPermission = perm.broadcastPermission
  permission.invitationsPermission = perm.invitationsPermission
  permission.deleteAgentPermission = perm.deleteAgentPermission
  permission.inviteAgentPermission = perm.inviteAgentPermission
  permission.updateRolePermission = perm.updateRolePermission
  permission.deleteAdminPermission = perm.deleteAdminPermission
  permission.inviteAdminPermission = perm.inviteAdminPermission
  permission.membersPermission = perm.membersPermission
  permission.companyUpdatePermission = perm.companyUpdatePermission
  permission.companyPermission = perm.companyPermission
  permission.dashboardPermission = perm.dashboardPermission
  permission.customerMatchingPermission = perm.customerMatchingPermission
  permission.terminateService = perm.terminateService
  permission.upgradeService = perm.upgradeService
  permission.downgradeService = perm.downgradeService
  permission.billingPermission = perm.billingPermission
  return permission
}
exports.prepareCreateQuery = function (body) {
  var temp = body.name.split(' ')
  for (var i = 1; i < temp.length; i++) {
    temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1)
  }
  var permission = temp.toString().replace(new RegExp(',', 'g'), '')
  let query = {}
  query[permission] = false
  return query
}
