/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Subscribers = require('./Subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const TAG = 'api/subscribers/subscribers.controller.js'
const TagsSubscribers = require('./../tags_subscribers/tags_subscribers.model')

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
        for (let i = 0; i < subscribers.length; i++) {
          subsArray.push(subscribers[i]._id)
          subscribers.tags = []
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
                if (subscribers[i]._id === tags[j].subscriberId) {
                  subscribers[i].tags.push(tags[j].tagId.tag)
                }
              }
            }
            res.status(200).json(subscribers)
          })
      })
    })
}
