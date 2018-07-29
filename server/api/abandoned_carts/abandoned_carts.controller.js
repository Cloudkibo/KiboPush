/**
 * Created by sojharo on 27/07/2017.
 */

// const logger = require('../../components/logger')
const StoreInfo = require('./StoreInfo.model')
const CartInfo = require('./CartInfo.model')
const CheckoutInfo = require('./CheckoutInfo.model')
// const TAG = 'api/pages/pages.controller.js'
// const Users = require('./../user/Users.model')
// const needle = require('needle')
// const Subscribers = require('../subscribers/Subscribers.model')

const _ = require('lodash')

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

exports.saveCartInfo = function (req, res) {
  const cart = new CartInfo({
    shopifyCartId: req.body.shopifyCartId,
    cartToken: req.body.cartToken,
    storeId: req.body.storeId,
    linePrice: req.body.linePrice,
    productIds: req.body.productIds
  })
  cart.save((err) => {
    if (err) {
      return res.status(500).json({ status: 'failed', error: err })
    }
    return res.status(200).json({status: 'success'})
  })
}

exports.saveCheckoutInfo = function (req, res) {
  const checkout = new CheckoutInfo({
    shopifyCheckoutId: req.body.shopifyCheckoutId,
    checkoutToken: req.body.checkoutToken,
    cartToken: req.body.cartToken,
    storeId: req.body.storeId,
    totalPrice: req.body.totalPrice,
    abandonedCheckoutUrl: req.body.abandonedCheckoutUrl,
    productIds: req.body.productIds
  })
  checkout.save((err) => {
    if (err) {
      return res.status(500).json({ status: 'failed', error: err })
    }
    return res.status(200).json({status: 'success'})
  })
}

exports.updateStatusStore = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'shopId')) parametersMissing = true
  if (!_.has(req.body, 'isActive')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'Failed', description: 'Parameters are missing'})
  }

  StoreInfo.updateOne({_id: req.body.shopId}, {isActive: req.body.isActive}, (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'Failed', error: err })
    }

    return res.status(200).json({status: 'success', payload: result})
  })
}
