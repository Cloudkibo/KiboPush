const utility = require('../utility')
const logicLayer = require('./lists.logiclayer')
const dataLayer = require('./lists.datalayer')
const logger = require('../../../components/logger')
const TAG = 'api/lists/lists.controller.js'
const util = require('util')

exports.getAll = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization) // fetch company user
  .then(companyuser => {
    let criterias = logicLayer.getCriterias(req.body, companyuser)
    console.log('criterias.countCriteria', JSON.stringify(criterias.countCriteria))
    console.log('criterias.fetchCriteria', JSON.stringify(criterias.fetchCriteria))
    utility.callApi(`lists/aggregate/`, 'post', criterias.countCriteria, req.headers.authorization) // fetch lists count
    .then(count => {
      utility.callApi(`lists/aggregate/`, 'post', criterias.fetchCriteria, req.headers.authorization) // fetch lists
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
          payload: `Failed to fetch lists ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch list count ${JSON.stringify(error)}`
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
  utility.callApi(`companyprofile/query`, 'post', {ownerId: req.user._id}, req.headers.authorization)
  .then(companyProfile => {
    utility.callApi(`featureUsage/planQuery`, 'post', {planId: companyProfile.planId}, req.headers.authorization)
    .then(planUsage => {
      utility.callApi(`featureUsage/companyQuery`, 'post', {companyId: companyProfile._id}, req.headers.authorization)
      .then(companyUsage => {
        if (planUsage.segmentation_lists !== -1 && companyUsage.segmentation_lists >= planUsage.segmentation_lists) {
          return res.status(500).json({
            status: 'failed',
            description: `Your lists limit has reached. Please upgrade your plan to premium in order to create more lists.`
          })
        }
        utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization) // fetch company user
        .then(companyUser => {
          utility.callApi(`lists`, 'post', {
            companyId: companyUser.companyId,
            userId: req.user._id,
            listName: req.body.listName,
            conditions: req.body.conditions,
            content: req.body.content,
            parentList: req.body.parentListId,
            parentListName: req.body.parentListName
          }, req.headers.authorization)
          .then(listCreated => {
            utility.callApi(`featureUsage/updateCompany`, 'put', {
              query: {companyId: req.body.companyId},
              newPayload: { $inc: { segmentation_lists: 1 } }
            }, req.headers.authorization)
            .then(updated => {
            })
            .catch(error => {
              return res.status(500).json({
                status: 'failed',
                payload: `Failed to update company usage ${JSON.stringify(error)}`
              })
            })
            return res.status(201).json({status: 'success', payload: listCreated})
          })
          .catch(error => {
            return res.status(500).json({
              status: 'failed',
              payload: `Failed to create list ${JSON.stringify(error)}`
            })
          })
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
          payload: `Failed to company usage ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to plan usage ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to company profile ${JSON.stringify(error)}`
    })
  })
}
exports.editList = function (req, res) {
  utility.callApi(`lists/${req.body._id}`, 'put', {
    listName: req.body.listName,
    conditions: req.body.conditions,
    content: req.body.content
  }, req.headers.authorization)
  .then(savedList => {
    return res.status(200).json({status: 'success', payload: savedList})
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to edit ${JSON.stringify(error)}`
    })
  })
}
exports.viewList = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization) // fetch company user
  .then(companyUser => {
    utility.callApi(`lists/${req.params.id}`, 'get', {}, req.headers.authorization)
    .then(list => {
      logger.serverLog(TAG, `found list ${util.inspect(list)}`)
      if (list.initialList === true) {
        utility.callApi(`phone/query`, 'post', {
          companyId: companyUser.companyId,
          hasSubscribed: true,
          fileName: list[0].listName
        }, req.headers.authorization)
        .then(number => {
          if (number.length > 0) {
            let criterias = logicLayer.getSubscriberCriteria(number, companyUser)
            utility.callApi(`subscribers/query`, 'post', criterias, req.headers.authorization)
            .then(subscribers => {
              let content = logicLayer.getContent(subscribers)
              utility.callApi(`lists/${req.params.id}`, 'put', {
                content: content
              }, req.headers.authorization)
              .then(savedList => {
                return res.status(201).json({status: 'success', payload: subscribers})
              })
              .catch(error => {
                return res.status(500).json({
                  status: 'failed',
                  payload: `Failed to fetch list content ${JSON.stringify(error)}`
                })
              })
            })
            .catch(error => {
              return res.status(500).json({
                status: 'failed',
                payload: `Failed to fetch subscribers ${JSON.stringify(error)}`
              })
            })
          } else {
            return res.status(500).json({
              status: 'failed',
              description: 'No subscribers found'
            })
          }
        })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to fetch numbers ${JSON.stringify(error)}`
          })
        })
      } else {
        utility.callApi(`subscribers/query`, 'post', {
          isSubscribed: true, _id: {$in: list[0].content}}, req.headers.authorization)
        .then(subscribers => {
          return res.status(201)
            .json({status: 'success', payload: subscribers})
        })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to fetch subscribers ${JSON.stringify(error)}`
          })
        })
      }
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch list ${JSON.stringify(error)}`
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
exports.deleteList = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization) // fetch company user
  .then(companyUser => {
    utility.callApi(`lists/${req.params.id}`, 'delete', {}, req.headers.authorization)
    .then(result => {
      utility.callApi(`featureUsage/updateCompany`, 'put', {
        query: {companyId: companyUser.companyId},
        newPayload: { $inc: { segmentation_lists: -1 } }
      }, req.headers.authorization)
      .then(updated => {
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to update company usage ${JSON.stringify(error)}`
        })
      })
      res.status(201).json({status: 'success', payload: result})
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to delete list ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to delete list ${JSON.stringify(error)}`
    })
  })
}
exports.repliedPollSubscribers = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization) // fetch company user
  .then(companyUser => {
    dataLayer.findPolls({companyId: companyUser.companyId})
    .then(polls => {
      let criteria = logicLayer.pollResponseCriteria(polls)
      dataLayer.findPollResponses(criteria)
      .then(responses => {
        let subscriberCriteria = logicLayer.respondedSubscribersCriteria(responses)
        utility.callApi(`subscribers/query`, 'post', subscriberCriteria, req.headers.authorization)
        .then(subscribers => {
          let subscribersPayload = logicLayer.preparePayload(subscribers, responses)
          return res.status(200).json({status: 'success', payload: subscribersPayload})
        })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to fetch subscribers ${JSON.stringify(error)}`
          })
        })
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to fetch poll responses ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch polls ${JSON.stringify(error)}`
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
exports.repliedSurveySubscribers = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization) // fetch company user
  .then(companyUser => {
    dataLayer.findSurveys({companyId: companyUser.companyId})
    .then(surveys => {
      let criteria = logicLayer.pollResponseCriteria(surveys)
      dataLayer.findSurveyResponses(criteria)
      .then(responses => {
        let subscriberCriteria = logicLayer.respondedSubscribersCriteria(responses)
        utility.callApi(`subscribers/query`, 'post', subscriberCriteria, req.headers.authorization)
        .then(subscribers => {
          let subscribersPayload = logicLayer.preparePayload(subscribers, responses)
          return res.status(200).json({status: 'success', payload: subscribersPayload})
        })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to fetch subscribers ${JSON.stringify(error)}`
          })
        })
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to fetch survey responses ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch surveys ${JSON.stringify(error)}`
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
