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
  addPoll,
  loadPollsList,
  sendpoll,
  clearAlertMessage
} from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'

class Poll extends React.Component {
  constructor (props, context) {
    props.loadPollsList()
    super(props, context)
    this.state = {
      alertMessage: '',
      alertType: '',
      pollsData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  componentWillMount () {
   // this.props.loadSubscribersList()
  //  document.title('KiboPush | Poll')
  }

  displayData (n, polls) {
    console.log(polls)
    let offset = n * 5
    let data = []
    let limit
    let index = 0
    if ((offset + 5) > polls.length) {
      limit = polls.length
    } else {
      limit = offset + 5
    }
    for (var i = offset; i < limit; i++) {
      data[index] = polls[i]
      index++
    }
    this.setState({pollsData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.polls)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.polls && nextProps.polls.length > 0) {
      console.log('Polls Updated', nextProps.polls)
      // this.setState({broadcasts: nextProps.broadcasts});
      this.displayData(0, nextProps.polls)
      this.setState({ totalLength: nextProps.polls.length })
    }
    if (nextProps.successMessage || nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.successMessage,
        alertType: 'success'
      })
    } else if (nextProps.errorMessage || nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.errorMessage,
        alertType: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
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
      state: poll
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

  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              {
              this.props.subscribers && this.props.subscribers.length === 0 &&
              <div style={{padding: '10px'}}>
                <center>
                  <Alert type='info' headline='0 Subscribers' >
                  Your connected pages have zero subscribers. Unless you do not have any subscriber, you will not be able to broadcast message, polls and surveys.
                  To invite subscribers click <Link to='/invitesubscribers' style={{color: 'blue', cursor: 'pointer'}}> here </Link>.
                  </Alert>
                </center>
              </div>
              }
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='m-portlet'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Polls
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        {this.props.subscribers && this.props.subscribers.length === 0
                        ? <Link to='createpoll' className='pull-right'>
                          <button className='btn btn-sm' disabled> Create Poll
                        </button>
                        </Link>
                        : <Link to='createpoll' className='pull-right'>
                          <button className='btn btn-primary btn-sm'> Create Poll
                            </button>
                        </Link>
                        }
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      {this.state.pollsData && this.state.pollsData.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--scroll m-datatable--loaded'>
                        <table className='m-datatable__table'>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'>
                              <th className='m-datatable__cell'>Platform</th>
                              <th className='m-datatable__cell'>Statment</th>
                              <th className='m-datatable__cell'>Created At</th>
                              <th className='m-datatable__cell'>Sent</th>
                              <th className='m-datatable__cell'>Seen</th>
                              <th className='m-datatable__cell'>Responded</th>
                              <th className='m-datatable__cell'>Actions</th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                            this.state.pollsData.map((poll, i) => (
                              <tr>
                                <td>{poll.platform}</td>
                                <td>{poll.statement}</td>
                                <td>{handleDate(poll.datetime)}</td>
                                <td>{poll.sent}</td>
                                <td>{poll.seen}</td>
                                <td>{poll.responses}</td>
                                <td>
                                  <button className='btn btn-primary btn-sm'
                                    style={{float: 'left', margin: 2}}
                                    onClick={() => this.gotoViewPoll(poll)}>
                                    View
                                  </button>
                                  { this.props.subscribers && this.props.subscribers.length === 0
                                  ? <span>
                                    <button className='btn btn-sm' disabled
                                      style={{float: 'left', margin: 2}}
                                      onClick={() => this.props.sendpoll(poll)}>
                                      Send
                                    </button>
                                    <button className='btn btn-sm' disabled
                                      style={{float: 'left', margin: 2}}
                                      onClick={() => this.gotoView(poll)}>Report
                                    </button>
                                  </span>
                                  : <span>
                                    <button className='btn btn-primary btn-sm'
                                      style={{float: 'left', margin: 2}}
                                      onClick={() => this.props.sendpoll(poll)}>
                                      Send
                                    </button>
                                    <button className='btn btn-primary btn-sm'
                                      style={{float: 'left', margin: 2}}
                                      onClick={() => this.gotoView(poll)}>Report
                                    </button>
                                  </span>
                                }
                                </td>
                              </tr>
                          ))
                        }
                          </tbody>
                        </table>
                        <div className='m-datatable__pager m-datatable--paging-loaded clearfix'>
                          <ReactPaginate previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={<a>...</a>}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalLength / 5)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'} />
                        </div>
                      </div>
                      : <span>
                        <p> No data to display </p>
                      </span>
                      }
                      {
                        this.state.alertMessage !== '' &&
                        <center>
                          <Alert type={this.state.alertType} >
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
