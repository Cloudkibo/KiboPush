/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class LoginSignup extends React.Component {
  render () {
    console.log('In LoginSignup JS')
    return (
      <div>
        <div className='fb-customerchat'
          data-page_id='151990922046256'
          data-logged_in_greeting='Hi, Let us know if you find any bugs or have a feature request'
          data-logged_out_greeting='Hi, Let us know if you find any bugs or have a feature request'
        />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login' style={{height: '100vh'}}>
          <div className='m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside'>
            <div className='m-stack m-stack--hor m-stack--desktop'>
              <div className='m-stack__item m-stack__item--fluid'>
                <div className='m-login__wrapper'>
                  <div className='m-login__logo'>
                    <a href='#'>
                      <img src='img/logo.png' style={{maxWidth: 250}} />
                    </a>
                  </div>
                  <br />
                  <br />
                  <br />
                  <div className='m-login__signin'>
                    <div className='m-login__form m-form'>
                      <center>
                        <Link to='/login' className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air'>
                          Login
                        </Link>
                        <br />
                        <br />
                        <Link to='/signup' className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air'>
                          Signup
                        </Link>
                      </center>
                    </div>
                  </div>
                </div>
              </div>
              <div className='m-stack__item m-stack__item--center'>
                <div className='m-login__account'>
                  <div className='m-login__account'>
                    <span className='m-login__account-msg'>Want to learn more about KiboPush ?</span>&nbsp;&nbsp;
                    <a href='http://kibopush.com/faq/' id='m_login_signup' target='_blank' className='m-link m-link--focus m-login__account-link'>Visit FAQ page</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1 m-login__content' style={{backgroundImage: "url('assets/app/media/img//bg/bg-4.jpg')"}}>
            <div className='m-grid__item m-grid__item--middle'>
              <Link to='/signup' className='m-login__welcome'>Join KiboPush</Link>
              <p className='m-login__msg'>Get connected with your facebook audience through push messages.
              Push surveys, polls, instant broadcasts to your Facebook subscribers.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log(state)
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginSignup)
