/**
 * Created by sojharo on 24/11/2017.
 */
const express = require('express')

const router = express.Router()

const controller = require('./facebook_posts.controller')
const auth = require('../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  controller.index)

router.get('/:id',
  auth.isAuthenticated(),
  controller.viewPost)

router.post('/create',
  auth.isAuthenticated(),
  controller.create)

module.exports = router
