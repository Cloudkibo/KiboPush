/**
 * Created by sojharo on 24/11/2017.
 */

const util = require('util')
const utility = require('../utility')

exports.index = function (req, res) {
  utility.callApi(`api_settings`, 'post', req.body, req.headers.authorization)
    .then(settings => {
      res.status(200).json({
        status: 'success',
        payload: settings
      })
    })
    .catch(err => {
      res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch api settings ${util.inspect(err)}`
      })
    })
}

exports.enable = function (req, res) {
  utility.callApi(`api_settings/enable`, 'post', req.body, req.headers.authorization)
    .then(settings => {
      res.status(200).json({
        status: 'success',
        payload: settings
      })
    })
    .catch(err => {
      res.status(500).json({
        status: 'failed',
        payload: `Failed to enable api settings ${util.inspect(err)}`
      })
    })
}

exports.disable = function (req, res) {
  utility.callApi(`api_settings/disble`, 'post', req.body, req.headers.authorization)
    .then(settings => {
      res.status(200).json({
        status: 'success',
        payload: settings
      })
    })
    .catch(err => {
      res.status(500).json({
        status: 'failed',
        payload: `Failed to disble api settings ${util.inspect(err)}`
      })
    })
}

exports.reset = function (req, res) {
  utility.callApi(`api_settings/reset`, 'post', req.body, req.headers.authorization)
    .then(settings => {
      res.status(200).json({
        status: 'success',
        payload: settings
      })
    })
    .catch(err => {
      res.status(500).json({
        status: 'failed',
        payload: `Failed to reset api settings ${util.inspect(err)}`
      })
    })
}
