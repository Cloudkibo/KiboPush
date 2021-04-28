import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from '../../wizard/header'
import AlertContainer from 'react-alert'
import SIDEBAR from '../sidebar'
import { updatePlatformWhatsApp, setSuperNumber } from '../../../redux/actions/settings.actions'
import { validatePhoneNumber } from '../../../utility/utils'
import { Link } from 'react-router-dom'

class WhatsAppProvidersScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.initialWhatsappData = {
      twilio: {
        provider: 'twilio',
        accessToken: '',
        businessNumber: '',
        accountSID: '',
        sandBoxCode: ''
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
      gupshup: {
        provider: 'gupshup',
        accessToken: '',
        businessNumber: '',
        appName: ''
      },
      twilioFree: {
        provider: 'twilioFree',
        accessToken: '',
        businessNumber: '+14155238886',
        accountSID: '',
        sandBoxCode: ''
      },
    }
    this.state = {
      whatsappData: JSON.parse(JSON.stringify(this.initialWhatsappData)),
      usage: 'superNumber',
      whatsappProvider: ''
    }
    this.handleUsage = this.handleUsage.bind(this)
    this.changeWhatsAppProvider = this.changeWhatsAppProvider.bind(this)
    this.getBusinessNumber = this.getBusinessNumber.bind(this)
    this.getFirstInput = this.getFirstInput.bind(this)
    this.getSecondInput = this.getSecondInput.bind(this)
    this.updateWhatsAppData = this.updateWhatsAppData.bind(this)
    this.getNote = this.getNote.bind(this)
    this.submitWapp = this.submitWapp.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }

  handleResponse () {
    this.props.history.push({
      pathname: '/whatsAppFinishScreen'
    })
  }

  submitWapp(event) {
    event.preventDefault()
    if (this.state.usage === 'superNumber') {
      this.props.setSuperNumber(this.msg, this.handleResponse)
    } else {
      let whatsappData = this.state.whatsappData[this.state.whatsappProvider]
      whatsappData.connected = true
      if (whatsappData.provider === 'twilioFree') whatsappData.provider = 'twilio'
      this.props.updatePlatformWhatsApp(whatsappData, this.msg, null, this.handleResponse)
    }
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

  updateData () {
    let whatsappData = this.state.whatsappData[this.state.whatsappProvider]
    whatsappData.connected = true
    if (whatsappData.provider === 'twilioFree') whatsappData.provider = 'twilio'
    this.props.updatePlatformWhatsApp(whatsappData, this.msg, null, this.handleResponse)
  }

  changeWhatsAppProvider(e) {
    this.setState({
      whatsappProvider: e.target.value
    })
  }

  handleUsage (e) {
    this.setState({usage: e.target.value})
  }

  updateState (state) {
    this.setState(state)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Configure WhatsApp`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    $('#headerDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  getBusinessNumber () {
    if (this.state.whatsappData && this.state.whatsappData.cequens && this.state.whatsappData.cequens.businessNumber) {
      return this.state.whatsappData.cequens.businessNumber
    } else {
      return '{whatsApp-number}'
    }
  }

  getFirstInput () {
    if (this.state.whatsappProvider === 'twilio' || this.state.whatsappProvider === 'twilioFree') {
      return ({provider: 'twilio', label: 'Account SID', value: 'accountSID'})
    } else if (this.state.whatsappProvider === 'cequens') {
      return ({provider: 'cequens', label: 'Client Name', value: 'clientName'})
    } else if (this.state.whatsappProvider === 'gupshup') {
      return ({provider: 'gupshup', label: 'App Name', value: 'appName'})
    }
  }

  getSecondInput () {
    if (this.state.whatsappProvider === 'flockSend') {
      return ({provider: 'flockSend', label: 'Access Token'})
    } else if (this.state.whatsappProvider === 'twilio') {
      return ({provider: 'twilio', label: 'Auth Token'})
    } else if (this.state.whatsappProvider === 'twilioFree') {
      return ({provider: 'twilioFree', label: 'Sandbox Number'})
    } else if (this.state.whatsappProvider === 'cequens') {
      return ({provider: 'cequens', label: 'API Token'})
    } else if (this.state.whatsappProvider === 'gupshup') {
      return ({provider: 'gupshup', label: 'API Key'})
    }
  }

  getNote () {
    if (this.state.whatsappProvider === 'twilioFree' || this.state.whatsappProvider === 'cequens' || this.state.whatsappProvider === 'gupshup') {
      return (
        <div>
          <label style={{fontWeight: 'normal'}}>Note:</label>&nbsp;&nbsp;
          {this.state.whatsappProvider === 'twilioFree' &&
            <span>You can find your sandbox code <a href='https://www.twilio.com/console/sms/whatsapp/sandbox' target='_blank' rel='noopener noreferrer'>here</a></span>  
          }
          {this.state.whatsappProvider === 'cequens' &&
            <span>Please add this webhook url "https://webhook.cloudkibo.com/webhooks/cequens/{this.getBusinessNumber()}" as callback URL in your Cequens WhatsApp configuration</span>  
          }
          {this.state.whatsappProvider === 'gupshup' &&
            <span>Please add this webhook url "https://webhook.cloudkibo.com/webhooks/gupshup" as callback URL in your Gupshup settings</span>  
          }
        </div>
      )
    } else {
      return null
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
      <div>
        <Header showTitle hideMessages hideSettings />
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin"
        style={{ height: 'calc(100vh - 130px)', margin: '30px'}}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <SIDEBAR 
            heading='Configure WhatsApp Channel'
            description='Reach out to 2 billion WhatsApp users to grow your business!'
          />
          <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem'}}>
            <h2> Step 3: Provider Configuration </h2>
            <br />
            <form onSubmit={this.submitWapp}>
              <div className='form-group m-form__group'>
                <label style={{fontWeight: 'normal'}}>Select Usage:</label>
                <div style={{marginTop: '5px'}}>
                  <label className="m-radio" style={{fontWeight: 'lighter'}}>
                    <input
                      type='radio'
                      value='superNumber'
                      onChange={this.handleUsage}
                      onClick={this.handleUsage}
                      checked={this.state.usage === 'superNumber'}
                      />
                    Use Cloudkibo’s WhatsApp number for Commerce (shopify)
                    <span></span>
                  </label>
                  <label className="m-radio" style={{fontWeight: 'lighter'}}>
                    <input
                      type='radio'
                      value='businessAPI'
                      onChange={this.handleUsage}
                      onClick={this.handleUsage}
                      checked={this.state.usage === 'businessAPI'}
                    />
                      Use Whatsapp Business API
                    <span></span>
                  </label>
                </div>
                {this.state.usage === 'businessAPI' &&
                  <div>
                    <div style={{ marginBottom: '15px' }} id='_whatsapp_provider' className='form-group m-form__group'>
                      <label style={{fontWeight: 'normal'}} className='control-label'>WhatsApp Provider:</label>
                      <select onChange={this.changeWhatsAppProvider} class="form-control m-input" value={this.state.whatsappProvider} id="_zoom_users" required>
                        <option value='' selected disabled>Select a WhatsApp Provider...</option>
                        <option value='flockSend'>FlockSend</option>
                        <option value='twilio'>Twilio</option>
                        <option value='cequens'>Cequens</option>
                        <option value='gupshup'>Gupshup</option>
                          {this.props.user && this.props.user.isSuperUser &&
                            <option value='twilioFree'>Twilio (Free)</option>
                          }
                      </select>
                    </div>
                    {this.state.whatsappProvider &&
                      <div>
                        {this.state.whatsappProvider !== 'flockSend' &&
                          <div className='form-group m-form__group'>
                            <label style={{fontWeight: 'normal'}} className='control-label'>{this.getFirstInput().label}:</label>
                            <input required className='form-control' 
                              value={this.state.whatsappData[this.getFirstInput().provider][this.getFirstInput().value]}
                              onChange={(e) => {
                                this.updateWhatsAppData(e, { [this.getFirstInput().value]: e.target.value })
                              }} />
                          </div>
                        }
                        <div className='form-group m-form__group'>
                          <label style={{fontWeight: 'normal'}} className='control-label'>{this.getSecondInput().label}:</label>
                          <input required className='form-control' value={this.state.whatsappData[this.getSecondInput().provider].accessToken}
                          onChange={(e) => this.updateWhatsAppData(e, { accessToken: e.target.value })} />
                        </div>
                        <div className='form-group m-form__group'>
                          <label style={{fontWeight: 'normal'}} className='control-label'>WhatsApp Number:</label>
                          <input
                            required
                            type="tel"
                            className='form-control'
                            value={this.state.whatsappData[this.getSecondInput().provider].businessNumber}
                            onChange={(e) => this.updateWhatsAppData(e, { businessNumber: e.target.value })} />
                        </div>
                        {this.state.whatsappProvider === 'twilioFree' &&
                          <div className='form-group m-form__group'>
                            <label style={{fontWeight: 'normal'}} className='control-label'>Sandbox Code:</label>
                            <input className='form-control' value={this.state.whatsappData.twilioFree.sandBoxCode} onChange={(e) => this.updateWhatsAppData(e, { sandBoxCode: e.target.value })} />
                          </div>
                        }
                        {this.getNote()}
                      </div>
                    }
                    </div>
                  }
                </div>
                <br />
                <div className='row'>
                  <div className='col-lg-6 m--align-left'>
                    <Link to='/whatsAppBillingScreen' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                      <span>
                        <i className='la la-arrow-left' />
                        <span>Back</span>&nbsp;&nbsp;
                      </span>
                    </Link>
                  </div>
                  <div className='col-lg-6 m--align-right'>
                    <button type='submit' className='btn btn-success m-btn m-btn--custom m-btn--icon'>
                      <span>
                        <span>Next</span>&nbsp;&nbsp;
                        <i className='la la-arrow-right' />
                      </span>
                    </button>
                  </div>
                </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updatePlatformWhatsApp,
    setSuperNumber
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(WhatsAppProvidersScreen)
