// eslint-disable-next-line no-unused-vars
const logger = require('../../components/logger')
const Lists = require('./lists.model')
const Subscribers = require('../subscribers/Subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
// eslint-disable-next-line no-unused-vars
const TAG = 'api/lists/lists.controller.js'
const PhoneNumber = require('../growthtools/growthtools.model')
const Polls = require('./../polls/Polls.model')
const Surveys = require('./../surveys/surveys.model')
const PollResponses = require('./../polls/pollresponse.model')
const SurveyResponses = require('./../surveys/surveyresponse.model')
const mongoose = require('mongoose')
const CompanyUsage = require('./../featureUsage/companyUsage.model')
const PlanUsage = require('./../featureUsage/planUsage.model')
const CompanyProfile = require('./../companyprofile/companyprofile.model')
let _ = require('lodash')
exports.allLists = function (req, res) {
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

exports.getAll = function (req, res) {
  /*
  body: {
  first_page:
  last_id: number_of_records
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
        let findCriteria = {
          companyId: mongoose.Types.ObjectId(companyUser.companyId)
        }
        Lists.aggregate([
          { $match: findCriteria },
          { $group: { _id: null, count: { $sum: 1 } } }
        ], (err, listsCount) => {
          if (err) {
            return res.status(404)
              .json({status: 'failed', description: 'BroadcastsCount not found'})
          }
          Lists.aggregate([{$match: findCriteria}, {$sort: {datetime: -1}}]).limit(req.body.number_of_records)
          .exec((err, lists) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            // after survey is created, create survey questions
            return res.status(201).json({status: 'success', payload: {lists: lists, count: lists.length > 0 ? listsCount[0].count : ''}})
          })
        })
      } else if (req.body.first_page === 'next') {
        let findCriteria = {
          companyId: mongoose.Types.ObjectId(companyUser.companyId)
        }
        Lists.aggregate([
          { $match: findCriteria },
          { $group: { _id: null, count: { $sum: 1 } } }
        ], (err, listsCount) => {
          if (err) {
            return res.status(404)
              .json({status: 'failed', description: 'BroadcastsCount not found'})
          }
          Lists.aggregate([{$match: {$and: [findCriteria, {_id: {$lt: mongoose.Types.ObjectId(req.body.last_id)}}]}}, {$sort: {datetime: -1}}]).limit(req.body.number_of_records)
          .exec((err, lists) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            // after survey is created, create survey questions
            return res.status(201).json({status: 'success', payload: {lists: lists, count: lists.length > 0 ? listsCount[0].count : ''}})
          })
        })
      } else if (req.body.first_page === 'previous') {
        let findCriteria = {
          companyId: mongoose.Types.ObjectId(companyUser.companyId)
        }
        Lists.aggregate([
          { $match: findCriteria },
          { $group: { _id: null, count: { $sum: 1 } } }
        ], (err, listsCount) => {
          if (err) {
            return res.status(404)
              .json({status: 'failed', description: 'BroadcastsCount not found'})
          }
          Lists.aggregate([{$match: {$and: [findCriteria, {_id: {$gt: mongoose.Types.ObjectId(req.body.last_id)}}]}}, {$sort: {datetime: 1}}]).limit(req.body.number_of_records)
          .exec((err, lists) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            // after survey is created, create survey questions
            return res.status(201).json({status: 'success', payload: {lists: lists.reverse(), count: lists.length > 0 ? listsCount[0].count : ''}})
          })
        })
      }
    })
}

exports.viewList = function (req, res) {
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
      Lists.find({_id: req.params.id}, (err, list) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        if (list[0].initialList === true) {
          PhoneNumber.find({
            companyId: companyUser.companyId,
            hasSubscribed: true,
            fileName: list[0].listName
          }, (err, number) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: 'phone number not found'
              })
            }
            if (number.length > 0) {
              let findNumber = []
              let findPage = []
              for (let a = 0; a < number.length; a++) {
                findNumber.push(number[a].number)
                findPage.push(number[a].pageId)
              }
              let subscriberFindCriteria = {
                source: 'customer_matching',
                companyId: companyUser.companyId,
                isSubscribed: true
              }
              subscriberFindCriteria = _.merge(subscriberFindCriteria, {
                phoneNumber: {
                  $in: findNumber
                },
                pageId: {
                  $in: findPage
                }
              })
              Subscribers.find(subscriberFindCriteria)
                .populate('pageId')
                .exec((err, subscribers) => {
                  if (err) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Internal Server Error ${JSON.stringify(
                        err)}`
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
                        description: `Internal Server Error ${JSON.stringify(
                          err)}`
                      })
                    }
                  })
                  return res.status(201)
                    .json({status: 'success', payload: subscribers})
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
          Subscribers.find(pagesFindCriteria)
            .populate('pageId')
            .exec((err, subscriber) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
              return res.status(201)
                .json({status: 'success', payload: subscriber})
            })
        }
      })
    })
}
exports.createList = function (req, res) {
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
      CompanyProfile.findOne({ownerId: req.user._id}, (err, companyProfile) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        PlanUsage.findOne({planId: companyProfile.planId}, (err, planUsage) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          CompanyUsage.findOne({companyId: companyProfile._id}, (err, companyUsage) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            if (planUsage.segmentation_lists !== -1 && companyUsage.segmentation_lists >= planUsage.segmentation_lists) {
              return res.status(500).json({
                status: 'failed',
                description: `Your lists limit has reached. Please upgrade your plan to premium in order to create more lists.`
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
              CompanyUsage.update({companyId: companyUser.companyId},
                { $inc: { segmentation_lists: 1 } }, (err, updated) => {
                  if (err) {
                    logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                  }
                })
              return res.status(201).json({status: 'success', payload: listCreated})
            })
          })
        })
      })
    })
}
exports.deleteList = function (req, res) {
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
      return res.status(200).json({status: 'success'})
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
      return res.status(200).json({status: 'success', payload: savedList})
    })
  })
}
exports.repliedPollSubscribers = function (req, res) {
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
    Polls.find({companyId: companyUser.companyId}, {_id: 1}, (err, polls) => {
      if (err) {
        logger.serverLog(TAG, `Error: ${err}`)
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }
      let pollIds = []
      for (let i = 0; i < polls.length; i++) {
        pollIds.push(polls[i]._id)
      }
      PollResponses.find({pollId: {$in: pollIds}}, (err, responses) => {
        if (err) {
          return logger.serverLog(TAG,
            `At get survey responses subscribers ${JSON.stringify(err)}`)
        }
        let respondedSubscribers = []
        for (let j = 0; j < responses.length; j++) {
          respondedSubscribers.push(responses[j].subscriberId)
        }
        Subscribers.find({_id: {$in: respondedSubscribers}}, (err, subscribers) => {
          if (err) {
            return logger.serverLog(TAG,
              `At get survey responses subscribers ${JSON.stringify(err)}`)
          }
          let subscribersPayload = []
          for (let a = 0; a < subscribers.length; a++) {
            for (let b = 0; b < responses.length; b++) {
              if (JSON.stringify(subscribers[a]._id) === JSON.stringify(responses[b].subscriberId)) {
                subscribersPayload.push({
                  _id: subscribers[a]._id,
                  pageScopedId: subscribers[a].pageScopedId,
                  firstName: subscribers[a].firstName,
                  lastName: subscribers[a].lastName,
                  locale: subscribers[a].locale,
                  timezone: subscribers[a].timezone,
                  email: subscribers[a].email,
                  gender: subscribers[a].gender,
                  senderId: subscribers[a].senderId,
                  profilePic: subscribers[a].senderId,
                  pageId: subscribers[a].pageId,
                  phoneNumber: subscribers[a].phoneNumber,
                  unSubscribedBy: subscribers[a].unSubscribedBy,
                  companyId: subscribers[a].companyId,
                  isSubscribed: subscribers[a].isSubscribed,
                  isEnabledByPage: subscribers[a].isEnabledByPage,
                  datetime: subscribers[a].datetime,
                  dateReplied: responses[b].datetime,
                  source: subscribers[a].source
                })
              }
            }
          }
          return res.status(200).json({status: 'success', payload: subscribersPayload})
        })
      })
    })
  })
}
exports.repliedSurveySubscribers = function (req, res) {
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
    Surveys.find({companyId: companyUser.companyId}, {_id: 1}, (err, surveys) => {
      if (err) {
        logger.serverLog(TAG, `Error: ${err}`)
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }
      let surveyIds = []
      for (let i = 0; i < surveys.length; i++) {
        surveyIds.push(surveys[i]._id)
      }
      SurveyResponses.find({surveyId: {$in: surveyIds}}, (err, responses) => {
        if (err) {
          return logger.serverLog(TAG,
            `At get survey responses subscribers ${JSON.stringify(err)}`)
        }
        let respondedSubscribers = []
        for (let j = 0; j < responses.length; j++) {
          respondedSubscribers.push(responses[j].subscriberId)
        }
        Subscribers.find({_id: {$in: respondedSubscribers}}, (err, subscribers) => {
          if (err) {
            return logger.serverLog(TAG,
              `At get survey responses subscribers ${JSON.stringify(err)}`)
          }
          let subscribersPayload = []
          for (let a = 0; a < subscribers.length; a++) {
            for (let b = 0; b < responses.length; b++) {
              if (JSON.stringify(subscribers[a]._id) === JSON.stringify(responses[b].subscriberId)) {
                subscribersPayload.push({
                  _id: subscribers[a]._id,
                  pageScopedId: subscribers[a].pageScopedId,
                  firstName: subscribers[a].firstName,
                  lastName: subscribers[a].lastName,
                  locale: subscribers[a].locale,
                  timezone: subscribers[a].timezone,
                  email: subscribers[a].email,
                  gender: subscribers[a].gender,
                  senderId: subscribers[a].senderId,
                  profilePic: subscribers[a].senderId,
                  pageId: subscribers[a].pageId,
                  phoneNumber: subscribers[a].phoneNumber,
                  unSubscribedBy: subscribers[a].unSubscribedBy,
                  companyId: subscribers[a].companyId,
                  isSubscribed: subscribers[a].isSubscribed,
                  isEnabledByPage: subscribers[a].isEnabledByPage,
                  datetime: subscribers[a].datetime,
                  dateReplied: responses[b].datetime,
                  source: subscribers[a].source
                })
              }
            }
          }
          return res.status(200).json({status: 'success', payload: subscribersPayload})
        })
      })
    })
  })
}
