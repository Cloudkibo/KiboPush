/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const StoreInfo = require('./../abandoned_carts/StoreInfo.model')
const CheckoutInfo = require('./../abandoned_carts/CheckoutInfo.model')
const TAG = 'api/pages/pages.controller.js'

exports.handleCheckout = function (req, res) {
  const productIds = req.body.line_items.map((item) => {
    return item.product_id
  })
  const shopUrl = req.header('X-Shopify-Shop-Domain')
  StoreInfo.find({shopUrl: shopUrl}).exec()
  .then((results) => {
    const shopId = results[0]._id
    const userId = results[0].userId
    const checkout = new CheckoutInfo({
      shopifyCheckoutId: req.body.id,
      checkoutToken: req.body.token,
      cartToken: req.body.cart_token,
      storeId: shopId,
      userId: userId,
      totalPrice: req.body.total_price,
      abandonedCheckoutUrl: req.body.abandoned_checkout_url,
      productIds: productIds,
      status: 'pending'
    })
    checkout.save((err) => {
      if (err) {
        logger.serverLog(TAG, `Error saving checkout ${JSON.stringify(err)}`)
        return res.status(500).json({ status: 'failed', error: err })
      }
      return res.status(200).json({status: 'success'})
    })
  })
  .catch((err) => {
    logger.serverLog(TAG, `Error in checkout webhook ${JSON.stringify(err)}`)
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
