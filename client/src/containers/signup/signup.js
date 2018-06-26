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
import AlertContainer from 'react-alert'
var taiPasswordStrength = require('tai-password-strength')
var strengthTester = new taiPasswordStrength.PasswordStrength()
const TAG = 'containers/login/login'

class Signup extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      eulaAgreed: false,
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
    this.setState({error: false})
    if (nextprops.successSignup) {
      this.props.history.push({
        pathname: '/connectFb',
        state: { account_type: this.state.account_type }
      })
    } else if (nextprops.errorSignup) {
      //  this.setState({error: nextprops.errorSignup})
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
      if (this.state.account_type === 'team') {
        data = {
          name: this.refs.name.value.trim(),
          email: this.refs.email.value.trim(),
          domain: this.refs.domain.value.trim(),
          password: this.refs.password.value.trim(),
          company_name: this.refs.companyName.value.trim()
        }
      } else {
        data = {
          name: this.refs.name.value.trim(),
          email: this.refs.email.value.trim(),
          password: this.refs.password.value.trim()
        }
      }

      this.props.signUp(data, this.msg)
    }
  }
  equal () {
    if (this.refs.rpassword.value === this.refs.password.value) {
      this.setState({ismatch: true})
    } else {
      this.setState({ismatch: false})
    }
  }

  acceptEULA () {
    this.setState({eulaAgreed: true})
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
        <div className='fb-customerchat'
          data-page_id='151990922046256'
          data-logged_in_greeting='Hi, Let us know if you find any bugs or have a feature request'
          data-logged_out_greeting='Hi, Let us know if you find any bugs or have a feature request'
        />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin m-login--signup' id='m_login' style={{height: 100 + 'vh'}}>
          <div className='m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside'>
            <div style={{marginTop: !this.state.eulaAgreed ? -120 : 0}} className='m-stack m-stack--hor m-stack--desktop'>
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
                      {
                        (this.state.eulaAgreed)
                        ? <div className='m-login__desc'>
                        Enter your details to create your account:
                      </div>
                      : <div className='m-login__desc'>
                      Please read and accept the End-User License Agreement in order to use KiboPush
                    </div>
                      }
                    </div>
                    {
                    (this.state.eulaAgreed && this.state.account_type !== 'none') &&
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
                    { (this.state.eulaAgreed && this.state.account_type === 'none') &&
                      <div className='m-login__form m-form'>
                        <center>
                          {/* We are not accepting new sign ups for now as Facebook Platform Access is temporarily disabled. */}
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
                    {
                      (!this.state.eulaAgreed) &&
                      <div className='m-login__form m-form'>
                        <center>
                          <div style={{
                            width: '300px',
                            height: '17pc',
                            overflowY: 'scroll',
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                            marginTop: -20,
                            border: '1px solid black',
                            padding: 10
                          }}>

                            <p>This End-User License Agreement ("EULA") is a legal agreement between you and CloudKibo</p>
                            <p>This EULA agreement governs your acquisition and use of our KiboPush software ("Software") directly from CloudKibo or indirectly through a CloudKibo authorized reseller or distributor (a "Reseller").</p>
                            <p>Please read this EULA agreement carefully before completing the installation process and using the KiboPush software. It provides a license to use the KiboPush software and contains warranty information and liability disclaimers.</p>
                            <p>If you register for a free trial of the KiboPush software, this EULA agreement will also govern that trial. By clicking "accept" or installing and/or using the KiboPush software, you are confirming your acceptance of the Software and agreeing to become bound by the terms of this EULA agreement.</p>
                            <p>If you are entering into this EULA agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms and conditions. If you do not have such authority or if you do not agree with the terms and conditions of this EULA agreement, do not install or use the Software, and you must not accept this EULA agreement.</p>
                            <p>This EULA agreement shall apply only to the Software supplied by CloudKibo herewith regardless of whether other software is referred to or described herein. The terms also apply to any CloudKibo updates, supplements, Internet-based services, and support services for the Software, unless other terms accompany those items on delivery. If so, those terms apply.</p>
                            <p><strong>License Grant</strong></p>
                            <p>CloudKibo hereby grants you a personal, non-transferable, non-exclusive licence to use the KiboPush software on your devices in accordance with the terms of this EULA agreement.</p>
                            <p>You are permitted to load the KiboPush software (for example a PC, laptop, mobile or tablet) under your control. You are responsible for ensuring your device meets the minimum requirements of the KiboPush software.</p>
                            <p>You are not permitted to:</p>
                            <ul>
                              <li>Edit, alter, modify, adapt, translate or otherwise change the whole or any part of the Software nor permit the whole or any part of the Software to be combined with or become incorporated in any other software, nor decompile, disassemble or reverse engineer the Software or attempt to do any such things</li>
                              <li>Reproduce, copy, distribute, resell or otherwise use the Software for any commercial purpose</li>
                              <li>Allow any third party to use the Software on behalf of or for the benefit of any third party</li>
                              <li>Use the Software in any way which breaches any applicable local, national or international law</li>
                              <li>use the Software for any purpose that CloudKibo considers is a breach of this EULA agreement</li>
                            </ul>
                            <p><strong>Intellectual Property and Ownership</strong></p>
                            <p>CloudKibo shall at all times retain ownership of the Software as originally downloaded by you and all subsequent downloads of the Software by you. The Software (and the copyright, and other intellectual property rights of whatever nature in the Software, including any modifications made thereto) are and shall remain the property of CloudKibo.</p>
                            <p>CloudKibo reserves the right to grant licences to use the Software to third parties.</p>
                            <p><strong>Termination</strong></p>
                            <p>This EULA agreement is effective from the date you first use the Software and shall continue until terminated. You may terminate it at any time upon written notice to CloudKibo.</p>
                            <p>It will also terminate immediately if you fail to comply with any term of this EULA agreement. Upon such termination, the licenses granted by this EULA agreement will immediately terminate and you agree to stop all access and use of the Software. The provisions that by their nature continue and survive will survive any termination of this EULA agreement.</p>
                            <p><strong>Governing Law</strong></p>
                            <p>This EULA agreement, and any dispute arising out of or in connection with this EULA agreement, shall be governed by and construed in accordance with the laws of United States.</p>
                            <p>&nbsp;</p>
                          </div>
                          <br />
                          <br />
                          <span>
                            <div style={{marginRight: '30px'}} className='btn m-btn--pill btn-secondary' onClick={() => this.acceptEULA()}>
                              Accept
                            </div>
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
