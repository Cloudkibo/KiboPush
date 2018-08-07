/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const StoreInfo = require('./../abandoned_carts/StoreInfo.model')
const CheckoutInfo = require('./../abandoned_carts/CheckoutInfo.model')
const CartInfo = require('./../abandoned_carts/CartInfo.model')
const StoreAnalytics = require('./../abandoned_carts/StoreAnalytics.model')

const TAG = 'api/shopify/webhook.controller.js'
const mainScript = require('./mainScript')
const config = require('./../../config/environment/index')

exports.handleCheckout = function (req, res) {
  const productIds = req.body.line_items.map((item) => {
    return item.product_id
  })
  const shopUrl = req.header('X-Shopify-Shop-Domain')
  StoreInfo.find({shopUrl: shopUrl}, (err, results) => {
    if (err) {
      logger.serverLog(TAG, `Error in checkout webhook ${JSON.stringify(err)}`)
      return res.status(500).json({ status: 'failed', error: err })
    }
    const shopId = results[0]._id
    const userId = results[0].userId
    const companyId = results[0].companyId
    const checkout = new CheckoutInfo({
      shopifyCheckoutId: req.body.id,
      checkoutToken: req.body.token,
      cartToken: req.body.cart_token,
      storeId: shopId,
      userId: userId,
      companyId: companyId,
      totalPrice: req.body.total_price,
      abandonedCheckoutUrl: req.body.abandoned_checkout_url,
      productIds: productIds,
      status: 'pending',
      subscriberId: ''
    })
    // We need to update the analytics against this store
    StoreAnalytics.findOneAndUpdate({storeId: shopId}, {$inc: {totalAbandonedCarts: 1}}, (err, result1) => {
      if (err) {
        logger.serverLog(TAG, `Error Finding Store Analytics ${JSON.stringify(err)}`)
        return res.status(500).json({ status: 'failed', error: err })
      }
      checkout.save((err) => {
        if (err) {
          logger.serverLog(TAG, `Error saving checkout ${JSON.stringify(err)}`)
          return res.status(500).json({ status: 'failed', error: err })
        }
        return res.status(200).json({status: 'success'})
      }) // Checkout Save
    })  // Store Analytics FindOne
  })
}

exports.handleCart = function (req, res) {
  const productIds = req.body.line_items.map((item) => {
    return item.product_id
  })
  const shopUrl = req.header('X-Shopify-Shop-Domain')
  StoreInfo.findOne({shopUrl: shopUrl}).exec()
  .then((results) => {
    const shopId = results._id
    const userId = results.userId
    const companyId = results.companyId
    const cart = new CartInfo({
      shopifyCartId: req.body.id,
      cartToken: req.body.token,
      storeId: shopId,
      userId: userId,
      companyId: companyId,
      linePrice: 0,
      productIds: productIds,
      status: 'pending',
      subscriberId: ''
    })
    cart.save((err) => {
      if (err) {
        logger.serverLog(TAG, `Error saving cart ${JSON.stringify(err)}`)
        return res.status(500).json({ status: 'failed', error: err })
      }
      return res.status(200).json({status: 'success'})
    })
  })
  .catch((err) => {
    logger.serverLog(TAG, `Error in cart webhook ${JSON.stringify(err)}`)
    return res.status(500).json({ status: 'failed', error: err })
  })
}

