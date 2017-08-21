/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { log } from './../../utility/socketio'
const TAG = 'containers/login/login'

class Login extends React.Component {
  componentDidMount () {
    log(TAG, 'Login Container Mounted')
  }
  render () {
    return (
      <div className='landing-page'>
        <title>Landing Page</title>
        {/* Required meta tags always come first */}
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />
        {/* Main Font */}
        {/* Bootstrap CSS */}
        <link rel='stylesheet' type='text/css' href='Bootstrap/dist/css/bootstrap-reboot.css' />
        <link rel='stylesheet' type='text/css' href='Bootstrap/dist/css/bootstrap.css' />
        <link rel='stylesheet' type='text/css' href='Bootstrap/dist/css/bootstrap-grid.css' />
        {/* Theme Styles CSS */}
        <link rel='stylesheet' type='text/css' href='css/theme-styles.css' />
        <link rel='stylesheet' type='text/css' href='css/blocks.css' />
        <link rel='stylesheet' type='text/css' href='css/fonts.css' />
        {/* Styles for plugins */}
        <link rel='stylesheet' type='text/css' href='css/jquery.mCustomScrollbar.min.css' />
        <link rel='stylesheet' type='text/css' href='css/daterangepicker.css' />
        <link rel='stylesheet' type='text/css' href='css/bootstrap-select.css' />
        <div className='content-bg-wrap'>
          <div className='content-bg' />
        </div>

        {/* Landing Header */}
        <div className='container'>
          <div className='row'>
            <div className='col-xl-12 col-lg-12 col-md-12'>
              <div id='site-header-landing' className='header-landing'>
                <a href='02-ProfilePage.html' className='logo'>
                  <img src='img/logo.png' alt='KiboPush' />
                  <h5 className='logo-title'>KiboPush</h5>
                </a>

              </div>
            </div>
          </div>
        </div>

        <div className='container'>
          <div className='row display-flex'>
            <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12'>
              <div className='landing-content'>
                <h1>Welcome to KiboPush</h1>
                <p style={{fontSize: '2em'}}>
                  Get connected with your facebook audience through push messages.
                  Push surveys, polls, instant broadcasts to your Facebook subscribers.
                </p>
                <a href='/auth/facebook'>Login with Facebook</a>
              </div>
            </div>

          </div>

        </div>
      </div>

    )
  }
}

export default Login
