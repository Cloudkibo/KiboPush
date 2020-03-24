/* eslint-disable no-useless-constructor */
import React from 'react'
import { updatePlatformSettings, updatePlatformWhatsApp, disconnect, deleteWhatsApp } from '../../redux/actions/settings.actions'
import { getAutomatedOptions, disconnectFacebook } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import WhatsAppDeleteModal from '../../components/extras/deleteWithPassword'

class Webhook extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      SID: '',
      token: '',
      SIDWapp: '',
      tokenWapp: '',
      number: '+14155238886',
      code: '',
      type: '',
      deleteType: ''
    }
    this.updateToken = this.updateToken.bind(this)
    this.updateSID = this.updateSID.bind(this)
    this.updateTokenWapp = this.updateTokenWapp.bind(this)
    this.updateSIDWapp = this.updateSIDWapp.bind(this)
    this.updateCode = this.updateCode.bind(this)
    this.submit = this.submit.bind(this)
    this.submitWapp = this.submitWapp.bind(this)
    this.clearFields = this.clearFields.bind(this)
    this.clearFieldsWapp = this.clearFieldsWapp.bind(this)
    this.disconnect = this.disconnect.bind(this)
    this.showDialogDisconnect = this.showDialogDisconnect.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this.deleteWhatsApp = this.deleteWhatsApp.bind(this)
    this.handleDeleteWhatsAppResponse = this.handleDeleteWhatsAppResponse.bind(this)
    this.setType = this.setType.bind(this)
    props.getAutomatedOptions()
  }

  setType (type) {
    this.setState({deleteType: type}, () => {
      if (type === 'Disconnect') {
        this.refs.disconnectWhatsApp.click()
      } else {
        this.refs.connectWapp.click()
      }
    })
  }

  deleteWhatsApp (password) {
    if (this.state.type === 'Disconnect') {
      this.props.deleteWhatsApp({type: this.state.deleteType, password: password}, this.handleDeleteWhatsAppResponse)
    } else {
      let data = {
        accountSID: this.state.SIDWapp,
        authToken: this.state.tokenWapp,
        sandboxNumber: this.state.number,
        sandboxCode: this.state.code,
        type: this.state.deleteType,
        password: password
      }
      this.props.deleteWhatsApp(data, this.handleDeleteWhatsAppResponse)
    }
  }

  handleDeleteWhatsAppResponse (res) {
    if (res.status === 'success') {
      this.refs.disconnectWhatsApp.click()
      this.msg.success(res.payload)
    } else {
      this.msg.error(res.payload)
    }
  }

  showDialogDisconnect (type) {
    this.setState({type: type})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('UNSAFE_componentWillReceiveProps', nextProps)
    if (nextProps.automated_options && nextProps.automated_options.twilio) {
      this.setState({SID: nextProps.automated_options.twilio.accountSID, token: nextProps.automated_options.twilio.authToken})
    }
    if (nextProps.automated_options && nextProps.automated_options.twilioWhatsApp) {
      this.setState({SIDWapp: nextProps.automated_options.twilioWhatsApp.accountSID,
        tokenWapp: nextProps.automated_options.twilioWhatsApp.authToken,
        number: nextProps.automated_options.twilioWhatsApp.sandboxNumber,
        code: nextProps.automated_options.twilioWhatsApp.sandboxCode
      })
    }
    if (nextProps.user && nextProps.user.platform === 'sms' && nextProps.automated_options && !nextProps.automated_options.twilio) {
      this.props.history.push({
        pathname: '/integrations',
        state: 'sms'
      })
    } else if (nextProps.user && nextProps.user.platform === 'whatsApp' && nextProps.automated_options && !nextProps.automated_options.twilioWhatsApp) {
      this.props.history.push({
        pathname: '/integrations',
        state: 'whatsApp'
      })
    } else if (nextProps.user && nextProps.user.platform === 'messenger' && !nextProps.user.facebookInfo) {
      this.props.history.push({
        pathname: '/integrations',
        state: 'messenger'
      })
    }
  }

  disconnect () {
    this.props.disconnect({type: this.state.type})
  }


  updateCode (e) {
    this.setState({code: e.target.value})
  }

  updateSIDWapp (e) {
    this.setState({SIDWapp: e.target.value})
  }

  updateTokenWapp (e) {
    this.setState({tokenWapp: e.target.value})
  }

  updateSID (e) {
    this.setState({SID: e.target.value})
  }

  updateToken (e) {
    this.setState({token: e.target.value})
  }

  submit () {
    this.props.updatePlatformSettings({twilio: {
      accountSID: this.state.SID,
      authToken: this.state.token
    }}, this.msg, this.clearFields, 'sms')
  }

  handleResponse (payload) {
    this.refs.connectWapp.click()
    if (payload.showModal) {
      this.refs.disconnectWhatsApp.click()
    } else {
      this.msg.success('Saved Successfully')
    }
  }

  submitWapp () {
    const regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
    if (this.state.SIDWapp === '') {
      this.msg.error('Account SID cannot be empty')
    } else if (this.state.tokenWapp === '') {
      this.msg.error('Auth Token cannot be empty')
    } else if (!this.state.number.match(regex)) {
      this.msg.error('Invalid Sandbox Number')
    } else if (this.state.code === '') {
      this.msg.error('Sandbox code cannot be empty')
    } else {
      let data = {
        changeWhatsAppTwilio: this.props.automated_options.twilioWhatsApp ? true : false,
        accountSID: this.state.SIDWapp,
        authToken: this.state.tokenWapp,
        sandboxNumber: this.state.number,
        sandboxCode: this.state.code
      }
      this.props.updatePlatformWhatsApp(data, this.msg, this.clearFieldsWapp, this.handleResponse)
    }
  }

  clearFields () {
    if (this.props.automated_options && this.props.automated_options.twilio) {
      this.setState({SID: this.props.automated_options.twilio.accountSID, token: this.props.automated_options.twilio.authToken})
    } else {
      this.setState({SID: '', token: ''})
    }
  }

  clearFieldsWapp () {
    if (this.props.automated_options && this.props.automated_options.twilioWhatsApp) {
      this.setState({SIDWapp: this.props.automated_options.twilioWhatsApp.accountSID,
        tokenWapp: this.props.automated_options.twilioWhatsApp.authToken,
        number: this.props.automated_options.twilioWhatsApp.sandboxNumber,
        code: this.props.automated_options.twilioWhatsApp.sandboxCode
      })
    } else {
      this.setState({SIDWapp: '', tokenWapp: '', code: '', number: ''})
    }
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
      <div className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <button ref='disconnectWhatsApp' style={{ marginTop: '-10px', opacity: '0.5', color: 'black', display: 'none'}} type="button" className="close" data-toggle="modal" data-target="#disconnectWhatsApp" aria-label="Close">
          <span aria-hidden="true">
            &times;
                      </span>
        </button>
        <button ref='connectWapp' style={{ marginTop: '-10px', opacity: '0.5', color: 'black', display: 'none' }} type="button" className="close" data-toggle="modal" data-target="#connectWapp" aria-label="Close">
          <span aria-hidden="true">
            &times;
                      </span>
        </button>
        <WhatsAppDeleteModal
          id='disconnectWhatsApp'
          title={`${this.state.type} WhatsApp Twilio Account`}
          content={`Are you sure you want to ${this.state.type} your WhatsApp Twilio Account? Doing so will be remove all of your subscribers, their chat history and the broadcasts you have created.`}
          deleteWithPassword={this.deleteWhatsApp}
        />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="disconnect" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Disconnect from Twilio
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div className='m-form'>
                  <span>{`Are you sure you want to disconnect from Twilio? You won't be able to send ${this.state.type} broadcasts.`}</span>
                  <div className='m-portlet__foot m-portlet__foot--fit' style={{ 'overflow': 'auto' }}>
                    <div className='m-form__actions' style={{ 'float': 'right' }}>
                      <button className='btn btn-danger' data-dismiss="modal" aria-label="Close"
                        onClick={this.disconnect}> Disconnect
                  </button>
                    </div>
                  </div>
                </div>
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)'}} className="modal fade" id="disconnectFacebook" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Disconnet Facebook Account
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Are you sure you want to disconnect your Facebook account?</p>
                <button style={{float: 'right'}}
                    className='btn btn-primary btn-sm'
                    onClick={() => {
                    this.props.disconnectFacebook()
                    this.logout()
                  }} data-dismiss='modal'>Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="connectWapp" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
              <div style={{ color: 'black' }} className="modal-body">
                <div className='m-form'>
                  <span>Please enter your Twilio credentials here:</span>
                  <div className='form-group m-form__group'>

                    <div id='question' className='form-group m-form__group'>
                      <label className='control-label'>Twilio Account SID</label>
                      <input className='form-control' value={this.state.SIDWapp} onChange={(e) => this.updateSIDWapp(e)} />
                    </div>
                    <div id='question' className='form-group m-form__group'>
                      <label className='control-label'>Twilio Auth Token:</label>
                      <input className='form-control' value={this.state.tokenWapp} onChange={(e) => this.updateTokenWapp(e)} />
                    </div>
                    <div id='question' className='form-group m-form__group'>
                      <label className='control-label'>WhatsApp Sandbox Number:</label>
                      <input className='form-control' value={this.state.number} disabled />
                    </div>
                    <div id='question' className='form-group m-form__group'>
                      <label className='control-label'>Sandbox Code:</label>
                      <input className='form-control' value={this.state.code} onChange={(e) => this.updateCode(e)} />
                    </div>
                    <span><b>Note:</b> You can find your sandbox number and code <a href='https://www.twilio.com/console/sms/whatsapp/sandbox' target='_blank' rel='noopener noreferrer'>here</a></span>
                  </div>
                  <div className='m-portlet__foot m-portlet__foot--fit' style={{ 'overflow': 'auto' }}>
                    <div className='m-form__actions' style={{ 'float': 'right' }}>
                      <button className='btn btn-primary'
                        onClick={this.submitWapp}> Submit
                  </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <div id='target' >
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Configuration
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div>
                    <div>Connect your business identity:</div>
                    <div className='m-portlet__body'>
                      <div className='tab-content'>
                        <div className='tab-pane active m-scrollable' role='tabpanel'>
                          <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                            <div style={{height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                              <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                                <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                                  <div className='tab-pane active' id='m_widget4_tab1_content'><div className='m-widget4' >
                                    {this.props.user && this.props.user.role === 'buyer' &&
                                      <div className='m-widget4__item'>
                                        <div className='m-widget4__info'>
                                          <span className='m-widget4__title'>
                                            <i className='fa fa-facebook-official' style={{fontSize: '15px'}} />&nbsp;&nbsp;&nbsp;
                                            <span>
                                              Facebook
                                            </span>
                                          </span>
                                          <br />
                                        </div>
                                        <div className='m-widget4__ext'>
                                          {this.props.user.facebookInfo
                                            ? <a href='#/' data-toggle="modal" data-target="#disconnectFacebook" className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger' style={{borderColor: '#d9534f', color: '#d9534f', marginRight: '10px'}}>
                                              Disconnect
                                            </a>
                                            : <a href='/auth/facebook' className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px'}}>
                                              Connect
                                            </a>
                                          }
                                        </div>
                                      </div>
                                    }
                                    <div className='m-widget4__item'>
                                      <div className='m-widget4__info'>
                                        <span className='m-widget4__title'>
                                          <i className='fa fa-envelope-o' style={{fontSize: '15px'}} />&nbsp;&nbsp;&nbsp;
                                          <span>
                                            SMS
                                          </span>
                                        </span>
                                        <br />
                                      </div>
                                      <div className='m-widget4__ext'>
                                        <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px'}} data-toggle="modal" data-target="#connect">
                                          {this.props.automated_options && this.props.automated_options.twilio ? 'Edit' : 'Connect'}
                                        </button>
                                      </div>
                                      {this.props.automated_options && this.props.automated_options.twilio &&
                                      <div className='m-widget4__ext'>
                                        <button className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger' style={{borderColor: '#d9534f', color: '#d9534f', marginRight: '10px'}} data-toggle="modal" data-target="#disconnect" onClick={() => { this.showDialogDisconnect('sms')} }>
                                          Disconnect
                                        </button>
                                      </div>
                                    }
                                    </div>
                                    <div className='m-widget4__item'>
                                      <div className='m-widget4__info'>
                                        <span className='m-widget4__title'>
                                          <i className='fa fa-whatsapp' style={{fontSize: '18px'}} />&nbsp;&nbsp;&nbsp;
                                          <span>
                                            WhatsApp
                                          </span>
                                        </span>
                                        <br />
                                      </div>
                                      <div className='m-widget4__ext'>
                                        <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success'
                                          style={{borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px'}}
                                          onClick={() => this.setType('Change')}>
                                          {this.props.automated_options && this.props.automated_options.twilioWhatsApp ? 'Edit' : 'Connect'}
                                        </button>
                                      </div>
                                      {this.props.automated_options && this.props.automated_options.twilioWhatsApp &&
                                      <div className='m-widget4__ext'>
                                        <button className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger'
                                          style={{borderColor: '#d9534f', color: '#d9534f', marginRight: '10px'}}
                                          onClick={() => this.setType('Disconnect')}>
                                          Disconnect
                                        </button>
                                      </div>
                                    }
                                    </div>
                                  </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
  return {
    automated_options: (state.basicInfo.automated_options),
    user: (state.basicInfo.user)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updatePlatformSettings: updatePlatformSettings,
    getAutomatedOptions: getAutomatedOptions,
    updatePlatformWhatsApp: updatePlatformWhatsApp,
    disconnect: disconnect,
    disconnectFacebook: disconnectFacebook,
    deleteWhatsApp: deleteWhatsApp
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Webhook)
