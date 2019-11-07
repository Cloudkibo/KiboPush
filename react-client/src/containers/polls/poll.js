/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  addPoll,
  loadPollsListNew,
  sendpoll,
  clearAlertMessage,
  deletePoll,
  getAllPollResults
} from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { checkConditions } from './utility'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import {loadTags} from '../../redux/actions/tags.actions'
import AlertMessageModal from '../../components/alertMessages/alertMessageModal'
import AlertMessage from '../../components/alertMessages/alertMessage'
import SubscriptionPermissionALert from '../../components/alertMessages/subscriptionPermissionAlert'
import {
  getSubscriberCount
} from '../../redux/actions/broadcast.actions'
class Poll extends React.Component {
  constructor (props, context) {
    props.loadSubscribersList()
    props.loadPollsListNew({last_id: 'none', number_of_records: 10, first_page: 'first', days: '0'})
    props.loadTags()
    super(props, context)
    this.state = {
      alertMessage: '',
      alertType: '',
      pollsData: [],
      totalLength: 0,
      isShowingModal: false,
      isShowingModalPro: false,
      isShowingZeroModal: true,
      isShowingZeroSubModal: this.props.subscribers && this.props.subscribers.length === 0,
      isShowingZeroPageModal: this.props.pages && this.props.pages.length === 0,
      isShowingModalDelete: false,
      deleteid: '',
      selectedDays: '0',
      pageNumber: 0,
      savePoll: '',
      subscriberCount: 0
    }
    this.gotoCreate = this.gotoCreate.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.showProDialog = this.showProDialog.bind(this)
    this.closeProDialog = this.closeProDialog.bind(this)
    this.showZeroSubDialog = this.showZeroSubDialog.bind(this)
    this.closeZeroSubDialog = this.closeZeroSubDialog.bind(this)
    this.props.clearAlertMessage()
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.sendPoll = this.sendPoll.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.handleSubscriberCount = this.handleSubscriberCount.bind(this)
    this.isShowingLearnMore = this.isShowingLearnMore.bind(this)
    this.savePoll = this.savePoll.bind(this)
    this.props.getAllPollResults()
  }
  isShowingLearnMore () {
    this.setState({isShowingLearnMore: !this.state.isShowingLearnMore})
  }
  handleSubscriberCount(response) {
    this.setState({subscriberCount: response.payload.count})
  }
  savePoll(poll) {
    console.log('poll in savePoll', poll)
      this.setState({savePoll:poll})
      let pageId = this.props.pages.find(page => page.pageId === poll.segmentationPageIds[0])
      var payload = {
        pageId:  pageId._id,
        segmented: poll.isSegmented,
        segmentationGender: poll.segmentationGender,
        segmentationLocale: poll.segmentationLocale,
        segmentationTags: poll.segmentationTags,
        isList: poll.isList ? true : false,
        segmentationList: poll.segmentationList
    }
    this.props.getSubscriberCount(payload, this.handleSubscriberCount)

  }
  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  showZeroSubDialog () {
    this.setState({isShowingZeroModal: true})
  }

  closeZeroSubDialog () {
    this.setState({isShowingZeroModal: false})
  }

  showProDialog () {
    this.setState({isShowingModalPro: true})
  }
  closeProDialog () {
    this.setState({isShowingModalPro: false})
  }
  goToSettings () {
    browserHistory.push({
      pathname: `/settings`,
      state: {module: 'pro'}
    })
  }

