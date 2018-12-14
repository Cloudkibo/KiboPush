/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

class SetUp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      landingPageUrl: ''
    }
  }
  render () {
    return (
      <div>
        <div className='form-group m-form__group m--margin-top-10'>
            Landing Page URL
            <input className='form-control m-input m-input--air' value={this.state.landingPageUrl} />
        </div>
        <CopyToClipboard text={this.state.landingPageUrl}
          onCopy={() => {
            this.setState({copied: true})
            toastr.options = {
              'closeButton': true,
              'debug': false,
              'newestOnTop': false,
              'progressBar': false,
              'positionClass': 'toast-bottom-right',
              'preventDuplicates': false,
              'showDuration': '300',
              'hideDuration': '1000',
              'timeOut': '5000',
              'extendedTimeOut': '1000',
              'showEasing': 'swing',
              'hideEasing': 'linear',
              'showMethod': 'fadeIn',
              'hideMethod': 'fadeOut'
            }

            toastr.success('Link Copied Successfully', 'Copied!')
          }
        }>
          <button type='button' className='btn btn-success'>
            Copy Link
          </button>
        </CopyToClipboard>
      </div>
    )
  }
}

export default SetUp
