/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';
import { Link } from 'react-router';

class Login extends React.Component {
  render() {
    console.log("Sojahro wada here");
    return (
      <div className="container-background">
        <div className="container-background-up">
          <Link to="/dashboard">Sojharo is here!</Link>
        </div>
      </div>
    );
  }
}

export default Login;
