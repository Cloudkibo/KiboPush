/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { resendEmail } from '../../redux/actions/signup.actions'
import { bindActionCreators } from 'redux'

class ResendEmail extends React.Component {
  constructor (props) {
    super(props)
    this.resend = this.resend.bind(this)
  }
  resend () {
    this.props.resendEmail()
  }
  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    document.title = 'KiboPush | Add Pages'
  }

  render () {
    return (
      <div>
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Email Verification</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-exclamation m--font-brand' />
                </div>
                <div className='m-alert__text'>
                  <div>Your email address is not verified. Please click on the button below to resend the verification email.</div>
                </div>
              </div>
              {this.props.successMessage &&
              <label>{this.props.successMessage}. Please check your email </label>
              }
              <br />
              <br />
              <center>
                <button type='submit' id='m_login_signup_submit' className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air' onClick={this.resend}>
                  Resend Verification Email
                </button>
              </center>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
function mapStateToProps (state) {
 // console.log(state)
  return {
    errorMessage: (state.signupInfo.errorMessage),
    successMessage: (state.signupInfo.successMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      resendEmail: resendEmail
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ResendEmail)
