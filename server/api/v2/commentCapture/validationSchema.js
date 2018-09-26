/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/
exports.postPayload = {
  'type': 'object',
  'properties': {
    'excludedKeywords': {
      'type': 'array',
      'items': {
        'type': 'string'
      }
    },
    'includeKeywords': {
      'type': 'array',
      'items': {
        'type': 'string'
      }
    },
    'pageId': {
      'type': 'string'
    },
    'reply': {
      'type': 'string'
    },
    'payload': {
      'type': 'array',
      'items': [
        {
          'type': 'object'
        }
      ]
    }
  },
  'required': [
    'excludedKeywords',
    'includeKeywords',
    'pageId',
    'reply',
    'payload'
  ]
}
