/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { AlertList, Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  addPoll,
  loadPollsList,
  sendpoll,
  clearAlertMessage
} from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'

class Poll extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      alerts: []
    }
    this.generateAlert = this.generateAlert.bind(this)
    this.dismissAlert = this.dismissAlert.bind(this)
  }

  componentWillMount () {
    this.props.loadSubscribersList()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.polls) {
      console.log('Polls Updated', nextProps.polls)
      // this.setState({broadcasts: nextProps.broadcasts});
    }
    if (nextProps.successMessage || nextProps.errorMessage) {
      this.generateAlert('success', nextProps.successMessage)
    } else if (nextProps.errorMessage || nextProps.errorMessage) {
      this.generateAlert('danger', nextProps.errorMessage)
    }
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
    if (!this.props.polls) {
      //  alert('calling')
      this.props.loadPollsList()
    }
  }

  gotoEdit (broadcast) {
    this.props.history.push({
      pathname: '/editbroadcast',
      state: broadcast
    })
  }

  gotoView (poll) {
    this.props.history.push({
      pathname: `/pollResult`,
      state: poll._id
    })
    // browserHistory.push(`/pollResult/${poll._id}`)
  }

  gotoViewPoll (poll) {
    this.props.history.push({
      pathname: `/pollView`,
      state: poll
    })
    // browserHistory.push(`/pollResult/${poll._id}`)
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

  dismissAlert (alert) {
    // find the index of the alert that was dismissed
    const idx = this.state.alerts.indexOf(alert)
    this.props.clearAlertMessage()
    if (idx >= 0) {
      this.setState({
        // remove the alert from the array
        alerts: [
          ...this.state.alerts.slice(0, idx),
          ...this.state.alerts.slice(idx + 1)]
      })
    }
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>

                {
                this.props.subscribers && this.props.subscribers.length == 0 &&
                <div style={{padding: '10px'}}>
                  <center>
                    <Alert type='info' headline='0 Subscribers' >
                    Your connected pages have zero subscribers. Unless you do not have any subscriber, you will not be able to broadcast message, polls and surveys.
                    To invite subscribers click <Link to='/invitesubscribers' style={{color: 'blue', cursor: 'pointer'}}> here </Link>.
                    </Alert>
                  </center>
                </div>
              }
                <br />

                <div className='birthday-item inline-items badges'>
                  <h3>Polls</h3>
                  <Link to='createpoll' className='pull-right'>
                    <button className='btn btn-primary btn-sm'> Create Poll
                    </button>
                  </Link>
                  {
                    (this.props.successMessage || this.props.errorMessage) &&
                    <AlertList
                      position='top-right'
                      alerts={this.state.alerts}
                      dismissTitle='Dismiss'
                      onDismiss={this.dismissAlert}
                    />
                  }
                  <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Platform</th>
                          <th>Statment</th>
                          <th>Created At</th>
                          <th>Sent</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        { (this.props.polls)
                        ? this.props.polls.map((poll, i) => (
                          <tr>
                            <td>{poll.platform}</td>
                            <td>{poll.statement}</td>
                            <td>{handleDate(poll.datetime)}</td>
                            <td>{poll.sent}</td>
                            <td>
                              <button className='btn btn-primary btn-sm'
                                style={{float: 'left', margin: 2}}
                                onClick={() => this.gotoViewPoll(poll)}>
                                View
                              </button>
                              <button className='btn btn-primary btn-sm'
                                style={{float: 'left', margin: 2}}
                                onClick={() => this.props.sendpoll(poll)}>
                                Send
                              </button>
                              <button className='btn btn-primary btn-sm'
                                style={{float: 'left', margin: 2}}
                                onClick={() => this.gotoView(poll)}>Report
                              </button>
                            </td>
                          </tr>
                        )) : <br />
                      }

                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </main>

          </div>
        </div>
      </div>

    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    polls: (state.pollsInfo.polls),
    successMessage: (state.pollsInfo.successMessage),
    errorMessage: (state.pollsInfo.errorMessage),
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadPollsList: loadPollsList,
      addPoll: addPoll,
      sendpoll: sendpoll,
      clearAlertMessage: clearAlertMessage,
      loadSubscribersList: loadSubscribersList
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Poll)
