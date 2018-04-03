/**
 * Created by sojharo on 27/07/2017.
 */

// eslint-disable-next-line no-unused-vars
const logger = require('../../components/logger')
// const Workflows = require('./Workflows.model')
// eslint-disable-next-line no-unused-vars
const TAG = 'api/smart_replies/bots.controller.js'
const CompanyUsers = require('./../companyuser/companyuser.model')
const _ = require('lodash')

exports.index = function (req, res) {
  return res.status(200).json({status: "Success", payload: {message: "Bot is working"}})
}


