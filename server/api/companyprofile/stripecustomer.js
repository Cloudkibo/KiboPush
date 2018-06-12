'use strict'

var Stripe = require('stripe')
var stripe

module.exports = exports = function stripeCustomer (schema, options) {
  stripe = Stripe(options.apiKey)

  schema.add({
    stripe: {
      customerId: String,
      subscriptionId: String,
      last4: String,
      plan: String
    }
  })

  schema.pre('save', function (next) {
    var user = this
    if (user.stripe.customerId) return next()
    user.createCustomer(function (err) {
      if (err) return next(err)
      next()
    })
  })

  schema.methods.createCustomer = function (cb) {
    var user = this

    stripe.customers.create({
      email: user.email
    }, function (err, customer) {
      if (err) return cb(err)

      user.stripe.customerId = customer.id
      return cb()
    })
  }

  schema.statics.getPlans = function () {
    return options.planData
  }

  schema.methods.setCard = function (stripeToken, cb) {
    var user = this

    var cardHandler = function (err, customer) {
      if (err) return cb(err)

      if (!user.stripe.customerId) {
        user.stripe.customerId = customer.id
      }

      var card = customer.cards ? customer.cards.data[0] : customer.sources.data[0]

      user.stripe.last4 = card.last4
      user.save(function (err) {
        if (err) return cb(err)
        return cb(null)
      })
    }

    if (user.stripe.customerId) {
      stripe.customers.update(user.stripe.customerId, {card: stripeToken}, cardHandler)
    } else {
      stripe.customers.create({
        email: user.email,
        card: stripeToken
      }, cardHandler)
    }
  }

  schema.methods.setPlan = function (plan, stripeToken, cb) {
    var user = this

    var subscriptionHandler = function (err, subscription) {
      if (err) return cb(err)

      user.stripe.plan = plan
      user.stripe.subscriptionId = subscription.id
      user.save(function (err) {
        if (err) return cb(err)
        return cb(null)
      })
    }

    var createSubscription = function () {
      stripe.customers.createSubscription(
        user.stripe.customerId,
        {plan: plan},
        subscriptionHandler
      )
    }

    if (stripeToken) {
      user.setCard(stripeToken, function (err) {
        if (err) return cb(err)
        createSubscription()
      })
    } else {
      if (user.stripe.subscriptionId) {
        // update subscription
        stripe.customers.updateSubscription(
          user.stripe.customerId,
          user.stripe.subscriptionId,
          { plan: plan },
          subscriptionHandler
        )
      } else {
        createSubscription()
      }
    }
  }

  schema.methods.updateStripeEmail = function (cb) {
    var user = this

    if (!user.stripe.customerId) return cb()

    stripe.customers.update(user.stripe.customerId, {email: user.email}, function (err, customer) {
      cb(err)
    })
  }

  schema.methods.cancelStripe = function (cb) {
    var user = this

    if (user.stripe.customerId) {
      stripe.customers.del(
        user.stripe.customerId
      ).then(function (confirmation) {
        cb()
      }, function (err) {
        return cb(err)
      })
    } else {
      cb()
    }
  }
}
