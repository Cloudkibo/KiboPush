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
      inputValue: ''
    }
    this.changeRef = this.changeRef.bind(this)
  }

  changeRef (e) {
    console.log('in changeRef')
    this.setState({inputValue: e.target.value})
    this.props.updateData(this.props.messengerRefURL, 'ref_parameter', e.target.value)
  }

  render () {
    return (
      <div>
        <div className='form-group m-form__group m--margin-top-10'>
          <span>Your messenger Ref URL: </span>
          <div className='form-control m-input m-input--air' readOnly style={{backgroundColor: 'white'}}>
            <a href={`https://m.me/${this.props.messengerRefURL.pageId}?ref=${this.props.messengerRefURL.ref_parameter}`} target='_blank'>{`https://m.me/${this.props.messengerRefURL.pageId}?ref=${this.props.messengerRefURL.ref_parameter}`}</a>
          </div>
        </div>
        <CopyToClipboard text={`https://m.me/${this.props.messengerRefURL.pageId}?ref=${this.props.messengerRefURL.ref_parameter}`}
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
        <br /><br />
        <div className='form-group m-form__group m--margin-top-10'>
          <span>Custom Ref Parameter: </span>
          <input className='form-control m-input m-input--air' value={this.props.messengerRefURL.ref_parameter} onChange={this.changeRef} />
        </div>
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
