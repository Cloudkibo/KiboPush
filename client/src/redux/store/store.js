import { createStore } from 'redux';
import initialDataLoad from '../reducers/reducer';

export function configureStore(initialState = {}) {
  const store = createStore(initialDataLoad, initialState);
  return store;
}
