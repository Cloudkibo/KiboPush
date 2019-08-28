/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { enable, disable, reset, getAPI, saveSwitchState, getNGP, enableNGP, disableNGP, saveNGP } from '../../redux/actions/settings.actions'
import ResetPassword from './resetPassword'
import GreetingMessage from './greetingMessage'
import WelcomeMessage from './welcomeMessage'
import ShowPermissions from './showPermissions'
import ConnectFb from './connectFb'
import Billing from './billing'
import PaymentMethods from './paymentMethods'
import ResponseMethods from './responseMethods'
import DeleteUserData from './deleteUserData'
import Webhook from './webhooks'
import Configuration from './configuration'
import YouTube from 'react-youtube'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import UploadCustomerInformation from './uploadCustomerInformation'
import WhiteListDomains from './whitelistDomains'

class Settings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      type: 'password',
      APIKey: '',
      APISecret: '',
      NGPKey: '',
      NGPSecret: '',
      buttonText: 'Show',
      disable: true,
      ngpDisable: true,
      buttonState: '',
      ngpButtonState: '',
      count: 1,
      count1: 0,
      count_ngp: 1,
      count1_ngp: 0,
      firstTime: true,
      firstTimeNGP: true,
      resetPassword: false,
      showAPIbyPlan: true,
      saveState: null,
      saveStateNGP: null,
      planInfo: '',
      show: true,
      openTab: 'configuration',
      pro: false,
      isShowingModal: false,
      isDisableInput: false,
      isDisableButton: false,
      isKiboChat: false,
      hideAPI: true
    }
    this.changeType = this.changeType.bind(this)
    this.initializeSwitch = this.initializeSwitch.bind(this)
    this.initializeSwitchNGP = this.initializeSwitchNGP.bind(this)
    this.setReset = this.setReset.bind(this)
    this.setResetPass = this.setResetPass.bind(this)
    this.setConfiguration = this.setConfiguration.bind(this)
    this.setAPI = this.setAPI.bind(this)
    this.setNGP = this.setNGP.bind(this)
    this.setConnectFb = this.setConnectFb.bind(this)
    this.setGreetingMessage = this.setGreetingMessage.bind(this)
    this.setWelcomeMessage = this.setWelcomeMessage.bind(this)
    this.setBilling = this.setBilling.bind(this)
    this.setWebhook = this.setWebhook.bind(this)
    this.setPayementMethods = this.setPayementMethods.bind(this)
    this.setPermissions = this.setPermissions.bind(this)
    this.setWhiteListDomains = this.setWhiteListDomains.bind(this)
    this.getPlanInfo = this.getPlanInfo.bind(this)
    this.handleNGPKeyChange = this.handleNGPKeyChange.bind(this)
    this.handleNGPSecretChange = this.handleNGPSecretChange.bind(this)
    this.setResponseMethods = this.setResponseMethods.bind(this)
    this.setDeleteUserData = this.setDeleteUserData.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.setUploadCustomerFile = this.setUploadCustomerFile.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentWillMount () {
    let url = window.location.hostname
    console.log('this.props.location', this.props.location)
    if (url === 'skibochat.cloudkibo.com' || url === 'kibochat.cloudkibo.com') {
      console.log('kibochat')
      this.setState({isKiboChat: true})
    }
    if (this.props.location && this.props.location.state && this.props.location.state.module === 'addPages') {
      this.setState({
        openTab: 'connectFb'
      })
    }
    if (this.props.location && this.props.location.state && this.props.location.state.module === 'welcome') {
      this.setState({
        openTab: 'welcomeMessage', show: false
      })
    }
    if (this.props.location && this.props.location.state && this.props.location.state.module === 'webhook') {
      this.setState({
        openTab: 'webhook', show: false
      })
    }
    if (this.props.location && this.props.location.state && this.props.location.state.module === 'pro') {
      this.setState({
        openTab: 'billing', show: false, pro: true
      })
    }
    if (this.props.location && this.props.location.state && this.props.location.state.module === 'whitelistDomains') {
      this.setState({
        openTab: 'whitelistDomains', show: false
      })
    }
    this.props.getuserdetails()
    this.props.getAPI({company_id: this.props.user._id})
    this.props.getNGP({company_id: this.props.user.companyId})
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }
  closeDialog () {
    this.setState({isShowingModal: false})
  }
  goToSettings () {
    this.setState({
      isShowingModal: false, openTab: 'billing', show: false, pro: true
    })
  }
  handleNGPKeyChange (event) {
    this.setState({NGPKey: event.target.value})
    if (event.target.value.toString().trim() !== '' && this.state.NGPSecret.toString().trim() !== '') {
      this.setState({isDisableButton: false})
    } else {
      this.setState({isDisableButton: true})
    }
  }
  handleNGPSecretChange (event) {
    this.setState({NGPSecret: event.target.value})

    if (event.target.value.toString().trim() !== '' && this.state.NGPKey.toString().trim() !== '') {
      this.setState({isDisableButton: false})
    } else {
      this.setState({isDisableButton: true})
    }
  }
  getPlanInfo (plan) {
    this.setState({show: false})
    var planInfo
    if (plan === 'plan_A') {
      planInfo = 'Individual, Premium Account'
    } else if (plan === 'plan_B') {
      planInfo = 'Individual, Free Account'
      this.setState({showAPIbyPlan: false, openTab: 'resetPassword'})
    } else if (plan === 'plan_C') {
      planInfo = 'Team, Premium Account'
    } else if (plan === 'plan_D') {
      this.setState({showAPIbyPlan: false, openTab: 'resetPassword'})
      planInfo = 'Team, Free Account)'
    } else {
      planInfo = ''
    }
    this.setState({planInfo: planInfo})
  }
  setAPI () {
    this.props.saveSwitchState()
    this.setState({
      openTab: 'showAPI'
    }, () => {
      this.initializeSwitch(this.state.buttonState)
    })
  }
  setNGP () {
    this.setState({
      openTab: 'showNGP'
    }, () => {
      this.initializeSwitchNGP(this.state.ngpButtonState)
    })
  }
  setWhiteListDomains () {
    this.setState({
      openTab: 'whitelistDomains'
    })
  }
  setResetPass () {
    this.setState({
      openTab: 'resetPassword'
    })
  }
  setConfiguration () {
    this.setState({
      openTab: 'configuration'
    })
  }
  setPermissions () {
    this.setState({
      openTab: 'permissions'
    })
  }
  setGreetingMessage () {
    this.setState({
      openTab: 'greetingMessage'
    })
  }
  setUploadCustomerFile () {
    this.setState({
      openTab: 'uploadCustomerInformation'
    })
  }
  setBilling () {
    this.setState({
      openTab: 'billing', show: false
    })
  }
  setWebhook () {
    this.setState({
      openTab: 'webhook'
    })
  }
  setPayementMethods () {
    this.setState({
      openTab: 'paymentMethods'
    })
  }
  setConnectFb () {
    this.setState({
      openTab: 'connectFb'
    })
  }
  setWelcomeMessage () {
    this.setState({
      openTab: 'welcomeMessage'
    })
  }
  setResponseMethods () {
    this.setState({
      openTab: 'responseMethods'
    })
  }
  setDeleteUserData () {
    this.setState({
      openTab: 'deleteUserData'
    })
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Api Settings`
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.body.appendChild(addScript)
    this.scrollToTop()
    if (this.state.saveState === true || this.state.saveState === false) {
      this.initializeSwitch(this.state.saveState)
    }
    this.initializeSwitch(this.state.buttonState)
    this.initializeSwitchNGP(this.state.ngpButtonState)

    console.log('this.state.ngpButtonState', this.state.ngpButtonState)
    if (this.state.ngpButtonState) {
      this.setState({ isDisableInput: true, isDisableButton: true })
    } else {
      this.setState({ isDisableInput: false, isDisableButton: false })
    }
    if (this.props.location.state && this.props.location.state.tab) {
      if (this.props.location.state.tab === 'whitelistDomains') {
        this.setWhiteListDomains()
      }
    }
  }
  componentDidUpdate () {
    console.log('in componentDidUpdate')
  }
  changeType (e) {
    if (this.state.type === 'password') {
      this.setState({type: 'text', buttonText: 'Hide'})
    } else {
      this.setState({type: 'password', buttonText: 'Show'})
    }
    e.preventDefault()
  }
  initializeSwitch (state) {
    console.log('initializingSwitch settings')
    // console.log('state', state)
    var self = this
   /* /* eslint-disable */
   // $("[name='switch']").bootstrapSwitch({
      /* eslint-enable */
     // onText: 'Enabled',
     // offText: 'Disabled',
     // offColor: 'danger',
     // state: state
    // })
    /* eslint-disable */
   // $('input[name="switch"]').on('switchChange.bootstrapSwitch', function (event, state) {
      /* eslint-enable */
    self.setState({buttonState: state})
    if (state === true) {
      self.setState({disable: false, buttonState: true})
      self.props.enable({company_id: self.props.user._id})
    } else {
      self.setState({disable: true, buttonState: false})
      self.props.disable({company_id: self.props.user._id})
    }
   // })
  }
  handleChange () {
    console.log('Handle change function')
   // console.log('state', state)
  //  var self = this

   /* /* eslint-disable */
   // $("[name='switch']").bootstrapSwitch({
      /* eslint-enable */
     // onText: 'Enabled',
     // offText: 'Disabled',
     // offColor: 'danger',
     // state: state
    // })
    /* eslint-disable */
   // $('input[name="switch"]').on('switchChange.bootstrapSwitch', function (event, state) {
      /* eslint-enable */
      // self.setState({buttonState: !this.state.buttonState })
    console.log('buttonState', this.state.buttonState)
    if (this.state.buttonState === false) {
      this.setState({disable: false, buttonState: true})
      this.props.enable({company_id: this.props.user._id})
    } else {
      this.setState({disable: true, buttonState: false})
      this.props.disable({company_id: this.props.user._id})
    }
   // })
  }
  initializeSwitchNGP (state) {
    var self = this
    /* eslint-disable */
    $("[name='switch-NGP']").bootstrapSwitch({
      /* eslint-enable */
      onText: 'Enabled',
      offText: 'Disabled',
      offColor: 'danger',
      state: state
    })
    /* eslint-disable */
    $('input[name="switch-NGP"]').on('switchChange.bootstrapSwitch', function (event, state) {
      /* eslint-enable */
      console.log('state',state)
      self.setState({ngpButtonState: state})
      if (state === true) {
        self.setState({ngpDisable: false, ngpButtonState: true})
        self.props.enableNGP({company_id: self.props.user.companyId})
      } else {
        self.setState({ngpDisable: true, ngpButtonState: false})
        self.props.disableNGP({company_id: self.props.user.companyId})
      }
    })
  }
  setReset (e) {
    e.preventDefault()
    this.props.reset({company_id: this.props.user._id})
  }
  saveNGPBtn (e) {
    
    e.preventDefault()
    this.props.saveNGP({
      company_id: this.props.user.companyId,
      app_id: this.state.NGPKey,
      app_secret: this.state.NGPSecret
    }, this.msg)
  }
  componentWillReceiveProps (nextProps) {
    console.log('iin componentWillReceiveProps', nextProps)
    if (nextProps.user && nextProps.user.emailVerified === false &&
      (nextProps.user.currentPlan.unique_ID === 'plan_A' || nextProps.user.currentPlan.unique_ID === 'plan_B')) {
      browserHistory.push({
        pathname: '/resendVerificationEmail'
      })
    }
    if (nextProps.user && this.state.show) {
      var plan = nextProps.user.currentPlan.unique_ID
      this.getPlanInfo(plan)
    }
    // if (nextProps.user && (nextProps.user.role === 'admin' || nextProps.user.role === 'agent')) {
    //   this.setResetPass()
    // }
    if (nextProps.apiEnable) {
      if (this.state.disable === false) {
        this.setState({APIKey: nextProps.apiEnable.app_id, APISecret: nextProps.apiEnable.app_secret})
      }
    }
    if (nextProps.apiDisable) {
      if (this.state.disable === true) {
        this.setState({APIKey: '', APISecret: ''})
      }
    }
    if (nextProps.resetData) {
      if (this.state.disable === false) {
        this.setState({APIKey: nextProps.resetData.app_id, APISecret: nextProps.resetData.app_secret})
      } else {
        this.setState({APIKey: '', APISecret: ''})
      }
    }
    if (nextProps.apiSuccess) {
      console.log('nextProps.apiSuccess', nextProps.apiSuccess)
      console.log('this.state.count', this.state.count)
      if (this.state.count === 1) {
        this.setState({APIKey: nextProps.apiSuccess.app_id, APISecret: nextProps.apiSuccess.app_secret, buttonState: nextProps.apiSuccess.enabled})
        if (this.state.count1 !== 1) {
          this.initializeSwitch(nextProps.apiSuccess.enabled)
          this.setState({saveState: nextProps.apiSuccess.enabled})
        }
        this.setState({count: 2})
      }
    } else if (nextProps.apiFailure) {
      if (this.state.firstTime === true) {
        this.initializeSwitch(false)
        this.setState({APIKey: '', APISecret: '', buttonState: false, firstTime: false, count1: 1})
        this.setState({saveState: false})
      }
    }
    /*
    NGP Work Starts
    */console.log('nextProps.apiEnableNGP', nextProps.apiEnableNGP)
   console.log('nextProps.apiDisableNGP', nextProps.apiDisableNGP)
   console.log('this.state.ngpDisable', this.state.ngpDisable)
    if (nextProps.apiEnableNGP) {
      if (this.state.ngpDisable === false) {
        this.setState({NGPKey: nextProps.apiEnableNGP.app_id, NGPSecret: nextProps.apiEnableNGP.app_secret, isDisableInput: false, isDisableButton: false})
      }
    }
    if (nextProps.apiDisableNGP) {
      if (this.state.ngpDisable === true) {
        this.setState({NGPKey: '', NGPSecret: '', isDisableButton: true, isDisableInput: true})
      }
    }
    if (!nextProps.apiDisableNGP && nextProps.apiEnableNGP) {
      console.log('call this function')
      if (this.state.ngpDisable === true) {
        this.setState({NGPKey: nextProps.apiEnableNGP.app_id, NGPSecret: nextProps.apiEnableNGP.app_secret, isDisableInput: false, isDisableButton: false, ngpButtonState: true})
      }
    }
    // if (nextProps.resetDataNGP) {
    //   if (this.state.ngpDisable === false) {
    //     this.setState({NGPKey: nextProps.resetDataNGP.app_id, NGPSecret: nextProps.resetDataNGP.app_secret, isDisableInput: false, isDisableButton: false})
    //   } else {
    //     this.setState({NGPKey: '', NGPSecret: '', isDisableButton: true, isDisableInput: true})
    //   }
    // }
    if (nextProps.apiSuccessNGP && !nextProps.apiEnableNGP && !nextProps.apiDisableNGP) {
      console.log('nextProps.apiSuccessNGP', nextProps.apiSuccessNGP)
      console.log('nextProps.apiFailureNGP', nextProps.apiFailureNGP)
      if (this.state.count_ngp === 1) {
        this.setState({NGPKey: nextProps.apiSuccessNGP.app_id, NGPSecret: nextProps.apiSuccessNGP.app_secret, ngpButtonState: nextProps.apiSuccessNGP.enabled})
        if(nextProps.apiSuccessNGP.enabled) {
          this.setState({isDisableButton: false, isDisableInput: false})

        }
        else {
           this.setState({isDisableButton: true, isDisableInput: true})

        }
        // if (this.state.count1_ngp !== 1) {
        //   this.initializeSwitchNGP(nextProps.apiSuccessNGP.enabled)
        //   this.setState({saveStateNGP: nextProps.apiSuccessNGP.enabled})
        // }
        // this.setState({count_ngp: 2})
      }
    } else if (nextProps.apiFailureNGP) {
      if (this.state.firstTimeNGP === true) {
        this.initializeSwitchNGP(false)
        this.setState({NGPKey: '', NGPSecret: '', ngpButtonState: false, firstTimeNGP: false, count1_ngp: 1})
        this.setState({saveStateNGP: false})
      }
    }
    /*
     NGP Work Ends
     */
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('buttonState in render function', this.state.buttonState)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='6hmz4lkUAqM'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        {
          this.state.isShowingModal &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialog}>
              <h3>Upgrade to Pro</h3>
              <p>This feature is not available in free account. Kindly updrade your account to use this feature.</p>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={() => this.goToSettings()}>
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Settings</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
              <div className='m-portlet m-portlet--full-height'>
                <div className='m-portlet__body'>
                  <div className='m-card-profile'>
                    <div className='m-card-profile__title m--hide'>
                      Your Profile
                    </div>
                    {/* <div className='m-card-profile__pic'>
                      <div className='m-card-profile__pic-wrapper'>
                        <img src={(this.props.user) ? this.props.user.profilePic : ''} alt='' style={{width: '100px'}} />
                      </div>
                    </div> */}
                    <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} className='m-card-profile__details'>
                      <span className='m-card-profile__name'>
                        {(this.props.user) ? this.props.user.name : ''}
                      </span>
                      <span className='m-card-profile__email'>
                        {(this.props.user) ? this.props.user.email : ''}
                      </span>
                      <span className='m-card-profile__email' style={{display: 'block'}}>
                        {this.state.planInfo}
                      </span>
                    </div>
                  </div>
                  <ul className='m-nav m-nav--hover-bg m-portlet-fit--sides'>
                    <li className='m-nav__separator m-nav__separator--fit' />
                    <li className='m-nav__section m--hide'>
                      <span className='m-nav__section-text'>Section</span>
                    </li>
                    {this.props.user && !(this.props.user.role === 'admin' || this.props.user.role === 'agent') && !this.state.hideAPI &&
                      <li className='m-nav__item'>
                        {/* this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_C' */}
                        <a className='m-nav__link' onClick={this.setAPI} style={{cursor: 'pointer'}}>
                          <i className='m-nav__link-icon flaticon-share' />
                          <span className='m-nav__link-text'>API</span>
                        </a>
                        {/*: <a className='m-nav__link' onClick={this.showDialog} style={{cursor: 'pointer'}}>
                          <i className='m-nav__link-icon flaticon-share' />
                          <span className='m-nav__link-text'>API&nbsp;&nbsp;&nbsp;
                            <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                              <span style={{color: '#34bfa3'}}>PRO</span>
                            </span>
                          </span>
                        </a>
                      */}
                      </li>
                    }
                    <li className='m-nav__item'>
                      <a className='m-nav__link' onClick={this.setResetPass} style={{cursor: 'pointer'}} >
                        <i className='m-nav__link-icon flaticon-lock-1' />
                        <span className='m-nav__link-text'>Change Password</span>
                      </a>
                    </li>
                    <li className='m-nav__item'>
                      <a className='m-nav__link' onClick={this.setConfiguration} style={{cursor: 'pointer'}} >
                        <i className='m-nav__link-icon flaticon-settings' />
                        <span className='m-nav__link-text'>Configuration</span>
                      </a>
                    </li>
                    {this.props.user && !(this.props.user.role === 'admin' || this.props.user.role === 'agent') &&
                    <li className='m-nav__item'>
                      <a className='m-nav__link' onClick={this.setNGP} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon flaticon-share' />
                        <span className='m-nav__link-text'>NGP Integration</span>
                      </a>
                    </li>
                    }
                    {this.props.user && this.props.user.role === 'buyer' && (this.props.user.currentPlan === 'plan_C' || this.props.user.currentPlan === 'plan_D') &&
                    <li className='m-nav__item'>
                      <a className='m-nav__link' onClick={this.setPermissions} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon flaticon-mark' />
                        <span className='m-nav__link-text'>User Permissions</span>
                      </a>
                    </li>
                    }
                    { this.props.user && this.props.user.role === 'buyer' && this.state.isKiboChat &&
                    <li className='m-nav__item'>
                      {/* this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_C' */}
                      <a className='m-nav__link' onClick={this.setResponseMethods} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon flaticon-list-2' />
                        <span className='m-nav__link-text'> Live Chat Response Methods</span>
                      </a>
                      {/* }: <a className='m-nav__link' onClick={this.showDialog} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon flaticon-list-2' />
                        <span className='m-nav__link-text'>Live Chat Response Methods&nbsp;&nbsp;&nbsp;
                          <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                            <span style={{color: '#34bfa3'}}>PRO</span>
                          </span>
                        </span>
                      </a>
                    */}
                    </li>
                    }
                    { this.props.user && !this.props.user.facebookInfo && this.props.user.role === 'buyer' &&
                    <li className='m-nav__item'>
                      <a className='m-nav__link' onClick={this.setConnectFb} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon fa fa-facebook' />
                        <span className='m-nav__link-text'>Connect with Facebook</span>
                      </a>
                    </li>
                    }
                    <li className='m-nav__item'>
                      <a className='m-nav__link' onClick={this.setUploadCustomerFile} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon la la-cloud-upload' />
                        <span className='m-nav__link-text'>Upload Customer Information</span>
                      </a>
                    </li>
                    { this.props.user && this.props.user.isSuperUser &&
                    <li className='m-nav__item'>
                      <a className='m-nav__link' onClick={this.setPayementMethods} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon fa fa-cc-mastercard' />
                        <span className='m-nav__link-text'>Payment Methods</span>
                      </a>
                    </li>
                    }
                    { this.props.user && this.props.user.isSuperUser &&
                    <li className='m-nav__item'>
                      <a className='m-nav__link' onClick={this.setBilling} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon fa fa-money' />
                        <span className='m-nav__link-text'>Billing</span>
                      </a>
                    </li>
                  }
                    <li className='m-nav__item'>
                      {/* this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_C' */}
                      <a className='m-nav__link' onClick={this.setWebhook} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon la la-link' />
                        <span className='m-nav__link-text'>Webhooks</span>
                      </a>
                      {/* <a className='m-nav__link' onClick={this.showDialog} style={{cursor: 'pointer'}}>
                         <i className='m-nav__link-icon la la-link' />
                         <span className='m-nav__link-text'>Webhooks&nbsp;&nbsp;&nbsp;
                           <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                             <span style={{color: '#34bfa3'}}>PRO</span>
                           </span>
                         </span>
                       </a>
                     */}
                    </li>
                    { this.props.user && this.props.user.role === 'buyer' &&
                    <li className='m-nav__item'>
                      <a className='m-nav__link' onClick={this.setDeleteUserData} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon flaticon-delete' />
                        <span className='m-nav__link-text'>Delete Information</span>
                      </a>
                    </li>
                    }
                    <li className='m-nav__item'>
                      <a className='m-nav__link' onClick={this.setWhiteListDomains} style={{cursor: 'pointer'}}>
                        <i className='m-nav__link-icon la la-list' />
                        <span className='m-nav__link-text'>Whitelist Domains</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            { this.state.openTab === 'showAPI' && this.state.showAPIbyPlan &&
            <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
              <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-tools'>
                    <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                      <li className='nav-item m-tabs__item'>
                        <span className='nav-link m-tabs__link active'>
                          <i className='flaticon-share m--hide' />
                          API
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
                          <div className='col-lg-8 col-md-8 col-sm-12' />
                          <div className='col-lg-4 col-md-4 col-sm-4'>
                            <span className='m-switch m-switch--icon m-switch--primary'>
                              <label>
                                <input type='checkbox' data-switch='true' checked={this.state.buttonState} onChange={this.handleChange} />
                                <span />
                              </label>
                            </span>
                          </div>
                        </div>
                        <br /><br />
                        {
                          <div>
                            <div className='form-group m-form__group row'>
                              <label className='col-2 col-form-label' style={{textAlign: 'left'}}>API Key</label>
                              <div className='col-7 input-group'>
                                <input disabled={this.state.isDisableInput} className='form-control m-input' type='text' value={this.state.buttonState ? this.state.APIKey : ''} onChange={this.handleNGPKeyChange} />
                              </div>
                            </div>
                            <div className='form-group m-form__group row'>
                              <label className='col-2 col-form-label' style={{textAlign: 'left'}}>
                                  API Secret
                                </label>
                              <div className='col-7 input-group'>
                                <input disabled={this.state.isDisableInput} className='form-control m-input' type='text' value={this.state.buttonState ? this.state.APISecret : ''} onChange={this.handleNGPSecretChange} />
                              </div>
                            </div>
                            {
                              this.state.buttonState &&
                                <button className='btn btn-primary' style={{marginLeft: '30px'}} onClick={(e) => this.setReset(e)}>Reset</button>
                            }
                          </div>
                        }
                      </div>
                    </form>
                    <div className='form-group m-form__group'>
                      <div style={{textAlign: 'center'}} className='alert m-alert m-alert--default' role='alert'>
                        For API documentation, please visit <a href='https://app.kibopush.com/docs' target='_blank'>https://app.kibopush.com/docs</a>
                      </div>
                    </div>
                  </div>
                  <div className='tab-pane active' id='m_user_profile_tab_2' />
                </div>
              </div>
            </div>
            }
            { this.state.openTab === 'showNGP' &&
            <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
              <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-tools'>
                    <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                      <li className='nav-item m-tabs__item'>
                        <span className='nav-link m-tabs__link active'>
                          <i className='flaticon-share m--hide' />
                          NGP Integration
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
                          <div className='col-lg-8 col-md-8 col-sm-12' />
                          <div className='col-lg-4 col-md-4 col-sm-4'>
                            <div className='bootstrap-switch-id-test bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate bootstrap-switch-on' style={{width: '130px'}}>
                              <div className='bootstrap-switch-container' style={{width: '177px', marginLeft: '0px'}}>
                                <input data-switch='true' type='checkbox' name='switch-NGP' id='test' data-on-color='success' data-off-color='warning' aria-describedby='switch-error' aria-invalid='false' checked={this.state.ngpButtonState} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <br /><br />
                        {
                          <div>
                            <div className='form-group m-form__group row'>
                              <label className='col-2 col-form-label' style={{textAlign: 'left'}}>NGP APP Name</label>
                              <div className='col-7 input-group'>
                                <input disabled={this.state.isDisableInput} className='form-control m-input' type='text' value={this.state.ngpButtonState ? this.state.NGPKey : ''} onChange={this.handleNGPKeyChange} />
                              </div>
                            </div>
                            <div className='form-group m-form__group row'>
                              <label className='col-2 col-form-label' style={{textAlign: 'left'}}>
                                  NGP API Key
                                </label>
                              <div className='col-7 input-group'>
                                <input disabled={this.state.isDisableInput} className='form-control m-input' type='text' value={this.state.ngpButtonState ? this.state.NGPSecret : ''} onChange={this.handleNGPSecretChange} />
                              </div>
                            </div>
                          </div>
                        }
                        <br />
                        {
                          <button disabled={this.state.isDisableButton} className='btn btn-primary' style={{marginLeft: '30px'}} onClick={(e) => this.saveNGPBtn(e)}>Save</button>
                        }
                        <br />
                      </div>
                    </form>
                  </div>
                  <div className='tab-pane active' id='m_user_profile_tab_2' />
                </div>
              </div>
            </div>
            }
            { this.state.openTab === 'resetPassword' &&
              <ResetPassword />
            }
            { this.state.openTab === 'permissions' &&
              <ShowPermissions />
            }
            { this.state.openTab === 'greetingMessage' &&
              <GreetingMessage user={this.props.user} />
            }
            { this.state.openTab === 'welcomeMessage' &&
              <WelcomeMessage />
            }
            { this.state.openTab === 'connectFb' &&
              <ConnectFb />
            }
            { this.state.openTab === 'uploadCustomerInformation' &&
              <UploadCustomerInformation />
            }
            { this.state.openTab === 'billing' &&
              <Billing showPaymentMethods={this.setPayementMethods} pro={this.state.pro} />
            }
            { this.state.openTab === 'paymentMethods' &&
              <PaymentMethods />
            }
            { this.state.openTab === 'responseMethods' &&
              <ResponseMethods />
            }
            { this.state.openTab === 'deleteUserData' &&
              <DeleteUserData />
            }
            { this.state.openTab === 'webhook' &&
              <Webhook />
            }
            { this.state.openTab === 'whitelistDomains' &&
              <WhiteListDomains />
            }
            { this.state.openTab === 'configuration' &&
              <Configuration />
            }
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    apiEnable: (state.settingsInfo.apiEnable),
    apiDisable: (state.settingsInfo.apiDisable),
    resetData: (state.settingsInfo.resetData),
    apiSuccess: (state.settingsInfo.apiSuccess),
    apiFailure: (state.settingsInfo.apiFailure),
    apiEnableNGP: (state.settingsInfo.apiEnableNGP),
    apiDisableNGP: (state.settingsInfo.apiDisableNGP),
    resetDataNGP: (state.settingsInfo.resetDataNGP),
    apiSuccessNGP: (state.settingsInfo.apiSuccessNGP),
    apiFailureNGP: (state.settingsInfo.apiFailureNGP),
    switchState: (state.settingsInfo.switchState)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails: getuserdetails,
    enable: enable,
    disable: disable,
    reset: reset,
    getAPI: getAPI,
    getNGP: getNGP,
    enableNGP: enableNGP,
    disableNGP: disableNGP,
    saveNGP: saveNGP,
    saveSwitchState: saveSwitchState
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings)
