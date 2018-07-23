/* eslint-disable no-undef */
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
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast, allBroadcasts
} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import YouTube from 'react-youtube'

class Convo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      alertMessage: '',
      type: '',
      broadcastsData: [],
      totalLength: 0,
      filterValue: '',
      isShowingModal: false,
      selectedDays: '0',
      searchValue: '',
      filter: false,
      pageNumber: 0,
      isShowingModalPro: false
    }
    props.allBroadcasts({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: '', type_value: '', days: '0'}})
    props.loadSubscribersList()
    this.sendBroadcast = this.sendBroadcast.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchBroadcast = this.searchBroadcast.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.showProDialog = this.showProDialog.bind(this)
    this.closeProDialog = this.closeProDialog.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
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
    // this.setState({
    //   filterValue: '',
    //   searchValue: ''
    // })
    //  var defaultVal = 0
    var value = e.target.value
    this.setState({selectedDays: value})
    if (value && value !== '') {
      if (value.indexOf('.') !== -1) {
        value = Math.floor(value)
      }
      if (value === '0') {
        this.setState({
          selectedDays: '0'
        })
      }
      this.setState({filter: true, pageNumber: 0})
      this.props.allBroadcasts({last_id: 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue, days: value}})
      //  this.props.loadBroadcastsList(value)
    } else if (value === '') {
      this.setState({selectedDays: '0', filter: false})
      this.props.allBroadcasts({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue, days: '0'}})
    }
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  componentDidMount () {
    this.scrollToTop()

    document.title = 'KiboPush | Broadcast'
  }

  displayData (n, broadcasts) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > broadcasts.length) {
      limit = broadcasts.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = broadcasts[i]
      index++
    }
    this.setState({broadcastsData: data})
  }

  handlePageClick (data) {
    console.log('data.selected', data.selected)
    if (data.selected === 0) {
      this.props.allBroadcasts({last_id: 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue, days: this.state.selectedDays}})
    } else if (this.state.pageNumber < data.selected) {
      this.props.allBroadcasts({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'next', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue, days: this.state.selectedDays}})
    } else {
      this.props.allBroadcasts({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[0]._id : 'none', number_of_records: 10, first_page: 'previous', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue, days: this.state.selectedDays}})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.broadcasts)
  }

  gotoEdit (broadcast) {
    this.props.history.push({
      pathname: `/editbroadcast`,
      state: broadcast._id
    })
  }

  gotoCreate (broadcast) {
    browserHistory.push({
      pathname: `/createBroadcast`,
      state: {module: 'convo', subscribers: this.props.subscribers}
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
    if (nextProps.broadcasts) {
      this.displayData(0, nextProps.broadcasts)
      //  this.setState({ totalLength: nextProps.broadcasts.length })
    }
    if (nextProps.count) {
      this.setState({ totalLength: nextProps.count })
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
  searchBroadcast (event) {
    this.setState({
      searchValue: event.target.value
    })
    //  var filtered = []
    if (event.target.value !== '') {
      this.setState({filter: true})
      this.props.allBroadcasts({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: event.target.value.toLowerCase(), type_value: this.state.filterValue, days: this.state.selectedDays}})
      // for (let i = 0; i < this.props.broadcasts.length; i++) {
      //   if (this.props.broadcasts[i].title && this.props.broadcasts[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
      //     filtered.push(this.props.broadcasts[i])
      //   }
      // }
    } else {
      //  this.setState({filter: false})
      this.props.allBroadcasts({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: '', type_value: this.state.filterValue, days: this.state.selectedDays}})
      //  filtered = this.props.broadcasts
    }
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }

  onFilter (e) {
    this.setState({filterValue: e.target.value})
    // var filtered = []
    if (e.target.value !== '') {
      this.setState({filter: true})
      this.props.allBroadcasts({last_id: (this.props.broadcasts && this.props.broadcasts.length) > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, type_value: e.target.value, days: this.state.selectedDays}})
      // for (let i = 0; i < this.props.broadcasts.length; i++) {
      //   if (e.target.value === 'miscellaneous') {
      //     if (this.props.broadcasts[i].payload.length > 1) {
      //       filtered.push(this.props.broadcasts[i])
      //     }
      //   } else {
      //     if (this.props.broadcasts[i].payload.length === 1 && this.props.broadcasts[i].payload[0].componentType === e.target.value) {
      //       filtered.push(this.props.broadcasts[i])
      //     }
      //   }
      // }
    } else {
      this.setState({filter: false})
      this.props.allBroadcasts({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: this.state.searchValue, type_value: '', days: this.state.selectedDays}})
      // filtered = this.props.broadcasts
    }
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }

  render () {
    return (
      <div>
        <Header />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='p3BPp3fHBBc'
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
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
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
                  Need help in understanding broadcasts? Here is the <a href='http://kibopush.com/broadcasts/' target='_blank'>documentation</a>.
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
                            Broadcasts
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        {
                          this.props.subscribers && this.props.subscribers.length === 0
                            ? <a href='#'>
                              <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled>
                                <span>
                                  <i className='la la-plus' />
                                  <span>
                                    Create New Broadcast
                                  </span>
                                </span>
                              </button>
                            </a>
                            : <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog}>
                              <span>
                                <i className='la la-plus' />
                                <span>
                                  Create New Broadcast
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
                                <h3>Create Broadcast</h3>
                                <p>To create a new broadcast from scratch, click on Create New Broadcast. To use a template broadcast and modify it, click on Use Template</p>
                                <div style={{width: '100%', textAlign: 'center'}}>
                                  <div style={{display: 'inline-block', padding: '5px'}}>
                                    <Link style={{color: 'white'}} onClick={this.gotoCreate} className='btn btn-primary'>
                                      Create New Broadcast
                                    </Link>
                                  </div>
                                  <div style={{display: 'inline-block', padding: '5px'}}>
                                    {this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_C'
                                    ? <Link to='/showTemplateBroadcasts' className='btn btn-primary'>
                                      Use Template
                                    </Link>
                                    : <button onClick={this.showProDialog} className='btn btn-primary'>
                                      Use Template&nbsp;&nbsp;&nbsp;
                                      <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                                        <span style={{color: '#34bfa3'}}>PRO</span>
                                      </span>
                                    </button>
                                  }
                                  </div>
                                </div>
                              </ModalDialog>
                            </ModalContainer>
                          }
                        </div>
                      </div>
                      <div className='form-row'>
                        <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                          <input type='text' placeholder='Search broadcasts by title' className='form-control' value={this.state.searchValue} onChange={this.searchBroadcast} />
                        </div>
                        <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                          <select className='custom-select' style={{width: '100%'}} value={this.state.filterValue} onChange={this.onFilter} >
                            <option value='' disabled>Filter by type...</option>
                            <option value='text'>text</option>
                            <option value='image'>image</option>
                            <option value='card'>card</option>
                            <option value='gallery'>gallery</option>
                            <option value='audio'>audio</option>
                            <option value='video'>video</option>
                            <option value='file'>file</option>
                            <option value='list'>list</option>
                            <option value='miscellaneous'>miscellaneous</option>
                            <option value=''>all</option>
                          </select>
                        </div>
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
                      <div>

                        { this.state.broadcastsData && this.state.broadcastsData.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{height: '53px'}}>
                              <th data-field='platform' style={{width: 100}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span >Title</span>
                              </th>
                              <th data-field='statement' style={{width: 120}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span>Type</span>
                              </th>
                              <th data-field='datetime' style={{width: 100}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span>Created At</span>
                              </th>
                              <th data-field='sent' style={{width: 100}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span >Sent</span>
                              </th>
                              <th data-field='seen' style={{width: 100}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span>Seen</span>
                              </th>
                              <th data-field='clicks' style={{width: 100}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span>Clicks</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                            this.state.broadcastsData.map((broadcast, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='platform' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span>{broadcast.title}</span></td>
                                <td data-field='type' style={{width: 120, textAlign: 'center'}} className='m-datatable__cell'><span >{(broadcast.payload.length > 1) ? 'Miscellaneous' : broadcast.payload[0].componentType}</span></td>
                                <td data-field='datetime' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span>{handleDate(broadcast.datetime)}</span></td>
                                <td data-field='sent' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span >{broadcast.sent}</span></td>
                                <td data-field='seen' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'>
                                  <span >
                                    {broadcast.seen}

                                  </span>
                                </td>
                                <td data-field='clicks' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span >{broadcast.clicks ? broadcast.clicks : 0}</span></td>
                              </tr>
                            ))
                          }
                          </tbody>
                        </table>
                        <div className='pagination'>
                          <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={<a>...</a>}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalLength / 10)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            forcePage={this.state.pageNumber}
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

      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    count: (state.broadcastsInfo.count),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage),
    subscribers: (state.subscribersInfo.subscribers),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList: loadBroadcastsList,
    addBroadcast: addBroadcast,
    sendbroadcast: sendbroadcast,
    clearAlertMessage: clearAlertMessage,
    loadSubscribersList: loadSubscribersList,
    allBroadcasts: allBroadcasts
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Convo)
