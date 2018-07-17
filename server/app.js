/**
 * Created by sojharo on 20/07/2017.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development' // production

const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/environment/index')

const app = express()
const httpApp = express()
const swaggerTools = require('swagger-tools')

const Raven = require('raven')
Raven.config('https://6c7958e0570f455381d6f17122fbd117:d2041f4406ff4b3cb51290d9b8661a7d@sentry.io/292307', {
  environment: config.env,
  parseUser: ['name', 'email', 'domain', 'role', 'emailVerified']
}).install()

mongoose.connect(config.mongo.uri, config.mongo.options)

const appObj = (config.env === 'production' || config.env === 'staging') ? app : httpApp

appObj.use(Raven.requestHandler())

const swaggerDoc = require('./config/swagger/kibopush.json')

swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  // app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  // app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  // app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi())
  httpApp.use(middleware.swaggerUi())

  require('./config/express')(appObj)
  require('./config/setup')(app, httpApp, config)
  // require('./components/utility').setupPlans()
  // require('./config/integrations/pubsubhubbub')()
  require('./config/integrations/twitter').connect()
  require('./routes')(appObj)
})
