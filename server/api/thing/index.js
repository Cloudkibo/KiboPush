'use strict'

const express = require('express')

const router = express.Router()
const Broadcasts = require('./../broadcasts/broadcasts.model')

const logger = require('../../components/logger')
const TAG = 'api/thing/index'

router.get('/', (req, res) => {
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  logger.serverLog(TAG, arr)
  for (let i = 0; i < arr.length; i++) {
    logger.serverLog(TAG, `loop with iteration ${arr[i]}`)
    Broadcasts.find({}, (err, broadcasts) => {
      if (err) {
        return res.status(404)
        .json({status: 'failed', description: 'Broadcasts not found'})
      }
      logger.serverLog(TAG, `callback in loop with iteration ${arr[i]}`)
    })
  }
  res.status(200).json({status: 'success', payload: []})
})

module.exports = router
