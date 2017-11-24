/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
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
import ReactPaginate from 'react-paginate'

class Broadcast extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      alertMessage: '',
      type: '',
      broadcastsData: [],
      totalLength: 0
    }
    props.loadBroadcastsList()
    this.sendBroadcast = this.sendBroadcast.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
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
    document.title = 'KiboPush | Broadcast'
  }

  displayData (n, broadcasts) {
    console.log(broadcasts)
    let offset = n * 6
    let data = []
    let limit
    let index = 0
    if ((offset + 6) > broadcasts.length) {
      limit = broadcasts.length
    } else {
      limit = offset + 6
    }
    for (var i = offset; i < limit; i++) {
      data[index] = broadcasts[i]
      index++
    }
    this.setState({broadcastsData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.broadcasts)
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
      this.displayData(0, nextProps.broadcasts)
      this.setState({ totalLength: nextProps.broadcasts.length })
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
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Manage Broadcasts</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              {
                  this.props.subscribers &&
                  this.props.subscribers.length === 0 &&
                  <div className='alert alert-success'>
                    <h4 className='block'>0 Subscribers</h4>
                    Your connected pages have zero subscribers. Unless you don't
                    have any subscriber, you will not be able to broadcast
                    message, polls and surveys.
                    Lets invite subscribers first. Dont worry, we will guide
                    you on how you can invite subscribers.
                    Click on 'Invite Subscribers' button on right side of the
                    page title.

                  </div>
            }
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding broadcasts? <a href='#'>Click Here </a>
                </div>
              </div>
              <div className='row'>
                <div
                  className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                  <div className='m-portlet m-portlet--mobile'>

                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Broadcasts
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className='m-portlet__body'>

                      <div className='row align-items-center'>
                        <div className='col-md-4'>
                          <div className='m-input-icon m-input-icon--left'>
                            <input type='text' className='form-control m-input m-input--solid' placeholder='Search...' id='generalSearch' />
                            <span className='m-input-icon__icon m-input-icon__icon--left'>
                              <span><i className='la la-search' /></span>
                            </span>
                          </div>
                        </div>
                        <div className='col-xl-4 col-md-4' />
                        <div className='col-xl-4 order-1 col-md-4 order-xl-2 m--align-right'>
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

                        </div>
                      </div>

                      { this.state.broadcastsData && this.state.broadcastsData.length > 0
                    ? <div className='table-responsive'>
                      <table className='table table-striped'>
                        <thead>
                          <tr>
                            <th>Platform</th>
                            <th>Type</th>
                            <th>Created At</th>
                            <th>Message</th>
                            <th>Sent</th>
                            <th>Seen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.broadcastsData.map((broadcast, i) => (
                              <tr>
                                <td>{broadcast.platform}</td>
                                <td>{broadcast.type}</td>
                                <td>{handleDate(broadcast.datetime)}</td>
                                <td>{broadcast.text}</td>
                                <td>{broadcast.sent}</td>
                                <td>{broadcast.seen}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                      <ReactPaginate previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a href=''>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 6)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'} />
                    </div>
                  : <div className='table-responsive'>
                    <p> No data to display </p>
                  </div>
                }
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
