/**
 * Created by sojharo on 27/07/2017.
 */

// const logger = require('../../components/logger')
const config = require('./../../config/environment/index')
const cookie = require('cookie')
const nonce = require('nonce')()
const querystring = require('querystring')
const crypto = require('crypto')
const request = require('request-promise')
const StoreInfo = require('./../abandoned_carts/StoreInfo.model')
// const TAG = 'api/pages/pages.controller.js'
// const Users = require('./../user/Users.model')
// const needle = require('needle')
// const Subscribers = require('../subscribers/Subscribers.model')

exports.index = function (req, res) {
  console.log('User in body', req.user)
  const shop = req.body.shop
  const scopes = 'write_orders, write_products'
  if (shop) {
    const state = nonce()
    const redirectUri = config.shopify.app_host + '/api/shopify/callback'
    const installUrl = 'https://' + shop +
        '/admin/oauth/authorize?client_id=' + config.shopify.app_key +
        '&scope=' + scopes +
        '&state=' + state +
        '&redirect_uri=' + redirectUri

    res.cookie('state', state)
    res.cookie('userId', JSON.stringify(req.user._id))
    res.cookie('pageId', req.body.pageId)
    res.redirect(installUrl)
  } else {
    return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request')
  }
}

exports.callback = function (req, res) {
  const { shop, hmac, code, state } = req.query
  const stateCookie = cookie.parse(req.headers.cookie).state
  const userId = JSON.parse(cookie.parse(req.headers.cookie).userId)
  const pageId = cookie.parse(req.headers.cookie).pageId
  console.log("UserId of the user", userId)
  if (state !== stateCookie) {
    return res.status(403).send('Request origin cannot be verified')
  }

  if (shop && hmac && code) {
  // DONE: Validate request is from Shopify
    const map = Object.assign({}, req.query)
    delete map['signature']
    delete map['hmac']
    const message = querystring.stringify(map)
    const providedHmac = Buffer.from(hmac, 'utf-8')
    const generatedHash = Buffer.from(
    crypto
      .createHmac('sha256', config.shopify.app_secret)
      .update(message)
      .digest('hex'),
      'utf-8'
    )
    let hashEquals = false

    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
    } catch (e) {
      hashEquals = false
    };

    if (!hashEquals) {
      return res.status(400).send('HMAC validation failed')
    }

  // DONE: Exchange temporary code for a permanent access token
    const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token'
    const accessTokenPayload = {
      client_id: config.shopify.app_key,
      client_secret: config.shopify.app_secret,
      code
    }

    request.post(accessTokenRequestUrl, { json: accessTokenPayload })
  .then((accessTokenResponse) => {
    const accessToken = accessTokenResponse.access_token
    const store = new StoreInfo({
      userId: userId,
      pageId: pageId,
      shopUrl: shop,
      shopToken: accessToken
    })
    store.save((err) => {
      if (err) {
        return res.status(500).json({ status: 'failed', error: err })
      }
      return res.redirect('/')
    })
  })
  .catch((error) => {
    res.status(error.statusCode >= 100 && error.statusCode < 600 ? error.statusCode : 500).send(error.error_description)
  })
  } else {
    res.status(400).send('Required parameters missing')
  }
}
