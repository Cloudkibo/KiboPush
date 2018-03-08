const logger = require('../../components/logger')
const Lists = require('./lists.model')
const Subscribers = require('../subscribers/Subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const TAG = 'api/surveys/surveys.controller.js'
const PhoneNumber = require('../growthtools/growthtools.model')
let _ = require('lodash')
exports.allLists = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    Lists.find({companyId: companyUser.companyId}, (err, lists) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
    // after survey is created, create survey questions
      return res.status(201).json({status: 'success', payload: lists})
    })
  })
}
exports.viewList = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    Lists.find({_id: req.params.id}, (err, list) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      logger.serverLog(TAG,
        `listFound ${JSON.stringify(list[0])}`)
      if (list[0].initialList === true) {
        PhoneNumber.find({companyId: companyUser.companyId, hasSubscribed: true, fileName: list[0].listName}, (err, number) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: 'phone number not found'
            })
          }
          logger.serverLog(TAG,
            `listFoundNumber ${JSON.stringify(number)}`)
          if (number.length > 0) {
            let findNumber = []
            let findPage = []
            for (let a = 0; a < number.length; a++) {
              findNumber.push(number[a].number)
              findPage.push(number[a].pageId)
            }
            let subscriberFindCriteria = {isSubscribedByPhoneNumber: true, companyId: companyUser.companyId, isSubscribed: true}
            subscriberFindCriteria = _.merge(subscriberFindCriteria, {
              phoneNumber: {
                $in: findNumber
              },
              pageId: {
                $in: findPage
              }
            })
            logger.serverLog(TAG,
              `listFoundCriteria ${JSON.stringify(subscriberFindCriteria)}`)
            Subscribers.find(subscriberFindCriteria).populate('pageId').exec((err, subscribers) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
              logger.serverLog(TAG,
                `listFoundCriteria ${JSON.stringify(subscribers)}`)
              let temp = []
              for (let i = 0; i < subscribers.length; i++) {
                temp.push(subscribers[i]._id)
              }
              Lists.update({_id: req.params.id}, {
                content: temp
              }, (err2, savedList) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
              })
              return res.status(201).json({status: 'success', payload: subscribers})
            })
          } else {
            return res.status(500).json({
              status: 'failed',
              description: 'No subscribers found'
            })
          }
        })
      } else {
        let pagesFindCriteria = {isSubscribed: true}
        pagesFindCriteria = _.merge(pagesFindCriteria, {
          _id: {
            $in: list[0].content
          }
        })
        Subscribers.find(pagesFindCriteria).populate('pageId').exec((err, subscriber) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          return res.status(201).json({status: 'success', payload: subscriber})
        })
      }
    })
  })
}
exports.createList = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    let listPayload = {
      companyId: companyUser.companyId,
      userId: req.user._id,
      listName: req.body.listName,
      conditions: req.body.conditions,
      content: req.body.content,
      parentList: req.body.parentListId,
      parentListName: req.body.parentListName
    }
    const newlist = new Lists(listPayload)
    newlist.save((err, listCreated) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      return res.status(201).json({status: 'success', payload: listCreated})
    })
  })
}
exports.deleteList = function (req, res) {
  logger.serverLog(TAG,
    `This is body in delete autoposting ${JSON.stringify(req.params)}`)
  Lists.findById(req.params.id, (err, list) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!list) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    list.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'list update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
exports.editList = function (req, res) {
  Lists.findById(req.body._id, (err, list) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!list) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    list.listName = req.body.listName
    list.conditions = req.body.conditions
    list.content = req.body.content
    list.save((err2, savedList) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      return res.status(200)
      .json({status: 'success', payload: savedList})
    })
  })
}
