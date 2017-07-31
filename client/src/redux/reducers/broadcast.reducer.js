import * as ActionTypes from '../constants/constants';

const initialState = {
  broadcasts: [],

};

export function broadcastsInfo(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts: action.data
      });
    case ActionTypes.ADD_BROADCAST:
      return Object.assign({}, state, {
        broadcasts: [...state.broadcasts, action.data]
      });
    case ActionTypes.EDIT_BROADCAST:
      return Object.assign({}, state, {
        broadcasts: action.data
      });
     case ActionTypes.GET_BROADCAST:
      return Object.assign({}, state, {
        broadcast: state.broadcasts.filter((c) => c._id == action.data)[0],
      });
   
    default:
      return state;
  }
}


