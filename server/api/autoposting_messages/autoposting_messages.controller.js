const AutopostingMessages = require('./autoposting_messages.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const mongoose = require('mongoose')

exports.index = function (req, res) {
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
    AutopostingMessages.find({companyId: companyUser.companyId, autopostingId: req.params.id})
    .populate('pageId companyId autopostingId')
    .exec((err, autopostingMessages) => {
      if (err) {
        return res.status(500)
        .json({status: 'failed', description: 'Autoposting query failed'})
      }
      res.status(200).json({
        status: 'success',
        payload: autopostingMessages
      })
    })
  })
}

exports.getMessages = function (req, res) {
  /*
  body = {
    first_page:
    last_id:
    number_of_records:
}
  */
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
    if (req.body.first_page) {
      AutopostingMessages.aggregate([
        { $match: {companyId: mongoose.Types.ObjectId(companyUser.companyId), autopostingId: mongoose.Types.ObjectId(req.params.id)} },
        { $group: { _id: null, count: { $sum: 1 } } }
      ], (err, messagesCount) => {
        if (err) {
          return res.status(404)
            .json({status: 'failed', description: 'BroadcastsCount not found'})
        }
        AutopostingMessages.find({companyId: companyUser.companyId, autopostingId: req.params.id}).limit(req.body.number_of_records)
        .populate('pageId companyId autopostingId')
        .exec((err, autopostingMessages) => {
          if (err) {
            return res.status(500)
            .json({status: 'failed', description: 'Autoposting query failed'})
          }
          res.status(200).json({
            status: 'success',
            payload: {messages: autopostingMessages, count: messagesCount.length > 0 ? messagesCount[0].count : 0}
          })
        })
      })
    } else {
      AutopostingMessages.aggregate([
        { $match: {companyId: mongoose.Types.ObjectId(companyUser.companyId), autopostingId: mongoose.Types.ObjectId(req.params.id)} },
        { $group: { _id: null, count: { $sum: 1 } } }
      ], (err, messagesCount) => {
        if (err) {
          return res.status(404)
            .json({status: 'failed', description: 'BroadcastsCount not found'})
        }
        AutopostingMessages.find({companyId: companyUser.companyId, autopostingId: req.params.id, _id: {$gt: req.body.last_id}}).limit(req.body.number_of_records)
        .populate('pageId companyId autopostingId')
        .exec((err, autopostingMessages) => {
          if (err) {
            return res.status(500)
            .json({status: 'failed', description: 'Autoposting query failed'})
          }
          res.status(200).json({
            status: 'success',
            payload: {messages: autopostingMessages, count: messagesCount.length > 0 ? messagesCount[0].count : 0}
          })
        })
      })
    }
  })
}
