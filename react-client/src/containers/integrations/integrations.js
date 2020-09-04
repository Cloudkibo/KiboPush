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
import { validatePhoneNumber } from '../../utility/utils'
import ConfirmationModal from '../../components/extras/confirmationModal'

class FacebookIntegration extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.initialWhatsappData = {
      twilio: {
        provider: 'twilio',
        accessToken: '',
        businessNumber: '+14155238886',
        accountSID: '',
        sandBoxCode: ''
      },
      flockSend: {
        provider: 'flockSend',
        accessToken: '',
        businessNumber: ''
      }
    }
    this.state = {
      isShowingModal: false,
      isShowingModalWhatsApp: false,
      SID: '',
      token: '',
      whatsappData: JSON.parse(JSON.stringify(this.initialWhatsappData))
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
    this.changeWhatsAppProvider = this.changeWhatsAppProvider.bind(this)
    this.updateWhatsAppData = this.updateWhatsAppData.bind(this)
    this.clearFieldsWapp = this.clearFieldsWapp.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this.updateData =this.updateData.bind(this)
  }

  updateWhatsAppData(e, data) {
    if (data.businessNumber) {
      if (!validatePhoneNumber(data.businessNumber)) {
        e.target.setCustomValidity('Please enter a valid WhatsApp number')
      } else {
        e.target.setCustomValidity('')
      }
    }
    let whatsappData = this.state.whatsappData
    whatsappData[this.state.whatsappProvider] = { ...whatsappData[this.state.whatsappProvider], ...data }
    this.setState({
      whatsappData
    })
  }

  changeWhatsAppProvider(e) {
    this.setState({
      whatsappProvider: e.target.value
    })
  }

  cancel() {
    this.props.history.push({
      pathname: '/dashboard',
      state: { loadScript: true }
    })
  }

  updateSID(e) {
    this.setState({ SID: e.target.value })
  }

  updateToken(e) {
    this.setState({ token: e.target.value })
  }

  showDialog() {
    this.setState({ isShowingModal: true })
  }

  closeDialog() {
    this.setState({ isShowingModal: false })
  }
  showDialogWhatsApp() {
    this.setState({ isShowingModalWhatsApp: true })
  }

  closeDialogWhatsApp() {
    this.setState({ isShowingModalWhatsApp: false })
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    console.log('nextprops in Integrations', nextprops)
  }

  submit() {
    this.setState({ isShowingModal: false })
    this.props.updatePlatformSettings({
      twilio: {
        accountSID: this.state.SID,
        authToken: this.state.token,
        platform: 'sms'
      }
    }, this.msg)
  }

  handleResponse(payload) {
    this.refs.connectWapp.click()
    if (payload.showModal) {
      this.refs.disconnectWhatsApp.click()
    } else {
      this.msg.success('Saved Successfully')
    }
  }

  updateData () {
    let whatsappData = this.state.whatsappData[this.state.whatsappProvider]
    whatsappData.connected = true
    this.props.updatePlatformWhatsApp(whatsappData, this.msg, null, this.handleResponse)
  }


  submitWapp(event) {
    event.preventDefault()
    if(this.props.automated_options.whatsApp && this.props.automated_options.whatsApp.connected === false) {
      let whatsappData = this.state.whatsappData[this.state.whatsappProvider]
      let businessNmber = whatsappData.businessNumber.replace(/[- )(]/g, '')
      if(businessNmber !== this.props.automated_options.whatsApp.businessNumber) {
        this.refs.createModal.click()
      } else {
        this.updateData ()
      }
    } else {
      this.updateData ()
    }
  }

  UNSAFE_componentWillMount() {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  goToNext() {
    this.props.history.push({
      pathname: '/dashboard',
      state: { loadScript: true }
    })
  }

  clearFieldsWapp() {
    this.setState({
      whatsappProvider: '',
      whatsappData: this.initialWhatsappData
    })
  }

  componentDidMount() {
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

  render() {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div style={{ height: 100 + 'vh', margin: '25px 300px', width: '100%' }}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login' style={{ boxShadow: '0px 0px 30px 0px #ccc' }}>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--hor m-login m-login--singin m-login--2 m-login-2--skin-1'>
            <div className='m-login__wrapper col-md-8 col-lg-8 col-sm-8'>
              <div className='m-login__logo'>
                <a href='#/'>
                  <img alt='' src='https://cdn.cloudkibo.com/public/img/logo.png' style={{ maxWidth: 250 }} />
                </a>
              </div>
              <div className='m-login__signin'>
                <div className='m-login__head'>
                  <h3 className='m-login__title'>Integrations</h3>
                </div>
              </div>
              <br /><br />
              <div className='tab-pane active' style={{ height: '520px' }} id='m_widget4_tab1_content'><div className='m-widget4'>
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
                    {this.props.user && this.props.user.connectFacebook
                      ? <button className='m-btn m-btn--pill m-btn--hover-secondary btn btn-secondary' disabled>
                        Connected
                      </button>
                      : <a href='/auth/facebook' style={{ borderColor: '#34bfa3', color: '#34bfa3' }} className='m-btn m-btn--pill m-btn--hover-success btn btn-success'>
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
                      : <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{ borderColor: '#34bfa3', color: '#34bfa3' }} data-toggle="modal" data-target="#connect" onClick={this.showDialog}>
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
                        WhatsApp
                      </span>
                    </span>
                    <br />
                  </div>
                  <div className='m-widget4__ext'>
                    {this.props.automated_options && this.props.automated_options.whatsApp &&  this.props.automated_options.whatsApp.connected !== false
                      ? <button className='m-btn m-btn--pill m-btn--hover-secondary btn btn-secondary' disabled>
                        Connected
                      </button>
                      : <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{ borderColor: '#34bfa3', color: '#34bfa3' }} data-toggle="modal" data-target="#whatsapp" onClick={this.showDialogWhatsApp}>
                        Connect
                      </button>
                    }
                  </div>
                </div>
              </div>
                <br /><br />
                {this.props.automated_options && this.props.user &&
                  <center>
                    <button onClick={this.goToNext} className='btn btn-primary m-btn m-btn--custom m-btn--icon' data-wizard-action='next' disabled={(!this.props.user.connectFacebook && !this.props.automated_options.twilio && !this.props.automated_options.whatsApp) || (this.props.location.state === 'sms' && !this.props.automated_options.twilio) || (this.props.location.state === 'messenger' && !this.props.user.facebookInfo) || (this.props.location.state === 'whatsApp' && !this.props.automated_options.whatsApp)}>
                      <span>
                        <span>Continue</span>&nbsp;&nbsp;
                        <i className='la la-arrow-right' />
                      </span>
                    </button>
                    {this.props.location.state &&
                      <button onClick={this.cancel} className='btn btn-secondary m-btn m-btn--custom' data-wizard-action='next' style={{ marginLeft: '15px' }}>
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

          <a href='#/' style={{ display: 'none' }} ref='createModal' data-toggle='modal' data-target='#create_confirmation_modal'>DeleteModal</a>
          <ConfirmationModal
          id = 'create_confirmation_modal'
          title = 'Are You Sure?'
          description = {`You had previously connected different account from this number ${this.props.automated_options.whatsApp ? this.props.automated_options.whatsApp.businessNumber: 0}. If you choose to connect the new Number then all the old data will be deleted...` }
          onConfirm = {this.updateData}
        />
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
              <div style={{ color: 'black' }} className="modal-body">
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
                  <div className='m-portlet__foot m-portlet__foot--fit' style={{ 'overflow': 'auto' }}>
                    <div className='m-form__actions' style={{ 'float': 'right' }}>
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
                  Connect with WhatsApp
									</h5>
                <button ref='connectWapp' onClick={this.clearFieldsWapp} style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black', maxHeight: '500px', overflowY: 'auto' }} className="modal-body">
                <form onSubmit={this.submitWapp}>
                  <div className='m-form'>
                    <div className='form-group m-form__group'>
                      <div style={{ marginBottom: '15px' }} id='_whatsapp_provider' className='form-group m-form__group'>
                        <label className='control-label'>WhatsApp Provider:</label>
                        <select onChange={this.changeWhatsAppProvider} class="form-control m-input" value={this.state.whatsappProvider} id="_zoom_users" required>
                          <option value='' selected disabled>Select a WhatsApp Provider...</option>
                          <option value='flockSend'>FlockSend</option>
                          <option value='twilio'>Twilio</option>
                        </select>
                      </div>


                      <div style={{ display: this.state.whatsappProvider === 'flockSend' ? 'initial' : 'none' }} >
                        <div id='_flocksend_access_token' className='form-group m-form__group'>
                          <label className='control-label'>FlockSend Access Token:</label>
                          <input
                            required={this.state.whatsappProvider === 'flockSend'} className='form-control' value={this.state.whatsappData.flockSend.accessToken} onChange={(e) => this.updateWhatsAppData(e, { accessToken: e.target.value })} />
                        </div>
                        <div id='_flocksend_whatsapp_number' className='form-group m-form__group'>
                          <label className='control-label'>WhatsApp Number:</label>
                          <input
                            required={this.state.whatsappProvider === 'flockSend'}
                            type="tel"
                            className='form-control'
                            value={this.state.whatsappData.flockSend.businessNumber}
                            onChange={(e) => this.updateWhatsAppData(e, { businessNumber: e.target.value })} />
                        </div>
                      </div>

                      <div style={{ display: this.state.whatsappProvider === 'twilio' ? 'initial' : 'none' }}>
                        <div id='question' className='form-group m-form__group'>
                          <label className='control-label'>Twilio Account SID</label>
                          <input required={this.state.whatsappProvider === 'twilio'} className='form-control' value={this.state.whatsappData.twilio.accountSID} onChange={(e) => this.updateWhatsAppData(e, { accountSID: e.target.value })} />
                        </div>
                        <div id='question' className='form-group m-form__group'>
                          <label className='control-label'>Twilio Auth Token:</label>
                          <input required={this.state.whatsappProvider === 'twilio'} className='form-control' value={this.state.whatsappData.twilio.accessToken} onChange={(e) => this.updateWhatsAppData(e, { accessToken: e.target.value })} />
                        </div>
                        <div id='question' className='form-group m-form__group'>
                          <label className='control-label'>WhatsApp Sandbox Number:</label>
                          <input className='form-control' value={this.state.whatsappData.twilio.businessNumber} disabled />
                        </div>
                        <div id='question' className='form-group m-form__group'>
                          <label className='control-label'>Sandbox Code:</label>
                          <input required={this.state.whatsappProvider === 'twilio'} className='form-control' value={this.state.whatsappData.twilio.sandBoxCode} onChange={(e) => this.updateWhatsAppData(e, { sandBoxCode: e.target.value })} />
                        </div>
                        <span><b>Note:</b> You can find your sandbox code <a href='https://www.twilio.com/console/sms/whatsapp/sandbox' target='_blank' rel='noopener noreferrer'>here</a></span>
                      </div>
                    </div>

                    {
                      this.state.whatsappProvider &&
                      <div className='m-portlet__foot m-portlet__foot--fit' style={{ 'overflow': 'auto', marginTop: '15px', float: 'right' }}>
                        <button type='submit' className='btn btn-primary'> Submit
                      </button>
                      </div>
                    }
                  </div>
                </form>
                {/* <div className='row'>
                  <div className='col-12'>
                    In order to send broadcasts and chat with your WhatsApp customers, you need to make them subscribers. In order to do so, please follow the instructions below:
                    <br /><br />
                    <b>1. Setup Webhook:</b> Go to <a href='https://flocksend.com/user/profile' target='_blank' rel='noopener noreferrer'>https://flocksend.com/user/profile</a> and click on the Webhook Setting from the Sidebar. Set this URL <i>https://webhook.cloudkibo.com/webhooks/flockSend</i> in the Webhook URL and click on save changes.
                    <br /><br />
                    <b>2. Get Subscribers:</b> Now ask your customers to send any WhatsApp message to your FlockSend WhatsApp number {this.state.number}. When they message, they will become a subscriber.
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  console.log('state in Integrations', state)
  return {
    automated_options: (state.basicInfo.automated_options),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updatePlatformSettings,
    updatePlatform,
    updatePlatformWhatsApp
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FacebookIntegration)
