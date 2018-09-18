/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Subscribers = require('./Subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const TAG = 'api/subscribers/subscribers.controller.js'
const TagsSubscribers = require('./../tags_subscribers/tags_subscribers.model')
const mongoose = require('mongoose')

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
      Subscribers.find({
        companyId: companyUser.companyId,
        isEnabledByPage: true,
        isSubscribed: true
      }).populate('pageId').exec((err, subscribers) => {
        if (err) {
          logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
          return res.status(404)
            .json({status: 'failed', description: 'Subscribers not found'})
        }
        let subsArray = []
        let subscribersPayload = []
        for (let i = 0; i < subscribers.length; i++) {
          subsArray.push(subscribers[i]._id)
          subscribersPayload.push({
            _id: subscribers[i]._id,
            firstName: subscribers[i].firstName,
            lastName: subscribers[i].lastName,
            locale: subscribers[i].locale,
            gender: subscribers[i].gender,
            timezone: subscribers[i].timezone,
            profilePic: subscribers[i].profilePic,
            companyId: subscribers[i].companyId,
            pageScopedId: '',
            email: '',
            senderId: subscribers[i].senderId,
            pageId: subscribers[i].pageId,
            datetime: subscribers[i].datetime,
            isEnabledByPage: subscribers[i].isEnabledByPage,
            isSubscribed: subscribers[i].isSubscribed,
            isSubscribedByPhoneNumber: subscribers[i].isSubscribedByPhoneNumber,
            phoneNumber: subscribers[i].phoneNumber,
            unSubscribedBy: subscribers[i].unSubscribedBy,
            tags: []
          })
        }
        TagsSubscribers.find({subscriberId: {$in: subsArray}})
          .populate('tagId')
          .exec((err, tags) => {
            if (err) {
              logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
              return res.status(404)
                .json({status: 'failed', description: 'Subscribers not found'})
            }
            for (let i = 0; i < subscribers.length; i++) {
              for (let j = 0; j < tags.length; j++) {
                if (subscribers[i]._id.toString() === tags[j].subscriberId.toString()) {
                  subscribersPayload[i].tags.push(tags[j].tagId.tag)
                }
              }
            }
            res.status(200).json(subscribersPayload)
          })
      })
    })
}

exports.allSubscribers = function (req, res) {
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
      Subscribers.find({
        companyId: companyUser.companyId,
        isEnabledByPage: true
      }).populate('pageId').exec((err, subscribers) => {
        if (err) {
          logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
          return res.status(404)
            .json({status: 'failed', description: 'Subscribers not found'})
        }
        let subsArray = []
        let subscribersPayload = []
        for (let i = 0; i < subscribers.length; i++) {
          subsArray.push(subscribers[i]._id)
          subscribersPayload.push({
            _id: subscribers[i]._id,
            firstName: subscribers[i].firstName,
            lastName: subscribers[i].lastName,
            locale: subscribers[i].locale,
            gender: subscribers[i].gender,
            timezone: subscribers[i].timezone,
            profilePic: subscribers[i].profilePic,
            companyId: subscribers[i].companyId,
            pageScopedId: '',
            email: '',
            senderId: subscribers[i].senderId,
            pageId: subscribers[i].pageId,
            datetime: subscribers[i].datetime,
            isEnabledByPage: subscribers[i].isEnabledByPage,
            isSubscribed: subscribers[i].isSubscribed,
            phoneNumber: subscribers[i].phoneNumber,
            unSubscribedBy: subscribers[i].unSubscribedBy,
            tags: [],
            source: subscribers[i].source
          })
        }
        TagsSubscribers.find({subscriberId: {$in: subsArray}})
          .populate('tagId')
          .exec((err, tags) => {
            if (err) {
              logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
              return res.status(404)
                .json({status: 'failed', description: 'Subscribers not found'})
            }
            for (let i = 0; i < subscribers.length; i++) {
              for (let j = 0; j < tags.length; j++) {
                if (subscribers[i]._id.toString() === tags[j].subscriberId.toString()) {
                  subscribersPayload[i].tags.push(tags[j].tagId.tag)
                }
              }
            }
            res.status(200).json(subscribersPayload)
          })
      })
    })
}

