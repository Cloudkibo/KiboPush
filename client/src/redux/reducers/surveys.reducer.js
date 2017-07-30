import * as ActionTypes from '../constants/constants';

const initialState = {
  surveys: [],

};

export function surveysInfo(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_SURVEYS_LIST:
      return Object.assign({}, state, {
        surveys: action.data
      });
    case ActionTypes.ADD_SURVEY:
   	   return Object.assign({}, state, {
        surveys: [...state.surveys,action.data]
      });
    default:
      return state;
  }
}
