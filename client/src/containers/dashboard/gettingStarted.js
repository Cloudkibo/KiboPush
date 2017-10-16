/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadDashboardData } from '../../redux/actions/dashboard.actions'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  createbroadcast, clearAlertMessage
} from '../../redux/actions/broadcast.actions'
import CopyToClipboard from 'react-copy-to-clipboard'
import { AlertList } from 'react-bs-notifier'

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      inviteUrl: props.pages[0].pageUserName ? `https://m.me/${props.pages[0].pageUserName}` : `https://m.me/${props.pages[0].pageId}`,
      alerts: []
    }
    this.selectPage = this.selectPage.bind(this)
    this.sendBroadcast = this.sendBroadcast.bind(this)
    this.onAlertDismissed = this.onAlertDismissed.bind(this)
    this.generateAlert = this.generateAlert.bind(this)
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

  sendBroadcast () {
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

  render () {
    return (
      <div className='row'>
        <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
          <AlertList
            position='top-right'
            alerts={this.state.alerts}
            timeout={3000}
            dismissTitle='Dismiss'
            onDismiss={this.onAlertDismissed}
          />
          <h2>Getting Started</h2>
          <p>Your connected pages have zero subscribers. Unless you do not
          have any subscriber, you will not be able to broadcast
          message, polls and surveys. Please follow the steps given below to invite subscribers.
          </p>
          <div className='row'>
            <div className='col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3'>
              <div className='card-block' style={{height: 220, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '5px', border: '1px solid #ccc'}}>
                <h5 className='card-title'>Step 1:</h5>
                <p className='card-text'>Select A Page From The Drop Down</p>
                <br />
                <div className='col-xl-12 align-center'>
                  <select onChange={this.selectPage}>
                    {
                              (this.props.pages) ? this.props.pages.map((page) => {
                                return <option value={page.pageId}>{page.pageName}</option>
                              }) : <p> No Pages Found </p>
                            }
                  </select>
                </div>
              </div>
            </div>
            <div className='col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3'>
              <div className='card-block' style={{height: 220, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '5px', border: '1px solid #ccc'}}>
                <h5 className='card-title'>Step 2:</h5>
                <p className='card-text'>Become a subscriber of the page. Make sure you send a message to you page in order to subscribe</p>
                <div className='col-xl-12 align-center'>
                  <a href={this.state.inviteUrl} target='_blank' className='btn btn-primary btn-sm'> Subscribe Now </a>
                </div>
              </div>
            </div>
            <div className='col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3'>
              <div className='card-block' style={{height: 220, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '5px', border: '1px solid #ccc'}}>
                <h5 className='card-title'>Step 3:</h5>
                <p className='card-text'>Try to send a test broadcast to see how it works</p>
                <div style={{paddingTop: '40px'}} className='col-xl-12 align-center'>
                  <button onClick={this.sendBroadcast} className='btn btn-primary btn-sm'> Send Test Broadcast </button>
                </div>
              </div>
            </div>
            <div className='col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3'>
              <div className='card-block' style={{height: 220, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '5px', border: '1px solid #ccc'}}>
                <h5 className='card-title'>Step 4:</h5>
                <p className='card-text'>Invite other people to subscribe by sharing this link: <a href={this.state.inviteUrl}>{this.state.inviteUrl}</a></p>
                <div style={{paddingTop: '17px'}} className='col-xl-12 align-center'>
                  <CopyToClipboard text={this.state.inviteUrl}
                    onCopy={() => this.msg.info('Link is copied')}>
                    <button className='btn btn-primary btn-sm'> Copy Link </button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>
          <br />
          <p>Subscribe to our messenger page for help and promotional messages:
            <a className='btn' href='https://www.messenger.com/t/kibopush' style={{marginTop: '12px', marginLeft: '7px', background: 'blue', color: 'white', borderColor: 'white'}} >
              <i className='fa fa-facebook fa-lg' /> Subscribe
            </a>
          </p>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    dashboard: (state.dashboardInfo.dashboard),
    pages: (state.pagesInfo.pages),
    subscribers: (state.subscribersInfo.subscribers),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {clearAlertMessage: clearAlertMessage, loadDashboardData: loadDashboardData, loadMyPagesList: loadMyPagesList, loadSubscribersList: loadSubscribersList, createbroadcast: createbroadcast},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
