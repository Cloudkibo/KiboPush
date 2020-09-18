/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { resendEmail } from '../../redux/actions/signup.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import auth from '../../utility/auth.service'
import $ from 'jquery'

class ResendEmail extends React.Component {
  constructor (props) {
    super(props)
    this.resend = this.resend.bind(this)
  }
  UNSAFE_componentWillMount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }
  resend () {
    this.props.resendEmail()
  }
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Add Pages`
    /* eslint-disable */
     $('#sidebarDiv').addClass('hideSideBar')
     /* eslint-enable */
  }

  render () {
    return (
      <div style={{width: '100%'}}>
        <header className='m-grid__item    m-header ' data-minimize-offset='200' data-minimize-mobile-offset='200' >
          <div className='m-container m-container--fluid m-container--full-height'>
            <div className='m-stack m-stack--ver m-stack--desktop'>
              <div className='m-stack__item m-brand'>
                <div className='m-stack m-stack--ver m-stack--general'>
                  <div className='m-stack__item m-stack__item--middle m-brand__logo'>
                    <h4 className='m-brand__logo-wrapper'>
                      KIBOPUSH
                    </h4>
                  </div>
                  <div className='m-stack__item m-stack__item--middle m-brand__tools'>
                    <a href='#/' onClick={() => { auth.logout() }} className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air'>
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
          <br /><br /><br /><br /><br /><br />
          <center>
            <div className='m-login__logo'>
              <a href='#/'>
                <img alt='' src='https://cdn.cloudkibo.com/public/img/logo.png' style={{maxWidth: 250}} />
              </a>
            </div>
          </center>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
            <div className='m-grid__item m-grid__item--fluid m-wrapper'>
              <div className='m-content'>
                <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                  <div className='m-alert__icon'>
                    <i className='flaticon-exclamation m--font-brand' />
                  </div>
                  <div className='m-alert__text'>
                    <div>Your email address is not verified. Please click on the button below to resend the verification email.</div>
                  </div>
                </div>
                {this.props.successMessage &&
                <label>{this.props.successMessage}</label>
                }
                <br />
                <br />
                <center>
                  <button type='submit' id='m_login_signup_submit' className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air' onClick={this.resend}>
                    Resend Verification Email
                  </button>
                  {this.props.user && (this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_ B') &&
                  <Link id='m_login_signup_cancel' to='/dashboard' className='btn btn-outline-focus  m-btn m-btn--pill m-btn--custom'>
                    Cancel
                  </Link>
                }
                </center>
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
    errorMessage: (state.signupInfo.errorMessage),
    successMessage: (state.signupInfo.successMessage),
    user: (state.basicInfo.user),
    isMobile: (state.basicInfo.isMobile)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      resendEmail: resendEmail
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ResendEmail)
