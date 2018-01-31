const logger = require('../../components/logger')
const Lists = require('./lists.model')
const PhoneNumber = require('../growthtools/growthtools.model')
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
    PhoneNumber.find({hasSubscribed: true, companyId: companyUser.companyId}, (err, phonenumbers) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      Lists.update({listName: 'All customers'}, {
        listName: 'All customers',
        userId: req.user._id,
        companyId: companyUser.companyId,
        content: phonenumbers
      }, {upsert: true}, (err2, savedList) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
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
      content: req.body.content
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
