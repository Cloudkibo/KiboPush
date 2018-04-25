/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  addPoll,
  loadPollsList,
  sendpoll,
  clearAlertMessage,
  deletePoll
} from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { checkConditions } from './utility'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import {loadTags} from '../../redux/actions/tags.actions'

class Poll extends React.Component {
  constructor (props, context) {
    props.loadSubscribersList()
    props.loadPollsList(0)
    props.loadTags()
    super(props, context)
    this.state = {
      alertMessage: '',
      alertType: '',
      pollsData: [],
      totalLength: 0,
      isShowingModal: false,
      isShowingModalDelete: false,
      deleteid: '',
      selectedDays: ''
    }
    this.gotoCreate = this.gotoCreate.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.props.clearAlertMessage()
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.sendPoll = this.sendPoll.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  onDaysChange (e) {
    var defaultVal = 0
    var value = e.target.value
    this.setState({selectedDays: value})
    if (value && value !== '') {
      if (value.indexOf('.') !== -1) {
        value = Math.floor(value)
      }
      if (value === '0') {
        this.setState({
          selectedDays: ''
        })
      }
      this.props.loadPollsList(value)
    } else if (value === '') {
      this.setState({selectedDays: ''})
      this.props.loadPollsList(defaultVal)
    }
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }
  componentWillMount () {
   // this.props.loadSubscribersList()
  //  document.title('KiboPush | Poll')
  }

  displayData (n, polls) {
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
    if (nextProps.polls) {
      // this.setState({broadcasts: nextProps.broadcasts});
      this.displayData(0, nextProps.polls)
      this.setState({ totalLength: nextProps.polls.length })
    }
    if (nextProps.successMessage || nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.successMessage,
        alertType: 'success'
      })
      //  this.msg.success(nextProps.successMessage)
    } else if (nextProps.errorMessage || nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.errorMessage,
        alertType: 'danger'
      })
      //  this.msg.error(nextProps.errorMessage)
    } else {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
    }
  }

  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
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
  gotoCreate () {
    browserHistory.push({
      pathname: `/createpoll`
    })
  }

  sendPoll (poll) {
    let segmentationValues = []
    if (poll.segmentationTags && poll.segmentationTags.length > 0) {
      for (let i = 0; i < poll.segmentationTags.length; i++) {
        for (let j = 0; j < this.props.tags.length; j++) {
          if (poll.segmentationTags[i] === this.props.tags[j]._id) {
            segmentationValues.push(this.props.tags[j].tag)
          }
        }
      }
    }
    var res = checkConditions(poll.segmentationPageIds, poll.segmentationGender, poll.segmentationLocale, segmentationValues, this.props.subscribers)
    if (res === false) {
      this.msg.error('No subscribers match the selected criteria')
    } else {
      this.props.sendpoll(poll, this.msg)
    }
  }
  render () {
    console.log('poll props', this.props)
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='fY-YEtYtGhA'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                  />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Manage Polls</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              {
              this.props.subscribers && this.props.subscribers.length === 0 &&
              <div className='alert alert-success'>
                <h4 className='block'>0 Subscribers</h4>
                  Your connected pages have zero subscribers. Unless you do not have any subscriber, you will not be able to broadcast message, polls and surveys.
                  To invite subscribers click <Link to='/invitesubscribers' style={{color: 'blue', cursor: 'pointer'}}> here </Link>
              </div>
              }
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding polls? Here is the <a href='http://kibopush.com/polls/' target='_blank'>documentation</a>.
                  Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
                </div>
              </div>
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
                        {
                          this.props.subscribers && this.props.subscribers.length === 0
                          ? <span />
                          : <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog}>
                            <span>
                              <i className='la la-plus' />
                              <span>
                                Create Poll
                              </span>
                            </span>
                          </button>
                        }
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='row align-items-center'>
                        <div className='col-xl-8 order-2 order-xl-1' />
                        <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                          {
                            this.state.isShowingModal &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeDialog}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeDialog}>
                                <h3>Create Poll</h3>
                                <p>To create a new poll from scratch, click on Create New Poll. To use a template poll and modify it, click on Use Template</p>
                                <div style={{width: '100%', textAlign: 'center'}}>
                                  <div style={{display: 'inline-block', padding: '5px'}}>
                                    <button className='btn btn-primary' onClick={() => this.gotoCreate()}>
                                      Create New Poll
                                    </button>
                                  </div>
                                  <div style={{display: 'inline-block', padding: '5px'}}>
                                    <Link to='/showTemplatePolls' className='btn btn-primary'>
                                      Use Template
                                    </Link>
                                  </div>
                                </div>
                              </ModalDialog>
                            </ModalContainer>
                          }
                          {
                            this.state.isShowingModalDelete &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeDialogDelete}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeDialogDelete}>
                                <h3>Delete Poll</h3>
                                <p>Are you sure you want to delete this poll?</p>
                                <button style={{float: 'right'}}
                                  className='btn btn-primary btn-sm'
                                  onClick={() => {
                                    this.props.deletePoll(this.state.deleteid, this.msg)
                                    this.closeDialogDelete()
                                  }}>Delete
                                </button>
                              </ModalDialog>
                            </ModalContainer>
                          }
                        </div>
                      </div>
                      <div className='form-row'>
                        <div className='form-group col-md-6' />
                        <div className='form-group col-md-6' style={{display: 'flex', float: 'right'}}>
                          <span style={{marginLeft: '70px'}} htmlFor='example-text-input' className='col-form-label'>
                            Show records for last:&nbsp;&nbsp;
                          </span>
                          <div style={{width: '200px'}}>
                            <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
                          </div>
                          <span htmlFor='example-text-input' className='col-form-label'>
                          &nbsp;&nbsp;days
                          </span>
                        </div>
                      </div>
                      { this.state.pollsData && this.state.pollsData.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{height: '53px'}}>
                              <th data-field='platform'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px'}}>Platform</span>
                              </th>
                              <th data-field='statement'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '150px'}}>Statement</span>
                              </th>
                              <th data-field='datetime'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '150px'}}>Created At</span>
                              </th>
                              <th data-field='sent'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '50px'}}>Sent</span>
                              </th>
                              <th data-field='seen'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '50px'}}>Seen</span>
                              </th>
                              <th data-field='responses'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px'}}>Responses</span>
                              </th>
                              <th data-field='actions'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '200px'}}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                            this.state.pollsData.map((poll, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='platform' className='m-datatable__cell'><span style={{width: '100px'}}>{poll.platform}</span></td>
                                <td data-field='statement' className='m-datatable__cell'><span style={{width: '150px'}}>{poll.statement}</span></td>
                                <td data-field='datetime' className='m-datatable__cell'><span style={{width: '150px'}}>{handleDate(poll.datetime)}</span></td>
                                <td data-field='sent' className='m-datatable__cell'><span style={{width: '50px'}}>{poll.sent}</span></td>
                                <td data-field='seen' className='m-datatable__cell'><span style={{width: '50px'}}>{poll.seen}</span></td>
                                <td data-field='responses' className='m-datatable__cell'><span style={{width: '50px'}}>{poll.responses}</span></td>
                                <td data-field='actions' className='m-datatable__cell'>
                                  <span style={{width: '200px'}}>
                                    <button className='btn btn-primary btn-sm'
                                      style={{float: 'left', margin: 2}}
                                      onClick={() => this.gotoViewPoll(poll)}>
                                      View
                                    </button>
                                    <button className='btn btn-primary btn-sm'
                                      style={{float: 'left', margin: 2}}
                                      onClick={() => this.gotoView(poll)}>Report
                                    </button>
                                    { this.props.subscribers && this.props.subscribers.length === 0
                                    ? <span style={{width: '150px'}}>
                                      <button className='btn btn-sm' disabled
                                        style={{float: 'left', margin: 2}}
                                        onClick={() => this.sendPoll(poll)}>
                                        Send
                                      </button>
                                    </span>
                                    : <span style={{width: '150px'}}>
                                      <button className='btn btn-primary btn-sm'
                                        style={{float: 'left', margin: 2}}
                                        onClick={() => this.sendPoll(poll)}>
                                        Send
                                      </button>
                                    </span>
                                    }
                                    { this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer')
                                      ? <button className='btn btn-primary btn-sm'
                                        style={{float: 'left', margin: 2}}
                                        onClick={() => this.showDialogDelete(poll._id)}>
                                      Delete
                                  </button>
                                  : <div>
                                    {poll.sent === 0
                                    ? <button className='btn btn-primary btn-sm'
                                      style={{float: 'left', margin: 2}}
                                      onClick={() => this.showDialogDelete(poll._id)}>
                                    Delete
                                </button>
                                : <button className='btn btn-primary btn-sm' disabled
                                  style={{float: 'left', margin: 2}}
                                  onClick={() => this.showDialogDelete(poll._id)}>
                                Delete
                                </button>
                                  }
                                  </div>
                                }
                                  </span>
                                </td>
                              </tr>
                            ))
                          }
                          </tbody>
                        </table>
                        <div className='pagination'>
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
  console.log('poll state', state)
  return {
    polls: (state.pollsInfo.polls),
    successMessage: (state.pollsInfo.successMessage),
    errorMessage: (state.pollsInfo.errorMessage),
    subscribers: (state.subscribersInfo.subscribers),
    user: (state.basicInfo.user),
    tags: (state.tagsInfo.tags)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadPollsList: loadPollsList,
      addPoll: addPoll,
      sendpoll: sendpoll,
      clearAlertMessage: clearAlertMessage,
      loadSubscribersList: loadSubscribersList,
      deletePoll: deletePoll,
      loadTags: loadTags
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Poll)
