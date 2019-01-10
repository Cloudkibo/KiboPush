/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {updateData} from '../../redux/actions/messengerRefURL.actions'

class SetUp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      jsonCode: '<Json Code>',
      copied: false
    }
  }

  render () {
    return (
      <div>
        <div className='form-group m-form__group'>
          <h3>Generated JSON Code</h3>
          <p>The json code depends on the first items in your Opt-In message. Every time you change it, you will also need to copy the new JSON code.</p>
          <textarea
            className='form-control m-input m-input--solid'
            id='exampleTextarea' rows='3'
            placeholder='JSON code'
            style={{minHeight: '200px', resize: 'none', maxLength: '160'}}
            value={this.state.jsonCode}
            readOnly />
        </div>
        <CopyToClipboard text={this.state.jsonCode}
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

function mapStateToProps (state) {
  console.log(state)
  return {
    messengerRefURL: (state.messengerRefURLInfo.messengerRefURL)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateData: updateData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SetUp)
