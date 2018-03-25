'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PermissionsSchema = new Schema({

  plan_A: Schema.Types.Mixed, // Individual Paid
  plan_B: Schema.Types.Mixed, // Individual Unpaid
  plan_C: Schema.Types.Mixed, // Team Paid
  plan_D: Schema.Types.Mixed  // Team Unpaid

})

module.exports = mongoose.model('permissions_plan', PermissionsSchema)
