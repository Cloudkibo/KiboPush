/**
 * Created by sojharo on 27/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./abandoned_carts.controller')

router.get('/',
  auth.isAuthenticated(),
  controller.index) // this id will be userid

router.post('/saveStoreInfo',
  controller.saveStoreInfo)

router.post('/saveCartInfo',
  controller.saveCartInfo)

router.post('/saveCheckoutInfo',
  controller.saveCheckoutInfo)

router.post('/updateStatusStore',
  controller.updateStatusStore)

module.exports = router

// {
//     "userId": "124sda2fsavad",
//     "pageId": "124sda2fsavad",
//     "shopUrl": "cloudkibo.myshopify.com",
//     "shopToken": "124sda2fsavad"
//  }

// {
//     "shopifyCartId": "124sda2fsavad",
//     "cartToken": "124sda2fsavad",
//     "storeId": "124sda2fsavad",
//     "linePrice": "290",
//     "productIds": ["124sda2fsavad", "124sda2fsavaddasdsaAUYe22a", "1E2vsaED24sda2fsavaddasdsaA"]
//  }

// {
//     "shopifyCheckoutId": "124sda2fsavaddasdsaAUYe22a",
//     "checkoutToken": "124sda2fsavaddasdsaAUYe22a",
//     "cartToken": "124sda2fsavaddasdsaAUYe22a",
//     "storeId": "124sda2fsavaddasdsaAUYe22a",
//     "totalPrice":  "290",
//     "abandonedCheckoutUrl": "www.checkout.myshopify.com",
//     "productIds": ["124sda2fsavad", "124sda2fsavaddasdsaAUYe22a", "1E2vsaED24sda2fsavaddasdsaA"]
//   }
