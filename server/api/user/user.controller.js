/**
 * Created by sojharo on 27/07/2017.
 */

const Users = require('./Users.model')

const logger = require('../../components/logger')

const TAG = 'api/user/user.controller.js'

exports.index = function (req, res) {
  Users.findOne({_id: req.user._id}, (err, user) => {
    if (err) {
      logger.serverLog(TAG, 'user object sent to client failed ' + JSON.stringify(err))
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!user) {
      return res.status(404)
        .json({status: 'failed', description: 'User not found'})
    }
    res.status(200).json({status: 'success', payload: user})
  })
}

exports.updateChecks = function (req, res) {
  Users.findOne({_id: req.user._id}, (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!user) {
      return res.status(404)
        .json({status: 'failed', description: 'User not found'})
    }
    logger.serverLog(TAG, `user object being update with : ${JSON.stringify(
      req.body)}`)

    if (req.body.getStartedSeen) user.getStartedSeen = req.body.getStartedSeen
    if (req.body.dashboardTourSeen) user.dashboardTourSeen = req.body.dashboardTourSeen
    if (req.body.workFlowsTourSeen) user.workFlowsTourSeen = req.body.workFlowsTourSeen
    if (req.body.surveyTourSeen) user.surveyTourSeen = req.body.surveyTourSeen
    if (req.body.convoTourSeen) user.convoTourSeen = req.body.convoTourSeen
    if (req.body.pollTourSeen) user.pollTourSeen = req.body.pollTourSeen
    if (req.body.growthToolsTourSeen) user.growthToolsTourSeen = req.body.growthToolsTourSeen
    if (req.body.subscriberTourSeen) user.subscriberTourSeen = req.body.subscriberTourSeen
    if (req.body.liveChatTourSeen) user.liveChatTourSeen = req.body.liveChatTourSeen
    if (req.body.autoPostingTourSeen) user.autoPostingTourSeen = req.body.autoPostingTourSeen
    if (req.body.mainMenuTourSeen) user.mainMenuTourSeen = req.body.mainMenuTourSeen
    if (req.body.subscribeToMessengerTourSeen) user.subscribeToMessengerTourSeen = req.body.subscribeToMessengerTourSeen
    if (req.body.pagesTourSeen) user.pagesTourSeen = req.body.pagesTourSeen

    user.save((err) => {
      if (err) {
        return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
      }
      return res.status(200).json({status: 'success', payload: user})
    })
  })
}
