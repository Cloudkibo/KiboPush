const logger = require('../../../components/logger')
const Pages = require('../pages/Pages.model')
const TAG = 'api/facebookEvents/changePageName.controller.js'

exports.changePageName = function (req, res) {
  let pageId = req.body.entry[0].id
  let newPageName = req.body.entry[0].changes[0].value
  logger.serverLog(TAG, `Page name update request ${JSON.stringify(req.body)}`)
  Pages.update({ pageId: pageId }, { $set: { pageName: newPageName } }, { multi: true }, (err, page) => {
    if (err) {
      logger.serverLog(TAG, `Error in updating page name ${JSON.stringify(err)}`)
    } else {
      logger.serverLog(TAG, `Page name updated: ${JSON.stringify(page)}`)
    }
  })
}
