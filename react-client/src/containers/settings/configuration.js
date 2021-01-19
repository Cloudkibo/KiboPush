/* eslint-disable no-useless-constructor */
import React from 'react'
import { updatePlatformSettings, updatePlatformWhatsApp, disconnect, deleteWhatsApp } from '../../redux/actions/settings.actions'
import { getAutomatedOptions, disconnectFacebook, updateShowIntegrations } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import WhatsAppDeleteModal from '../../components/extras/deleteWithPassword'
import ConfirmationModal from '../../components/extras/confirmationModal'
import { validatePhoneNumber } from '../../utility/utils'

class Configuration extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.initialWhatsappData = {
      twilio: {
        provider: 'twilio',
        accessToken: '',
        businessNumber: '',
        accountSID: ''
      },
      flockSend: {
        provider: 'flockSend',
        accessToken: '',
        businessNumber: ''
      },
      cequens: {
        provider: 'cequens',
        accessToken: '',
        businessNumber: '',
        clientName: ''
      },
      twilioFree: {
        provider: 'twilioFree',
        accessToken: '',
        businessNumber: '+14155238886',
        accountSID: '',
        sandBoxCode: ''
      }
    }
    this.state = {
      SID: '',
      token: '',
      type: '',
      deleteType: '',
      whatsappProvider: '',
      whatsappData: JSON.parse(JSON.stringify(this.initialWhatsappData)),
      retainData: false
    }
    this.updateToken = this.updateToken.bind(this)
    this.updateSID = this.updateSID.bind(this)
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
    this.changeWhatsAppProvider = this.changeWhatsAppProvider.bind(this)
    this.updateWhatsAppData = this.updateWhatsAppData.bind(this)
    this.logout = this.logout.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.logout = this.logout.bind(this)
    this.updateData =this.updateData.bind(this)
    this.getBusinessNumber =this.getBusinessNumber.bind(this)
    props.getAutomatedOptions()
  }
  handleCheckbox (e) {
    console.log('e.target.value', e.target.checked)
    this.setState({retainData : e.target.checked})
  }
  logout() {
    this.props.history.push({
      pathname: '/facebookIntegration'
    })
    this.props.updateShowIntegrations({ showIntegrations: true })
    // auth.logout()
  }

  getBusinessNumber () {
    if (this.state.whatsappData && this.state.whatsappData.cequens && this.state.whatsappData.cequens.businessNumber) {
      return this.state.whatsappData.cequens.businessNumber
    } else {
      return '{whatsApp-number}'
    }
  }

  getBusinessNumber () {
    if (this.state.whatsappData && this.state.whatsappData.cequens && this.state.whatsappData.cequens.businessNumber) {
      return this.state.whatsappData.cequens.businessNumber
    } else {
      return '{whatsApp-number}'
    }
  }

  logout() {
    this.props.history.push({
      pathname: '/facebookIntegration'
    })
    this.props.updateShowIntegrations({ showIntegrations: true })
  }

  handleCheckbox (e) {
    console.log('e.target.value', e.target.checked)
    this.setState({retainData : e.target.checked})
  }
  updateWhatsAppData(e, data) {
    console.log('updateWhatsAppData', e)
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

  setType(type) {
    this.setState({ deleteType: type }, () => {
      if (type === 'Disconnect') {
        this.refs.disconnectWhatsApp.click()
      } else {
        this.refs.connectWapp.click()
      }
    })
  }

  deleteWhatsApp(password) {
    if (this.state.type === 'Disconnect') {
      this.props.deleteWhatsApp({ type: this.state.deleteType, password: password }, this.handleDeleteWhatsAppResponse)
    } else {
      let data = {
        accessToken: this.state.whatsappData[this.state.whatsappProvider].accessToken,
        type: this.state.deleteType,
        password: password,
        connected: !this.state.retainData,
        Date: new Date().toJSON().slice(0,10).replace(/-/g,'/')
      }
      this.props.deleteWhatsApp(data, this.handleDeleteWhatsAppResponse)
    }
  }

  handleDeleteWhatsAppResponse(res) {
    if (res.status === 'success') {
      this.refs.disconnectWhatsApp.click()
      this.msg.success(res.payload)
    } else {
      this.msg.error(res.description || res.payload)
    }
  }

  showDialogDisconnect(type) {
    this.setState({ type: type })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('UNSAFE_componentWillReceiveProps', nextProps)
    if (nextProps.automated_options && nextProps.automated_options.twilio) {
      this.setState({ SID: nextProps.automated_options.twilio.accountSID, token: nextProps.automated_options.twilio.authToken })
    }
    // console.log('nextProps.automated_options', nextProps.automated_options.whatsApp.connected)
    if (nextProps.automated_options && nextProps.automated_options.whatsApp && (nextProps.automated_options.whatsApp.connected !== false)) {
      let whatsappData = JSON.parse(JSON.stringify(this.initialWhatsappData))
      if (nextProps.automated_options.whatsApp.sandBoxCode) {
        whatsappData['twilioFree'] = nextProps.automated_options.whatsApp
      } else {
        whatsappData[nextProps.automated_options.whatsApp.provider] = nextProps.automated_options.whatsApp
      }
      this.setState({
        whatsappProvider: nextProps.automated_options.whatsApp.sandBoxCode ? 'twilioFree' : nextProps.automated_options.whatsApp.provider,
        whatsappData
      })
    }
    // if (nextProps.user && nextProps.user.platform === 'sms' && nextProps.automated_options && !nextProps.automated_options.twilio) {
    //   this.props.history.push({
    //     pathname: '/integrations',
    //     state: 'sms'
    //   })
    // } else if (nextProps.user && nextProps.user.platform === 'whatsApp' && nextProps.automated_options && !nextProps.automated_options.whatsApp) {
    //   this.props.history.push({
    //     pathname: '/integrations',
    //     state: 'whatsApp'
    //   })
    // } else if (nextProps.user && nextProps.user.platform === 'messenger' && (nextProps.user.role === 'buyer' && !nextProps.user.facebookInfo)) {
    //   this.props.history.push({
    //     pathname: '/integrations',
    //     state: 'messenger'
    //   })
    // }
  }

  disconnect() {
    this.props.disconnect({ type: this.state.type }, this.msg)
  }

  updateSID(e) {
    this.setState({ SID: e.target.value })
  }

  updateToken(e) {
    this.setState({ token: e.target.value })
  }

  submit() {
    this.props.updatePlatformSettings({
      twilio: {
        accountSID: this.state.SID,
        authToken: this.state.token
      }
    }, this.msg, this.clearFields, 'sms')
  }

  handleResponse(payload) {
    this.refs.connectWapp.click()
    this.msg.success('Saved Successfully')
  }

  updateData () {
    let whatsappData = this.state.whatsappData[this.state.whatsappProvider]
    whatsappData.connected = true
    if (whatsappData.provider === 'twilioFree') whatsappData.provider = 'twilio'
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

  clearFields() {
    if (this.props.automated_options && this.props.automated_options.twilio) {
      this.setState({ SID: this.props.automated_options.twilio.accountSID, token: this.props.automated_options.twilio.authToken })
    } else {
      this.setState({ SID: '', token: '' })
    }
  }

  clearFieldsWapp() {
    if (this.props.automated_options && this.props.automated_options.whatsApp && this.props.automated_options.whatsApp.connected !== false) {
      let whatsappData = JSON.parse(JSON.stringify(this.initialWhatsappData))
      if (this.props.automated_options.whatsApp.sandBoxCode) {
        whatsappData['twilioFree'] = this.props.automated_options.whatsApp
      } else {
        whatsappData[this.props.automated_options.whatsApp.provider] = this.props.automated_options.whatsApp
      }
      this.setState({
        whatsappProvider: this.props.automated_options.whatsApp.sandBoxCode ? 'twilioFree': this.props.automated_options.whatsApp.provider,
        whatsappData
      })
    } else {
      this.setState({
        whatsappProvider: '',
        whatsappData: this.initialWhatsappData
      })
    }
  }

  render() {
    console.log('this.state.provider', this.state.whatsappProvider)
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    const url = window.location.hostname
    return (
      <div className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <button ref='disconnectWhatsApp' style={{ marginTop: '-10px', opacity: '0.5', color: 'black', display: 'none' }} type="button" className="close" data-toggle="modal" data-target="#disconnectWhatsApp" aria-label="Close">
          <span aria-hidden="true">
            &times;
          </span>
        </button>
        <button onClick={this.clearFieldsWapp} ref='connectWapp' style={{ marginTop: '-10px', opacity: '0.5', color: 'black', display: 'none' }} type="button" className="close" data-toggle="modal" data-target="#connectWapp" aria-label="Close">
          <span aria-hidden="true">
            &times;
          </span>
        </button>
        <WhatsAppDeleteModal
          id='disconnectWhatsApp'
          title={`${this.state.deleteType} WhatsApp Account`}
          content={`Are you sure you want to ${this.state.deleteType} your WhatsApp Account? Doing so will remove all of your subscribers, their chat history and the broadcasts you have created.`}
          deleteWithPassword={this.deleteWhatsApp}
          handleCheckbox = {this.handleCheckbox}
          retainData= {this.state.retainData}
        />
        <a href='#/' style={{ display: 'none' }} ref='createModal' data-toggle='modal' data-target='#create_confirmation_modal'>DeleteModal</a>
        <ConfirmationModal
          id = 'create_confirmation_modal'
          title = 'Are You Sure?'
          description = {`You had previously connected different account from this number ${(this.props.automated_options && this.props.automated_options.whatsApp) ? this.props.automated_options.whatsApp.businessNumber: 0}. If you choose to connect the new Number then all the old data will be deleted...` }
          onConfirm = {this.updateData}
          zIndex= {99991}
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="disconnectFacebookConfiguration" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Disconnect Facebook Account
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
								  </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to disconnect your Facebook account?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.disconnectFacebook((res) => {
                      if (res.status !== 'success') {
                        this.msg.error(res.description || 'Failed to disconnect Facebook')
                      }
                    })
                    // this.logout()
                    this.props.disconnectFacebook()
                  }} data-dismiss='modal'>Yes
                  </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="connectWapp" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content" style={{width: '600px'}}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Connect with WhatsApp
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              {/* <div style={{ color: 'black' }} className="modal-body">
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
              </div> */}


              <div style={{ color: 'black' }} className="modal-body">
                <form onSubmit={this.submitWapp}>
                  <div className='m-form'>
                    <div className='form-group m-form__group'>
                      <div style={{ marginBottom: '15px' }} id='_whatsapp_provider' className='form-group m-form__group'>
                        <label className='control-label'>WhatsApp Provider:</label>
                        <select onChange={this.changeWhatsAppProvider} class="form-control m-input" value={this.state.whatsappProvider} id="_zoom_users" required>
                          <option value='' selected disabled>Select a WhatsApp Provider...</option>
                          <option value='flockSend'>FlockSend</option>
                          <option value='twilio'>Twilio</option>
                          <option value='cequens'>Cequens</option>
                          {this.props.user && this.props.user.isSuperUser &&
                            <option value='twilioFree'>Twilio (Free)</option>
                          }
                        </select>
                      </div>


                      <div style={{ display: this.state.whatsappProvider === 'flockSend' ? 'initial' : 'none' }} >
                        <div id='_flocksend_access_token' className='form-group m-form__group'>
                          <label className='control-label'>FlockSend Access Token:</label>
                          <input required={this.state.whatsappProvider === 'flockSend'} className='form-control' value={this.state.whatsappData.flockSend.accessToken} onChange={(e) => this.updateWhatsAppData(e, { accessToken: e.target.value })} />
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

                      <div style={{ display: this.state.whatsappProvider === 'cequens' ? 'initial' : 'none' }} >
                        <div id='_cequens_client_name' className='form-group m-form__group'>
                          <label className='control-label'>Client Name:</label>
                          <input required={this.state.whatsappProvider === 'cequens'} className='form-control' value={this.state.whatsappData.cequens.clientName} onChange={(e) => this.updateWhatsAppData(e, { clientName: e.target.value })} />
                        </div>
                        <div id='_cequens_access_token' className='form-group m-form__group'>
                          <label className='control-label'>API Token:</label>
                          <input required={this.state.whatsappProvider === 'cequens'} className='form-control' value={this.state.whatsappData.cequens.accessToken} onChange={(e) => this.updateWhatsAppData(e, { accessToken: e.target.value })} />
                        </div>
                        <div id='_cequens_whatsapp_number' className='form-group m-form__group'>
                          <label className='control-label'>WhatsApp Number:</label>
                          <input
                            required={this.state.whatsappProvider === 'cequens'}
                            type="tel"
                            className='form-control'
                            value={this.state.whatsappData.cequens.businessNumber}
                            onChange={(e) => this.updateWhatsAppData(e, { businessNumber: e.target.value })} />
                        </div>
                        <span><b>Note:</b> Please add this webhook url </span>
                        <span>"https://webhook.cloudkibo.com/webhooks/cequens/{this.getBusinessNumber()}"</span>
                        <span> to your cequens WhatsApp configuration.</span>
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
                          <label className='control-label'>WhatsApp Number:</label>
                          <input required={this.state.whatsappProvider === 'twilio'} className='form-control' value={this.state.whatsappData.twilio.businessNumber} onChange={(e) => this.updateWhatsAppData(e, { businessNumber: e.target.value })} />
                        </div>
                      </div>

                      <div style={{ display: this.state.whatsappProvider === 'twilioFree' ? 'initial' : 'none' }}>
                        <div id='question' className='form-group m-form__group'>
                          <label className='control-label'>Twilio Account SID</label>
                          <input required={this.state.whatsappProvider === 'twilioFree'} className='form-control' value={this.state.whatsappData.twilioFree.accountSID} onChange={(e) => this.updateWhatsAppData(e, { accountSID: e.target.value })} />
                        </div>
                        <div id='question' className='form-group m-form__group'>
                          <label className='control-label'>Twilio Auth Token:</label>
                          <input required={this.state.whatsappProvider === 'twilioFree'} className='form-control' value={this.state.whatsappData.twilioFree.accessToken} onChange={(e) => this.updateWhatsAppData(e, { accessToken: e.target.value })} />
                        </div>
                        <div id='question' className='form-group m-form__group'>
                          <label className='control-label'>WhatsApp Sandbox Number:</label>
                          <input required={this.state.whatsappProvider === 'twilioFree'} className='form-control' value={this.state.whatsappData.twilioFree.businessNumber} disabled />
                        </div>
                        <div id='question' className='form-group m-form__group'>
                          <label className='control-label'>Sandbox Code:</label>
                          <input required={this.state.whatsappProvider === 'twilioFree'} className='form-control' value={this.state.whatsappData.twilioFree.sandBoxCode} onChange={(e) => this.updateWhatsAppData(e, { sandBoxCode: e.target.value })} />
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
                              <div style={{ height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom' }} className='m-messenger__messages'>
                                <div style={{ position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr' }}>
                                  <div style={{ position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto' }} >
                                    <div className='tab-pane active' id='m_widget4_tab1_content'><div className='m-widget4' >
                                      {this.props.user && this.props.user.role === 'buyer' &&
                                        <div className='m-widget4__item'>
                                          <div className='m-widget4__info'>
                                            <span className='m-widget4__title'>
                                              <i className='fa fa-facebook-official' style={{ fontSize: '15px' }} />&nbsp;&nbsp;&nbsp;
                                            <span>
                                                Facebook
                                            </span>
                                            </span>
                                            <br />
                                          </div>
                                          <div className='m-widget4__ext'>
                                            {this.props.user.facebookInfo && this.props.user.connectFacebook
                                              ? <a href='#/' data-toggle="modal" data-target="#disconnectFacebookConfiguration" className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger' style={{ borderColor: '#d9534f', color: '#d9534f', marginRight: '10px' }}>                                                Disconnect
                                            </a>
                                              : <a href='/auth/facebook' className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{ borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px' }}>
                                                Connect
                                            </a>
                                            }
                                          </div>
                                        </div>
                                      }
                                      {(url.includes('kiboengage.cloudkibo.com') || url.includes('kibochat.cloudkibo.com') || url.includes('localhost')) &&
                                        <div className='m-widget4__item'>
                                          <div className='m-widget4__info'>
                                            <span className='m-widget4__title'>
                                              <i className='fa fa-envelope-o' style={{ fontSize: '15px' }} />&nbsp;&nbsp;&nbsp;
                                          <span>
                                                SMS
                                          </span>
                                            </span>
                                            <br />
                                          </div>
                                          <div className='m-widget4__ext'>
                                            <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{ borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px' }} data-toggle="modal" data-target="#connect">
                                              {this.props.automated_options && this.props.automated_options.twilio ? 'Edit' : 'Connect'}
                                            </button>
                                          </div>
                                          {this.props.automated_options && this.props.automated_options.twilio &&
                                            <div className='m-widget4__ext'>
                                              <button className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger' style={{ borderColor: '#d9534f', color: '#d9534f', marginRight: '10px' }} data-toggle="modal" data-target="#disconnect" onClick={() => { this.showDialogDisconnect('sms') }}>
                                                Disconnect
                                        </button>
                                            </div>
                                          }
                                        </div>
                                      }
                                      {(url.includes('kiboengage.cloudkibo.com') || url.includes('kibochat.cloudkibo.com') || url.includes('localhost')) &&
                                        <div className='m-widget4__item'>
                                          <div className='m-widget4__info'>
                                            <span className='m-widget4__title'>
                                              <i className='fa fa-whatsapp' style={{ fontSize: '18px' }} />&nbsp;&nbsp;&nbsp;
                                          <span>
                                                WhatsApp
                                          </span>
                                            </span>
                                            <br />
                                          </div>
                                          <div className='m-widget4__ext'>
                                            <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success'
                                              style={{ borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px' }}
                                              onClick={() => this.setType('Change')}>
                                              {this.props.automated_options && this.props.automated_options.whatsApp ? this.props.automated_options.whatsApp.connected === false ? 'Connect' : 'Edit' : 'Connect'}
                                            </button>
                                          </div>
                                          {this.props.automated_options && this.props.automated_options.whatsApp && (!(this.props.automated_options.whatsApp.connected === false)) &&
                                            <div className='m-widget4__ext'>
                                              <button className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger'
                                                style={{ borderColor: '#d9534f', color: '#d9534f', marginRight: '10px' }}
                                                onClick={() => this.setType('Disconnect')}>
                                                Disconnect
                                        </button>
                                            </div>
                                          }
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
      </div >
    )
  }
}
function mapStateToProps(state) {
  return {
    automated_options: (state.basicInfo.automated_options),
    user: (state.basicInfo.user)
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updatePlatformSettings: updatePlatformSettings,
    getAutomatedOptions: getAutomatedOptions,
    updatePlatformWhatsApp: updatePlatformWhatsApp,
    disconnect: disconnect,
    disconnectFacebook: disconnectFacebook,
    deleteWhatsApp: deleteWhatsApp,
    updateShowIntegrations
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Configuration)
