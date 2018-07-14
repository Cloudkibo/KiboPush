const PlanUsage = require('./planUsage.model')
const CompanyUsage = require('./companyUsage.model')
const CompanyProfile = require('./../companyprofile/companyprofile.model')
const Plans = require('./../plans/plans.model')
const _ = require('lodash')

exports.index = function (req, res) {
  PlanUsage.findOne({plan_id: req.params.id}, (err, usage) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: usage
    })
  })
}

exports.update = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'plan_id')) parametersMissing = true
  if (!_.has(req.body, 'item_name')) parametersMissing = true
  if (!_.has(req.body, 'item_value')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  PlanUsage.findOne({plan_id: req.body.plan_id}, (err, usage) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    let name = req.body.item_name
    let value = req.body.item_value
    usage[name] = value
    usage.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Plan usage update failed'})
      }
      res.status(200).json({
        status: 'success',
        description: 'Feature has been updated successfully!'
      })
    })
  })
}

exports.create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'plan_id')) parametersMissing = true
  if (!_.has(req.body, 'item_name')) parametersMissing = true
  if (!_.has(req.body, 'item_value')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  let name = req.body.item_name
  let value = req.body.item_value
  let queryPlan = {}
  queryPlan[name] = value
  let queryCompany = {}
  queryCompany[name] = 0

  PlanUsage.update({}, queryPlan, {multi: true}, (err, updatedplan) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    CompanyUsage.update({}, queryCompany, {multi: true}, (err, updatedcompany) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      res.status(200).json({
        status: 'success',
        description: 'Usage item has been added successfully!'
      })
    })
  })
}

exports.populatePlanUsage = function (req, res) {
  Plans.find({}, (err, plans) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    plans.forEach((plan, index) => {
      if (plan.unique_ID === 'plan_A' || plan.unique_ID === 'plan_C') {
        let planUsageData = {
          plan_id: plan._id,
          broadcasts: -1,
          surveys: -1,
          polls: -1,
          broadcast_templates: -1,
          survey_templates: -1,
          polls_templates: -1,
          sessions: -1,
          chat_messages: -1,
          facebook_pages: -1,
          bots: -1,
          subscribers: -1,
          labels: -1,
          phone_invitation: -1,
          facebook_autoposting: -1,
          twitter_autoposting: -1,
          wordpress_autoposting: -1,
          broadcast_sequences: -1,
          messages_per_sequence: -1,
          segmentation_lists: -1
        }
        let planUsage = new PlanUsage(planUsageData)
        planUsage.save((err) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: 'Failed to insert record'})
          }
        })
      } else if (plan.unique_ID === 'plan_B' || plan.unique_ID === 'plan_D') {
        let planUsageData = {
          plan_id: plan._id,
          broadcasts: -1,
          surveys: -1,
          polls: -1,
          broadcast_templates: 0,
          survey_templates: 0,
          polls_templates: 0,
          sessions: -1,
          chat_messages: -1,
          facebook_pages: 5,
          bots: -1,
          subscribers: 1000,
          labels: 10,
          phone_invitation: 0,
          facebook_autoposting: 2,
          twitter_autoposting: 2,
          wordpress_autoposting: 2,
          broadcast_sequences: 3,
          messages_per_sequence: 5,
          segmentation_lists: 5
        }
        let planUsage = new PlanUsage(planUsageData)
        planUsage.save((err) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: 'Failed to insert record2'})
          }
        })
      }
      if (index === (plans.length - 1)) {
        return res.status(200).json({
          status: 'success',
          description: 'Successfuly populated!'
        })
      }
    })
  })
}

exports.populateCompanyUsage = function (req, res) {
  CompanyProfile.find({}, (err, companies) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    companies.forEach((company, index) => {
      let companyUsageData = {
        companyId: company._id,
        broadcasts: 0,
        surveys: 0,
        polls: 0,
        broadcast_templates: 0,
        survey_templates: 0,
        polls_templates: 0,
        sessions: 0,
        chat_messages: 0,
        facebook_pages: 0,
        bots: 0,
        subscribers: 0,
        labels: 0,
        phone_invitation: 0,
        facebook_autoposting: 0,
        twitter_autoposting: 0,
        wordpress_autoposting: 0,
        broadcast_sequences: 0,
        messages_per_sequence: 0,
        segmentation_lists: 0
      }
      let companyUsage = new CompanyUsage(companyUsageData)
      companyUsage.save((err) => {
        if (err) {
          return res.status(500)
            .json({status: 'failed', description: 'Failed to insert record'})
        }
      })
      if (index === (companies.length - 1)) {
        return res.status(200).json({
          status: 'success',
          description: 'Successfuly populated!'
        })
      }
    })
  })
}
