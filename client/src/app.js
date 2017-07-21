/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import { configureStore } from './redux/store/store';
const history = browserHistory;
import routes from './routes';

import {setBrowserName, setBrowserVersion} from './redux/actions/basicinfo.actions';
import {BROWSER_NAME, BROWSER_VERSION} from './utility/browser.utility';

const store = configureStore(window.__INITIAL_STATE__);
const rootElement = document.getElementById('content');

store.dispatch(setBrowserName(BROWSER_NAME));
store.dispatch(setBrowserVersion(BROWSER_VERSION));

console.log(store.getState());

ReactDOM.render((
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
), rootElement);
