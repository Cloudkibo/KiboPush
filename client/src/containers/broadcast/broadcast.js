/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast
} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'

class Broadcast extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      alertMessage: '',
      type: ''
    }
    if (!props.broadcasts) {
      //  alert('calling')
      props.loadBroadcastsList()
    }
    this.sendBroadcast = this.sendBroadcast.bind(this)
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
    if (this.props.subscribers.length === 0) {
      this.setState({
        alertMessage: 'You dont have any Subscribers',
        type: 'danger'
      })
    } else {
      this.props.sendbroadcast(broadcast)
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.broadcasts) {
      console.log('Broadcasts Updated', nextProps.broadcasts)
      // this.setState({broadcasts: nextProps.broadcasts});
    }
    this.sendBroadcast = this.sendBroadcast.bind(this)
    if (nextProps.successMessage) {
      this.setState({
        alertMessage: nextProps.successMessage,
        type: 'success'
      })
    } else if (nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.errorMessage,
        type: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        type: ''
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
                  this.props.subscribers &&
                  this.props.subscribers.length === 0 &&
                  <div style={{padding: '10px'}}>
                    <center>
                      <Alert type='info' headline='0 Subscribers'>
                        Your connected pages have zero subscribers. Unless you
                        do not have any subscriber, you will not be able to
                        broadcast message, polls and surveys.
                        To invite subscribers click <Link
                          to='/invitesubscribers'
                          style={{color: 'blue', cursor: 'pointer'}}> here </Link>.
                      </Alert>
                    </center>
                  </div>
                }
                <br />

                <div className='birthday-item inline-items badges'>
                  <h3>Broadcasts</h3>
                  {
                    this.props.subscribers && this.props.subscribers.length === 0

                      ? <Link to='createbroadcast' className='pull-right'>
                        <button className='btn btn-sm' disabled> Send
                        Broadcast
                      </button>
                      </Link>
                      : <Link to='createbroadcast' className='pull-right'>
                        <button className='btn btn-primary btn-sm'> Send
                        Broadcast
                      </button>
                      </Link>
                  }
                  <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Platform</th>
                          <th>Type</th>
                          <th>Created At</th>
                          <th>Message</th>

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

                          </tr>
                        ))
                      }

                      </tbody>
                    </table>
                  </div>
                  {
                    this.state.alertMessage !== '' &&
                    <center>
                      <Alert type={this.state.type}>
                        {this.state.alertMessage}
                      </Alert>
                    </center>
                  }
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
    errorMessage: (state.broadcastsInfo.errorMessage),
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList: loadBroadcastsList,
    addBroadcast: addBroadcast,
    sendbroadcast: sendbroadcast,
    clearAlertMessage: clearAlertMessage,
    loadSubscribersList: loadSubscribersList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Broadcast)
