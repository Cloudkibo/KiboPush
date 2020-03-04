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
    case ActionTypes.ASSIGN_TAG: {
      if (state.tags && state.subscriberTags && state.subscriberTags.subscriberId === action.data.subscriberId) {
        let tag = state.tags.find(tag => tag._id === action.data.tagId)
        let subscriberTags = {...state.subscriberTags}
        subscriberTags.tags.push({
          _id: tag._id,
          tag: tag.tag
        })
        return Object.assign({}, state, {
          subscriberTags
        })
      } else {
        return state
      }
    }
    case ActionTypes.UNASSIGN_TAG: {
      if (state.subscriberTags && state.subscriberTags.subscriberId === action.data.subscriberId) {
        let index = state.subscriberTags.tags.findIndex(tag => tag._id === action.data.tagId)
        let subscriberTags = {...state.subscriberTags}
        subscriberTags.tags.splice(index, 1)
        return Object.assign({}, state, {
          subscriberTags
        })
      } else {
        return state
      }
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
