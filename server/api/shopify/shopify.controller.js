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
const Shopify = require('shopify-api-node')
// const TAG = 'api/pages/pages.controller.js'
// const Users = require('./../user/Users.model')
// const needle = require('needle')
// const Subscribers = require('../subscribers/Subscribers.model')

function registerWebhooks (shop, token) {
  const shopify = new Shopify({
    shopName: shop,
    accessToken: token
  })

  shopify.webhook.create({
    topic: 'carts/create',
    address: `${config.shopify.app_host}/api/shopify/cart-create`,
    format: 'json'
  }).then((response) => {
    console.log('Carts webhook created')
  }).catch((err) => {
    console.log('Error Creating Carts Webhook', err)
    throw err
  })

  shopify.webhook.create({
    topic: 'checkouts/create',
    address: `${config.shopify.app_host}/api/shopify/checkout-create`,
    format: 'json'
  }).then((response) => {
    console.log('Checkout webhook created')
  }).catch((err) => {
    console.log('Error Creating Checkout Webhook', err)
    throw err
  })

  shopify.webhook.create({
    topic: 'orders/create',
    address: `${config.shopify.app_host}/api/shopify/order-create`,
    format: 'json'
  }).then((response) => {
    console.log('Order webhook created')
  }).catch((err) => {
    console.log('Error Creating Order Webhook', err)
    throw err
  })

  shopify.webhook.create({
    topic: 'app/uninstalled',
    address: `${config.shopify.app_host}/api/shopify/app-uninstall`,
    format: 'json'
  }).then((response) => {
    console.log('App Uninstall webhook created')
  }).catch((err) => {
    console.log('Error Creating App Uninstall Webhook', err)
    throw err
  })

  shopify.webhook.create({
    topic: 'themes/publish',
    address: `${config.shopify.app_host}/api/shopify/theme-publish`,
    format: 'json'
  }).then((response) => {
    console.log('Theme Publish webhook created')
  }).catch((err) => {
    console.log('Error Creating Theme Publish Webhook', err)
    throw err
  })
}

const registerScript = function (shopDomain, accessToken, params) {
  const shopify = new Shopify({ shopName: shopDomain, accessToken: accessToken })
  shopify.scriptTag.create(params).then(
    response => console.log('Script posted and created', response),
    err => console.log(`Error creating script. ${JSON.stringify(err.response.body)}`)
  )
}

exports.index = function (req, res) {
  console.log('User in body', req.user)
  const shop = req.body.shop
  const scopes = 'write_orders, write_products, read_themes, write_themes, read_script_tags, write_script_tags'
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
  console.log('UserId of the user', userId)
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
    registerWebhooks(shop, accessToken)
    registerScript(shop, accessToken, {
      event: 'onload',
      src: 'https://rawgit.com/dayemsiddiqui/63f45b25ff476a17fc575f3acccd14f6/raw/620f03c5ffee29c7f0d62b3f365b12163c0ea9f8/kiboshop.js'
    })
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
