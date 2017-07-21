import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './sub.app.js';
import Home from './containers/home';

const routes = (
   <Route path="/dashboard" component={App}>
    <IndexRoute component={Home} />
  </Route>
);

export default routes;
