const Features = require('./permissions_plan.model')
const Plans = require('./../plans/plans.model')
const utility = require('./../plans/billing.utility')
const _ = require('lodash')

exports.index = function (req, res) {
  Features.findOne({plan_id: req.params.id}, (err, features) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: features
    })
  })
}

exports.update = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'features')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  Features.findOne({plan_id: req.body.features.plan_id}, (err, features) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    features = utility.prepareUpdatePayload(features, req.body.features, 'plan_id')
    features.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Features update failed'})
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

  if (!_.has(req.body, 'name')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  let feature = req.body.name.replace(' ', '_')
  let query = {}
  query[feature] = false

  Features.aggregate([{$addFields: query}, {$out: 'permissions_plan'}], (err, updated) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      description: 'Feature has been added successfully!'
    })
  })
}

exports.populatePlanPermissions = function (req, res) {
  Plans.find({}, (err, plans) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    plans.forEach((plan, index) => {
      if (plan.unique_ID === 'plan_A') {
        let featuresData = {
          plan_id: plan._id,
          customer_matching: true,
          invite_team: false,
          dashboard: true,
          broadcasts: true,
          broadcasts_templates: true,
          polls: true,
          polls_reports: true,
          surveys: true,
          surveys_reports: true,
          csv_exports: true,
          livechat: true,
          autoposting: true,
          menu: true,
          manage_pages: true,
          manage_subscribers: true,
          subscribe_to_messenger: true,
          team_members_management: false,
          messenger_links: true,
          comment_capture: true,
          messenger_code: true,
          analytics: true,
          api: true,
          advanced_segmentation: true,
          buy_button: true,
          segmentation_lists: true,
          user_permissions: false,
          greeting_text: true,
          welcome_message: true,
          html_widget: true,
          livechat_response_methods: true,
          kibopush_widget: true,
          webhook: true,
          survey_templates: true,
          poll_templates: true
        }
        let feature = new Features(featuresData)
        feature.save((err) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: 'Failed to insert record1'})
          }
        })
      } else if (plan.unique_ID === 'plan_B') {
        let featuresData = {
          plan_id: plan._id,
          customer_matching: false,
          invite_team: false,
          dashboard: true,
          broadcasts: true,
          broadcasts_templates: false,
          polls: true,
          polls_reports: true,
          surveys: true,
          surveys_reports: true,
          csv_exports: false,
          livechat: true,
          autoposting: true,
          menu: true,
          manage_pages: true,
          manage_subscribers: true,
          subscribe_to_messenger: true,
          team_members_management: false,
          messenger_links: true,
          comment_capture: false,
          messenger_code: false,
          analytics: false,
          api: false,
          advanced_segmentation: false,
          buy_button: false,
          segmentation_lists: true,
          user_permissions: false,
          greeting_text: true,
          welcome_message: true,
          html_widget: true,
          livechat_response_methods: false,
          kibopush_widget: false,
          webhook: false,
          survey_templates: false,
          poll_templates: false
        }
        let feature = new Features(featuresData)
        feature.save((err) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: 'Failed to insert record2'})
          }
        })
      } if (plan.unique_ID === 'plan_C') {
        let featuresData = {
          plan_id: plan._id,
          customer_matching: true,
          invite_team: true,
          dashboard: true,
          broadcasts: true,
          broadcasts_templates: true,
          polls: true,
          polls_reports: true,
          surveys: true,
          surveys_reports: true,
          csv_exports: true,
          livechat: true,
          autoposting: true,
          menu: true,
          manage_pages: true,
          manage_subscribers: true,
          subscribe_to_messenger: true,
          team_members_management: true,
          messenger_links: true,
          comment_capture: true,
          messenger_code: true,
          analytics: true,
          api: true,
          advanced_segmentation: true,
          buy_button: true,
          segmentation_lists: true,
          user_permissions: true,
          greeting_text: true,
          welcome_message: true,
          html_widget: true,
          livechat_response_methods: true,
          kibopush_widget: true,
          webhook: true,
          survey_templates: true,
          poll_templates: true
        }
        let feature = new Features(featuresData)
        feature.save((err) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: 'Failed to insert record3'})
          }
        })
      } if (plan.unique_ID === 'plan_D') {
        let featuresData = {
          plan_id: plan._id,
          customer_matching: false,
          invite_team: true,
          dashboard: true,
          broadcasts: true,
          broadcasts_templates: false,
          polls: true,
          polls_reports: true,
          surveys: true,
          surveys_reports: true,
          csv_exports: false,
          livechat: true,
          autoposting: true,
          menu: true,
          manage_pages: true,
          manage_subscribers: true,
          subscribe_to_messenger: true,
          team_members_management: true,
          messenger_links: true,
          comment_capture: false,
          messenger_code: false,
          analytics: false,
          api: false,
          advanced_segmentation: false,
          buy_button: false,
          segmentation_lists: true,
          user_permissions: true,
          greeting_text: true,
          welcome_message: true,
          html_widget: true,
          livechat_response_methods: false,
          kibopush_widget: false,
          webhook: false,
          survey_templates: false,
          poll_templates: false
        }
        let feature = new Features(featuresData)
        feature.save((err) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: 'Failed to insert record4'})
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
