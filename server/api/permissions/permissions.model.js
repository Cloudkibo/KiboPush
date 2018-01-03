'use strict'

var mongoose = require('mongoose'),
  Schema = mongoose.Schema

var PermissionsSchema = new Schema({

  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  userId: { type: Schema.ObjectId, ref: 'users' },
  billingPermission: { type: Boolean, default: true },
  downgradeService: { type: Boolean, default: true },
  upgradeService: { type: Boolean, default: true },
  terminateService: { type: Boolean, default: true },
  inviteAdminPermission: { type: Boolean, default: true },
  deleteAdminPermission: { type: Boolean, default: true },
  promoteToAdminPermission: { type: Boolean, default: true },
  inviteAgentPermission: { type: Boolean, default: true },
  deleteAgentPermission: { type: Boolean, default: true },
  broadcastPermission: { type: Boolean, default: true },
  autopostingPermission: { type: Boolean, default: true },
  livechatPermission: { type: Boolean, default: true },
  menuPermission: { type: Boolean, default: true },
  pagesPermission: { type: Boolean, default: true },
  pollsPermission: { type: Boolean, default: true },
  subscriberPermission: { type: Boolean, default: true },
  surveyPermission: { type: Boolean, default: true },
  workflowPermission: { type: Boolean, default: true }

})

module.exports = mongoose.model('permissions', PermissionsSchema)
