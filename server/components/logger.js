/**
 * Created by sojharo on 20/07/2017.
 */

const config = require('../config/environment/index')

const winston = require('winston')
require('winston-papertrail').Papertrail

const logger = new winston.Logger({
  transports: [
    // new (winston.transports.Console)(),
    new winston.transports.Papertrail({
      host: 'logs3.papertrailapp.com',
      port: 45576,
      colorize: true
    })
  ]
})

exports.serverLog = function (label, data) {
  const namespace = `kibopush:${label}`
  const debug = require('debug')(namespace)

  if (config.env === 'development' || config.env === 'test') {
    debug(data)
    // todo use log levels like info, warn, error and debug
    logger.info(`${namespace} - ${data}`)
  } else {
    logger.info(`${namespace} - ${data}`)
  }
}
