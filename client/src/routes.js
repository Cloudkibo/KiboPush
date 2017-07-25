import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './sub.app.js';
import Home from './containers/home';
import Login from './containers/login/login';
import Subscriber from './containers/subscriber/subscriber';
import Broadcast from './containers/broadcast/broadcast';
import Page from './containers/page/page';
import AddPage from './containers/page/addPage';
import CreateBroadcast from './containers/broadcast/CreateBroadcast';
import Surveys from './containers/survey/surveys';
const routes = (
<<<<<<< HEAD
  <Route path="/" component={App}>
    <IndexRoute  component={Login} />
    <Route path="/dashboard" component={Home}  />
    <Route path="/subscribers" component={Subscriber}  />
    <Route path="/broadcasts" component={Broadcast}  />
    <Route path="/pages" component={Page}  />
    <Route path="/addPages" component={AddPage}  />
    <Route path="/createbroadcast" component={CreateBroadcast}  />

=======
   <Route path="/dashboard" component={App}>
     <IndexRoute  component={Home} />
     <Route path="/login" component={Login}  />
     <Route path="/subscribers" component={Subscriber}  />
     <Route path="/broadcasts" component={Broadcast}  />
     <Route path="/pages" component={Page}  />
     <Route path="/addPages" component={AddPage}  />
     <Route path="/surveys" component={Surveys}  />
     <Route path="/createbroadcast" component={CreateBroadcast}  />
     
>>>>>>> 3f1515a3e0e35f5640a3912971f3ab1ae5ad4fec
  </Route>
);

// const routes = (
//    <Route path="/dashboard" component={App}>
//      <IndexRoute  component={Home} />
//      <Route path="/login" component={Login}  />
//      <Route path="/subscribers" component={Subscriber}  />
//      <Route path="/broadcasts" component={Broadcast}  />
//      <Route path="/pages" component={Page}  />
//      <Route path="/addPages" component={AddPage}  />
//      <Route path="/createbroadcast" component={CreateBroadcast}  />
//
//   </Route>
// );

export default routes;
