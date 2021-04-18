/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class SmsPlansScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      fblink: '',
      copied: false,
      selectPage: {},
      selectedTab: 'becomeSubscriber',
      sendTestMessage: false,
    }
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
  }

  render () {
    return (
      <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin" id="m_login">
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1	m-login__content" style={{backgroundImage: 'url(https://cdn.cloudkibo.com/public/assets/app/media/img//bg/bg-4.jpg)'}}>
          <div className="m-grid__item m-grid__item--middle">
            <h3 className="m-login__welcome">
              Join Our Community
            </h3>
            <p className="m-login__msg">
              Lorem ipsum dolor sit amet, coectetuer adipiscing
              <br />
              elit sed diam nonummy et nibh euismod
            </p>
          </div>
        </div>
        <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside">
          <div className="m-stack m-stack--hor m-stack--desktop">
            <div className="m-stack__item m-stack__item--fluid">
              <div className="m-login__wrapper">
                <div className="m-login__logo">
                  <a href="#">
                    <img src="../../../assets/app/media/img//logos/logo-2.png" />
                  </a>
                </div>
                <div className="m-login__signin">
                  <div className="m-login__head">
                    <h3 className="m-login__title">
                      Sign In To Admin
                    </h3>
                  </div>
                  <form className="m-login__form m-form" action>
                    <div className="form-group m-form__group">
                      <input className="form-control m-input" type="text" placeholder="Email" name="email" autoComplete="off" />
                    </div>
                    <div className="form-group m-form__group">
                      <input className="form-control m-input m-login__form-input--last" type="password" placeholder="Password" name="password" />
                    </div>
                    <div className="row m-login__form-sub">
                      <div className="col m--align-left">
                        <label className="m-checkbox m-checkbox--focus">
                          <input type="checkbox" name="remember" />
                          Remember me
                          <span />
                        </label>
                      </div>
                      <div className="col m--align-right">
                        <a href="javascript:;" id="m_login_forget_password" className="m-link">
                          Forget Password ?
                        </a>
                      </div>
                    </div>
                    <div className="m-login__form-action">
                      <button id="m_login_signin_submit" className="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">
                        Sign In
                      </button>
                    </div>
                  </form>
                </div>
                <div className="m-login__signup">
                  <div className="m-login__head">
                    <h3 className="m-login__title">
                      Sign Up
                    </h3>
                    <div className="m-login__desc">
                      Enter your details to create your account:
                    </div>
                  </div>
                  <form className="m-login__form m-form" action>
                    <div className="form-group m-form__group">
                      <input className="form-control m-input" type="text" placeholder="Fullname" name="fullname" />
                    </div>
                    <div className="form-group m-form__group">
                      <input className="form-control m-input" type="text" placeholder="Email" name="email" autoComplete="off" />
                    </div>
                    <div className="form-group m-form__group">
                      <input className="form-control m-input" type="password" placeholder="Password" name="password" />
                    </div>
                    <div className="form-group m-form__group">
                      <input className="form-control m-input m-login__form-input--last" type="password" placeholder="Confirm Password" name="rpassword" />
                    </div>
                    <div className="row form-group m-form__group m-login__form-sub">
                      <div className="col m--align-left">
                        <label className="m-checkbox m-checkbox--focus">
                          <input type="checkbox" name="agree" />
                          I Agree the
                          <a href="#" className="m-link m-link--focus">
                            terms and conditions
                          </a>
                          .
                          <span />
                        </label>
                        <span className="m-form__help" />
                      </div>
                    </div>
                    <div className="m-login__form-action">
                      <button id="m_login_signup_submit" className="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">
                        Sign Up
                      </button>
                      <button id="m_login_signup_cancel" className="btn btn-outline-focus  m-btn m-btn--pill m-btn--custom">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
                <div className="m-login__forget-password">
                  <div className="m-login__head">
                    <h3 className="m-login__title">
                      Forgotten Password ?
                    </h3>
                    <div className="m-login__desc">
                      Enter your email to reset your password:
                    </div>
                  </div>
                  <form className="m-login__form m-form" action>
                    <div className="form-group m-form__group">
                      <input className="form-control m-input" type="text" placeholder="Email" name="email" id="m_email" autoComplete="off" />
                    </div>
                    <div className="m-login__form-action">
                      <button id="m_login_forget_password_submit" className="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">
                        Request
                      </button>
                      <button id="m_login_forget_password_cancel" className="btn btn-outline-focus m-btn m-btn--pill m-btn--custom">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="m-stack__item m-stack__item--center">
              <div className="m-login__account">
                <span className="m-login__account-msg">
                  Don't have an account yet ?
                </span>
                &nbsp;&nbsp;
                <a href="javascript:;" id="m_login_signup" className="m-link m-link--focus m-login__account-link">
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    superUser: (state.basicInfo.superUser)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SmsPlansScreen)
