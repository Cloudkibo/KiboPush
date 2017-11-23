/**
 * Created by sojharo on 23/11/2017.
 */
const fs = require('fs')

const swaggerTools = require('swagger-tools')
const jsyaml = require('js-yaml')

module.exports = function (app, config) {
  if (['staging', 'production'].indexOf(config.env) > -1) {
    // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
    const spec = fs.readFileSync('kibopush.yaml', 'utf8')
    const swaggerDoc = jsyaml.safeLoad(spec)

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
      // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
      // app.use(middleware.swaggerMetadata());

      // Validate Swagger requests
      // app.use(middleware.swaggerValidator());

      // Route validated requests to appropriate controller
      // app.use(middleware.swaggerRouter(options));

      // Serve the Swagger documents and Swagger UI
      app.use(middleware.swaggerUi())
    })
  }
}
