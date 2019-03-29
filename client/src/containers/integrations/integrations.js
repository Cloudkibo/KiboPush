/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
// import auth from '../../utility/auth.service'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import { updatePlatformSettings } from '../../redux/actions/settings.actions'
import { updatePlatform } from '../../redux/actions/basicinfo.actions'
class FacebookIntegration extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      SID: '',
      token: ''
    }
    this.closeDialog = this.closeDialog.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.submit = this.submit.bind(this)
    this.updateToken = this.updateToken.bind(this)
    this.updateSID = this.updateSID.bind(this)
    this.goToNext = this.goToNext.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  cancel () {
    this.props.updatePlatform({platform: this.props.location.state.showCancel})
    browserHistory.push({
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

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  componentWillReceiveProps (nextprops) {
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
  componentWillMount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  goToNext () {
    browserHistory.push({
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
                <a href='#'>
                  <img src='https://cdn.cloudkibo.com/public/img/logo.png' style={{maxWidth: 250}} />
                </a>
              </div>
              <div className='m-login__signin'>
                <div className='m-login__head'>
                  <h3 className='m-login__title'>Integrations</h3>
                </div>
              </div>
              <br /><br />
              <div className='tab-pane active' style={{height: '420px'}} id='m_widget4_tab1_content'><div className='m-widget4'>
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
                      : <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3'}} onClick={this.showDialog}>
                        Connect
                      </button>
                    }
                  </div>
                </div>
              </div>
                <br /><br />
                {this.props.automated_options && this.props.user &&
                  <center>
                    <button onClick={this.goToNext} className='btn btn-primary m-btn m-btn--custom m-btn--icon' data-wizard-action='next' disabled={(!this.props.user.facebookInfo && !this.props.automated_options.twilio) || (this.props.user.platform === 'sms' && !this.props.automated_options.twilio) || (this.props.user.platform === 'messenger' && !this.props.user.facebookInfo)}>
                      <span>
                        <span>Continue</span>&nbsp;&nbsp;
                        <i className='la la-arrow-right' />
                      </span>
                    </button>
                    {this.props.location.state && this.props.location.state.showCancel &&
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
    updatePlatform
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FacebookIntegration)
