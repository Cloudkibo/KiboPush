/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/tags/tags.controller.js'

const Tags = require('./tags.model')
const TagsSubscribers = require('./../tags_subscribers/tags_subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const Subscribers = require('./../subscribers/Subscribers.model')
const _ = require('lodash')
const CompanyUsage = require('./../featureUsage/companyUsage.model')

exports.index = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email},
    (err, companyUser) => {
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
      Tags.find({companyId: companyUser.companyId}, (err, tags) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        res.status(200).json({status: 'success', payload: tags})
      })
    })
}

exports.create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'tag')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  CompanyUsers.findOne({domain_email: req.user.domain_email},
    (err, companyUser) => {
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
        companyId: companyUser.companyId
      })
      tagPayload.save((err, newTag) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        CompanyUsage.update({companyId: companyUser.companyId},
          { $inc: { labels: 1 } }, (err, updated) => {
            if (err) {
              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            }
          })
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'new_tag',
            payload: {
              tag_id: newTag._id,
              tag_name: newTag.tag
            }
          }
        })
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
      require('./../../config/socketio').sendMessageToClient({
        room_id: newTag.companyId,
        body: {
          action: 'tag_rename',
          payload: {
            tag_id: newTag._id,
            tag_name: newTag.tag
          }
        }
      })
      res.status(200).json({status: 'success', payload: newTag})
    })
  })
}

exports.delete = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'tagId')) parametersMissing = true

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
    TagsSubscribers.remove({tagId: req.body.tagId}, (err) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      Tags.remove({_id: req.body.tagId}, (err) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        require('./../../config/socketio').sendMessageToClient({
          room_id: tagPayload.companyId,
          body: {
            action: 'tag_remove',
            payload: {
              tag_id: req.body.tagId
            }
          }
        })
        res.status(200)
          .json({status: 'success', description: 'Tag removed successfully'})
      })
    })
  })
}

exports.assign = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'tagId')) parametersMissing = true
  if (!_.has(req.body, 'subscribers')) parametersMissing = true

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
    req.body.subscribers.forEach((subscriberId) => {
      Subscribers.findById(subscriberId, (err, subscriber) => {
        if (err) {
          logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
        }
        if (!subscriber) {
          logger.serverLog(TAG,
            `WRONG SUBSCRIBER ID ${subscriberId} SENT IN ${JSON.stringify(
              req.body.payload)}`)
        }
        let subscriberTagsPayload = new TagsSubscribers({
          tagId: tagPayload._id,
          subscriberId: subscriber._id,
          companyId: tagPayload.companyId
        })
        subscriberTagsPayload.save((err) => {
          if (err) {
            logger.serverLog(TAG,
              `Internal Server Error ${JSON.stringify(err)}`)
          }
        })
      })
    })
    require('./../../config/socketio').sendMessageToClient({
      room_id: tagPayload.companyId,
      body: {
        action: 'tag_assign',
        payload: {
          tag_id: req.body.tagId,
          subscriber_ids: req.body.subscribers
        }
      }
    })
    res.status(201).json({
      status: 'success',
      description: 'Tag assigned successfully'
    })
  })
}

exports.unassign = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'tagId')) parametersMissing = true
  if (!_.has(req.body, 'subscribers')) parametersMissing = true

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
    TagsSubscribers.remove(
      {tagId: req.body.tagId, subscriberId: {$in: req.body.subscribers}},
      (err) => {
        if (err) {
          return res.status(400)
          .json({status: 'failed', description: 'Parameters are missing'})
        }
        require('./../../config/socketio').sendMessageToClient({
          room_id: tagPayload.companyId,
          body: {
            action: 'tag_unassign',
            payload: {
              tag_id: req.body.tagId,
              subscriber_ids: req.body.subscribers
            }
          }
        })
        res.status(201).json({
          status: 'success',
          description: 'Tag unassigned successfully'
        })
      })
  })
}

exports.subscribertags = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'subscriberId')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }
  TagsSubscribers.find({subscriberId: req.body.subscriberId})
    .populate('tagId')
    .exec((err, tagsSubscriber) => {
      if (err) {
        return res.status(400)
          .json({status: 'failed', description: 'Parameters are missing'})
      }
      let payload = []
      for (let i = 0; i < tagsSubscriber.length; i++) {
        payload.push({
          _id: tagsSubscriber[i].tagId._id,
          tag: tagsSubscriber[i].tagId.tag,
          subscriberId: tagsSubscriber[i].subscriberId
        })
      }
      res.status(200).json({
        status: 'success',
        payload: payload
      })
    })
}
