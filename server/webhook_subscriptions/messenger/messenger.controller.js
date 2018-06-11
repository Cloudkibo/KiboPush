/**
 * Created by sojharo on 02/02/2018.
 */

const logger = require('../../components/logger')

const TAG = 'api/pages/dashboard.controller.js'

exports.verifyHook = function (req, res) {
  if (req.query['hub.verify_token'] === 'VERIFY_ME') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong token')
  }
}

exports.getHook = function (req, res) {

}

exports.deauthorize = function (req, res) {
  console.log('DEAUTHORIZE')
  logger.serverLog(TAG, 'Deauthorized App')
}
