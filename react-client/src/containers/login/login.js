/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class Login extends React.Component {
  render () {
    return (
      <div>
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login' style={{height: 100 + 'vh'}}>
          <div className='m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside'>
            <div className='m-stack m-stack--hor m-stack--desktop'>
              <div className='m-stack__item m-stack__item--fluid'>
                <div className='m-login__wrapper'>
                  <div className='m-login__logo'>
                    <a href='#/'>
                      <img src='https://cdn.cloudkibo.com/public/img/logo.png' style={{maxWidth: 250}} />
                    </a>
                  </div>
                  <div className='m-login__signin'>
                    <div className='m-login__head'>
                      <h3 className='m-login__title'>Sign In To KiboPush</h3>
                    </div>
                  </div>
                  <div className='m-stack__item m-stack__item--center' style={{textAlign: 'center', paddingTop: 25}}>
                    <a href='/auth/facebook' className='btn btn-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                      <span>
                        <i className='la la-power-off' />
                        <span>Login With Facebook</span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div className='m-stack__item m-stack__item--center'>

                <div className='m-login__account'>
                  <span className='m-login__account-msg'>Want to learn more about KiboPush ?</span>&nbsp;&nbsp;
                  <a href='https://kibopush.com/faq/' id='m_login_signup' target='_blank' rel='noopener noreferrer' className='m-link m-link--focus m-login__account-link'>Visit FAQ page</a>
                </div>
              </div>
            </div>
          </div>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1 m-login__content' style={{backgroundImage: "url('https://cdn.cloudkibo.com/public/assets/app/media/img//bg/bg-4.jpg')"}}>
            <div className='m-grid__item m-grid__item--middle'>
              <h3 className='m-login__welcome'>Join KiboPush</h3>
              <p className='m-login__msg'>Get connected with your facebook audience through push messages.
              Push surveys, polls, instant broadcasts to your Facebook subscribers.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
