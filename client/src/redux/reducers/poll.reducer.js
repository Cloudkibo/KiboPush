import * as ActionTypes from '../constants/constants';

const initialState = {
  polls: [],

};

export function pollsInfo(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_POLLS_LIST:
      return Object.assign({}, state, {
        polls: action.data
      });
    case ActionTypes.ADD_POLL:
      return Object.assign({}, state, {
        polls: [...state.polls, action.data]
      });

   
    default:
      return state;
  }
}


