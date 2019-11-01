/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  sendBroadcast, clearAlertMessage
} from '../../redux/actions/broadcast.actions'

class GettingStarted extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      alerts: [],
      step: 0
    }
    this.selectPage = this.selectPage.bind(this)
    this.sendTestBroadcast = this.sendTestBroadcast.bind(this)
    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)
    this.generateAlert = this.generateAlert.bind(this)
  }

  componentDidMount () {
    /* eslint-disable */
    $('#gettingStarted').click()
    /* eslint-enable */
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.successMessage && this.state.step !== 0) {
      this.generateAlert('success', nextprops.successMessage)
    } else if (nextprops.errorMessage && this.state.step !== 0) {
      this.generateAlert('danger', nextprops.errorMessage)
    }
  }

  selectPage (event) {
    let page
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].pageId === event.target.value) {
        page = this.props.pages[i]
        break
      }
    }
    if (page.pageUserName) {
      this.setState({inviteUrl: 'https://m.me/' + page.pageUserName})
    } else {
      this.setState({inviteUrl: 'https://m.me/' + page.pageId})
    }
  }

  sendTestBroadcast () {
    this.props.clearAlertMessage()
    var data = {
      platform: 'facebook',
      payload: [{ text: 'Hello! this is a test broadcast.', componentType: 'text' }],
      isSegmented: false,
      segmentationPageIds: [],
      segmentationLocale: '',
      segmentationGender: '',
      segmentationTimeZone: '',
      title: 'Test Broadcast'
    }
    this.props.sendBroadcast(data)
  }

/* eslint-disable */
  generateAlert (type, message) {
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
    if (type === 'success') {
      toastr.success(message, 'Success!')
    } else {
      toastr.error(message, 'Failed!')
    }
  }
/* eslint-enable */
  gotopage () {
    this.props.browserHistory.push({
      pathname: `/addPageWizard`,
      state: {showMsg: true}
    })
  }
  nextStep () {
    this.setState({step: this.state.step + 1})
  }

  previousStep () {
    this.setState({step: this.state.step - 1})
  }

  render () {
    return (
      <div>
        <button type='button' id='gettingStarted' className='btn btn-metal' data-toggle='modal' data-target='#m_modal_1_2' hidden>
          Launch Modal
        </button>
        <div className='modal fade' id='m_modal_1_2' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div className='modal-dialog' role='document'>
            <div style={{top: '60px'}} className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Getting Started
                </h5>
                <button style={{marginLeft: '300px'}} type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>
                    &times;
                  </span>
                </button>
              </div>
              <div className='modal-body'>
                <p>
                  Do you want to setup using wizard? Please click on <strong>Start</strong> and follow the steps
                </p>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-secondary' data-dismiss='modal'>
                  Close
                </button>
                <button onClick={this.gotopage} className='btn btn-primary' data-dismiss='modal'>
                  Start
                </button>
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
    dashboard: (state.dashboardInfo.dashboard),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {clearAlertMessage: clearAlertMessage, sendBroadcast: sendBroadcast},
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GettingStarted)
