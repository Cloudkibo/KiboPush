/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Pages = require('./Pages.model')
const TAG = 'api/pages/pages.controller.js'
const CompanyUsers = require('./../companyuser/companyuser.model')
const Users = require('./../user/Users.model')
const needle = require('needle')
const Subscribers = require('../subscribers/Subscribers.model')

exports.index = function (req, res) {
  return res.status(200).json({status: 'success', payload: {}})
}
