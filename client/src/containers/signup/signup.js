/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { signUp } from '../../redux/actions/signup.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { isWebURL } from './../../utility/utils'
import { log } from './../../utility/socketio'
import { Link } from 'react-router'
import Progress from 'react-progressbar'
var taiPasswordStrength = require('tai-password-strength')
var strengthTester = new taiPasswordStrength.PasswordStrength()
const TAG = 'containers/login/login'

class Signup extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      domain: false,
      password: false,
      strength: '',
      pwdBar: 0,
      pwd_color: 'red',
      ismatch: false,
      isurl: false,
      pwdlength: true,
      error: false,
      account_type: 'none'
    }
    this.check = this.check.bind(this)
    this.handlePwdChange = this.handlePwdChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.equal = this.equal.bind(this)
  }
  check () {
    this.setState({domain: true})
    if (isWebURL(this.refs.domain.value)) {
      this.setState({isurl: true})
    }
  }
  componentDidMount () {
    log(TAG, 'signup Container Mounted')
  }
  componentWillReceiveProps (nextprops) {
    console.log('props', nextprops)
    this.setState({error: false})
    if (nextprops.successSignup) {
      console.log('i am called')
      this.props.history.push({
        pathname: '/connectFb',
        state: { account_type: this.state.account_type }
      })
    } else if (nextprops.errorSignup) {
      console.log('nextprops.errorSignup', nextprops.errorSignup)
      this.setState({error: nextprops.errorSignup})
    }
  }
  handlePwdChange (event) {
    this.setState({password: true})
    if (event.target.value.length <= 6) {
      this.setState({pwdlength: false})
    } else if (event.target.value.length > 6) {
      this.setState({pwdlength: true})
    }
    var result = strengthTester.check(event.target.value)
    var text = ''
    var bar = 0
    var color = 'red'
    switch (result.strengthCode) {
      case 'VERY_WEAK':
        text = 'WEAK'
        bar = 25
        color = 'red'
        break
      case 'WEAK':
        text = 'REASONABLE'
        bar = 50
        color = 'orange'
        break
      case 'REASONABLE':
        text = 'GOOD'
        bar = 75
        color = 'yellow'
        break
      case 'STRONG':
        text = 'STRONG'
        bar = 100
        color = 'green'
        break
      case 'VERY_STRONG':
        text = 'STRONG'
        bar = 100
        color = 'green'
        break
      default:
        text = ''
        bar = 0
        color = 'red'
    }
    this.setState({strength: text})
    this.setState({pwdBar: bar})
    this.setState({pwd_color: color})
  }
  onSubmit (event) {
    this.setState({error: false})
    event.preventDefault()
    if (this.refs.password.value.length > 6 && this.refs.password.value === this.refs.rpassword.value) {
      let data = {}
      if(this.state.account_type == 'team') {
          data = {
          name: this.refs.name.value.trim(),
          email: this.refs.email.value.trim(),
          domain: this.refs.domain.value.trim(),
          password: this.refs.password.value.trim(),
          company_name: this.refs.companyName.value.trim()
        }
      }
      else{
        data = {
          name: this.refs.name.value.trim(),
          email: this.refs.email.value.trim(),
          password: this.refs.password.value.trim()
        }
      }

      this.props.signUp(data)
    }
  }
  equal () {
    if (this.refs.rpassword.value === this.refs.password.value) {
      this.setState({ismatch: true})
    } else {
      this.setState({ismatch: false})
    }
  }
  render () {
    console.log('In signup JS')
    return (
      <div style={{height: 130 + 'vh'}}>
        <div className='fb-customerchat'
          data-page_id='151990922046256'
          data-logged_in_greeting='Hi, Let us know if you find any bugs or have a feature request'
          data-logged_out_greeting='Hi, Let us know if you find any bugs or have a feature request'
        />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin m-login--signup' id='m_login' style={{height: 130 + 'vh'}}>
          <div className='m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside'>
            <div className='m-stack m-stack--hor m-stack--desktop'>
              <div className='m-stack__item m-stack__item--fluid'>
                <div className='m-login__wrapper'>
                  <div className='m-login__logo'>
                    <a href='#'>
                      <img src='img/logo.png' style={{maxWidth: 250}} />
                    </a>
                  </div>
                  <div className='m-login__signup'>
                    <div className='m-login__head'>
                      <h3 className='m-login__title'>
                        Sign Up
                      </h3>
                      <div className='m-login__desc'>
                        Enter your details to create your account:
                      </div>
                    </div>
                    {
                    (this.state.account_type !== 'none') &&
                    <form onSubmit={this.onSubmit} className='m-login__form m-form'>
                      {this.state.error &&
                      <div id='email-error' style={{color: 'red', fontWeight: 'bold'}}><bold>{this.state.error}</bold></div>
                      }
                      <div className='form-group m-form__group'>
                        <input className='form-control m-input' type='text' placeholder='Name' ref='name' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }} />
                      </div>
                      {
                        (this.state.account_type === 'team') &&
                        <div>
                          <div className='form-group m-form__group'>
                            <input className='form-control m-input' type='text' placeholder='Workspace name e.g. mycompany' ref='domain' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }}
                              onChange={this.check} />
                            {/* !this.state.domain  &&
                            <div id='email-error' style={{color: 'red'}}>Please enter a valid/unique workspace name</div>
                             */}
                          </div>
                          <div className='form-group m-form__group'>
                            <input className='form-control m-input' type='text' placeholder='Company Name' ref='companyName' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }} />
                          </div>
                        </div>
                      }
                      <div className='form-group m-form__group'>
                        <input className='form-control m-input' type='email' placeholder='Email' ref='email' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }} />
                      </div>
                      <div className='form-group m-form__group'>
                        <input className='form-control m-input' type='password' placeholder='Password' ref='password' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }}
                          onChange={this.handlePwdChange} />
                        { this.state.password && this.state.pwdlength === false &&
                          <div id='email-error' style={{color: 'red'}}>Length of password should be greater than 6</div>
                        }
                        { this.state.password &&
                          <div>
                            <div> Strength: {this.state.strength}</div>
                            <div> <Progress completed={this.state.pwdBar} color={this.state.pwd_color} /> </div>
                            </div>
                        }
                      </div>
                      <div className='form-group m-form__group'>
                        <input className='form-control m-input' type='password' required placeholder='Confirm Password' ref='rpassword' style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }}
                          onChange={this.equal} />
                        { this.state.password && this.state.ismatch === false &&
                          <div id='email-error' style={{color: 'red'}}>Passwords do not match</div>
                        }
                      </div>
                      <div className='m-login__form-action'>
                        <button type='submit' id='m_login_signup_submit' className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air'>
                          Sign Up
                        </button>
                        <Link id='m_login_signup_cancel' to='/' className='btn btn-outline-focus  m-btn m-btn--pill m-btn--custom'>
                          Cancel
                        </Link>
                      </div>
                    </form>
                    }
                    { (this.state.account_type === 'none') &&
                      <div className='m-login__form m-form'>
                        <center>
                          <button className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air' onClick={() => { this.setState({account_type: 'individual'}) }}>
                           Create Individual Account
                          </button>
                          <br />
                          <br />
                          <button className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air' onClick={() => { this.setState({account_type: 'team'}) }}>
                            Create Team Account
                          </button>
                          <br />
                          <br />
                          <span>
                            <Link id='m_login_signup_cancel' to='/' className='btn m-btn--pill btn-secondary'>
                              Cancel
                            </Link>
                          </span>
                        </center>
                      </div>
                    }
                  </div>
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
  }
}
function mapStateToProps (state) {
  console.log('state', state)
  return {
    errorMessage: (state.signupInfo.errorMessage),
    successMessage: (state.signupInfo.successMessage),
    successSignup: (state.signupInfo.successSignup),
    errorSignup: (state.signupInfo.errorSignup)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    signUp: signUp
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup)
