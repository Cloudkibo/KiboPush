/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { enable, disable, reset } from '../../redux/actions/settings.actions'

class Settings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      type: 'password',
      APIKey: '',
      APISecret: '',
      buttonText: 'Show',
      disable: true
    }
    this.changeType = this.changeType.bind(this)
    this.initializeSwitch = this.initializeSwitch.bind(this)
    this.setReset = this.setReset.bind(this)
  }
  componentWillMount () {
    this.props.getuserdetails()
  }
  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://unpkg.com/react-select/dist/react-select.js')
    document.body.appendChild(addScript)
    document.title = 'KiboPush | api_settings'

    this.initializeSwitch()
  }
  changeType (e) {
    if (this.state.type === 'password') {
      this.setState({type: 'text', buttonText: 'Hide'})
    } else {
      this.setState({type: 'password', buttonText: 'Show'})
    }
    e.preventDefault()
  }
  initializeSwitch () {
    var self = this
    $("[name='switch']").bootstrapSwitch({
      onText: 'Enabled',
      offText: 'Disabled',
      offColor: 'danger'
    })
    $('input[name="switch"]').on('switchChange.bootstrapSwitch', function (event, state) {
      if (state === true) {
        console.log('true')
        self.setState({disable: false})
        console.log('self.state.disabled', self.state.disable)
        self.props.enable({company_id: self.props.user._id})
      } else {
        console.log('false')
        self.setState({disable: true})
        self.props.disable({company_id: self.props.user._id})
      }
    })
  }
  setReset (e) {
    e.preventDefault()
    this.props.reset({company_id: this.props.user._id})
  }
  componentWillReceiveProps (nextProps) {
    console.log('hello', nextProps)
    if (nextProps.apiEnable) {
      console.log('this.state.disabled', this.state.disable)
      if (this.state.disable === false) {
        console.log('api enabled', nextProps.apiEnable)
        this.setState({APIKey: nextProps.apiEnable.app_id, APISecret: nextProps.apiEnable.app_secret})
      }
    }
    if (nextProps.apiDisable) {
      if (this.state.disable === true) {
        console.log('api disabled', nextProps.apiDisable)
        this.setState({APIKey: '', APISecret: ''})
      }
    }
    if (nextProps.resetData) {
      this.setState({APIKey: nextProps.resetData.app_id, APISecret: nextProps.resetData.app_secret})
    }
  }
  render () {
    return (
      <div>
        <Header />
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
                        <div className='m-card-profile__pic'>
                          <div className='m-card-profile__pic-wrapper'>
                            <img src={(this.props.user) ? this.props.user.profilePic : ''} alt='' style={{width: '100px'}} />
                          </div>
                        </div>
                        <div className='m-card-profile__details'>
                          <span className='m-card-profile__name'>
                            {(this.props.user) ? this.props.user.name : 'Richard Hennricks'}
                          </span>
                        </div>
                      </div>
                      <ul className='m-nav m-nav--hover-bg m-portlet-fit--sides'>
                        <li className='m-nav__separator m-nav__separator--fit' />
                        <li className='m-nav__section m--hide'>
                          <span className='m-nav__section-text'>Section</span>
                        </li>
                        <li className='m-nav__item'>
                          <a href='' className='m-nav__link'>
                            <i className='m-nav__link-icon flaticon-profile-1' />
                            <span className='m-nav__link-title'>
                              <span className='m-nav__link-wrap'>
                                <span className='m-nav__link-text'>My Profile</span>
                              </span>
                            </span>
                          </a>
                        </li>
                        <li className='m-nav__item'>
                          <a href='' className='m-nav__link'>
                            <i className='m-nav__link-icon flaticon-share' />
                            <span className='m-nav__link-text'>API</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div id='target' className='col-lg-8 col-md-8 col-sm-4 col-xs-12'>
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
                                <div class='bootstrap-switch-id-test bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate bootstrap-switch-on' style={{width: '120px'}}>
                                  <div className='bootstrap-switch-container' style={{width: '177px', marginLeft: '0px'}}>
                                    <input data-switch='true' type='checkbox' name='switch' id='test' data-on-color='success' data-off-color='warning' aria-describedby='switch-error' aria-invalid='false' />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <br /><br />
                            <div className='form-group m-form__group row'>
                              <label for='example-text-input' className='col-2 col-form-label' style={{textAlign: 'left'}}>API Key</label>
                              <div className='col-7 input-group'>
                                <input className='form-control m-input' type='text' readOnly value={this.state.APIKey} />
                              </div>
                            </div>
                            <div className='form-group m-form__group row'>
                              <label for='example-text-input' className='col-2 col-form-label' style={{textAlign: 'left'}}>
                                API Secret
                              </label>
                              <div className='col-7 input-group'>
                                <input className='form-control m-input' type={this.state.type} readOnly value={this.state.APISecret} />
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
                          <div className='alert m-alert m-alert--default' role='alert' style={{width: '515px', marginLeft: '90px'}}>
                            For API documentation, please visit <a href='https://app.kibopush.com/docs'>https://app.kibopush.com/docs</a>
                          </div>
                        </div>
                      </div>
                      <div className='tab-pane active' id='m_user_profile_tab_2' />
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
  console.log(state)
  return {
    user: (state.basicInfo.user),
    apiEnable: (state.APIInfo.apiEnable),
    apiDisable: (state.APIInfo.apiDisable),
    resetData: (state.APIInfo.resetData)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails: getuserdetails,
    enable: enable,
    disable: disable,
    reset: reset
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings)
