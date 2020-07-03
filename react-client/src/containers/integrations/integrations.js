/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import auth from '../../utility/auth.service'
import AlertContainer from 'react-alert'
import { updatePlatformSettings, updatePlatformWhatsApp } from '../../redux/actions/settings.actions'
import { updatePlatform } from '../../redux/actions/basicinfo.actions'
class FacebookIntegration extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      isShowingModalWhatsApp: false,
      SID: '',
      token: '',
      whatsAppSID: '',
      whatsAppToken: '',
      code: '',
      sandboxNumber: '+14155238886',
      flockSendNumber: ''
    }
    this.closeDialog = this.closeDialog.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialogWhatsApp = this.closeDialogWhatsApp.bind(this)
    this.showDialogWhatsApp = this.showDialogWhatsApp.bind(this)
    this.submit = this.submit.bind(this)
    this.submitWapp = this.submitWapp.bind(this)
    this.updateToken = this.updateToken.bind(this)
    this.updateSID = this.updateSID.bind(this)
    this.goToNext = this.goToNext.bind(this)
    this.cancel = this.cancel.bind(this)
    this.updateWhatsAppValues = this.updateWhatsAppValues.bind(this)
    this.updateFlockSendNumber = this.updateFlockSendNumber.bind(this)
  }

  updateFlockSendNumber (e) {
    this.setState({flockSendNumber: e.target.value})
  }

  cancel () {
    this.props.history.push({
      pathname: '/dashboard',
      state: {loadScript: true}
    })
  }

  updateSID (e) {
    this.setState({SID: e.target.value})
  }

  updateToken (e) {
    this.setState({token: e.target.value})
  }

  updateWhatsAppValues (e, key) {
    if (key === 'whatsAppToken') {
      this.setState({whatsAppToken: e.target.value})
    } else if (key === 'whatsAppSID') {
      this.setState({whatsAppSID: e.target.value})
    } else if (key === 'code') {
      this.setState({code: e.target.value})
    }
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  showDialogWhatsApp () {
    this.setState({isShowingModalWhatsApp: true})
  }

  closeDialogWhatsApp () {
    this.setState({isShowingModalWhatsApp: false})
  }
  UNSAFE_componentWillReceiveProps (nextprops) {
    console.log('nextprops in Integrations', nextprops)
  }

  submit () {
    this.setState({isShowingModal: false})
    this.props.updatePlatformSettings({twilio: {
      accountSID: this.state.SID,
      authToken: this.state.token,
      platform: 'sms'
    }}, this.msg)
  }
  submitWapp () {
    const regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
    // if (this.state.whatsAppSID === '') {
    //   this.msg.error('Account SID cannot be empty')
    // } else if (this.state.whatsAppToken === '') {
    //   this.msg.error('Auth Token cannot be empty')
    // } else if (this.state.code === '') {
    //   this.msg.error('Sandbox code cannot be empty')
    // } else {
    //   this.setState({isShowingModalWhatsApp: false})
    //   this.props.updatePlatformWhatsApp({
    //     accountSID: this.state.whatsAppSID,
    //     authToken: this.state.whatsAppToken,
    //     sandboxNumber: this.state.sandboxNumber,
    //     sandboxCode: this.state.code,
    //     platform: 'whatsApp'
    //   }, this.msg)
    // }
    
    if (this.state.whatsAppToken === '') {
      this.msg.error('Access Token cannot be empty')
    } else if (!this.state.flockSendNumber.match(regex)) {
      this.msg.error('Invalid Number')
    } else {
      this.setState({isShowingModalWhatsApp: false})
      this.props.updatePlatformWhatsApp({
        accessToken: this.state.whatsAppToken,
        number: this.state.flockSendNumber,
        platform: 'whatsApp'
      }, this.msg)
    }
  }
  UNSAFE_componentWillMount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  goToNext () {
    this.props.history.push({
      pathname: '/dashboard',
      state: {loadScript: true}
    })
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Integrations`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    /* eslint-enable */
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div style={{height: 100 + 'vh', margin: '25px 300px', width: '100%'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login' style={{boxShadow: '0px 0px 30px 0px #ccc'}}>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--hor m-login m-login--singin m-login--2 m-login-2--skin-1'>
            <div className='m-login__wrapper col-md-8 col-lg-8 col-sm-8'>
              <div className='m-login__logo'>
                <a href='#/'>
                  <img alt='' src='https://cdn.cloudkibo.com/public/img/logo.png' style={{maxWidth: 250}} />
                </a>
              </div>
              <div className='m-login__signin'>
                <div className='m-login__head'>
                  <h3 className='m-login__title'>Integrations</h3>
                </div>
              </div>
              <br /><br />
              <div className='tab-pane active' style={{height: '520px'}} id='m_widget4_tab1_content'><div className='m-widget4'>
                <div className='m-widget4__item'>
                  <div className='m-widget4__info'>
                    <span className='m-widget4__title'>
                      <i className='fa fa-facebook-square' />&nbsp;&nbsp;&nbsp;
                      <span>
                        Facebook
                      </span>
                    </span>
                    <br />
                  </div>
                  <div className='m-widget4__ext'>
                    {this.props.user && this.props.user.facebookInfo
                      ? <button className='m-btn m-btn--pill m-btn--hover-secondary btn btn-secondary' disabled>
                        Connected
                      </button>
                      : <a href='/auth/facebook' style={{borderColor: '#34bfa3', color: '#34bfa3'}} className='m-btn m-btn--pill m-btn--hover-success btn btn-success'>
                        <span>Connect</span>
                      </a>
                    }
                  </div>
                </div>
                <div className='m-widget4__item'>
                  <div className='m-widget4__info'>
                    <span className='m-widget4__title'>
                      <i className='fa fa-comment' />&nbsp;&nbsp;&nbsp;
                      <span>
                        Twilio
                      </span>
                    </span>
                    <br />
                  </div>
                  <div className='m-widget4__ext'>
                    {this.props.automated_options && this.props.automated_options.twilio
                      ? <button className='m-btn m-btn--pill m-btn--hover-secondary btn btn-secondary' disabled>
                        Connected
                      </button>
                      : <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3'}} data-toggle="modal" data-target="#connect" onClick={this.showDialog}>
                        Connect
                      </button>
                    }
                  </div>
                </div>
                <div className='m-widget4__item'>
                  <div className='m-widget4__info'>
                    <span className='m-widget4__title'>
                      <i className='fa fa-whatsapp' />&nbsp;&nbsp;&nbsp;
                      <span>
                        WhatsApp FlockSend
                      </span>
                    </span>
                    <br />
                  </div>
                  <div className='m-widget4__ext'>
                    {this.props.automated_options && this.props.automated_options.flockSendWhatsApp
                      ? <button className='m-btn m-btn--pill m-btn--hover-secondary btn btn-secondary' disabled>
                        Connected
                      </button>
                      : <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3'}} data-toggle="modal" data-target="#whatsapp" onClick={this.showDialogWhatsApp}>
                        Connect
                      </button>
                    }
                  </div>
                </div>
              </div>
                <br /><br />
                {this.props.automated_options && this.props.user &&
                  <center>
                    <button onClick={this.goToNext} className='btn btn-primary m-btn m-btn--custom m-btn--icon' data-wizard-action='next' disabled={(!this.props.user.facebookInfo && !this.props.automated_options.twilio && !this.props.automated_options.flockSendWhatsApp) || (this.props.location.state === 'sms' && !this.props.automated_options.twilio) || (this.props.location.state === 'messenger' && !this.props.user.facebookInfo) || (this.props.location.state === 'whatsApp' && !this.props.automated_options.flockSendWhatsApp)}>
                      <span>
                        <span>Continue</span>&nbsp;&nbsp;
                        <i className='la la-arrow-right' />
                      </span>
                    </button>
                    {this.props.location.state &&
                    <button onClick={this.cancel} className='btn btn-secondary m-btn m-btn--custom' data-wizard-action='next' style={{marginLeft: '15px'}}>
                      <span>
                        <span>Cancel</span>&nbsp;&nbsp;
                      </span>
                    </button>
                  }
                  </center>
              }
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="connect" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Connect with Twilio
                  </h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <div className='m-form'>
                <span>Please enter your Twilio credentials here:</span>
                <div className='form-group m-form__group'>

                  <div id='question' className='form-group m-form__group'>
                    <label className='control-label'>Twilio Account SID</label>
                    <input className='form-control' value={this.state.SID} onChange={(e) => this.updateSID(e)} />
                  </div>
                  <div id='question' className='form-group m-form__group'>
                    <label className='control-label'>Twilio Auth Token:</label>
                    <input className='form-control' value={this.state.token} onChange={(e) => this.updateToken(e)} />
                  </div>
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                  <div className='m-form__actions' style={{'float': 'right'}}>
                    <button className='btn btn-primary' data-dismiss="modal" aria-label="Close"
                      onClick={this.submit}> Submit
                    </button>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="whatsapp" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Connect with Twilio WhatsApp
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <div className='m-form'>
                <span>Please enter your Twilio credentials here:</span>
                <div className='form-group m-form__group'>

                  <div id='question' className='form-group m-form__group'>
                    <label className='control-label'>Twilio Account SID</label>
                    <input className='form-control' value={this.state.whatsAppSID} onChange={(e) => this.updateWhatsAppValues(e, 'whatsAppSID')} />
                  </div>
                  <div id='question' className='form-group m-form__group'>
                    <label className='control-label'>Twilio Auth Token:</label>
                    <input className='form-control' value={this.state.whatsAppToken} onChange={(e) => this.updateWhatsAppValues(e, 'whatsAppToken')} />
                  </div>
                  <div id='question' className='form-group m-form__group'>
                    <label className='control-label'>WhatsApp Sandbox Number:</label>
                    <input className='form-control' value={this.state.sandboxNumber} disabled />
                  </div>
                  <div id='question' className='form-group m-form__group'>
                    <label className='control-label'>Sandbox Code:</label>
                    <input className='form-control' value={this.state.code} onChange={(e) => this.updateWhatsAppValues(e, 'code')} />
                  </div>
                  <span><b>Note:</b> You can find your sandbox number and code <a href='https://www.twilio.com/console/sms/whatsapp/sandbox' target='_blank' rel='noopener noreferrer'>here</a></span>
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                  <div className='m-form__actions' style={{'float': 'right'}}>
                    <button className='btn btn-primary' data-dismiss="modal" aria-label="Close"
                      onClick={this.submitWapp}> Submit
                    </button>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div> */}

          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="whatsapp" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Connect with FlockSend WhatsApp
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <div className='m-form'>
                <span>Please enter your FlockSend credentials here:</span>
                <div className='form-group m-form__group'>

                  <div id='_flocksend_access_token' className='form-group m-form__group'>
                    <label className='control-label'>FlockSend Access Token:</label>
                    <input className='form-control' value={this.state.whatsAppToken} onChange={(e) => this.updateWhatsAppValues(e, 'whatsAppToken')} />
                  </div>
                  <div id='_flocksend_whatsapp_number' className='form-group m-form__group'>
                    <label className='control-label'>FlockSend WhatsApp Number:</label>
                    <input className='form-control' onChange={this.updateFlockSendNumber} value={this.state.flockSendNumber} />
                  </div>
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                  <div className='m-form__actions' style={{'float': 'right'}}>
                    <button className='btn btn-primary' data-dismiss="modal" aria-label="Close"
                      onClick={this.submitWapp}> Submit
                    </button>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log('state in Integrations', state)
  return {
    automated_options: (state.basicInfo.automated_options),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updatePlatformSettings,
    updatePlatform,
    updatePlatformWhatsApp
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FacebookIntegration)
