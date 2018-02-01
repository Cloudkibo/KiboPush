const logger = require('../../components/logger')
const Lists = require('./lists.model')
const PhoneNumber = require('../growthtools/growthtools.model')
const Subscribers = require('../subscribers/Subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const TAG = 'api/surveys/surveys.controller.js'

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
  Lists.find({_id: req.params.id}, (err, list) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (list[0].condition === 'initial_list') {
      Subscribers.find({isSubscribedByPhoneNumber: true}, (err, subscribers) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
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
          return res.status(201).json({status: 'success', payload: subscribers})
        })
      })
    }
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
      condition: req.body.condition
    }
    const list = new Lists(listPayload)
    list.save((err, listCreated) => {
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
    list.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      res.status(201).json({status: 'success', payload: list})
    })
  })
}
