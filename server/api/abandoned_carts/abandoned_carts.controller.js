/**
 * Created by sojharo on 27/07/2017.
 */

// const logger = require('../../components/logger')
const StoreInfo = require('./StoreInfo.model')
// const TAG = 'api/pages/pages.controller.js'
// const CompanyUsers = require('./../companyuser/companyuser.model')
// const Users = require('./../user/Users.model')
// const needle = require('needle')
// const Subscribers = require('../subscribers/Subscribers.model')

exports.index = function (req, res) {
  return res.status(200).json({status: 'success', payload: {}})
}

exports.saveStoreInfo = function (req, res) {
  const store = new StoreInfo({
    userId: req.body.userId,
    pageId: req.body.pageId,
    shopUrl: req.body.shopUrl,
    shopToken: req.body.shopToken
  })
  store.save((err) => {
    if (err) {
      return res.status(500).json({ status: 'failed', error: err })
    }
    return res.status(200).json({status: 'success'})
  })
}