exports.allLocales = function (req, res) {
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
    Subscribers.distinct('locale', {companyId: companyUser.companyId},
    (err, locales) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      res.status(200).json({
        status: 'success',
        payload: locales
      })
    })
  })
}

exports.getAll = function (req, res) {
  /*
  body = {
    first_page:
    last_id:
    number_of_records:
    filter:
    filter_criteria: {
      search_value:
      gender_value:
      page_value:
      locale_value:
      tag_value:
      status_value
  }
}
  */
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
      if (req.body.first_page === 'first') {
        if (!req.body.filter) {
          Subscribers.aggregate([
            { $match: {companyId: mongoose.Types.ObjectId(companyUser.companyId), isEnabledByPage: true} },
            { $group: { _id: null, count: { $sum: 1 } } }
          ], (err, subscribersCount) => {
            if (err) {
              return res.status(404)
                .json({status: 'failed', description: 'BroadcastsCount not found'})
            }
            Subscribers.find({
              companyId: companyUser.companyId,
              isEnabledByPage: true
            }).limit(req.body.number_of_records)
            .populate('pageId').exec((err, subscribers) => {
              if (err) {
                logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                return res.status(404)
                  .json({status: 'failed', description: 'Subscribers not found'})
              }
              let subsArray = []
              let subscribersPayload = []
              for (let i = 0; i < subscribers.length; i++) {
                subsArray.push(subscribers[i]._id)
                subscribersPayload.push({
                  _id: subscribers[i]._id,
                  firstName: subscribers[i].firstName,
                  lastName: subscribers[i].lastName,
                  locale: subscribers[i].locale,
                  gender: subscribers[i].gender,
                  timezone: subscribers[i].timezone,
                  profilePic: subscribers[i].profilePic,
                  companyId: subscribers[i].companyId,
                  pageScopedId: '',
                  email: '',
                  senderId: subscribers[i].senderId,
                  pageId: subscribers[i].pageId,
                  datetime: subscribers[i].datetime,
                  isEnabledByPage: subscribers[i].isEnabledByPage,
                  isSubscribed: subscribers[i].isSubscribed,
                  phoneNumber: subscribers[i].phoneNumber,
                  unSubscribedBy: subscribers[i].unSubscribedBy,
                  tags: [],
                  source: subscribers[i].source
                })
              }
              TagsSubscribers.find({subscriberId: {$in: subsArray}})
                .populate('tagId')
                .exec((err, tags) => {
                  if (err) {
                    logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                    return res.status(404)
                      .json({status: 'failed', description: 'Subscribers not found'})
                  }
                  for (let i = 0; i < subscribers.length; i++) {
                    for (let j = 0; j < tags.length; j++) {
                      if (subscribers[i]._id.toString() === tags[j].subscriberId.toString()) {
                        subscribersPayload[i].tags.push(tags[j].tagId.tag)
                      }
                    }
                  }
                  res.status(200).json({
                    status: 'success',
                    payload: {subscribers: subscribersPayload, count: subscribersPayload.length > 0 ? subscribersCount[0].count : ''}
                  })
                })
            })
          })
        } else {
          let search = new RegExp('.*' + req.body.filter_criteria.search_value + '.*', 'i')
          let subscribersFindCriteria = {
            companyId: mongoose.Types.ObjectId(companyUser.companyId),
            isEnabledByPage: true,
            $or: [{firstName: {$regex: search}}, {lastName: {$regex: search}}],
            gender: req.body.filter_criteria.gender_value !== '' ? req.body.filter_criteria.gender_value : {$exists: true},
            locale: req.body.filter_criteria.locale_value !== '' ? req.body.filter_criteria.locale_value : {$exists: true},
            isSubscribed: req.body.filter_criteria.status_value !== '' ? req.body.filter_criteria.status_value : {$exists: true},
            pageId: req.body.filter_criteria.page_value !== '' ? mongoose.Types.ObjectId(req.body.filter_criteria.page_value) : {$exists: true}
          }
          Subscribers.aggregate([
            { $match: subscribersFindCriteria },
            { $group: { _id: null, count: { $sum: 1 } } }
          ], (err, subscribersCount) => {
            if (err) {
              return res.status(404)
                .json({status: 'failed', description: 'BroadcastsCount not found'})
            }
            Subscribers.find(subscribersFindCriteria).limit(req.body.number_of_records)
            .populate('pageId').exec((err, subscribers) => {
              if (err) {
                logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                return res.status(404)
                  .json({status: 'failed', description: 'Subscribers not found'})
              }
              let subsArray = []
              let subscribersPayload = []
              for (let i = 0; i < subscribers.length; i++) {
                subsArray.push(subscribers[i]._id)
                subscribersPayload.push({
                  _id: subscribers[i]._id,
                  firstName: subscribers[i].firstName,
                  lastName: subscribers[i].lastName,
                  locale: subscribers[i].locale,
                  gender: subscribers[i].gender,
                  timezone: subscribers[i].timezone,
                  profilePic: subscribers[i].profilePic,
                  companyId: subscribers[i].companyId,
                  pageScopedId: '',
                  email: '',
                  senderId: subscribers[i].senderId,
                  pageId: subscribers[i].pageId,
                  datetime: subscribers[i].datetime,
                  isEnabledByPage: subscribers[i].isEnabledByPage,
                  isSubscribed: subscribers[i].isSubscribed,
                  phoneNumber: subscribers[i].phoneNumber,
                  unSubscribedBy: subscribers[i].unSubscribedBy,
                  tags: [],
                  source: subscribers[i].source
                })
              }
              let tagFindCriteria = {
                subscriberId: {$in: subsArray},
                tagId: req.body.filter_criteria.tag_value !== '' ? req.body.filter_criteria.tag_value : {$exists: true}
              }
              TagsSubscribers.find(tagFindCriteria)
                .populate('tagId')
                .exec((err, tags) => {
                  if (err) {
                    logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                    return res.status(404)
                      .json({status: 'failed', description: 'Subscribers not found'})
                  }
                  for (let i = 0; i < subscribers.length; i++) {
                    for (let j = 0; j < tags.length; j++) {
                      if (subscribers[i]._id.toString() === tags[j].subscriberId.toString()) {
                        subscribersPayload[i].tags.push(tags[j].tagId.tag)
                      }
                    }
                  }
                  let payload = []
                  if (req.body.filter_criteria.tag_value !== '') {
                    for (let j = 0; j < subscribersPayload.length; j++) {
                      if (subscribersPayload[j].tags && subscribersPayload[j].tags.length > 0) {
                        payload.push(subscribersPayload[j])
                      }
                    }
                  } else {
                    payload = subscribersPayload
                  }
                  res.status(200).json({
                    status: 'success',
                    payload: {subscribers: payload, count: subscribersPayload.length > 0 ? subscribersCount[0].count : ''}
                  })
                })
            })
          })
        }
      } else if (req.body.first_page === 'next') {
        let recordsToSkip = Math.abs(((req.body.requested_page - 1) - (req.body.current_page))) * req.body.number_of_records

        if (!req.body.filter) {
          Subscribers.aggregate([
            { $match: {companyId: mongoose.Types.ObjectId(companyUser.companyId), isEnabledByPage: true} },
            { $group: { _id: null, count: { $sum: 1 } } }
          ], (err, subscribersCount) => {
            if (err) {
              return res.status(404)
                .json({status: 'failed', description: 'BroadcastsCount not found'})
            }
            Subscribers.find({
              companyId: companyUser.companyId,
              isEnabledByPage: true,
              _id: {$gt: req.body.last_id}
            }).skip(recordsToSkip).limit(req.body.number_of_records)
            .populate('pageId').exec((err, subscribers) => {
              if (err) {
                logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                return res.status(404)
                  .json({status: 'failed', description: 'Subscribers not found'})
              }
              let subsArray = []
              let subscribersPayload = []
              for (let i = 0; i < subscribers.length; i++) {
                subsArray.push(subscribers[i]._id)
                subscribersPayload.push({
                  _id: subscribers[i]._id,
                  firstName: subscribers[i].firstName,
                  lastName: subscribers[i].lastName,
                  locale: subscribers[i].locale,
                  gender: subscribers[i].gender,
                  timezone: subscribers[i].timezone,
                  profilePic: subscribers[i].profilePic,
                  companyId: subscribers[i].companyId,
                  pageScopedId: '',
                  email: '',
                  senderId: subscribers[i].senderId,
                  pageId: subscribers[i].pageId,
                  datetime: subscribers[i].datetime,
                  isEnabledByPage: subscribers[i].isEnabledByPage,
                  isSubscribed: subscribers[i].isSubscribed,
                  phoneNumber: subscribers[i].phoneNumber,
                  unSubscribedBy: subscribers[i].unSubscribedBy,
                  tags: [],
                  source: subscribers[i].source
                })
              }
              TagsSubscribers.find({subscriberId: {$in: subsArray}})
                .populate('tagId')
                .exec((err, tags) => {
                  if (err) {
                    logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                    return res.status(404)
                      .json({status: 'failed', description: 'Subscribers not found'})
                  }
                  for (let i = 0; i < subscribers.length; i++) {
                    for (let j = 0; j < tags.length; j++) {
                      if (subscribers[i]._id.toString() === tags[j].subscriberId.toString()) {
                        subscribersPayload[i].tags.push(tags[j].tagId.tag)
                      }
                    }
                  }
                  res.status(200).json({
                    status: 'success',
                    payload: {subscribers: subscribersPayload, count: subscribersPayload.length > 0 ? subscribersCount[0].count : ''}
                  })
                })
            })
          })
        } else {
          let search = new RegExp('.*' + req.body.filter_criteria.search_value + '.*', 'i')
          let subscribersFindCriteria = {
            companyId: mongoose.Types.ObjectId(companyUser.companyId),
            isEnabledByPage: true,
            $or: [{firstName: {$regex: search}}, {lastName: {$regex: search}}],
            gender: req.body.filter_criteria.gender_value !== '' ? req.body.filter_criteria.gender_value : {$exists: true},
            locale: req.body.filter_criteria.locale_value !== '' ? req.body.filter_criteria.locale_value : {$exists: true},
            isSubscribed: req.body.filter_criteria.status_value === 'subscribed' ? req.body.filter_criteria.status_value : {$exists: true},
            pageId: req.body.filter_criteria.page_value !== '' ? mongoose.Types.ObjectId(req.body.filter_criteria.page_value) : {$exists: true}
          }
          Subscribers.aggregate([
            { $match: subscribersFindCriteria },
            { $group: { _id: null, count: { $sum: 1 } } }
          ], (err, subscribersCount) => {
            if (err) {
              return res.status(404)
                .json({status: 'failed', description: 'BroadcastsCount not found'})
            }
            Subscribers.find(Object.assign(subscribersFindCriteria, {_id: {$gt: req.body.last_id}})).skip(recordsToSkip).limit(req.body.number_of_records)
            .populate('pageId').exec((err, subscribers) => {
              if (err) {
                logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                return res.status(404)
                  .json({status: 'failed', description: 'Subscribers not found'})
              }
              let subsArray = []
              let subscribersPayload = []
              for (let i = 0; i < subscribers.length; i++) {
                subsArray.push(subscribers[i]._id)
                subscribersPayload.push({
                  _id: subscribers[i]._id,
                  firstName: subscribers[i].firstName,
                  lastName: subscribers[i].lastName,
                  locale: subscribers[i].locale,
                  gender: subscribers[i].gender,
                  timezone: subscribers[i].timezone,
                  profilePic: subscribers[i].profilePic,
                  companyId: subscribers[i].companyId,
                  pageScopedId: '',
                  email: '',
                  senderId: subscribers[i].senderId,
                  pageId: subscribers[i].pageId,
                  datetime: subscribers[i].datetime,
                  isEnabledByPage: subscribers[i].isEnabledByPage,
                  isSubscribed: subscribers[i].isSubscribed,
                  phoneNumber: subscribers[i].phoneNumber,
                  unSubscribedBy: subscribers[i].unSubscribedBy,
                  tags: [],
                  source: subscribers[i].source
                })
              }
              let tagFindCriteria = {
                subscriberId: {$in: subsArray},
                tagId: req.body.filter_criteria.tag_value !== '' ? req.body.filter_criteria.tag_value : {$exists: true}
              }
              TagsSubscribers.find(tagFindCriteria)
                .populate('tagId')
                .exec((err, tags) => {
                  if (err) {
                    logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                    return res.status(404)
                      .json({status: 'failed', description: 'Subscribers not found'})
                  }
                  for (let i = 0; i < subscribers.length; i++) {
                    for (let j = 0; j < tags.length; j++) {
                      if (subscribers[i]._id.toString() === tags[j].subscriberId.toString()) {
                        subscribersPayload[i].tags.push(tags[j].tagId.tag)
                      }
                    }
                  }
                  let payload = []
                  if (req.body.filter_criteria.tag_value !== '') {
                    for (let j = 0; j < subscribersPayload.length; j++) {
                      if (subscribersPayload[j].tags && subscribersPayload[j].tags.length > 0) {
                        payload.push(subscribersPayload[j])
                      }
                    }
                  } else {
                    payload = subscribersPayload
                  }
                  res.status(200).json({
                    status: 'success',
                    payload: {subscribers: payload, count: subscribersPayload.length > 0 ? subscribersCount[0].count : ''}
                  })
                })
            })
          })
        }
      } else if (req.body.first_page === 'previous') {
        let recordsToSkip = Math.abs(((req.body.requested_page) - (req.body.current_page - 1))) * req.body.number_of_records

        if (!req.body.filter) {
          Subscribers.aggregate([
            { $match: {companyId: mongoose.Types.ObjectId(companyUser.companyId), isEnabledByPage: true} },
            { $group: { _id: null, count: { $sum: 1 } } }
          ], (err, subscribersCount) => {
            if (err) {
              return res.status(404)
                .json({status: 'failed', description: 'BroadcastsCount not found'})
            }
            Subscribers.find({
              companyId: companyUser.companyId,
              isEnabledByPage: true,
              _id: {$lt: req.body.last_id}
            }).skip(recordsToSkip).limit(req.body.number_of_records)
            .populate('pageId').exec((err, subscribers) => {
              if (err) {
                logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                return res.status(404)
                  .json({status: 'failed', description: 'Subscribers not found'})
              }
              let subsArray = []
              let subscribersPayload = []
              for (let i = 0; i < subscribers.length; i++) {
                subsArray.push(subscribers[i]._id)
                subscribersPayload.push({
                  _id: subscribers[i]._id,
                  firstName: subscribers[i].firstName,
                  lastName: subscribers[i].lastName,
                  locale: subscribers[i].locale,
                  gender: subscribers[i].gender,
                  timezone: subscribers[i].timezone,
                  profilePic: subscribers[i].profilePic,
                  companyId: subscribers[i].companyId,
                  pageScopedId: '',
                  email: '',
                  senderId: subscribers[i].senderId,
                  pageId: subscribers[i].pageId,
                  datetime: subscribers[i].datetime,
                  isEnabledByPage: subscribers[i].isEnabledByPage,
                  isSubscribed: subscribers[i].isSubscribed,
                  phoneNumber: subscribers[i].phoneNumber,
                  unSubscribedBy: subscribers[i].unSubscribedBy,
                  tags: [],
                  source: subscribers[i].source
                })
              }
              TagsSubscribers.find({subscriberId: {$in: subsArray}})
                .populate('tagId')
                .exec((err, tags) => {
                  if (err) {
                    logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                    return res.status(404)
                      .json({status: 'failed', description: 'Subscribers not found'})
                  }
                  for (let i = 0; i < subscribers.length; i++) {
                    for (let j = 0; j < tags.length; j++) {
                      if (subscribers[i]._id.toString() === tags[j].subscriberId.toString()) {
                        subscribersPayload[i].tags.push(tags[j].tagId.tag)
                      }
                    }
                  }
                  res.status(200).json({
                    status: 'success',
                    payload: {subscribers: subscribersPayload, count: subscribersPayload.length > 0 ? subscribersCount[0].count : ''}
                  })
                })
            })
          })
        } else {
          let search = new RegExp('.*' + req.body.filter_criteria.search_value + '.*', 'i')
          let subscribersFindCriteria = {
            companyId: mongoose.Types.ObjectId(companyUser.companyId),
            isEnabledByPage: true,
            $or: [{firstName: {$regex: search}}, {lastName: {$regex: search}}],
            gender: req.body.filter_criteria.gender_value !== '' ? req.body.filter_criteria.gender_value : {$exists: true},
            locale: req.body.filter_criteria.locale_value !== '' ? req.body.filter_criteria.locale_value : {$exists: true},
            isSubscribed: req.body.filter_criteria.status_value === 'subscribed' ? req.body.filter_criteria.status_value : {$exists: true},
            pageId: req.body.filter_criteria.page_value !== '' ? mongoose.Types.ObjectId(req.body.filter_criteria.page_value) : {$exists: true}
          }
          Subscribers.aggregate([
            { $match: subscribersFindCriteria },
            { $group: { _id: null, count: { $sum: 1 } } }
          ], (err, subscribersCount) => {
            if (err) {
              return res.status(404)
                .json({status: 'failed', description: 'BroadcastsCount not found'})
            }
            Subscribers.find(Object.assign(subscribersFindCriteria, {_id: {$lt: req.body.last_id}})).skip(recordsToSkip).limit(req.body.number_of_records)
            .populate('pageId').exec((err, subscribers) => {
              if (err) {
                logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                return res.status(404)
                  .json({status: 'failed', description: 'Subscribers not found'})
              }
              let subsArray = []
              let subscribersPayload = []
              for (let i = 0; i < subscribers.length; i++) {
                subsArray.push(subscribers[i]._id)
                subscribersPayload.push({
                  _id: subscribers[i]._id,
                  firstName: subscribers[i].firstName,
                  lastName: subscribers[i].lastName,
                  locale: subscribers[i].locale,
                  gender: subscribers[i].gender,
                  timezone: subscribers[i].timezone,
                  profilePic: subscribers[i].profilePic,
                  companyId: subscribers[i].companyId,
                  pageScopedId: '',
                  email: '',
                  senderId: subscribers[i].senderId,
                  pageId: subscribers[i].pageId,
                  datetime: subscribers[i].datetime,
                  isEnabledByPage: subscribers[i].isEnabledByPage,
                  isSubscribed: subscribers[i].isSubscribed,
                  phoneNumber: subscribers[i].phoneNumber,
                  unSubscribedBy: subscribers[i].unSubscribedBy,
                  tags: [],
                  source: subscribers[i].source
                })
              }
              let tagFindCriteria = {
                subscriberId: {$in: subsArray},
                tagId: req.body.filter_criteria.tag_value !== '' ? req.body.filter_criteria.tag_value : {$exists: true}
              }
              TagsSubscribers.find(tagFindCriteria)
                .populate('tagId')
                .exec((err, tags) => {
                  if (err) {
                    logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                    return res.status(404)
                      .json({status: 'failed', description: 'Subscribers not found'})
                  }
                  for (let i = 0; i < subscribers.length; i++) {
                    for (let j = 0; j < tags.length; j++) {
                      if (subscribers[i]._id.toString() === tags[j].subscriberId.toString()) {
                        subscribersPayload[i].tags.push(tags[j].tagId.tag)
                      }
                    }
                  }
                  let payload = []
                  if (req.body.filter_criteria.tag_value !== '') {
                    for (let j = 0; j < subscribersPayload.length; j++) {
                      if (subscribersPayload[j].tags && subscribersPayload[j].tags.length > 0) {
                        payload.push(subscribersPayload[j])
                      }
                    }
                  } else {
                    payload = subscribersPayload
                  }
                  res.status(200).json({
                    status: 'success',
                    payload: {subscribers: payload, count: subscribersPayload.length > 0 ? subscribersCount[0].count : ''}
                  })
                })
            })
          })
        }
      }
    })
}

exports.subscribeBack = function (req, res) {
  Subscribers.findOne({_id: req.params.id, unSubscribedBy: 'agent'}, (err, subscriber) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!subscriber) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    subscriber.isSubscribed = true
    subscriber.unSubscribedBy = 'subscriber'
    subscriber.save((err2) => {
      if (err2) {
        return res.status(500)
            .json({status: 'failed', description: 'Could not subscribe back'})
      }
      res.status(200).json({status: 'success', payload: subscriber})

        // If the code below required?
        // require('./../../config/socketio').sendMessageToClient({
        //   room_id: companyUser.companyId,
        //   body: {
        //     action: 'subscriber_updated',
        //     payload: {
        //       subscriber_id: subscriber._id,
        //       user_id: req.user._id,
        //       user_name: req.user.name,
        //       payload: subscriber
        //     }
        //   }
        // })
    })
  })
}
