/**
 * Created by sojharo on 20/07/2017.
 */

/**
 * Main application routes
 */

'use strict'

const path = require('path')
const config = require('./config/environment/index')
const logger = require('./components/logger')

const TAG = 'routes.js'

module.exports = function (app) {
  app.use('/api/dashboard/', require('./api/dashboard'))
  app.use('/api/things', require('./api/thing'))
  app.use('/api/users', require('./api/user'))
  app.use('/api/broadcasts', require('./api/broadcasts'))
  app.use('/api/backdoor', require('./api/backdoor'))
  app.use('/api/polls', require('./api/polls'))
  app.use('/api/workflows', require('./api/workflows'))
  app.use('/api/subscribers', require('./api/subscribers'))
  app.use('/api/pages', require('./api/pages'))
  app.use('/api/growthtools', require('./api/growthtools'))
  app.use('/api/lists', require('./api/lists'))
  app.use('/api/autoposting', require('./api/autoposting'))
  app.use('/api/surveys', require('./api/surveys'))
  app.use('/api/page_poll', require('./api/page_poll'))
  app.use('/api/page_survey', require('./api/page_survey'))
  app.use('/api/page_broadcast', require('./api/page_broadcast'))
  app.use('/api/livechat', require('./api/livechat'))
  app.use('/api/sessions', require('./api/sessions'))
  app.use('/api/menu', require('./api/menu'))
  app.use('/api/api_settings', require('./api/api_settings'))
  app.use('/api/templates', require('./api/templates'))
  app.use('/api/company', require('./api/companyprofile'))
  app.use('/api/reset_password', require('./api/passwordresettoken'))
  app.use('/api/email_verification', require('./api/verificationtoken'))
  app.use('/api/invite_verification', require('./api/inviteagenttoken'))
  app.use('/api/invitations', require('./api/invitations'))
  app.use('/api/company_user', require('./api/companyuser'))
  app.use('/api/adminsubscriptions', require('./api/pageadminsubscriptions'))

  app.use('/webhooks/messenger', require('./webhook_subscriptions/messenger'))

  app.use('/auth', require('./auth'))

  app.get('/', (req, res) => {
    res.sendFile(path.join(config.root, 'client/index.html'))
  })

  app.get('/dashboard2', (req, res) => {
    logger.serverLog(TAG, 'going to serve landing page')
    res.sendFile(path.join(config.root, 'client/landing.html'))
  })

  app.route('/:url(api|auth)/*').get((req, res) => {
    res.status(404).send({url: `${req.originalUrl} not found`})
  }).post((req, res) => {
    res.status(404).send({url: `${req.originalUrl} not found`})
  })

  app.use((req, res) => {
    res.redirect('/')
  })
}
