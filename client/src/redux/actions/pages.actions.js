/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants';

export function loadPagesList(data) {
  return {
    type: ActionTypes.LOAD_PAGES_LIST,
    data
  };
}
