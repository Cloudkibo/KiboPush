const CartInfo = require('./CartInfo.model')
const StoreInfo = require('./StoreInfo.model')
const Pages = require('../pages/Pages.model')
const utility = require('../broadcasts/broadcasts.utility')
const Subscriber = require('../subscribers/Subscribers.model')
const logger = require('../../components/logger')
const TAG = 'api/abandoned_carts/utility_abandoned.js'
const Shopify = require('shopify-api-node')
const request = require('request')

// This function needs store Object as well because from store will we read the shop URL and token
// We also need to pass callback because shopify makes a async call and we need the result back in calling function
function fetchProductDetails (productIds, store, callBack) {
  logger.serverLog(TAG, JSON.stringify(productIds))

  const shopify = new Shopify({
    shopName: store.shopUrl,
    accessToken: store.shopToken
  })
  let arr = []
  for (let i = 0, productId, length = productIds.length; i < length; i++) {
    productId = productIds[i]
    shopify.product.get(productId)
    .then((resProduct) => {
      arr.push(resProduct)
      if (i === (length - 1)) {
        callBack(null, arr)
      }
    })
    .catch((err) => {
      callBack(err, null)
    })
  }
}

function sendToFacebook (cart, store, details) {
  Subscriber.findOne({_id: cart.subscriberId}, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
    }

    Pages.findOne({pageId: store.pageId}, (err, page) => {
      if (err) {
        logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
      }
      let obj
      let gallery = []
      let payload = []
      if (details.length <= 1) {
        // Send one card
        obj = {
          fileurl: {
            url: details[0].image.src
          },
          componentType: 'card',
          title: details[0].title,
          buttons: [{'type': 'web_url', 'url': store.shopUrl, 'title': 'Visit Our Shop'}],
          description: details[0].body_html + '. Vendor: ' + details[0].vendor
        }
        payload.push(obj)
      } else {
        // Send Gallary
        details.forEach((item) => {
          let temp = {
            title: item.title,
            buttons: [{'type': 'web_url', 'url': store.shopUrl, 'title': 'Visit Our Shop'}],
            subtitle: item.body_html + '. Vendor: ' + item.vendor,
            image_url: item.image.src
          }
          gallery.push(temp)
        })
        obj = {
          componentType: 'gallery',
          cards: gallery
        }
        payload.push(obj)
      }
      utility.getBatchData(payload, subscriber.senderId, page, send, subscriber.firstName, subscriber.lastName)
    }) // Pages findOne ends here
  }) // Subscriber findOne ends here
}

const send = (batchMessages, page) => {
  const r = request.post('https://graph.facebook.com', (err, httpResponse, body) => {
    if (err) {
      return logger.serverLog(TAG, `Batch send error ${JSON.stringify(err)}`)
    }
    logger.serverLog(TAG, `Batch send response ${JSON.stringify(body)}`)
  })
  const form = r.form()
  form.append('access_token', page.accessToken)
  form.append('batch', batchMessages)
}

// Unit test function
const fetchUnitFunction = (req, res) => {
  CartInfo.findOne({}, (err, cart) => {
    if (err) {
      throw err
    }

    if (cart) {
      StoreInfo.findOne({_id: cart.storeId}, (err, store) => {
        if (err) {
          throw err
        }

        fetchProductDetails(cart.productIds, store, (err, details) => {
          if (err) {
            throw err
          }

          logger.serverLog(TAG, 'Product Details: ' + details)
          sendToFacebook(cart, store, details)
        })
      })
    }
  })
}

exports.fetchUnitFunction = fetchUnitFunction
exports.fetchProductDetails = fetchProductDetails
exports.sendToFacebook = sendToFacebook
