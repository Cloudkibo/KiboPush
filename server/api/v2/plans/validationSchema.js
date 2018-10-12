exports.update = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true
    },
    trial_period: {
      type: 'string',
      required: true
    },
    unique_id: {
      type: 'string',
      required: true
    }
  }
}
exports.create = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true
    },
    interval: {
      type: 'string',
      required: true
    },
    trial_period: {
      type: 'string',
      required: true
    },
    amount: {
      type: 'string',
      required: true
    }
  }
}
exports.changeDefaultPlan = {
  type: 'object',
  properties: {
    plan_id: {
      type: 'string',
      required: true
    },
    account_type: {
      type: 'string',
      required: true
    }
  }
}
exports.migrateCompanies = {
  type: 'object',
  properties: {
    to: {
      type: 'object',
      required: true
    },
    from: {
      type: 'object',
      required: true
    }
  }
}
