/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { changePass, enable2FA, disable2FA, verify2FAToken } from '../../redux/actions/settings.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import Progress from 'react-progressbar'
var taiPasswordStrength = require('tai-password-strength')
var strengthTester = new taiPasswordStrength.PasswordStrength()
class AccountSettings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      password: false,
      strength: '',
      pwdBar: 0,
      pwd_color: 'red',
      ismatch: false,
      pwdlength: true,
      changePassword: false,
      tfaSwitch: this.props.user.tfaEnabled
    }
    this.save = this.save.bind(this)
    this.equal = this.equal.bind(this)
    this.handlePwdChange = this.handlePwdChange.bind(this)
    this.onCurrentPassChange = this.onCurrentPassChange.bind(this)
    this.onToggle2FASwitch = this.onToggle2FASwitch.bind(this)
    this.verifyOtp = this.verifyOtp.bind(this)
    this.cancel2FA = this.cancel2FA.bind(this)
  }
  onToggle2FASwitch (e) {
    const data = {
      tfaEnabled: e.target.checked
    }
    let user = this.props.user
    user.tfaEnabled = e.target.checked
    this.setState({tfaSwitch: e.target.checked})
    if (e.target.checked) {
      this.props.enable2FA(data)
    } else {
      this.props.disable2FA(data)
    }
  }
  verifyOtp(event) {
    event.preventDefault()
    this.props.verify2FAToken({token: this.refs.otp.value}, this.msg)
  }
  cancel2FA(event) {
    event.preventDefault()
    this.props.disable2FA()
  }
  equal () {
    if (this.refs.new.value === this.refs.retype.value) {
      this.setState({ismatch: true})
    } else {
      this.setState({ismatch: false})
    }
  }
  onCurrentPassChange () {
    if (this.refs.new && this.refs.current && this.refs.new.value === this.refs.current.value) {
      this.setState({changePassword: true})
    } else {
      this.setState({changePassword: false})
    }
  }
  handlePwdChange (event) {
    this.setState({password: true})
    if (event.target.value.length <= 6) {
      this.setState({pwdlength: false})
    } else if (event.target.value.length > 6) {
      this.setState({pwdlength: true})
    }
    if (this.refs.new && this.refs.current && this.refs.new.value === this.refs.current.value) {
      this.setState({changePassword: true})
    } else {
      this.setState({changePassword: false})
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

    if (this.refs.new.value === this.refs.retype.value) {
      this.setState({ismatch: true})
    } else {
      this.setState({ismatch: false})
    }
  }
  save (event) {
    event.preventDefault()
    if (this.state.ismatch) {
      this.props.changePass({old_password: this.refs.current.value, new_password: this.refs.new.value}, this.msg)
    }
  }
  componentDidMount () {
    document.title = 'KiboPush | api_settings'
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.user) {
      this.setState({
        tfaSwitch: nextProps.user.tfaEnabled
      })
    }
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Account Settings
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='tab-pane active' id='m_user_profile_tab_1'>
              <form className='m-form m-form--fit m-form--label-align-right'>
                <div className='m-portlet__body'>
                  <div className='form-group m-form__group m--margin-top-10 m--hide'>
                    <div className='alert m-alert m-alert--default' role='alert'>
                      The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classNamees.
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <h4>Reset Password</h4>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-4 col-form-label' style={{textAlign: 'left'}}>
                      Current Password
                    </label>
                    <div className='col-7 input-group'>
                      <input className='form-control m-input' required type='password' ref='current' onChange={this.onCurrentPassChange} />
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-4 col-form-label' style={{textAlign: 'left'}}>
                      New Password
                    </label>
                    <div className='col-7 input-group'>
                      <input className='form-control m-input' required type='password' ref='new' onChange={this.handlePwdChange} />
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
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-4 col-form-label' style={{textAlign: 'left'}}>
                      Retype Password
                    </label>
                    <div className='col-7 input-group'>
                      <input className='form-control m-input' required type='password' ref='retype' onChange={this.equal} />
                    </div>
                    <label className='col-4 col-form-label' style={{textAlign: 'left'}} />
                    { this.state.password && this.state.ismatch === false &&
                      <div className='col-7 input-group' style={{color: 'red'}}>Passwords do not match</div>
                    }
                    { this.state.password && this.state.changePassword &&
                      <div className='col-7 input-group' style={{color: 'red'}}>New password cannot be same as current password</div>
                    }
                    <div className='col-11 input-group pull-right'>
                      <button className='btn btn-primary pull-right' disabled={!this.refs.current || !this.refs.new || !this.refs.retype || this.refs.current.value === '' || this.refs.new.value === '' || this.refs.retype.value === '' || this.state.changePassword || !this.state.ismatch || !this.state.pwdlength} onClick={this.save}>Save</button>
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <h4>Account Security</h4>
                  </div>
                  <div className='m-form__group form-group row'>
                    <span className='col-9 col-form-label'>
                      2-Factor Authentication (You need to have authenticator app like Google Authenticator for this)
                    </span>
                    <div className='col-3'>
                      <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                        <label>
                          <input type='checkbox' data-switch='true'
                            checked={this.state.tfaSwitch}
                            onChange={(e) => {this.onToggle2FASwitch(e)}} />
                          <span></span>
                        </label>
                      </span>
                    </div>
                  </div>
                  {this.props.user && this.props.user.tfa && this.props.user.tfa.secret === '' &&
                  <center>
                    <div className='m-form__group form-group row'>
                      <span className='col-12 col-form-label'>
                        <img src={this.props.user.tfa.dataURL} />
                      </span>
                    </div>
                    <p>
                      Scan this QR code in your 2 Factor Authenticator app and put the code in following box.
                    </p>
                    <div className='m-form__group form-group row'>
                      <span className='col-12 col-form-label'>
                        <input className='form-control m-input' required type='text' ref='otp' />
                      </span>
                    </div>
                    <div className='m-form__group form-group row'>
                      <span className='col-6 col-form-label'></span>
                      <span className='col-3 col-form-label'>
                        <button className='btn btn-secondary' onClick={this.cancel2FA}>Cancel 2FA Setup</button>
                      </span>
                      <span className='col-3 col-form-label'>
                        <button className='btn btn-primary' onClick={this.verifyOtp}>Verify OTP</button>
                      </span>
                    </div>
                  </center>
                  }
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    changePass: changePass,
    enable2FA: enable2FA,
    disable2FA: disable2FA,
    verify2FAToken: verify2FAToken
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings)
