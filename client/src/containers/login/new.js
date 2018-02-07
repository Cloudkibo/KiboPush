/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router'
import { logIn } from '../../redux/actions/login.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { isWebURL } from './../../utility/utils'
import { log } from './../../utility/socketio'
const TAG = 'containers/login/login'
import AlertContainer from 'react-alert'

class Login extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      domain: false,
      password: false,
      isurl: false,
      redirect: true,
      error: false,
      success: false,
      account_type: 'none',
    }
    this.check = this.check.bind(this)
    this.edit = this.edit.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit (event) {
    event.preventDefault()
    var data = {}
    if(this.state.account_type == 'team'){
      data = {
        email: this.refs.email.value.trim(),
        domain: this.refs.domain.value.trim(),
        password: this.refs.password.value.trim()
      }
    }else{
      data = {
        email: this.refs.email.value.trim(),
        password: this.refs.password.value.trim()
      }
    }

    this.props.logIn(data, this.msg)
  }
  check () {
    this.setState({domain: true, error: false})
    if (isWebURL(this.refs.domain.value)) {
      this.setState({isurl: true})
    }
  }
  edit () {
    this.setState({error: false})
  }
  componentDidMount () {
    log(TAG, 'Login Container Mounted')
  }
  componentWillReceiveProps (nextprops) {
    console.log('componentWillReceiveProps called', nextprops)
    if (nextprops.errorMessage) {
      console.log('nextprops.errorMessage', nextprops.errorMessage)
      //  this.setState({error: true})
    }
    if (nextprops.successMessage) {
      console.log('succes', nextprops.successMessage)
      this.setState({success: true, error: false})
      this.props.history.push({
        pathname: '/dashboard'

      })
    }
  }
  render () {
    console.log('In Login JS')
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
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login'>
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
                      <h3 className='m-login__title'>Sign In To KiboPush</h3>
                    </div>
                    { (this.state.account_type != 'none') &&
                      <form onSubmit={this.onSubmit} className='m-login__form m-form' >
                      {this.state.error &&
                        <div id='email-error' style={{color: 'red'}}>{this.props.errorMessage}</div>
                      }
                      {
                        (this.state.account_type == 'team') && <div className='form-group m-form__group'>
                          <input className='form-control m-input' type='text' placeholder='Workspace name e.g. mycompany' ref='domain' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }}
                            onChange={this.check} />
                          {/* !this.state.domain &&
                          <div id='email-error' style={{color: 'red'}}>Please enter a valid/unique workspace name</div>
                           */}
                        </div>
                      }

                      <div className='form-group m-form__group'>
                        <input className='form-control m-input' type='email' placeholder='Email' ref='email' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }} onChange={this.edit} />
                      </div>
                      <div className='form-group m-form__group'>
                        <input className='form-control m-input' type='password' placeholder='Password' ref='password' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }}
                          onChange={this.edit} />
                      </div>
                      <div className='m-login__form-action'>
                        <span>
                          <Link id='m_login_signup_cancel' href='#' className='btn btn-outline-focus  m-btn m-btn--pill m-btn--custom' onClick={() => { this.setState({account_type: 'none'}) }}>
                            Back
                          </Link>
                        </span>
                        <button type='submit' id='m_login_signup_submit' className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air'>
                          Sign In
                        </button>
                      </div>
                    </form>
                    }

                    { (this.state.account_type == 'none') &&

                      <div className='m-login__form m-form' style={{marginLeft: 75}} >
                        <button className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air' onClick={() => {this.setState({account_type: 'individual'})}}>
                          Individual Account
                        </button>
                        <br />
                        <br />
                        <button className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air' onClick={() => {this.setState({account_type: 'team'})}}>
                          Team Account
                        </button>
                      </div>
                    }

                  </div>
                </div>
              </div>
              <div className='m-stack__item m-stack__item--center'>

                <div className='m-login__account'>
                  <span className='m-login__account-msg'>Forgot Password ?</span>&nbsp;&nbsp;
                  <Link to='/forgotPassword' id='m_login_signup' className='m-link m-link--focus m-login__account-link'>Click here</Link>
                </div>
                <br />
                <div className='m-login__account'>
                  <span className='m-login__account-msg'>Don't have an account yet ?</span>&nbsp;&nbsp;
                  <Link to='/signup' id='m_login_signup' className='m-link m-link--focus m-login__account-link'>Sign Up</Link>
                </div>
                <br />
                <div className='m-login__account'>
                  <span className='m-login__account-msg'>Want to learn more about KiboPush ?</span>&nbsp;&nbsp;
                  <a href='http://kibopush.com/faq/' id='m_login_signup' target='_blank' className='m-link m-link--focus m-login__account-link'>Visit FAQ page</a>
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
  return {
    errorMessage: (state.loginInfo.errorMessage),
    successMessage: (state.loginInfo.successMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    logIn: logIn
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)
