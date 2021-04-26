/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { validatePhoneNumber, validateSmsProviderInput } from '../../utility/utils'
import AlertContainer from 'react-alert'
import Header from '../wizard/header'
import { configureSMS, connectSMS } from '../../redux/actions/channelOnboarding.actions'
import { Link } from 'react-router-dom'

class SmsProviderScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.initialSmsData = {
      twilio: {
        provider: 'twilio',
        authToken: '',
        businessNumber: '',
        accountSID: '',
        sandBoxCode: '',
        messages: ''
      },
      bandwidth: {
        provider: 'bandwidth',
        accountType: 'user',
        accountStatus: 'pending',
        accountId: '',
        username: '',
        password: '',
        businessNumber: '',
        appId: '',
        messages: ''
      }
    }
    this.state = {
      smsProvider: '',
      smsData: JSON.parse(JSON.stringify(this.initialSmsData))
    }
    this.changeSmsProvider = this.changeSmsProvider.bind(this)
    this.updateSmsData = this.updateSmsData.bind(this)
    this.nextBtnAction = this.nextBtnAction.bind(this)
  }

  updateSmsData(e, data) {
    if (data.businessNumber) {
      if (!validatePhoneNumber(data.businessNumber)) {
        e.target.setCustomValidity('Please enter a valid SMS number')
      } else {
        e.target.setCustomValidity('')
      }
    }
    let smsData = this.state.smsData
    smsData[this.state.smsProvider] = { ...smsData[this.state.smsProvider], ...data }
    this.setState({
      smsData
    })
  }

  changeSmsProvider(e) {
    this.setState({
      smsProvider: e.target.value
    })
  }

  nextBtnAction () {
    if (validateSmsProviderInput(this.state)) {
      let smsData = this.state.smsData[this.state.smsProvider]

      if (isNaN(parseInt(smsData.messages))) {
        return this.msg.error('Expected messages count should be number only. Please enter valid number.')
      }

      this.props.connectSMS(smsData, (res) => {
        if (res.status === 'success') {
          this.props.configureSMS({
            planId: this.props.channelOnboarding.planId,
            planUniqueId: this.props.channelOnboarding.planUniqueId,
            stripeToken: this.props.channelOnboarding.stripeToken,
            platform: this.props.channelOnboarding.platform
          }, (res) => {
            if (res.status === 'success') {
              this.props.history.push({
                pathname: '/smsFinishScreen'
              })
            } else {
              this.msg.error(res.payload || 'Failed to configure sms integrations')
            }
          })
        } else {
          this.msg.error(res.description || res.payload || 'Failed to connect Sms')
        }
      })
    } else {
      this.msg.error('Please fill all the required fields')
    }
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Select SMS Provider`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    $('#headerDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  UNSAFE_componentWillReceiveProps (nextprops) {
    if (nextprops.successMessage && this.state.step !== 0) {
      //  this.generateAlert('success', nextprops.successMessage)
      this.msg.success('Message sent successfully!')
    } else if (nextprops.errorMessage && this.state.step !== 0) {
      this.msg.success('Message not sent!')
      //  this.generateAlert('danger', nextprops.errorMessage)
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
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin" style={{ height: 'calc(100vh - 70px)' }}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <div className="m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1	m-login__content" style={{backgroundImage: 'url(https://cdn.cloudkibo.com/public/assets/app/media/img//bg/bg-4.jpg)'}}>
            <div className="m-grid__item m-grid__item--middle">
              <h3 className="m-login__welcome">
                Configure SMS Channel
              </h3>
              <p className="m-login__msg">
                Get connected with your contacts with a 98%
                <br />
                open rate of sms
              </p>
            </div>
          </div>
          <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem'}}>
            <h2>Step 3: Choose Sms Provider</h2>
            <br />
            <div style={{ marginBottom: '15px' }} id='_whatsapp_provider' className='form-group m-form__group'>
              <label className='control-label' style={{ fontWeight: 'normal' }}>Select SMS Provider:</label>
              <select onChange={this.changeSmsProvider} className="form-control m-input" value={this.state.smsProvider} id="_zoom_users" required>
                <option value='' selected disabled>Select a SMS Provider...</option>
                <option value='bandwidth'>BandWidth</option>
                <option value='twilio'>Twilio</option>
              </select>
            </div>
            {
            }
            <div style={{ display: this.state.smsProvider === 'twilio' ? 'initial' : 'none' }}>
              <div id='question' className='form-group m-form__group'>
                <label className='control-label' style={{ fontWeight: 'normal' }}>Twilio Account SID</label>
                <input required={this.state.smsProvider === 'twilio'} className='form-control' value={this.state.smsData.twilio.accountSID} onChange={(e) => this.updateSmsData(e, { accountSID: e.target.value })} />
              </div>
              <div id='question' className='form-group m-form__group'>
                <label className='control-label' style={{ fontWeight: 'normal' }}>Twilio Auth Token:</label>
                <input required={this.state.smsProvider === 'twilio'} className='form-control' value={this.state.smsData.twilio.authToken} onChange={(e) => this.updateSmsData(e, { authToken: e.target.value })} />
              </div>
              <div id='question' className='form-group m-form__group'>
                <label className='control-label' style={{ fontWeight: 'normal' }}>SMS Number:</label>
                <input className='form-control' value={this.state.smsData.twilio.businessNumber} onChange={(e) => this.updateSmsData(e, { businessNumber: e.target.value })} />
              </div>
              <div id='question' className='form-group m-form__group'>
                <label className='control-label' style={{ fontWeight: 'normal' }}>Expected Messages Count:</label>
                <input className='form-control' value={this.state.smsData.twilio.messages} onChange={(e) => this.updateSmsData(e, { messages: e.target.value })} />
              </div>
            </div>
            {
            }
            <div style={{ display: this.state.smsProvider === 'bandwidth' ? 'initial' : 'none' }}>
              <div id='question' className='form-group m-form__group'>
                <label className='control-label' style={{ fontWeight: 'normal' }}>BandWidth Account ID</label>
                <input required={this.state.smsProvider === 'bandwidth'} className='form-control' value={this.state.smsData.bandwidth.accountId} onChange={(e) => this.updateSmsData(e, { accountId: e.target.value })} />
              </div>
              <div id='question' className='form-group m-form__group'>
                <label className='control-label' style={{ fontWeight: 'normal' }}>BandWidth App ID</label>
                <input required={this.state.smsProvider === 'bandwidth'} className='form-control' value={this.state.smsData.bandwidth.appId} onChange={(e) => this.updateSmsData(e, { appId: e.target.value })} />
              </div>
              <div id='question' className='form-group m-form__group'>
                <label className='control-label' style={{ fontWeight: 'normal' }}>BandWidth Username:</label>
                <input required={this.state.smsProvider === 'bandwidth'} className='form-control' value={this.state.smsData.bandwidth.username} onChange={(e) => this.updateSmsData(e, { username: e.target.value })} />
              </div>
              <div id='question' className='form-group m-form__group'>
                <label className='control-label' style={{ fontWeight: 'normal' }}>BandWidth Password:</label>
                <input className='form-control' value={this.state.smsData.bandwidth.password} onChange={(e) => this.updateSmsData(e, { password: e.target.value })} />
              </div>
              <div id='question' className='form-group m-form__group'>
                <label className='control-label' style={{ fontWeight: 'normal' }}>SMS Number:</label>
                <input className='form-control' value={this.state.smsData.bandwidth.businessNumber} onChange={(e) => this.updateSmsData(e, { businessNumber: e.target.value })} />
              </div>
              <div id='question' className='form-group m-form__group'>
                <label className='control-label' style={{ fontWeight: 'normal' }}>Expected Messages Count:</label>
                <input className='form-control' value={this.state.smsData.bandwidth.messages} onChange={(e) => this.updateSmsData(e, { messages: e.target.value })} />
              </div>
            </div>
            {
            }
            <br />
            <div className='row'>
              <div className='col-lg-6 m--align-left' >
                <Link to='/smsBillingScreen' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                  <span>
                    <i className='la la-arrow-left' />
                    <span>Back</span>&nbsp;&nbsp;
                  </span>
                </Link>
              </div>
              <div className='col-lg-6 m--align-right'>
                <button className='btn btn-success m-btn m-btn--custom m-btn--icon' onClick={this.nextBtnAction}>
                  <span>
                    <span>Next</span>&nbsp;&nbsp;
                    <i className='la la-arrow-right' />
                  </span>
                </button>
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
    user: (state.basicInfo.user),
    channelOnboarding: (state.channelOnboarding)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    configureSMS,
    connectSMS
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SmsProviderScreen)
