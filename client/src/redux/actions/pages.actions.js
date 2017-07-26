/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants';

export function loadMyPagesList(token, data) {
  data = [
    {pageName: 'Test', likes: 15, followers: 45, pic: 'Image'},
    {pageName: 'Pied Piper', likes: 15, followers: 45, pic: 'Image'},
    {pageName: 'Hooli', likes: 15, followers: 45, pic: 'Image'},
    {pageName: 'Raviga', likes: 15, followers: 45, pic: 'Image'},
    {pageName: 'Aviato', likes: 15, followers: 45, pic: 'Image'},
  ];
  return {
    type: ActionTypes.LOAD_PAGES_LIST,
    data
  };
}

export function loadOtherPagesList(token, data) {
  data = [
    {pageName: 'WoxCut', likes: 15, followers: 45, pic: 'Image'},
    {pageName: 'NYSE', likes: 15, followers: 45, pic: 'Image'},
    {pageName: 'Stupid Cat Memes', likes: 15, followers: 45, pic: 'Image'},
    {pageName: 'Serious Business Talks', likes: 15, followers: 45, pic: 'Image'},
    {pageName: 'Tech News', likes: 15, followers: 45, pic: 'Image'},
  ];
  return {
    type: ActionTypes.FETCH_PAGES_LIST,
    data
  };
}
