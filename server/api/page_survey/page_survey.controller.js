/**
 * Created by sojharo on 01/08/2017.
 */

const logger = require('../../components/logger')
const PageSurveys = require('./page_survey.model')

const TAG = 'api/page_survey/page_survey.controller.js'

exports.index = function (req, res) {
  PageSurveys.find({ userId: req.user._id }, (err, surveys) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({ status: 'success', payload: surveys })
  })
}

exports.show = function (req, res) {
  PageSurveys.find({ pollId: req.params.id }, (err, surveys) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({ status: 'success', payload: surveys })
  })
}
