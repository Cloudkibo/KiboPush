const logger = require('../../components/logger')
const AutomationQueue = require('./automation_queue.model')

const TAG = 'api/automation_queue/automation_queue.controller.js'

exports.index = function (req, res) {
  AutomationQueue.find({ companyId: req.companyId }, (err, automationQueue) => {
    if (err) {
      logger.serverLog(TAG, JSON.stringify(err))
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!automationQueue) {
      return res.status(404).json({
        status: 'failed',
        description: 'Automation Queue is empty for this company. Please contact support'
      })
    }

    res.status(200).json({
      status: 'success',
      payload: automationQueue
    })
  })
}
