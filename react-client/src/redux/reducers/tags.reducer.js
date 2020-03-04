import * as ActionTypes from '../constants/constants'

export function tagsInfo (state = {}, action) {
  console.log('tags reducer', action)
  switch (action.type) {      
    case ActionTypes.ADD_TAG: {
      let tags = [...state.tags]
      tags.push(action.data)
      return Object.assign({}, state, {
        tags
      })
    }
    case ActionTypes.REMOVE_TAG: {
      let tags = [...state.tags]
      let indexToRemove = tags.findIndex(tag => tag._id === action.data._id)
      tags.splice(indexToRemove, 1)
      return Object.assign({}, state, {
        tags
      })
    }
    case ActionTypes.UPDATE_TAG: {
      let tags = [...state.tags]
      let indexToRename = tags.findIndex(tag => tag._id === action.data._id)
      tags[indexToRename].tag = action.data.tag
      return Object.assign({}, state, {
        tags
      })
    }
    case ActionTypes.LOAD_TAGS_LIST:
      return Object.assign({}, state, {
        tags: action.data
      })
    case ActionTypes.LOAD_SUBSCRIBER_TAGS:
      return Object.assign({}, state, {
        subscriberTags: action.data
      })
    default:
      return state
  }
}
