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

const store = configureStore(window.__INITIAL_STATE__);
const rootElement = document.getElementById('content');

ReactDOM.render((
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
), rootElement);