exports.handleOrder = function (req, res) {
  logger.serverLog(TAG, `Order webhook called ${JSON.stringify(req.body.checkout_id)}`)
  CheckoutInfo.findOne({shopifyCheckoutId: req.body.checkout_id}, (err, result) => {
    if (err) {
      logger.serverLog(TAG, `Error in deleting checkout ${JSON.stringify(err)}`)
      return res.status(500).json({ status: 'failed', error: err })
    }

    if (result) {
      if (result.status === 'pending') {
        result.isPurchased = true
      } else if (result.status === 'sent') {
        result.isPurchased = true
        result.isExtraSales = true    // It denotes that the product was bought after we sent abandond cart in messngr
        // We need to update the total purchases in Analytics
        StoreAnalytics.findOneAndUpdate({storeId: result.storeId},
          {$inc: {totalPurchasedCarts: 1, totalExtraSales: req.body.total_price}},
          (err) => {
            if (err) {
              logger.serverLog(TAG, `Error in deleting checkout ${JSON.stringify(err)}`)
              return res.status(500).json({ status: 'failed', error: err })
            }
          })
      }
      // Saving the updated info
      result.save((err) => {
        if (err) {
          logger.serverLog(TAG, `Error in deleting checkout ${JSON.stringify(err)}`)
          return res.status(500).json({ status: 'failed', error: err })
        }
        return res.status(200).json({status: 'success'})
      })
    } else {
      return res.status(404).json({status: 'failed'})
    }
  })
}

exports.handleAppUninstall = function (req, res) {
  logger.serverLog(TAG, 'In App Uninstall')
  const shopUrl = req.header('X-Shopify-Shop-Domain')
  StoreInfo.findOne({shopUrl: shopUrl}).exec()
  .then((results) => {
    const shopId = results._id

    CartInfo.remove({storeId: shopId}).exec()
    .then((result) => {
      logger.serverLog(TAG, 'Successfully Deleted CartInfo')
    })

    CheckoutInfo.remove({storeId: shopId}).exec()
    .then((result) => {
      logger.serverLog(TAG, 'Successfully Deleted CheckoutInfo')
    })

    StoreAnalytics.remove({storeId: shopId}).exec()
    .then((result) => {
      logger.serverLog(TAG, 'Successfully Deleted StoreAnalytics')
    })

    StoreInfo.remove({shopUrl: shopUrl}).exec()
    .then((result) => {
      logger.serverLog(TAG, 'App Uninstall Success')
      return res.status(200).json({status: 'success'})
    })
  }).catch((err) => {
    if (err) {
      return res.status(200).json({status: 'success', error: err})
    } else {
      return res.status(500).json({status: 'failed', error: err})
    }
  })
}

exports.handleThemePublish = function (req, res) {
  logger.serverLog(TAG, 'A theme was switched')
  return res.status(200).json({status: 'success'})
}

exports.serveScript = function (req, res) {
  const shopUrl = req.query.shop
  StoreInfo.findOne({shopUrl: shopUrl}).exec()
   .then((results) => {
     const pageId = results.pageId
     // logger.serverLog(TAG, `Found the shop using url ${pageId}`)
     res.send(mainScript.renderJS(pageId, config.facebook.clientID))
   }).catch((err) => {
     logger.serverLog(TAG, `Error in finding the shop using Url ${JSON.stringify(err)}`)
     return res.status(500).json({status: 'failed', error: err})
   })
}

exports.handleNewSubscriber = function (payload) {
  // TODO: ADD Validation Check for payload
  // Get Page ID
  const pageId = payload.recipient.id
  // Get USER REF (Note USER REF is also the cart TOKEN)
  const userRef = payload.optin.user_ref

  const cartToken = payload.optin.user_ref.split('-')[0]

  CartInfo.findOne({cartToken: cartToken}, (err, cart) => {
    if (err) {
      logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
    }

    if (cart) {
      StoreAnalytics.findOneAndUpdate({storeId: cart.storeId},
        {$inc: {totalSubscribers: 1}},
        (err) => {
          if (err) {
            logger.serverLog(TAG, `Error in deleting checkout ${JSON.stringify(err)}`)
          }
        })  // Store Analytics save and update

      cart.userRef = userRef
      cart.save((err) => {
        if (err) {
          logger.serverLog(TAG, `Failed in Updating UserRef `)
        }

        logger.serverLog(TAG, `Successfully Updated UserRef `)
      })
    } else {
      logger.serverLog(TAG, ` Cart not found ${JSON.stringify(err)}`)
    }
  })
  logger.serverLog(TAG, `Page Id: ${JSON.stringify(pageId)} and UserRef ${JSON.stringify(userRef)}`)
}
