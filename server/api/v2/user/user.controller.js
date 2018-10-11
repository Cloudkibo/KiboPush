const utility = require('../utility')
const logger = require('../../../components/logger')
const TAG = 'api/v2/user/user.controller.js'

exports.updateChecks = function (req, res) {
  utility.callApi(`user/updateChecks`, 'post', req.body) // call updateChecks in accounts
        .then(user => {
          return res.status(200).json({
            status: 'success',
            payload: user
          })
        }).catch(error => {
          logger.serverLog(TAG, `Error while updating checks ${error}`)
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to update checks ${JSON.stringify(error)}`
          })
        })
}
// its update but its get. how come that?
// not req.body everywhere
exports.updateSkipConnect = function (req, res) {
  utility.callApi(`user/updateSkipConnect`, 'get')
}

exports.updateMode = function (req, res) {
  utility.callApi(`user/updateMode`, 'post', req)
  .then(user => {
    return res.status(200).json({
      status: 'success',
      payload: user
    })
  }).catch(error => {
    logger.serverLog(TAG, `Error while updating mode ${error}`)
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to update mode ${JSON.stringify(error)}`
    })
  })
}

exports.fbAppId = function (req, res) {
  utility.callApi(`user/fbAppId`, 'get', req.body)
  .then(facebookClientId => {
    return res.status(200).json({
      status: 'success',
      payload: facebookClientId
    })
  }).catch(error => {
    logger.serverLog(TAG, `Error while getting fbAppId ${error}`)
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch fbAppId ${JSON.stringify(error)}`
    })
  })
}

exports.authenticatePassword = function (req, res) {
  utility.callApi(`user/authenticatePassword`, 'post', req.body)
    .then(status => {
      return res.status(200).json({
        status: 'success',
        payload: status
      })
    }).catch(error => {
      logger.serverLog(TAG, `Error while authenticating password ${error}`)
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to authenticate password ${JSON.stringify(error)}`
      })
    })
}

exports.addAccountType = function (req, res) {
  utility.callApi(`user/addAccountType`, 'get', req.body)
    .then(status => {
      return res.status(200).json({
        status: 'success',
        payload: status
      })
    }).catch(error => {
      logger.serverLog(TAG, `Error while adding account type ${error}`)
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to add account type ${JSON.stringify(error)}`
      })
    })
}

exports.enableDelete = function (req, res) {
  utility.callApi(`user/enableDelete`, 'post', req.body)
      .then(updatedUser => {
        return res.status(200).json({
          status: 'success',
          payload: updatedUser
        })
      }).catch(error => {
        logger.serverLog(TAG, `Error while enabling GDPR delete ${error}`)
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to enable GDPR delete ${JSON.stringify(error)}`
        })
      })
}

exports.cancelDeletion = function (req, res) {
  utility.callApi(`user/cancelDeletion`, 'post', req.body)
        .then(updatedUser => {
          return res.status(200).json({
            status: 'success',
            payload: updatedUser
          })
        }).catch(error => {
          logger.serverLog(TAG, `Error while enabling GDPR delete ${error}`)
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to enable GDPR delete ${JSON.stringify(error)}`
          })
        })
}
