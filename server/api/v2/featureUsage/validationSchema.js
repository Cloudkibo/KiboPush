exports.editPayload = {
  'type': 'object',
  'properties': {
    'last_id': {
      'planId': 'string'
    },
    'item_value': {
      'type': 'integer'
    },
    'item_name': {
      'type': 'string'
    }
  },
  'required': [
    'planId',
    'item_name',
    'item_value'
  ]
}
