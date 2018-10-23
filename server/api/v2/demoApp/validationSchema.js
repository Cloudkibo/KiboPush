exports.payload = {
  'type': 'array',
  'items': [
    {
      'type': 'array',
      'items': [
        {
          'type': 'string'
        }
      ]
    }
  ]
}

exports.appendSubscriberSchema = {
  type: 'object',
  properties: {
    subscriberId: {
      type: 'string',
      required: true
    },
    customerId: {
      type: 'string',
      required: true
    }
  }
}
