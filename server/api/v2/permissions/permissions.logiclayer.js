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
