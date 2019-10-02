/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { requestMessengerCode, resetState } from '../../redux/actions/messengerCode.actions'
import AlertContainer from 'react-alert'
import Tabs from '../messengerCode/tabs'

class CreateURL extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  componentDidMount () {
    console.log('this.props.location.state', this.props.location.state)
    this.props.messengerCode.pageId = this.props.location.state.page._id
    this.props.requestMessengerCode(this.props.messengerCode)
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    if (this.props.location.state.module && this.props.location.state.module === 'edit') {
      document.title = `${title} | Edit  Messenger Code`
    } else {
      document.title = `${title} | Create  Messenger Code`
    }
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {/* <AlertContainer ref={a => { this.msg = a }} {...alertOptions} /> */}
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {this.props.location.state.module && this.props.location.state.module === 'edit'
                        ? 'Edit Messenger Code'
                        : 'Create Messenger Code'
                        }
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <button className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.onSave}>
                      <span>Save</span>
                    </button>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row'>
                    <Tabs module={this.props.location.state.module} selectedPage={this.props.location.state.page} />
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
  return {
    messengerCode: state.messengerCodeInfo.messengerCode,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    requestMessengerCode: requestMessengerCode,
    resetState: resetState,
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateURL)
