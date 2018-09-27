// const express = require('express')
// const router = express.Router()
// const auth = require('../../../auth/auth.service')
// const validate = require('express-jsonschema').validate
// const validationSchema = require('./validationSchema')
// const controller = require('./menu.controller')
// const multiparty = require('connect-multiparty')
// const multipartyMiddleware = multiparty()
//
// router.post('/editList',
//     auth.isAuthenticated(),
//     validate({body: validationSchema.editPayload}),
//     controller.editList)
//
//     router.post('/upload',
//       auth.isAuthenticated(),
//       auth.doesPlanPermitsThisAction('customer_matching'),
//       auth.doesRolePermitsThisAction('customerMatchingPermission'),
//       multipartyMiddleware,
//       controller.upload)
//
//     router.post('/sendNumbers',
//       auth.isAuthenticated(),
//       controller.sendNumbers)
//
//
//     router.get('/pendingSubscription/:name',
//         auth.isAuthenticated(),
//         auth.doesPlanPermitsThisAction('customer_matching'),
//         auth.doesRolePermitsThisAction('customerMatchingPermission'),
//         controller.pendingSubscription)
//
// module.exports = router