  onDaysChange (e) {
    //  var defaultVal = 0
    var value = e.target.value
    this.setState({selectedDays: value, pageNumber: 0})
    if (value && value !== '') {
      if (value.indexOf('.') !== -1) {
        value = Math.floor(value)
      }
      if (value === '0') {
        this.setState({
          selectedDays: ''
        })
      }
      this.props.loadPollsListNew({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', days: value})
    } else if (value === '') {
      this.setState({selectedDays: ''})
      this.props.loadPollsListNew({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', days: '0'})
    }
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false, pageNumber: 0 })
  }
  componentWillMount () {
   // this.props.loadSubscribersList()
  //  document.title('KiboPush | Poll')
  }

  displayData (n, polls) {
    console.log('in displayData', polls)
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > polls.length) {
      limit = polls.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = polls[i]
      index++
    }
    this.setState({pollsData: data})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadPollsListNew({last_id: 'none', number_of_records: 10, first_page: 'first', days: this.state.selectedDays})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadPollsListNew({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 10, first_page: 'next', days: this.state.selectedDays})
    } else {
      this.props.loadPollsListNew({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.polls.length > 0 ? this.props.polls[0]._id : 'none', number_of_records: 10, first_page: 'previous', days: this.state.selectedDays})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.polls)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.polls && nextProps.count) {
      // this.setState({broadcasts: nextProps.broadcasts});
      this.displayData(0, nextProps.polls)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({ pollsData: [], totalLength: 0 })
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
    // require('https://cdn.cloudkibo.com/public/js/jquery-3.2.0.min.js')
    // require('https://cdn.cloudkibo.com/public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Polls`
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
    let currentPageSubscribers = this.props.subscribers.filter(subscriber => subscriber.pageId.pageId === poll.segmentationPageIds[0])
    poll.subscribersCount = currentPageSubscribers.length
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
    let polls = {
      pollResponses: this.props.allResponses,
      selectedPolls: poll.segmentationPoll
    }
    var res = checkConditions(poll.segmentationPageIds, poll.segmentationGender, poll.segmentationLocale, segmentationValues, this.props.subscribers, polls)
    if (res === false) {
      this.msg.error('No subscribers match the selected criteria')
    } else {
      this.props.sendpoll(poll, this.msg)
      console.log('data send')
      this.setState({ pageNumber: 0 })
    }
  }
  render () {
    console.log('poll props', this.props)
    console.log('polls local state', this.state)
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'

    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <SubscriptionPermissionALert />
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px', top: 100 }}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px', top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='DpcqcTdguTg'
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
        {
          this.state.isShowingModalPro &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeProDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeProDialog}>
              <h3>Upgrade to Pro</h3>
              <p>This feature is not available in free account. Kindly updrade your account to use this feature.</p>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={() => this.goToSettings()}>
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        {
          this.state.isShowingZeroModal && ((this.props.subscribers && this.props.subscribers.length === 0) || (this.props.pages && this.props.pages.length === 0)) &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeZeroSubDialog}>
            <ModalDialog style={{width: '700px', top: '75px'}}
              onClose={this.closeZeroSubDialog}>
              {(this.props.pages && this.props.pages.length === 0)
              ? <AlertMessageModal type='page' />
            : <AlertMessageModal type='subscriber' />
            }
              <div>
                <YouTube
                  videoId='9kY3Fmj_tbM'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: {
                      autoplay: 0
                    }
                  }}
                />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
          <div style={{ background: 'rgba(33, 37, 41, 0.6)', paddingTop:'150px' }} className="modal fade" id="send" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Send Poll
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
								  </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
              <span
                className={this.state.subscriberCount === 0 ? 'm--font-boldest m--font-danger' : 'm--font-boldest m--font-success'}
                style={{marginLeft: '10px'}}>
                This Poll will be sent to {this.state.subscriberCount} subscriber(s). 
              { this.state.subscriberCount === 0 &&
              <div>
                <br/>
                <br/>
                <span style={{ color: 'black', paddingLeft:'20px' }}>
                Because of Either reason:
                </span>
                  <ol style={{ color: 'black', fontWeight:'300' }}>
                  <li>None of your subscribers have 24 hour window session active. The session will automatically become active when your subscriber messages.</li>
                  <li>No subscriber match the selected criteria.</li>
                </ol>
                </div>
              }

            </span>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <br />
                  <div style={{ display: 'inline-block', padding: '5px'}}>
                    <button style={{ color: 'white'}} disabled={this.state.subscriberCount === 0 ? true : null} onClick={() => {this.sendPoll(this.state.savePoll)}} className='btn btn-primary' data-dismiss="modal" aria-label="Close">
                    Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Polls</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {
            this.props.pages && this.props.pages.length === 0
            ? <AlertMessage type='page' />
          : this.props.subscribers && this.props.subscribers.length === 0 &&
            <AlertMessage type='subscriber' />
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
                      ? <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog} disabled>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Create New
                          </span>
                        </span>
                      </button>
                      : <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog}>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Create New
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
                                {/* this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_C' */}
                                <Link to='/showTemplatePolls' className='btn btn-primary'>
                                  Use Template
                                </Link>
                                {/* add paid plan check later
                                  : <button onClick={this.showProDialog} className='btn btn-primary'>
                                  Use Template&nbsp;&nbsp;&nbsp;
                                  <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                                    <span style={{color: '#34bfa3'}}>PRO</span>
                                  </span>
                                </button>
                              */}
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
                                let loadData = {}
                                loadData = {last_id: 'none', number_of_records: 10, first_page: 'first', days: this.state.selectedDays === '' ? '0' : this.state.selectedDays}

                                this.props.deletePoll(this.state.deleteid, this.msg, loadData)
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
                        <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays === '0' ? '' : this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
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
                          {/* <th data-field='seen'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '50px'}}>Seen</span>
                          </th> */}
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
                            {/* <td data-field='seen' className='m-datatable__cell'><span style={{width: '50px'}}>{poll.seen}</span></td> */}
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
                                    data-toggle="modal" data-target="#send"
                                    style={{float: 'left', margin: 2}}
                                    onClick={() => this.savePoll(poll)}>
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
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.state.pageNumber} />
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
    )
  }
}

function mapStateToProps (state) {
  console.log('poll state', state)
  return {
    pages: (state.pagesInfo.pages),
    polls: (state.pollsInfo.polls),
    count: (state.pollsInfo.count),
    successMessage: (state.pollsInfo.successMessage),
    errorMessage: (state.pollsInfo.errorMessage),
    subscribers: (state.subscribersInfo.subscribers),
    user: (state.basicInfo.user),
    tags: (state.tagsInfo.tags),
    allResponses: (state.pollsInfo.allResponses),
    subscribersCount: (state.subscribersInfo.subscribersCount)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadPollsListNew: loadPollsListNew,
      getAllPollResults: getAllPollResults,
      addPoll: addPoll,
      sendpoll: sendpoll,
      clearAlertMessage: clearAlertMessage,
      loadSubscribersList: loadSubscribersList,
      deletePoll: deletePoll,
      loadTags: loadTags,
      getSubscriberCount: getSubscriberCount
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Poll)
