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

exports.deleteAllCartInfo = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'storeId')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'Failed', description: 'Parameters are missing'})
  }

  CartInfo.remove({storeId: req.body.storeId}, (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'Failed', error: err })
    }

    if (result) {
      return res.status(200).json({status: 'success', payload: result})
    }
  })
}

exports.deleteOneCartInfo = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'storeId')) parametersMissing = true
  if (!_.has(req.body, 'cartInfoId')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'Failed', description: 'Parameters are missing'})
  }

  CartInfo.remove({storeId: req.body.storeId, _id: req.body.cartInfoId}, (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'Failed', error: err })
    }

    if (result) {
      return res.status(200).json({status: 'success', payload: result})
    }
  })
}

exports.deleteCheckoutInfo = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'checkoutInfoId')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'Failed', description: 'Parameters are missing'})
  }

  CheckoutInfo.remove({_id: req.body.checkoutInfoId}, (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'Failed', error: err })
    }

    if (result) {
      return res.status(200).json({status: 'success', payload: result})
    }
  })
}

exports.deleteAllInfo = function (req, res) {
  // We will change the find and delete by company Id instead of user Id once dayem adds the companyId.
  // untill then, we are using user id
  StoreInfo.find({userId: req.user._id}, (err, stores) => {
    if (err) {
      return res.status(500).json({ status: 'Failed', error: err })
    }
    let store
    // I am using for loop because it is fastest loop. Moreover, the use 'let' makes it secure and not unpredictable
    for (let i = 0, length = stores.length; i < length; i++) {
      store = stores[i]
      if (store) {
        CheckoutInfo.remove({storeId: store._id}, (err, result1) => {
          if (err) {
            return res.status(500).json({ status: 'Failed', error: err })
          }
          console.log({store})
          CartInfo.remove({storeId: store._id}, (err, result2) => {
            if (err) {
              return res.status(500).json({ status: 'Failed', error: err })
            }

            StoreInfo.remove({_id: store._id}, (err, result3) => {
              if (err) {
                return res.status(500).json({ status: 'Failed', error: err })
              }

              if (result1 && result2 && result3) {
                return res.status(200).json({status: 'success', payload: 'All information has been deleted'})
              }
            }) // Store remove
          }) // CartInfo remove
        }) // CheckoutInfo remove
      }
    }
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
