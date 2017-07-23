/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';
import { Link } from 'react-router';
import FacebookLogin from 'react-facebook-login';
const responseFacebook = (response) => {
  console.log(response);
};

class Login extends React.Component {

  render() {
    return (
      <div className="container-background">
        <div className="container-background-up">
          <Link to="/dashboard">Back to dashboard</Link>
        </div>
        <FacebookLogin
          appId="1088597931155576"
          autoLoad
          callback={responseFacebook}
          icon="fa-facebook"
        />
      </div>
    );
  }
}

export default Login;
