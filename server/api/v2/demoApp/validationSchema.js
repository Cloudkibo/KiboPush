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
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'customerId': {
      'type': 'string'
    },
    'subscriberId': {
      'type': 'string'
    }
  },
  'required': [
    'customerId',
    'subscriberId'
  ]
}
