/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { log } from '../../utility/socketio'
import { isWebURL } from '../../utility/utils'
import { forgotWorkspaceName } from '../../redux/actions/login.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'

const TAG = 'containers/login/login'
class ForgotWorkspaceName extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      domain: false,
      isurl: false,
      success: false,
      fail: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.check = this.check.bind(this)
  }
  UNSAFE_componentWillMount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  UNSAFE_componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }
  check () {
    this.setState({domain: true})
    if (isWebURL(this.refs.domain.value)) {
      this.setState({isurl: true})
    }
  }
  componentDidMount () {
    log(TAG, 'Login Container Mounted')
  }
  onSubmit (event) {
    event.preventDefault()
    this.props.forgotWorkspaceName({email: this.refs.email.value}, this.msg)
  }
  UNSAFE_componentWillReceiveProps (nextprops) {
    if (nextprops.successForgot) {
      this.setState({fail: false})
      this.setState({success: true})
    } if (nextprops.errorForgot) {
      this.setState({success: false})
      this.setState({fail: true})
    }
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom left',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div style={{height: 100 + 'vh'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login' style={{height: 100 + 'vh'}}>
          <div className='m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside'>
            <div className='m-stack m-stack--hor m-stack--desktop'>
              <div className='m-stack__item m-stack__item--fluid'>
                <div className='m-login__wrapper'>
                  <div className='m-login__logo'>
                    <a href='#/'>
                      <img alt='' src='http://cdn.cloudkibo.com/public/img/logo.png' style={{maxWidth: 250}} />
                    </a>
                  </div>
                  <div className='m-login__signin'>
                    <div className='m-login__head'>
                      <h3 className='m-login__title'>Forgot Password ?</h3>
                    </div>
                    <form onSubmit={this.onSubmit} className='m-login__form m-form'>
                      <label style={{fontWeight: 'normal'}}>
                        Please enter the details below. We'll send you an email having your workspace name.
                      </label>
                      <br /><br />
                      <div className='form-group m-form__group'>
                        <input className='form-control m-input' type='email' placeholder='Email' ref='email' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }} />
                      </div>
                      <br />
                      {/* this.state.success &&
                        <div className='form-group m-form__group'>
                          <label>A password reset link has been sent to your email. Please check your email</label>
                        </div> */
                      }
                      { /* this.state.fail &&
                        <div className='form-group m-form__group'>
                          <label style={{color: 'red'}}>{this.props.errorForgot}</label>
                        </div> */
                      }
                      <br />
                      <div className='m-login__form-action'>
                        <button type='submit' id='m_login_signup_submit' className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air'>
                          Submit
                        </button>
                        <Link id='m_login_signup_cancel' to='/login' className='btn btn-outline-focus  m-btn m-btn--pill m-btn--custom'>
                          Cancel
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1 m-login__content' style={{backgroundImage: "url('http://cdn.cloudkibo.com/public/assets/app/media/img//bg/bg-4.jpg')"}}>
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
function mapStateToProps (state) {
  return {
    errorForgot: (state.loginInfo.errorForgot),
    successForgot: (state.loginInfo.successForgot)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    forgotWorkspaceName: forgotWorkspaceName
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ForgotWorkspaceName)
