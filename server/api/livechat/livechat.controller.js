const logger = require('../../components/logger')
const TAG = 'api/livechat/livechat.controller.js'
var og = require('open-graph')

exports.geturlmeta = function (req, res) {
  var url = req.body.url
  logger.serverLog(TAG, `Url: ${url}`)
  og(url, function (err, meta) {
    if (err) {
      return res.status(404)
        .json({status: 'failed', description: 'Meta data not found'})
    }
    logger.serverLog(TAG, `Url Meta: ${meta}`)
    res.status(200).json({status: 'success', payload: meta})
  })
}
