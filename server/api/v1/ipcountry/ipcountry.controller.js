/**
 * Created by sojharo on 28/12/2017.
 */
const IpCountry = require('./ipcountry.model')
const Company = require('./../companyprofile/companyprofile.model')
const mongoose = require('mongoose')
const _ = require('lodash')

exports.findIp = function (req, res) {
  if (!_.has(req.body, 'company_id')) {
    return res.status(400)
    .json({status: 'failed', description: 'Parameters are missing. company_id is required'})
  }

  Company.findOne({_id: mongoose.Types.ObjectId(req.body.company_id)}, (err, company) => {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error ' + JSON.stringify(err)})
    }
    if (!company) {
      return res.status(404)
      .json({status: 'failed', description: 'No registered company found.'})
    }
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
    logger.serverLog(TAG, `IP found: ${ip}`)
    if (ip.includes('ffff')) {
      let temp = ip.split(':')
      ip = temp[temp.length - 1]
    }
    let ip2number = (parseInt(ip.split('.')[0]) * 256 * 256 * 256) + (parseInt(ip.split('.')[1]) * 256 * 256) + (parseInt(ip.split('.')[2]) * 256) + (parseInt(ip.split('.')[3]))

    IpCountry.findOne({startipint: {$lte: ip2number}, endipint: {$gte: ip2number}}, function (err, gotLocation) {
      if (err) {
        return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error ' + JSON.stringify(err)})
      }
      let response = {
        ip: ip
      }
      if (!gotLocation) {
        response.ccode = 'n/a'
        response.country = 'n/a'
      } else {
        response.ccode = gotLocation.ccode
        response.country = gotLocation.country
      }
      res.status(200).json({status: 'success', payload: response})
    })
  })
}
