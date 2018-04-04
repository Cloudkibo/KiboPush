/**
 * Created by sojharo on 27/07/2017.
 */

// eslint-disable-next-line no-unused-vars
const logger = require('../../components/logger')
// const Workflows = require('./Workflows.model')
// eslint-disable-next-line no-unused-vars
const TAG = 'api/smart_replies/bots.controller.js'
const CompanyUsers = require('./../companyuser/companyuser.model')
const Bots = require('./Bots.model')
const Answers = require('./Answers.model')
const _ = require('lodash')
let request = require('request')
const WIT_AI_TOKEN = 'RQC4XBQNCBMPETVHBDV4A34WSP5G2PYL'

exports.index = function (req, res) {
  return res.status(200).json({status: "success", payload: {message: "Bot is working"}})
}

exports.create = function (req, res) {

    request(
      {
        'method': 'POST',
        'uri': 'https://api.wit.ai/apps?v=20170307',
        headers: {
            'Authorization': 'Bearer ' + WIT_AI_TOKEN,
            'Content-Type': 'application/json'
        },
        body:{
           "name":req.body.botName + req.body.userId,
           "lang":"en",
           "private":"false"
         },
        json: true,
      },
      (err, witres) => {
        if (err) {
          return logger.serverLog(TAG,
            "Error Occured In Creating WIT.AI app")
            return res.status(500).json({status: "failed", payload: {error: err}})
        } else {
          if (witres.statusCode !== 200) {
            logger.serverLog(TAG,
              `Error Occured in creating Wit ai app ${JSON.stringify(
                witres.body.errors)}`)
                return res.status(500).json({status: "failed", payload: {error: witres.body.errors}})
          } else {
             logger.serverLog(TAG,
              "Wit.ai app created successfully", witres.body)
              
              const bot = new Bots({
                pageId: req.body.pageId, // TODO ENUMS
                userId: req.body.userId,
                botName: req.body.botName,
                witAppId: witres.body.app_id,
                witToken: witres.body.access_token,
                witAppName: req.body.botName + req.body.userId,
                isActive: req.body.isActive,
              })

              bot.save((err, newbot) => {
                if (err) {
                  res.status(500).json({
                    status: 'Failed',
                    error: err,
                    description: 'Failed to insert record'
                  })
                } else {
                  return res.status(200).json({status: "success", payload: {message: "Bot saved succesfully"}})
                }
              });
          }
        }
      })

     

      // save model to MongoDB

  
}

