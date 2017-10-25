/**
 * Created by sojharo on 25/09/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/backdoor/backdoor.controller.js'

const Users = require('../user/Users.model')
const Pages = require('../pages/Pages.model')
const Subscribers = require('../subscribers/Subscribers.model')
const Broadcasts = require('../broadcasts/broadcasts.model')
const Polls = require('../polls/Polls.model')
const Surveys = require('../surveys/surveys.model')
const sortBy = require('sort-array')
const mongoose = require('mongoose')
let _ = require('lodash')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Backdoor get all users api is working')
  Users.find({}, (err, users) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting users ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total users ${users.length}`)
    res.status(200).json({
      status: 'success',
      payload: users
    })
  })
}

exports.allpages = function (req, res) {
  logger.serverLog(TAG, `Backdoor get all pages ${JSON.stringify(req.params)}`)
  Pages.find({userId: req.params.userid}, (err, pages) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting pages ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total pages ${pages.length}`)
    Subscribers.aggregate([{
      $match: {
        userId: mongoose.Types.ObjectId(req.params.userid)
      }
    }, {
      $group: {
        _id: {pageId: '$pageId'},
        count: {$sum: 1}
      }
    }], (err2, gotSubscribersCount) => {
      if (err2) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting pages subscriber count ${JSON.stringify(err2)}`
        })
      }
      let pagesPayload = []
      for (let i = 0; i < pages.length; i++) {
        pagesPayload.push({
          _id: pages[i]._id,
          pageId: pages[i].pageId,
          pageName: pages[i].pageName,
          userId: pages[i].userId,
          pagePic: pages[i].pagePic,
          connected: pages[i].connected,
          pageUserName: pages[i].pageUserName,
          likes: pages[i].likes,
          subscribers: 0
        })
      }
      for (let i = 0; i < pagesPayload.length; i++) {
        for (let j = 0; j < gotSubscribersCount.length; j++) {
          if (pagesPayload[i]._id.toString() === gotSubscribersCount[j]._id.pageId.toString()) {
            logger.serverLog(TAG, `MATCH ${pagesPayload[i]._id} ${gotSubscribersCount[j]._id.pageId}`)
            logger.serverLog(TAG, `${JSON.stringify(gotSubscribersCount[j])}`)
            logger.serverLog(TAG, `${JSON.stringify(pagesPayload[i])}`)
            pagesPayload[i].subscribers = gotSubscribersCount[j].count
          }
        }
      }
      res.status(200).json({
        status: 'success',
        payload: pagesPayload
      })
    })
  })
}

exports.allsubscribers = function (req, res) {
  logger.serverLog(TAG, 'Backdoor get all subscribers api is working')
  Subscribers.find({pageId: req.params.pageid}, (err, subscribers) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting subscribers ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total subscribers ${subscribers.length}`)
    res.status(200).json({
      status: 'success',
      payload: subscribers
    })
  })
}

exports.allbroadcasts = function (req, res) {
  logger.serverLog(TAG, 'Backdoor get all broadcasts api is working')
  // todo put pagination for scaling
  Broadcasts.find({userId: req.params.userid}, (err, broadcasts) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting broadcasts ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total broadcasts ${broadcasts.length}`)
    res.status(200).json({
      status: 'success',
      payload: broadcasts
    })
  })
}

exports.allpolls = function (req, res) {
  logger.serverLog(TAG, 'Backdoor get all polls api is working')
  // todo put pagination for scaling
  Polls.find({userId: req.params.userid}, (err, polls) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting polls ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total polls ${polls.length}`)
    res.status(200).json({
      status: 'success',
      payload: polls
    })
  })
}

exports.allsurveys = function (req, res) {
  logger.serverLog(TAG, 'Backdoor get all surveys api is working')
  // todo put pagination for scaling
  Surveys.find({userId: req.params.userid}, (err, surveys) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting surveys ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total surveys ${surveys.length}`)
    res.status(200).json({
      status: 'success',
      payload: surveys
    })
  })
}

exports.toppages = function (req, res) {
  logger.serverLog(TAG, `Backdoor get all pages ${JSON.stringify(req.params)}`)
  Pages.find({}, (err, pages) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting pages ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total pages ${pages.length}`)
    Subscribers.aggregate([{
      $group: {
        _id: {pageId: '$pageId'},
        count: {$sum: 1}
      }
    }], (err2, gotSubscribersCount) => {
      if (err2) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting pages subscriber count ${JSON.stringify(err2)}`
        })
      }
      let pagesPayload = []
      for (let i = 0; i < pages.length; i++) {
        pagesPayload.push({
          _id: pages[i]._id,
          pageId: pages[i].pageId,
          pageName: pages[i].pageName,
          userId: pages[i].userId,
          pagePic: pages[i].pagePic,
          connected: pages[i].connected,
          pageUserName: pages[i].pageUserName,
          likes: pages[i].likes,
          subscribers: 0
        })
      }
      for (let i = 0; i < pagesPayload.length; i++) {
        for (let j = 0; j < gotSubscribersCount.length; j++) {
          if (pagesPayload[i]._id.toString() === gotSubscribersCount[j]._id.pageId.toString()) {
            logger.serverLog(TAG, `MATCH ${pagesPayload[i]._id} ${gotSubscribersCount[j]._id.pageId}`)
            logger.serverLog(TAG, `${JSON.stringify(gotSubscribersCount[j])}`)
            logger.serverLog(TAG, `${JSON.stringify(pagesPayload[i])}`)
            pagesPayload[i].subscribers = gotSubscribersCount[j].count
          }
        }
      }
      let sorted = sortBy(pagesPayload, 'subscribers')
      logger.serverLog(TAG, `sorted ${JSON.stringify(sorted)}`)
      let top10 = _.takeRight(sorted, 10)
      top10 = top10.reverse()
      logger.serverLog(TAG, `top10 ${JSON.stringify(top10)}`)
      res.status(200).json({
        status: 'success',
        payload: top10
      })
    })
  })
}
exports.datacount = function (req, res) {
  Users.aggregate(
    [
      { $group: { _id: null, count: { $sum: 1 } } }
    ], (err, gotUsersCount) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting Users count ${JSON.stringify(err)}`
      })
    }
    Subscribers.aggregate(
      [
        { $group: { _id: null, count: { $sum: 1 } } }
      ], (err2, gotSubscribersCount) => {
      if (err2) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting pages subscriber count ${JSON.stringify(err2)}`
        })
      }
      let datacounts = {
        UsersCount: gotUsersCount,
        SubscribersCount: gotSubscribersCount
      }
      logger.serverLog(TAG, `counts ${JSON.stringify(datacounts)}`)
      res.status(200).json({
        status: 'success',
        payload: datacounts
      })
    })
  })
}
