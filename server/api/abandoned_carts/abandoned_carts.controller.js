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

exports.index = function (req, res) {
  StoreInfo.find({userId: req.user._id}).exec()
  .then((result) => {
    return res.status(200).json({status: 'success', payload: result})
  })
  .catch((err) => {
    return res.status(500).json({status: 'failed', error: err})
  })
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

exports.abandonedCheckouts = function (req, res) {
  CheckoutInfo.find({userId: req.user._id}).exec()
  .then((result) => {
    return res.status(200).json({status: 'success', payload: result})
  })
  .catch((err) => {
    return res.status(500).json({status: 'failed', error: err})
  })
}
