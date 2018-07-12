/**
 * Created by imran on 11/07/2018.
 */
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let RolePermissionsSchema = new Schema({
  plan_id: {type: Schema.ObjectId, ref: 'plans'},
  billing_permission: Boolean,
  downgrade_service: Boolean,
  upgrade_service: Boolean,
  terminate_service: Boolean,
  customer_matching_permission: Boolean,
  dashboard_permission: Boolean,
  company_permission: Boolean,
  company_update_permission: Boolean,
  members_permission: Boolean,
  invite_admin_permission: Boolean,
  delete_admin_permission: Boolean,
  update_role_permission: Boolean,
  invite_agent_permission: Boolean,
  delete_agent_permission: Boolean,
  invitations_permission: Boolean,
  broadcast_permission: Boolean,
  autoposting_permission: Boolean,
  livechat_permission: Boolean,
  menu_permission: Boolean,
  pages_access_permission: Boolean,
  pages_permission: Boolean,
  polls_permission: Boolean,
  subscriber_permission: Boolean,
  survey_sermission: Boolean,
  api_permission: Boolean
})

module.exports = mongoose.model('role_permissions', RolePermissionsSchema)
