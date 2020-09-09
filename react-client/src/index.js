import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { configureStore } from './redux/store/store'
import Routes from './routes'
import { initiateSocket } from './utility/socketio'
import App from "./sub.app.js"

import {setBrowserName, setBrowserVersion, setIsMobile} from './redux/actions/basicinfo.actions'
import {BROWSER_NAME, BROWSER_VERSION, IS_MOBILE} from './utility/browser.utility'

const history = createBrowserHistory()

history.listen(() => {
  window.scrollTo(0, 0)
})

const store = configureStore(window.__INITIAL_STATE__)
const rootElement = document.getElementById('content')

store.dispatch(setBrowserName(BROWSER_NAME))
store.dispatch(setBrowserVersion(BROWSER_VERSION))
store.dispatch(setIsMobile(IS_MOBILE))

initiateSocket(store)

console.log(store.getState())

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <App history={history}>
          <Routes />
        </App>
      </Router>
    </Provider>
  ), rootElement)
