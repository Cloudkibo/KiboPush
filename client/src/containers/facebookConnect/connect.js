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
    console.log('In Login JS')
    return (
      <div style={{height: 100 + 'vh'}}>
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login' style={{height: 100 + 'vh'}}>
          <div className='m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside'>
            <div className='m-stack m-stack--hor m-stack--desktop'>
              <div className='m-stack__item m-stack__item--fluid'>
                <div className='m-login__wrapper'>
                  <div className='m-login__logo'>
                    <a href='#'>
                      <img src='img/logo.png' style={{maxWidth: 250}} />
                    </a>
                  </div>
                  <div className='m-login__signin'>
                    <div className='m-login__head'>
                      <h3 className='m-login__title'>Connect a facebook account</h3>
                    </div>
                  </div>
                  <div className='m-stack__item m-stack__item--center' style={{textAlign: 'center', paddingTop: 25}}>
                    <a href='/auth/facebook' className='btn btn-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                      <span>
                        <i className='la la-power-off' />
                        <span>Connect With Facebook</span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div className='m-stack__item m-stack__item--center'>

                <div className='m-login__account'>
                  <span className='m-login__account-msg'>Want to learn more about KiboPush ?</span>&nbsp;&nbsp;
                  <a href='http://kibopush.com/faq/' id='m_login_signup' target='_blank' className='m-link m-link--focus m-login__account-link'>Visit FAQ page</a>
                </div>
              </div>
            </div>
          </div>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1 m-login__content' style={{backgroundImage: "url('assets/app/media/img//bg/bg-4.jpg')"}}>
            <div className='m-grid__item m-grid__item--middle'>
              <h3 className='m-login__welcome'>Join KiboPush</h3>
              <p className='m-login__msg'>Get connected with your facebook audience through push messages.
              Push surveys, polls, instant broadcasts to your Facebook subscribers.</p>
            </div>
          </div>
        </div>
      </div>
    )
    /* {
          <div className='landing-page'>
        <title>Landing Page</title>

        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />

        <link rel='stylesheet' type='text/css' href='Bootstrap/dist/css/bootstrap-reboot.css' />
        <link rel='stylesheet' type='text/css' href='Bootstrap/dist/css/bootstrap.css' />
        <link rel='stylesheet' type='text/css' href='Bootstrap/dist/css/bootstrap-grid.css' />

        <link rel='stylesheet' type='text/css' href='css/theme-styles.css' />
        <link rel='stylesheet' type='text/css' href='css/blocks.css' />
        <link rel='stylesheet' type='text/css' href='css/fonts.css' />
        <link rel='stylesheet' type='text/css' href='css/jquery.mCustomScrollbar.min.css' />
        <link rel='stylesheet' type='text/css' href='css/daterangepicker.css' />
        <link rel='stylesheet' type='text/css' href='css/bootstrap-select.css' />
        <div className='content-bg-wrap'>
          <div className='content-bg' />
        </div>
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
     } */
  }
}

export default Login
