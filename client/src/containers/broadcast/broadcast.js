/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { AlertList } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import {
  addBroadcast,
  loadBroadcastsList,
  sendbroadcast,
  clearAlertMessage
} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'

class Broadcast extends React.Component {
  constructor (props, context) {
    super(props, context)
    if (!props.broadcasts) {
    //  alert('calling')
      props.loadBroadcastsList()
    }
    this.state = {
      alerts: []
    }
    this.sendBroadcast = this.sendBroadcast.bind(this)
    this.generateAlert = this.generateAlert.bind(this)
    this.dismissAlert = this.dismissAlert.bind(this)
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
  }

  gotoEdit (broadcast) {
    this.props.history.push({
      pathname: `/editbroadcast`,
      state: broadcast._id
    })
  }

  sendBroadcast (broadcast) {
    this.props.sendbroadcast(broadcast)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.broadcasts) {
      console.log('Broadcasts Updated', nextProps.broadcasts)
      // this.setState({broadcasts: nextProps.broadcasts});
    }
    if (nextProps.successMessage || nextProps.errorMessage) {
      this.generateAlert('success', nextProps.successMessage)
    } else if (nextProps.errorMessage || nextProps.errorMessage) {
      this.generateAlert('danger', nextProps.errorMessage)
    }
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
        alerts: [...this.state.alerts.slice(0, idx), ...this.state.alerts.slice(idx + 1)]
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
                <div className='birthday-item inline-items badges'>
                  <h3>Broadcasts</h3>
                  <Link to='createbroadcast' className='pull-right'>
                    <button className='btn btn-primary btn-sm'> Create
                      Broadcast
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
                          <th>Type</th>
                          <th>Created At</th>
                          <th>Message</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                        this.props.broadcasts &&
                        this.props.broadcasts.map((broadcast, i) => (
                          <tr>
                            <td>{broadcast.platform}</td>
                            <td>{broadcast.type}</td>
                            <td>{handleDate(broadcast.datetime)}</td>
                            <td>{broadcast.text}</td>
                            <td>
                              <button className='btn btn-primary btn-sm'
                                onClick={() => this.gotoEdit(broadcast)}
                                style={{float: 'left', margin: 2}}>Edit
                              </button>
                              <button
                                onClick={() => this.sendBroadcast(broadcast)}
                                className='btn btn-primary btn-sm'
                                style={{float: 'left', margin: 2}}>Send
                              </button>
                            </td>
                          </tr>
                        ))
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
    broadcasts: (state.broadcastsInfo.broadcasts),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList: loadBroadcastsList,
    addBroadcast: addBroadcast,
    sendbroadcast: sendbroadcast,
    clearAlertMessage: clearAlertMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Broadcast)
