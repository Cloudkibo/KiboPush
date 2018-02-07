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

mongoose.connect(config.mongo.uri, config.mongo.options)

const appObj = (config.env === 'production' || config.env === 'staging') ? app : httpApp

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
  require('./routes')(appObj)
  require('./config/setup')(app, httpApp, config)
  require('./components/utility').setupPlans()
  // require('./config/integrations/pubsubhubbub')()
  require('./config/integrations/twitter').connect()
})
