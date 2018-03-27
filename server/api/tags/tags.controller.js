/**
 * Created by sojharo on 27/07/2017.
 */

// const logger = require('../../components/logger')
// const TAG = 'api/tags/tags.controller.js'

const Tags = require('./tags.model')
// const Users = require('../user/Users.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const _ = require('lodash')

exports.index = function (req, res) {
  res.status(200).json({status: 'success', payload: 'Under construction'})
}

exports.create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'tag')) parametersMissing = true
  if (!_.has(req.body, 'pageId')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
    .json({status: 'failed', description: 'Parameters are missing'})
  }

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
    let tagPayload = new Tags({
      tag: req.body.tag,
      userId: req.user._id,
      companyId: companyUser.companyId,
      pageId: req.body.pageId
    })
    tagPayload.save((err, newTag) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      res.status(201).json({status: 'success', payload: newTag})
    })
  })
}

exports.rename = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'tagId')) parametersMissing = true
  if (!_.has(req.body, 'tagName')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
    .json({status: 'failed', description: 'Parameters are missing'})
  }

  Tags.findOne({_id: req.body.tagId}, (err, tagPayload) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!tagPayload) {
      return res.status(404).json({
        status: 'failed',
        description: 'No tag is available on server with given tagId.'
      })
    }
    tagPayload.tag = req.body.tagName
    tagPayload.save((err, newTag) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      res.status(200).json({status: 'success', payload: newTag})
    })
  })
}
