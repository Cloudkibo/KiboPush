const init = require('./initWebhooks')
const Validator = require('jsonschema').Validator
const _cloneDeep = require('lodash/cloneDeep')
const validator = new Validator()
const logger = require('../../components/logger')
const TAG = 'api/webhooks_facebook/webhooks_facebook.controller.js'

exports.verifyHook = function (req, res) {
  if (req.query['hub.verify_token'] === 'VERIFY_ME') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong token')
  }
}

exports.webhook = function (req, res) {
  try {
    init.getRegistry().map((entry) => {
      if (validator.validate(req.body, entry.schema).valid) {
        entry.callback(_cloneDeep(req.body))
      }
    })
    // @TODO : Need to fix the response mechanism
    return res.status(200).json({})
  } catch (e) {
    logger.serverLog(TAG, `Error on Webhook ${JSON.stringify(e)}`)
    return res.status(500).json({status: 'failed', err: e})
  }
}
