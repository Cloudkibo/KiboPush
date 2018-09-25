/**
 * Created by sojharo on 20/07/2017.
 */
'use strict'

const express = require('express')

const router = express.Router()

// const logger = require('../components/logger')
const config = require('../config/environment')
const Users = require('../api/v1/user/Users.model')

// const TAG = 'auth/index.js'

// todo see what to do with facebook passport integration
require('./facebook/passport').setup(Users, config)
require('./local/passport').setup(Users, config)

router.use('/facebook', require('./facebook'))
router.use('/local', require('./local'))

// if (config.env === 'development') {
//   router.get('/local/:name', (req, res) => {
//     logger.serverLog(TAG, 'localhost authentication with params: ' + JSON.stringify(req.params))
//     Users.findOne({ name: req.params.name }, (err, user) => {
//       if (err) {
//         return res.status(500).json({
//           status: 'failed',
//           description: 'Internal Server Error'
//         })
//       }
//       if (!err && user !== null) {
//         req.user = user
//         auth.setTokenCookie(req, res)
//       } else {
//         let payload = new Users({
//           name: req.params.name,
//           locale: 'en',
//           gender: req.params.name,
//           provider: 'local',
//           fbToken: '',
//           fbId: ''
//         })
//         payload.save((error, userPayload) => {
//           if (error) {
//             return res.status(500).json({
//               status: 'failed',
//               description: 'Internal Server Error'
//             })
//           }
//           req.user = userPayload
//           auth.setTokenCookie(req, res)
//         })
//       }
//     })
//   })
// }

module.exports = router
