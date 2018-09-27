const logger = require('../../../components/logger')
const TAG = 'api/lists/lists.controller.js'
const mongoose = require('mongoose')
const utility = require('../utility')
const logicLayer = require('./lists.logiclayer')

exports.getAll = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    let criterias = logicLayer.getCriterias(req.body, companyuser)
    utility.callApi(`list/pagination/`, 'post', criterias.countCriteria) // fetch lists count
    .then(count => {
      utility.callApi(`list/pagination`, 'post', criterias.fetchCriteria) // fetch lists
      .then(lists => {
        if (req.body.first_page === 'previous') {
          res.status(200).json({
            status: 'success',
            payload: {lists: lists.reverse(), count: count.length > 0 ? count[0].count : 0}
          })
        } else {
          res.status(200).json({
            status: 'success',
            payload: {lists: lists, count: count.length > 0 ? count[0].count : 0}
          })
        }
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to fetch connected pages ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch connected pages count ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}
exports.createList = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyUser => {
    utility.callApi(`list`, 'post', {
      companyId: companyUser.companyId,
      userId: req.user._id,
      listName: req.body.listName,
      conditions: req.body.conditions,
      content: req.body.content,
      parentList: req.body.parentListId,
      parentListName: req.body.parentListName
    })
    .then(listCreated => {
      return res.status(201).json({status: 'success', payload: listCreated})
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch company user ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}
exports.editList = function (req, res) {
  utility.callApi(`list/${req.body._id}`, 'put', {
    listName: req.body.listName,
    conditions: req.body.conditions,
    content: req.body.content
  })
  .then(savedList => {
    return res.status(200).json({status: 'success', payload: savedList})
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}
