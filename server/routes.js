/**
 * Created by sojharo on 20/07/2017.
 */

/**
 * Main application routes
 */

'use strict'

const path = require('path')
const config = require('./config/environment/index')
const Raven = require('raven')

module.exports = function (app) {
  const env = app.get('env')

  app.use('/api/dashboard/', require('./api/v1/dashboard'))
  app.use('/api/things', require('./api/v1/thing'))
  app.use('/api/users', require('./api/v2/user'))
  app.use('/api/broadcasts', require('./api/v1/broadcasts'))
  app.use('/api/backdoor', require('./api/v1/backdoor'))
  app.use('/api/polls', require('./api/v1/polls'))
  app.use('/api/bots', require('./api/v1/smart_replies'))
  app.use('/api/subscribers', require('./api/v1/subscribers'))
  app.use('/api/pages', require('./api/v1/pages'))
  app.use('/api/growthtools', require('./api/v1/growthtools'))
  app.use('/api/lists', require('./api/v1/lists'))
  app.use('/api/autoposting', require('./api/v1/autoposting'))
  app.use('/api/autoposting_messages', require('./api/v1/autoposting_messages'))
  app.use('/api/surveys', require('./api/v1/surveys'))
  app.use('/api/page_poll', require('./api/v1/page_poll'))
  app.use('/api/page_survey', require('./api/v1/page_survey'))
  app.use('/api/page_broadcast', require('./api/v1/page_broadcast'))
  app.use('/api/livechat', require('./api/v1/livechat'))
  app.use('/api/sessions', require('./api/v1/sessions'))
  app.use('/api/menu', require('./api/v1/menu'))
  app.use('/api/api_settings', require('./api/v1/api_settings'))
  app.use('/api/api_ngp', require('./api/v1/api_ngp'))
  app.use('/api/templates', require('./api/v1/templates'))
  app.use('/api/URL', require('./api/v1/URLforClickedCount'))
  app.use('/api/teams', require('./api/v2/teams'))
  app.use('/api/company', require('./api/v2/companyprofile'))
  app.use('/api/reset_password', require('./api/v1/passwordresettoken'))
  app.use('/api/email_verification', require('./api/v1/verificationtoken'))
  app.use('/api/invite_verification', require('./api/v1/inviteagenttoken'))
  app.use('/api/invitations', require('./api/v1/invitations'))
  app.use('/api/company_user', require('./api/v1/companyuser'))
  app.use('/api/adminsubscriptions', require('./api/v1/pageadminsubscriptions'))
  app.use('/api/tags', require('./api/v1/tags'))
  app.use('/api/notifications', require('./api/v1/notifications'))
  app.use('/api/sequenceMessaging', require('./api/v1/sequenceMessaging'))
  app.use('/api/post', require('./api/v1/facebook_posts'))
  app.use('/api/ip2country', require('./api/v1/ipcountry'))
  app.use('/webhooks/messenger', require('./webhook_subscriptions/messenger'))
  app.use('/webhooks/wordpress', require('./webhook_subscriptions/wordpress'))
  app.use('/migrations', require('./api/v1/migrations'))
  app.use('/api/permissions', require('./api/v1/permissions'))
  app.use('/api/webhooks', require('./api/v1/webhooks'))
  app.use('/api/planPermissions', require('./api/v1/permissions_plan'))
  app.use('/api/plans', require('./api/v1/plans'))
  app.use('/api/usage', require('./api/v1/featureUsage'))
  app.use('/api/kibodash', require('./api/v1/kibodash'))
  app.use('/api/planPermissions', require('./api/v1/permissions_plan'))
  app.use('/api/plans', require('./api/v1/plans'))
  app.use('/api/usage', require('./api/v1/featureUsage'))
  app.use('/api/abandonedCarts', require('./api/v1/abandoned_carts'))
  app.use('/api/shopify', require('./api/v1/shopify'))
  app.use('/api/cronScheduler', require('./api/v1/cron_scheduler'))
  app.use('/api/operational', require('./api/v1/operational_dashboard'))
  app.use('/api/facebookEvents', require('./api/v1/facebookEvents'))
  app.use('/api/twitterEvents', require('./api/v1/twitterEvents'))
  app.use('/api/messengerEvents', require('./api/v1/messengerEvents'))
  app.use('/api/wordpressEvents', require('./api/v1/wordpressEvents'))
  app.use('/auth', require('./auth'))

  app.get('/', (req, res) => {
    res.cookie('environment', config.env,
      {expires: new Date(Date.now() + 900000)})
    // res.sendFile(path.join(config.root, 'client/index.html'))
    res.render('main', { environment: env })
  })

  app.get('/dashboard2', (req, res) => {
    res.sendFile(path.join(config.root, 'client/landing.html'))
  })

  app.route('/:url(api|auth)/*').get((req, res) => {
    res.status(404).send({url: `${req.originalUrl} not found`})
  }).post((req, res) => {
    res.status(404).send({url: `${req.originalUrl} not found`})
  })

  app.route('/*').get((req, res) => {
    res.redirect('/')
  }).post((req, res) => {
    res.redirect('/')
  })

  if (env === 'production' || env === 'staging') {
    app.use(Raven.errorHandler())
  }
}
