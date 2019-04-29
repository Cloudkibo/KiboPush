/* eslint-disable no-useless-constructor */
import React from 'react'
import { updatePlatformSettings, updatePlatformWhatsApp } from '../../redux/actions/settings.actions'
import { getAutomatedOptions } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class Webhook extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      isShowingModalWapp: false,
      SID: '',
      token: '',
      SIDWapp: '',
      tokenWapp: '',
      number: '',
      code: ''
    }
    this.closeDialog = this.closeDialog.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialogWapp = this.closeDialogWapp.bind(this)
    this.showDialogWapp = this.showDialogWapp.bind(this)
    this.updateToken = this.updateToken.bind(this)
    this.updateSID = this.updateSID.bind(this)
    this.updateTokenWapp = this.updateTokenWapp.bind(this)
    this.updateSIDWapp = this.updateSIDWapp.bind(this)
    this.updateCode = this.updateCode.bind(this)
    this.updateNumber = this.updateNumber.bind(this)
    this.submit = this.submit.bind(this)
    this.submitWapp = this.submitWapp.bind(this)
    this.clearFields = this.clearFields.bind(this)

    props.getAutomatedOptions()
  }
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps', nextProps)
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
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  showDialogWapp () {
    this.setState({isShowingModalWapp: true})
  }

  closeDialogWapp () {
    this.setState({isShowingModalWapp: false})
  }

  updateNumber (e) {
    this.setState({number: e.target.value})
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
    this.setState({isShowingModal: false})
    this.props.updatePlatformSettings({twilio: {
      accountSID: this.state.SID,
      authToken: this.state.token
    }}, this.msg, this.clearFields)
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
      this.setState({isShowingModalWapp: false})
      this.props.updatePlatformWhatsApp({
        accountSID: this.state.SIDWapp,
        authToken: this.state.tokenWapp,
        sandboxNumber: this.state.number,
        sandboxCode: this.state.code
      }, this.msg, this.clearFieldsWapp)
    }
  }

  clearFields () {
    console.log('in clearFields')
    if (this.props.automated_options && this.props.automated_options.twilio) {
      this.setState({SID: this.props.automated_options.twilio.accountSID, token: this.props.automated_options.twilio.authToken})
    } else {
      this.setState({SID: '', token: ''})
    }
  }

  clearFieldsWapp () {
    if (this.props.automated_options && this.props.propsProps.automated_options.twilioWhatsApp) {
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
    console.log('this.state.SID', this.state.SID)
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
                      {
                        this.state.isShowingModal &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialog}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialog}>
                            <h3>Connect with Twilio</h3>
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
                                  <button className='btn btn-primary'
                                    onClick={this.submit}> Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </ModalDialog>
                        </ModalContainer>
                      }
                      {
                        this.state.isShowingModalWapp &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialogWapp}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialogWapp}>
                            <h3>Connect with Twilio WhatsApp</h3>
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
                                  <input className='form-control' value={this.state.number} onChange={(e) => this.updateNumber(e)} />
                                </div>
                                <div id='question' className='form-group m-form__group'>
                                  <label className='control-label'>Sandbox Code:</label>
                                  <input className='form-control' value={this.state.code} onChange={(e) => this.updateCode(e)} />
                                </div>
                                <span><b>Note:</b> You can find your sandbox number and code <a href='https://www.twilio.com/console/sms/whatsapp/sandbox' target='_blank'>here</a></span>
                              </div>
                              <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                                <div className='m-form__actions' style={{'float': 'right'}}>
                                  <button className='btn btn-primary'
                                    onClick={this.submitWapp}> Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </ModalDialog>
                        </ModalContainer>
                      }
                      <div className='tab-content'>
                        <div className='tab-pane active m-scrollable' role='tabpanel'>
                          <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                            <div style={{height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                              <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                                <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                                  <div className='tab-pane active' id='m_widget4_tab1_content'><div className='m-widget4' >
                                    <div className='m-widget4__item'>
                                      <div className='m-widget4__info'>
                                        <span className='m-widget4__title'>
                                          <i className='flaticon-chat-1' />&nbsp;&nbsp;&nbsp;
                                          <span>
                                            SMS
                                          </span>
                                        </span>
                                        <br />
                                      </div>
                                      <div className='m-widget4__ext'>
                                        <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px'}} onClick={this.showDialog}>
                                          {this.props.automated_options && this.props.automated_options.twilio ? 'Edit' : 'Connect'}
                                        </button>
                                      </div>
                                    </div>
                                    <div className='m-widget4__item'>
                                      <div className='m-widget4__info'>
                                        <span className='m-widget4__title'>
                                          <i className='flaticon-chat-1' />&nbsp;&nbsp;&nbsp;
                                          <span>
                                            WhatsApp
                                          </span>
                                        </span>
                                        <br />
                                      </div>
                                      <div className='m-widget4__ext'>
                                        <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px'}} onClick={this.showDialogWapp}>
                                          {this.props.automated_options && this.props.automated_options.twilioWhatsApp ? 'Edit' : 'Connect'}
                                        </button>
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
    automated_options: (state.basicInfo.automated_options)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updatePlatformSettings: updatePlatformSettings,
    getAutomatedOptions: getAutomatedOptions,
    updatePlatformWhatsApp: updatePlatformWhatsApp
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Webhook)
