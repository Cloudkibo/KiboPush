/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { browserHistory } from 'react-router'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { enable, disable, reset, getAPI, saveSwitchState } from '../../redux/actions/settings.actions'
import ResetPassword from './resetPassword'
import GreetingMessage from './greetingMessage'
import WelcomeMessage from './welcomeMessage'
import SubscribeToMessenger from './subscribeToMessenger'
import ConnectFb from './connectFb'
import YouTube from 'react-youtube'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class Settings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      type: 'password',
      APIKey: '',
      APISecret: '',
      buttonText: 'Show',
      disable: true,
      buttonState: '',
      count: 1,
      count1: 0,
      firstTime: true,
      resetPassword: false,
      showAPI: true,
      saveState: null,
      showGreetingMessage: false,
      showSubscribeToMessenger: false,
      showWelcomeMessage: false,
      planInfo: ''
    }
    this.changeType = this.changeType.bind(this)
    this.initializeSwitch = this.initializeSwitch.bind(this)
    this.setReset = this.setReset.bind(this)
    this.setResetPass = this.setResetPass.bind(this)
    this.setAPI = this.setAPI.bind(this)
    this.setConnectFb = this.setConnectFb.bind(this)
    this.setGreetingMessage = this.setGreetingMessage.bind(this)
    this.setSubscribeToMessenger = this.setSubscribeToMessenger.bind(this)
    this.setWelcomeMessage = this.setWelcomeMessage.bind(this)
    this.getPlanInfo = this.getPlanInfo.bind(this)
  }
  componentWillMount () {
    if (this.props.location && this.props.location.state && this.props.location.state.module === 'addPages') {
      this.setState({showAPI: false, resetPassword: false, showGreetingMessage: false, connectFb: true, showSubscribeToMessenger: false, showWelcomeMessage: false})
    }
    if (this.props.location && this.props.location.state && this.props.location.state.module === 'welcome') {
      this.setState({showAPI: false, resetPassword: false, showGreetingMessage: false, connectFb: false, showSubscribeToMessenger: false, showWelcomeMessage: true})
    }
    this.props.getuserdetails()
    this.props.getAPI({company_id: this.props.user._id})
  }
  getPlanInfo (plan) {
    var planInfo
    if (plan === 'plan_A') {
      planInfo = 'Individual, Premium Account'
    } else if (plan === 'plan_B') {
      planInfo = 'Individual, Free Account'
    } else if (plan === 'plan_C') {
      planInfo = 'Team, Premium Account'
    } else if (plan === 'plan_C') {
      planInfo = 'Team, Free Account)'
    } else {
      planInfo = ''
    }
    this.setState({planInfo: planInfo})
  }
  setAPI () {
    this.props.saveSwitchState()
    this.setState({showAPI: true, resetPassword: false, showGreetingMessage: false, connectFb: false, showSubscribeToMessenger: false, showWelcomeMessage: false})
  }
  setResetPass () {
    this.setState({showAPI: false, resetPassword: true, showGreetingMessage: false, connectFb: false, showSubscribeToMessenger: false, showWelcomeMessage: false})
  }
  setGreetingMessage () {
    this.setState({showAPI: false, resetPassword: false, showGreetingMessage: true, connectFb: false, showSubscribeToMessenger: false, showWelcomeMessage: false})
  }
  setConnectFb () {
    this.setState({showAPI: false, resetPassword: false, showGreetingMessage: false, connectFb: true, showSubscribeToMessenger: false, showWelcomeMessage: false})
  }
  setSubscribeToMessenger () {
    this.setState({showAPI: false, resetPassword: false, showGreetingMessage: false, connectFb: false, showSubscribeToMessenger: true, showWelcomeMessage: false})
  }
  setWelcomeMessage () {
    this.setState({showAPI: false, resetPassword: false, showGreetingMessage: false, connectFb: false, showSubscribeToMessenger: false, showWelcomeMessage: true})
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://unpkg.com/react-select/dist/react-select.js')
    // document.body.appendChild(addScript)
    document.title = 'KiboPush | api_settings'
    this.scrollToTop()
    if (this.state.saveState === true || this.state.saveState === false) {
      this.initializeSwitch(this.state.saveState)
    }
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
    var self = this
    /* eslint-disable */
    $("[name='switch']").bootstrapSwitch({
      /* eslint-enable */
      onText: 'Enabled',
      offText: 'Disabled',
      offColor: 'danger',
      state: state
    })
    /* eslint-disable */
    $('input[name="switch"]').on('switchChange.bootstrapSwitch', function (event, state) {
      /* eslint-enable */
      self.setState({buttonState: state})
      if (state === true) {
        self.setState({disable: false, buttonState: true})
        self.props.enable({company_id: self.props.user._id})
      } else {
        self.setState({disable: true, buttonState: false})
        self.props.disable({company_id: self.props.user._id})
      }
    })
  }
  setReset (e) {
    e.preventDefault()
    this.props.reset({company_id: this.props.user._id})
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.user && nextProps.user.emailVerified === false &&
      (nextProps.user.currentPlan === 'plan_A' || nextProps.user.currentPlan === 'plan_B')) {
      browserHistory.push({
        pathname: '/resendVerificationEmail'
      })
    }
    if (nextProps.user) {
      var plan = nextProps.user.currentPlan
      this.getPlanInfo(plan)
    }
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
  }
  render () {
    return (
      <div>
        <Header />
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
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
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
                        <li className='m-nav__item'>
                          <a className='m-nav__link' onClick={this.setAPI} style={{cursor: 'pointer'}}>
                            <i className='m-nav__link-icon flaticon-share' />
                            <span className='m-nav__link-text'>API</span>
                          </a>
                        </li>
                        <li className='m-nav__item'>
                          <a className='m-nav__link' onClick={this.setResetPass} style={{cursor: 'pointer'}} >
                            <i className='m-nav__link-icon flaticon-lock-1' />
                            <span className='m-nav__link-text'>Reset Password</span>
                          </a>
                        </li>
                        <li className='m-nav__item'>
                          <a className='m-nav__link' onClick={this.setGreetingMessage} style={{cursor: 'pointer'}} >
                            <i className='m-nav__link-icon flaticon-exclamation' />
                            <span className='m-nav__link-text'>Greeting Text</span>
                          </a>
                        </li>
                        <li className='m-nav__item'>
                          <a className='m-nav__link' onClick={this.setWelcomeMessage} style={{cursor: 'pointer'}} >
                            <i className='m-nav__link-icon flaticon-menu-button' />
                            <span className='m-nav__link-text'>Welcome Message</span>
                          </a>
                        </li>
                        <li className='m-nav__item'>
                          <a className='m-nav__link' onClick={this.setSubscribeToMessenger} style={{cursor: 'pointer'}}>
                            <i className='m-nav__link-icon flaticon-alarm' />
                            <span className='m-nav__link-text'>HTML Widget</span>
                          </a>
                        </li>
                        { this.props.user && !this.props.user.facebookInfo && (this.props.user.role === 'buyer' || this.props.user.role === 'admin') &&
                        <li className='m-nav__item'>
                          <a className='m-nav__link' onClick={this.setConnectFb} style={{cursor: 'pointer'}}>
                            <i className='m-nav__link-icon fa fa-facebook' />
                            <span className='m-nav__link-text'>Connect with Facebook</span>
                          </a>
                        </li>
                      }
                      </ul>
                    </div>
                  </div>
                </div>
                { this.state.showAPI &&
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
                                <div className='bootstrap-switch-id-test bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate bootstrap-switch-on' style={{width: '130px'}}>
                                  <div className='bootstrap-switch-container' style={{width: '177px', marginLeft: '0px'}}>
                                    <input data-switch='true' type='checkbox' name='switch' id='test' data-on-color='success' data-off-color='warning' aria-describedby='switch-error' aria-invalid='false' checked={this.state.buttonState} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <br /><br />
                            <div className='form-group m-form__group row'>
                              <label className='col-2 col-form-label' style={{textAlign: 'left'}}>API Key</label>
                              <div className='col-7 input-group'>
                                <input className='form-control m-input' type='text' readOnly value={this.state.buttonState ? this.state.APIKey : ''} />
                              </div>
                            </div>
                            <div className='form-group m-form__group row'>
                              <label className='col-2 col-form-label' style={{textAlign: 'left'}}>
                                API Secret
                              </label>
                              <div className='col-7 input-group'>
                                <input className='form-control m-input' type={this.state.type} readOnly value={this.state.buttonState ? this.state.APISecret : ''} />
                                <span className='input-group-btn'>
                                  <button className='btn btn-primary btn-sm' style={{height: '34px', width: '70px'}} onClick={(e) => this.changeType(e)}>{this.state.buttonText}</button>
                                </span>
                              </div>
                            </div>
                            <br />
                            {
                              this.state.APIKey &&
                              <button className='btn btn-primary' style={{marginLeft: '30px'}} onClick={(e) => this.setReset(e)}>Reset</button>
                            }
                            <br />
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
                { this.state.resetPassword &&
                  <ResetPassword />
                }
                { this.state.showGreetingMessage &&
                  <GreetingMessage user={this.props.user} />
                }
                { this.state.showSubscribeToMessenger &&
                  <SubscribeToMessenger />
                }
                { this.state.showWelcomeMessage &&
                  <WelcomeMessage />
                }
                { this.state.connectFb &&
                  <ConnectFb />
                }
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
    apiEnable: (state.APIInfo.apiEnable),
    apiDisable: (state.APIInfo.apiDisable),
    resetData: (state.APIInfo.resetData),
    apiSuccess: (state.APIInfo.apiSuccess),
    apiFailure: (state.APIInfo.apiFailure),
    switchState: (state.APIInfo.switchState)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails: getuserdetails,
    enable: enable,
    disable: disable,
    reset: reset,
    getAPI: getAPI,
    saveSwitchState: saveSwitchState
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings)
