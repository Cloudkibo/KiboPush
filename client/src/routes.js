import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './sub.app.js';
import Home from './containers/home';
import Login from './containers/login/login';
import Subscriber from './containers/subscriber/subscriber';
import Broadcast from './containers/broadcast/broadcast';
import Page from './containers/page/page';
import AddPage from './containers/page/addPage';

const routes = (
   <Route path="/dashboard" component={App}>
     <IndexRoute  component={Home} />
     <Route path="/login" component={Login}  />
     <Route path="/subscribers" component={Subscriber}  />
     <Route path="/broadcasts" component={Broadcast}  />
     <Route path="/pages" component={Page}  />
     <Route path="/addPages" component={AddPage}  />
  </Route>
);

export default routes;
