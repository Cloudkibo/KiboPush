/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { enable, disable, reset, getAPI } from '../../redux/actions/settings.actions'

class ResetPassword extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      ismatch: false,
      password: false
    }
    this.save = this.save.bind(this)
    this.equal = this.equal.bind(this)
    this.handlePwdChange = this.handlePwdChange.bind(this)
  }
  equal () {
    if (this.refs.new.value === this.refs.retype.value) {
      this.setState({ismatch: true})
    } else {
      this.setState({ismatch: false})
    }
  }
  handlePwdChange () {
    this.setState({password: true})
  }
  save () {
  }
  componentWillMount () {
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
  }
  componentWillReceiveProps (nextProps) {
  }
  render () {
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-4 col-xs-12'>
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Reset Password
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
                  <br /><br />
                  <div className='form-group m-form__group row'>
                    <label className='col-4 col-form-label' style={{textAlign: 'left'}}>Current Password</label>
                    <div className='col-7 input-group'>
                      <input className='form-control m-input' required type='password' ref='current' />
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-4 col-form-label' style={{textAlign: 'left'}}>
                      New Password
                    </label>
                    <div className='col-7 input-group'>
                      <input className='form-control m-input' required type='password' ref='new' onChange={this.handlePwdChange} />
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-4 col-form-label' style={{textAlign: 'left'}}>
                      Retype Password
                    </label>
                    <div className='col-7 input-group'>
                      <input className='form-control m-input' required type='password' ref='retype' onChange={this.equal} />
                    </div>
                    <label className='col-4 col-form-label' style={{textAlign: 'left'}} />
                    { this.state.password && this.state.ismatch === false &&
                      <div className='col-7 input-group' style={{color: 'red'}}>Passwords do not match</div>
                    }
                  </div>
                  <br />
                  <div className='form-group m-form__group row pull-right' style={{marginRight: '48px'}}>
                    <button className='btn btn-primary' onClick={this.save}>Save</button>
                  </div>
                </div>
              </form>
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
    resetData: (state.APIInfo.resetData),
    apiSuccess: (state.APIInfo.apiSuccess),
    apiFailure: (state.APIInfo.apiFailure)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails: getuserdetails,
    enable: enable,
    disable: disable,
    reset: reset,
    getAPI: getAPI
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
