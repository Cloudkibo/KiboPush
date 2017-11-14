/**
 * Created by sojharo on 03/08/2017.
 */

const http = require('http')
const https = require('https')
const fs = require('fs')
const logger = require('./../components/logger')

const TAG = 'config/setup.js'

module.exports = function (app, httpapp, config) {
  let options = {
    ca: '',
    key: '',
    cert: ''
  }

  if (config.env === 'production') {
    try {
      options = {
        ca: fs.readFileSync('/root/certs/kibopush.ca-bundle'),
        key: fs.readFileSync('/root/certs/kibopush.key'),
        cert: fs.readFileSync('/root/certs/kibopush.crt')
      }
    } catch (e) {

    }
  }

  if (config.env === 'staging') {
    try {
      options = {
        ca: fs.readFileSync('/root/certs/gd_bundle-g2-g1.crt'),
        key: fs.readFileSync('/root/certs/kibopush.key'),
        cert: fs.readFileSync('/root/certs/3b414648bf907e49.crt')
      }
    } catch (e) {

    }
  }

  const server = http.createServer(httpapp)
  const httpsServer = https.createServer(options, app)

  if (config.env === 'production') {
    httpapp.get('*', (req, res) => {
      res.redirect(`https://app.kibopush.com${req.url}`)
    })
  }

  if (config.env === 'staging') {
    httpapp.get('*', (req, res) => {
      res.redirect(`https://staging.kibopush.com${req.url}`)
    })
  }

  const socket = require('socket.io').listen(
    (config.env === 'production' || config.env === 'staging') ? httpsServer
    : server)

  require('./socketio').setup(socket)

  server.listen(config.port, config.ip, () => {
    logger.serverLog(TAG, `KiboPush server STARTED on ${
      config.port} in ${config.env} mode`)
  })

  httpsServer.listen(config.secure_port, () => {
    logger.serverLog(TAG, `KiboPush server STARTED on ${
      config.secure_port} in ${config.env} mode`)
  })

  if (config.env === 'production' || config.env ==='staging') {
    console.log('KiboPush server STARTED on %s in %s mode', config.port, config.env)
  }
}
