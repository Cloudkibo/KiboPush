/**
 * Created by sojharo on 20/07/2017.
 */

const path = require('path')
const _ = require('lodash')

const all = {

  env: process.env.NODE_ENV,

  // Project root path
  root: path.normalize(`${__dirname}/../../..`),

  // Server port
  port: process.env.PORT || 3000,

  // Secure Server port
  secure_port: process.env.SECURE_PORT || 8443,

  // pubsubhubbub port
  pubsub_port: process.env.PUBSUB_PORT || 1337,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SESSION_SECRET || 'f83b0cd6ccb20142185616dsf54dsf4'
  },

  ip: process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  undefined,

  sendgrid: {
    username: 'cloudkibo',
    password: 'cl0udk1b0'
  },

  domain: `${process.env.DOMAIN || 'https://staging.kibopush.com'}`,

  kibodashdomain: `${process.env.KIBODASH || 'http://localhost:5050'}`,

  // List of user roles, NOTE: don't change the order
  userRoles: ['buyer', 'admin', 'supervisor', 'agent'],

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  pubsubhubbub: {
    secret: process.env.SESSION_SECRET || 'f83b0cd6ccb20142185616dsf54dsf4',
    callbackUrl: `${process.env.DOMAIN || 'https://staging.kibopush.com'}/api/autoposting/pubsub/webhook`
  },

  twitter: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY || 'SPyt40d2i8IfIFoYtW5LtYnG8',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'L00OE6SIGOMjI0ZDe5n3ncnFdaxHaAco6wzkR2jdzLXJnXYoID',
    consumer_token: process.env.TWITTER_TOKEN || '2616186000-dAaH7yuQsBGNcbvnCiHweB8rFm54pF2YOC0hOtP',
    consumer_token_secret: process.env.TWITTER_TOKEN_SECRET || '6hWNxP6qwjPEjEfLwT8uK9JpPVFzwA3BxBeCSU7J6rylT',
    callbackUrl: `${process.env.DOMAIN || 'https://staging.kibopush.com'}/api/autoposting/twitter`
  },

  shopify: {
    app_key: '98fdce87050f053f7f9c89ee5f7a9064',
    app_host: 'https://kibopush-dayem.ngrok.io',
    app_secret: '716777a88dc4a2d16819d8aabe82ab11'
  },

  permissions: {
    admin: {
      billingPermission: false,
      downgradeService: false,
      upgradeService: false,
      terminateService: false,
      customerMatchingPermission: true,
      dashboardPermission: true,
      companyPermission: true,
      companyUpdatePermission: false,
      membersPermission: true,
      inviteAdminPermission: true,
      deleteAdminPermission: true,
      promoteToAdminPermission: true,
      inviteAgentPermission: true,
      deleteAgentPermission: true,
      updateRolePermission: true,
      invitationsPermission: true,
      broadcastPermission: true,
      autopostingPermission: true,
      livechatPermission: true,
      menuPermission: true,
      pagesAccessPermission: true,
      pagesPermission: true,
      pollsPermission: true,
      subscriberPermission: true,
      surveyPermission: true,
      apiPermission: false
    },
    agent: {
      billingPermission: false,
      downgradeService: false,
      upgradeService: false,
      terminateService: false,
      customerMatchingPermission: false,
      dashboardPermission: true,
      companyPermission: true,
      companyUpdatePermission: false,
      membersPermission: true,
      inviteAdminPermission: false,
      deleteAdminPermission: false,
      updateRolePermission: false,
      inviteAgentPermission: false,
      deleteAgentPermission: false,
      invitationsPermission: false,
      broadcastPermission: true,
      autopostingPermission: true,
      livechatPermission: true,
      menuPermission: true,
      pagesAccessPermission: true,
      pagesPermission: false,
      pollsPermission: true,
      subscriberPermission: true,
      surveyPermission: true,
      apiPermission: false
    }
  },

  plans: {
    plan_A: { // individual paid
      customer_matching: true,
      invite_team: null,
      dashboard: true,
      broadcasts: true,
      broadcasts_templates: true,
      polls: true,
      polls_reports: true,
      surveys: true,
      surveys_reports: true,
      csv_exports: true,
      live_chat: true,
      autoposting: true,
      menu: true,
      manage_pages: true,
      manage_subscribers: true,
      subscribe_to_messenger: true,
      team_members_management: null,
      messenger_links: true,
      comment_capture: true,
      messenger_code: true,
      analytics: true,
      api: true
    },
    plan_B: { // individual unpaid
      customer_matching: false,
      invite_team: null,
      dashboard: true,
      broadcasts: true,
      broadcasts_templates: true,
      polls: true,
      polls_reports: true,
      surveys: true,
      surveys_reports: true,
      csv_exports: false,
      live_chat: true,
      autoposting: true,
      menu: true,
      manage_pages: true,
      manage_subscribers: true,
      subscribe_to_messenger: true,
      team_members_management: null,
      messenger_links: true,
      comment_capture: false,
      messenger_code: false,
      analytics: false,
      api: false
    },
    plan_C: { // team paid
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
      live_chat: true,
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
      api: true
    },
    plan_D: { // team unpaid
      customer_matching: false,
      invite_team: true,
      dashboard: true,
      broadcasts: true,
      broadcasts_templates: true,
      polls: true,
      polls_reports: true,
      surveys: true,
      surveys_reports: true,
      csv_exports: false,
      live_chat: true,
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
      api: false
    }
  },

  stripeOptions: {
    apiKey: process.env.STRIPE_KEY || 'sk_test_gB8zWtkvbbYFbFFnuj3t4EZn',
    stripePubKey: process.env.STRIPE_PUB_KEY || 'pk_test_ozzmt2lgDgltSYx1pO4W2IE2',
    plans: ['plan_A', 'plan_B', 'plan_C', 'plan_D'],
    planData: {
      'plan_A': {
        name: 'plan_A',
        price: 10
      },
      'plan_B': {
        name: 'plan_B',
        price: 0
      },
      'plan_C': {
        name: 'plan_C',
        price: 15
      },
      'plan_D': {
        name: 'plan_D',
        price: 0
      }
    }
  },

  uiModes: {
    kiboengage: {
      mode: 'kiboengage',
      broadcasts: true,
      polls: true,
      surveys: true,
      sequenceMessaging: true,
      templates: true,
      livechat: false,
      smartReplies: false,
      abandonedCarts: false,
      subscribers: true,
      segmentSubscribers: true,
      autoposting: true,
      persistentMenu: true,
      pages: true,
      phoneNumber: true,
      inviteMembers: true,
      members: true,
      welcomeMessage: true,
      commentCapture: true
    },
    kibochat: {
      mode: 'kibochat',
      broadcasts: false,
      polls: false,
      surveys: false,
      sequenceMessaging: false,
      templates: false,
      livechat: true,
      smartReplies: true,
      abandonedCarts: false,
      subscribers: true,
      segmentSubscribers: true,
      autoposting: false,
      persistentMenu: true,
      pages: true,
      phoneNumber: true,
      inviteMembers: true,
      members: true,
      welcomeMessage: true,
      commentCapture: true
    },
    kibocommerce: {
      mode: 'kibocommerce',
      broadcasts: false,
      polls: false,
      surveys: false,
      sequenceMessaging: false,
      templates: false,
      livechat: false,
      smartReplies: false,
      abandonedCarts: true,
      subscribers: true,
      segmentSubscribers: true,
      autoposting: false,
      persistentMenu: true,
      pages: true,
      phoneNumber: true,
      inviteMembers: true,
      members: true,
      welcomeMessage: true,
      commentCapture: true
    },
    all: {
      mode: 'all',
      broadcasts: true,
      polls: true,
      surveys: true,
      sequenceMessaging: true,
      templates: true,
      livechat: true,
      smartReplies: true,
      abandonedCarts: true,
      subscribers: true,
      segmentSubscribers: true,
      autoposting: true,
      persistentMenu: true,
      pages: true,
      phoneNumber: true,
      inviteMembers: true,
      members: true,
      welcomeMessage: true,
      commentCapture: true
    }
  }
}

module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {})
