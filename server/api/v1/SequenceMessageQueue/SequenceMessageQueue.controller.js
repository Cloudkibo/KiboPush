const logger = require('../../../components/logger')
const SequenceMessageQueue = require('./SequenceMessageQueue.model')

const TAG = 'api/SequenceMessageQueue/SequenceMessageQueue.controller.js'

exports.index = function (req, res) {
  SequenceMessageQueue.find({ subscriberId: req.body.subscriberId }, (err, sequenceQueue) => {
    if (err) {
      logger.serverLog(TAG, JSON.stringify(err))
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!sequenceQueue) {
      return res.status(404).json({
        status: 'failed',
        description: 'Automation Queue is empty for this company. Please contact support'
      })
    }

    res.status(200).json({
      status: 'success',
      payload: sequenceQueue
    })
  })
}
