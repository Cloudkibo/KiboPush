/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const StoreInfo = require('./../abandoned_carts/StoreInfo.model')
const CheckoutInfo = require('./../abandoned_carts/CheckoutInfo.model')
const CartInfo = require('./../abandoned_carts/CartInfo.model')
const TAG = 'api/shopify/webhook.controller.js'
const mainScript = require('./mainScript')

exports.handleCheckout = function (req, res) {
  const productIds = req.body.line_items.map((item) => {
    return item.product_id
  })
  const shopUrl = req.header('X-Shopify-Shop-Domain')
  StoreInfo.find({shopUrl: shopUrl}).exec()
  .then((results) => {
    const shopId = results[0]._id
    const userId = results[0].userId
    const companyId = results[0].companyId
    CartInfo.findOne({cartToken: req.body.cart_token}).exec()
     .then((cart) => {
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
         userRef: cart.userRef
       })
       checkout.save((err) => {
         if (err) {
           logger.serverLog(TAG, `Error saving checkout ${JSON.stringify(err)}`)
           return res.status(500).json({ status: 'failed', error: err })
         }
         return res.status(200).json({status: 'success'})
       })
     }).catch((err) => {
       logger.serverLog(TAG, `Error in checkout webhook ${JSON.stringify(err)}`)
       return res.status(500).json({ status: 'failed', error: err })
     })
  })
  .catch((err) => {
    logger.serverLog(TAG, `Error in checkout webhook ${JSON.stringify(err)}`)
    return res.status(500).json({ status: 'failed', error: err })
  })
}

exports.handleCart = function (req, res) {
  const productIds = req.body.line_items.map((item) => {
    return item.product_id
  })
  const shopUrl = req.header('X-Shopify-Shop-Domain')
  StoreInfo.find({shopUrl: shopUrl}).exec()
  .then((results) => {
    const shopId = results[0]._id
    const userId = results[0].userId
    const companyId = results[0].companyId
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
  CheckoutInfo.remove({shopifyCheckoutId: req.body.checkout_id}).exec()
  .then((result) => {
    return res.status(200).json({status: 'success'})
  })
  .catch((err) => {
    logger.serverLog(TAG, `Error in deleting checkout ${JSON.stringify(err)}`)
    return res.status(500).json({ status: 'failed', error: err })
  })
}

exports.handleAppUninstall = function (req, res) {
  const shopUrl = req.header('X-Shopify-Shop-Domain')
  StoreInfo.find({shopUrl: shopUrl}).exec()
  .then((results) => {
    const shopId = results[0]._id

    CartInfo.remove({storeId: shopId}).exec()
    .then((result) => {
      logger.serverLog(TAG, 'Successfully Deleted CartInfo')
    })

    CheckoutInfo.remove({storeId: shopId}).exec()
    .then((result) => {
      logger.serverLog(TAG, 'Successfully Deleted CheckoutInfo')
    })

    StoreInfo.remove({shopUrl: shopUrl}).exec()
    .then((result) => {
      return res.status(200).json({status: 'success'})
    })
  }).catch((err) => {
    return res.status(500).json({status: 'failed', error: err})
  })
}

exports.handleThemePublish = function (req, res) {
  logger.serverLog(TAG, 'A theme was switched')
  return res.status(200).json({status: 'success'})
}

exports.serveScript = function (req, res) {
  const shopUrl = req.query.shop
  StoreInfo.find({shopUrl: shopUrl}).exec()
   .then((results) => {
     const pageId = results[0].pageId
     // logger.serverLog(TAG, `Found the shop using url ${pageId}`)
     res.send(mainScript.renderJS(pageId, '159385484629940'))
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
  const userRef = payload.optin.user_ref.split('-')[0]

  CartInfo.update({cartToken: userRef}, {userRef: userRef}).exec()
  .then((result) => {
    logger.serverLog(TAG, `Successfully Updated UserRef ${JSON.stringify(result)}`)
  }).catch((err) => {
    logger.serverLog(TAG, `Failed in updating the UserRef ${JSON.stringify(err)}`)
  })

  logger.serverLog(TAG, `Page Id: ${JSON.stringify(pageId)} and UserRef ${JSON.stringify(userRef)}`)
}
