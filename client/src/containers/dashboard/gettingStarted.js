/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  createbroadcast, clearAlertMessage
} from '../../redux/actions/broadcast.actions'
import CopyToClipboard from 'react-copy-to-clipboard'
import { AlertList } from 'react-bs-notifier'

class GettingStarted extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      inviteUrl: props.pages[0].pageUserName ? `https://m.me/${props.pages[0].pageUserName}` : `https://m.me/${props.pages[0].pageId}`,
      alerts: [],
      step: 0
    }
    this.selectPage = this.selectPage.bind(this)
    this.sendTestBroadcast = this.sendTestBroadcast.bind(this)
    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)
    this.onAlertDismissed = this.onAlertDismissed.bind(this)
    this.generateAlert = this.generateAlert.bind(this)
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
    document.title = 'KiboPush | Getting Started'
    $('#gettingStarted').click()
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.successMessage) {
      this.generateAlert('success', nextprops.successMessage)
    } else if (nextprops.errorMessage) {
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
    this.props.createbroadcast({platform: 'Facebook', type: 'text', text: 'Hello! This is a test broadcast'})
  }

  generateAlert (type, message) {
    const newAlert = {
      id: (new Date()).getTime(),
      type: type,
      message: message
    }

    this.setState({
      alerts: [...this.state.alerts, newAlert]
    })
  }

  onAlertDismissed (alert) {
    const alerts = this.state.alerts

    // find the index of the alert that was dismissed
    const idx = alerts.indexOf(alert)

    if (idx >= 0) {
      this.setState({
        // remove the alert from the array
        alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
      })
    }
  }

  nextStep () {
    this.setState({step: this.state.step + 1})
  }

  previousStep () {
    this.setState({step: this.state.step - 1})
  }

  render () {
    console.log('In Getting Started', this.state.step)
    return (
      <div>
        <button type='button' id='gettingStarted' className='btn btn-metal' data-toggle='modal' data-target='#m_modal_1_2' hidden >
          Launch Modal
        </button>
        <AlertList
          position='top-right'
          alerts={this.state.alerts}
          timeout={3000}
          dismissTitle='Dismiss'
          onDismiss={this.onAlertDismissed}
        />
        <div className='modal fade' id='m_modal_1_2' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div className='modal-dialog' role='document'>
            {
              this.state.step === 0
              ? <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='exampleModalLabel'>
                    Getting Started
                  </h5>
                  <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                    <span aria-hidden='true'>
                      &times;
                    </span>
                  </button>
                </div>
                <div className='modal-body'>
                  <p>
                    Your connected pages have zero subscribers. Unless you do not have any subscriber, you will not be able to broadcast messages, polls and surveys.
                    Please click on <strong>Start</strong> and follow the steps to invite subscribers.
                  </p>
                </div>
                <div className='modal-footer'>
                  <button type='button' className='btn btn-secondary' data-dismiss='modal'>
                    Close
                  </button>
                  <button onClick={this.nextStep} type='button' className='btn btn-primary'>
                    Start
                  </button>
                </div>
              </div>
              : this.state.step === 1
              ? <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='exampleModalLabel'>
                    Step 1:
                  </h5>
                  <button type='button' id='m_modal_1_2' className='close' data-dismiss='modal' aria-label='Close'>
                    <span aria-hidden='true'>
                      &times;
                    </span>
                  </button>
                </div>
                <div className='modal-body'>
                  <p>
                    Select a page from the drop down.
                  </p>
                  <select onChange={this.selectPage} className='form-control m-input' id='exampleSelect1'>
                    {
                      this.props.pages.map((page, i) => (
                        <option key={page.pageId} value={page.pageId}>{page.pageName}</option>
                      ))
                    }
                  </select>
                </div>
                <div className='modal-footer'>
                  <button onClick={this.previousStep} type='button' className='btn btn-secondary'>
                    Back
                  </button>
                  <button onClick={this.nextStep} type='button' className='btn btn-primary'>
                    Next
                  </button>
                </div>
              </div>
              : this.state.step === 2
              ? <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='exampleModalLabel'>
                    Step 2:
                  </h5>
                  <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                    <span aria-hidden='true'>
                      &times;
                    </span>
                  </button>
                </div>
                <div className='modal-body'>
                  <p>
                    Become a subscriber of your page.
                    You need to send a message to your page in order to subscribe it.
                  </p>
                  <a href={this.state.inviteUrl} target='_blank' className='btn btn-success'>
                    Subscribe Now
                  </a>
                </div>
                <div className='modal-footer'>
                  <button onClick={this.previousStep} type='button' className='btn btn-secondary'>
                    Back
                  </button>
                  <button onClick={this.nextStep} type='button' className='btn btn-primary'>
                    Next
                  </button>
                </div>
              </div>
              : this.state.step === 3
              ? <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='exampleModalLabel'>
                    Step 3:
                  </h5>
                  <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                    <span aria-hidden='true'>
                      &times;
                    </span>
                  </button>
                </div>
                <div className='modal-body'>
                  <p>
                    Send a test broadcast to see how it works.
                  </p>
                  <button onClick={this.sendTestBroadcast} type='button' className='btn btn-success'>
                    Send Test Broadcast
                  </button>
                </div>
                <div className='modal-footer'>
                  <button onClick={this.previousStep} type='button' className='btn btn-secondary'>
                    Back
                  </button>
                  <button onClick={this.nextStep} type='button' className='btn btn-primary'>
                    Next
                  </button>
                </div>
              </div>
              : <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='exampleModalLabel'>
                    Step 4:
                  </h5>
                  <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                    <span aria-hidden='true'>
                      &times;
                    </span>
                  </button>
                </div>
                <div className='modal-body'>
                  <p>
                    Invite other people to subscribe your page by sharing this link:
                    <a href={this.state.inviteUrl} target='_blank'> {this.state.inviteUrl}</a>
                  </p>
                  <CopyToClipboard text={this.state.inviteUrl} onCopy={() => this.generateAlert('success', 'Link copied successfully!')}>
                    <button href={this.state.inviteUrl} className='btn btn-success'>
                      Copy Link
                    </button>
                  </CopyToClipboard>
                </div>
                <div className='modal-footer'>
                  <button type='button' className='btn btn-secondary' data-dismiss='modal'>
                    Close
                  </button>
                  <button type='button' className='btn btn-primary' data-dismiss='modal'>
                    Done
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    dashboard: (state.dashboardInfo.dashboard),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {clearAlertMessage: clearAlertMessage, createbroadcast: createbroadcast},
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GettingStarted)
