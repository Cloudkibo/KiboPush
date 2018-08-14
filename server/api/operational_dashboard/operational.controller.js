/**
 * Created by sojharo on 25/09/2017.
 */
const logger = require('../../components/logger')
const TAG = 'api/operational_dashboard/operational.controller.js'

exports.index = (req, res) => {
  return res.status(200).json({status: 'success'})
}
