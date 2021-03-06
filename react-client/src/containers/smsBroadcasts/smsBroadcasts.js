/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadBroadcastsList, loadTwilioNumbers, saveCurrentSmsBroadcast, clearSmsAnalytics, updateSmsBroadcasts} from '../../redux/actions/smsBroadcasts.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import { loadContactsList } from '../../redux/actions/uploadContacts.actions'
import { RingLoader } from 'halogenium'

class SmsBroadcast extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      broadcastsData: [],
      totalLength: 0,
      pageNumber: 0,
      isShowingModal: false,
      numberValue: '',
      showPopover: false,
      loading: true,
      searchValue: '',
      isFollowupFilter: ''
    }

    props.loadContactsList({last_id: 'none', number_of_records: 10, first_page: 'first', filter_criteria: {followup_value: ''}})
    props.loadBroadcastsList({last_id: 'none', number_of_records: 10, first_page: 'first', filter_criteria: {followup_value: ''}})
    props.loadTwilioNumbers()
    props.saveCurrentSmsBroadcast(null)
    props.clearSmsAnalytics()

    this.displayData = this.displayData.bind(this)
    this.showPopover = this.showPopover.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.onNumberChange = this.onNumberChange.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.createFollowUp = this.createFollowUp.bind(this)
    this.searchBroadcast = this.searchBroadcast.bind(this)
    this.isFollowupFilter = this.isFollowupFilter.bind(this)
    this.isFilterApplied = this.isFilterApplied.bind(this)
  }

  showPopover () {
    this.setState({showPopover: true})
  }
  isFollowupFilter (e) {
    this.setState({isFollowupFilter: e.target.value})
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({pageNumber: 0})
      this.props.loadBroadcastsList({title: this.state.searchValue, last_id: 'none', number_of_records: 10, first_page: 'first', filter_criteria: {followup_value: e.target.value}})
    } else {
      this.setState({pageNumber: 0})
      this.props.loadBroadcastsList({title: this.state.searchValue, last_id: 'none', number_of_records: 10, first_page: 'first', filter_criteria: {followup_value: ''}})
    }
  }
  onNumberChange (e) {
    this.setState({numberValue: e.target.value})
  }
  createFollowUp () {
    this.props.history.push({
      pathname: `/createFollowupBroadcast`
    })
  }
  searchBroadcast (event) {
    this.setState({
      searchValue: event.target.value, pageNumber:0
    })
    if (event.target.value !== '') {
      this.props.loadBroadcastsList({title: event.target.value, last_id: 'none', number_of_records: 10, first_page: 'first', filter_criteria: {followup_value: this.state.isFollowupFilter}})
    } else {
      this.props.loadBroadcastsList({title: '', last_id: 'none', number_of_records: 10, first_page: 'first', filter_criteria: {followup_value: this.state.isFollowupFilter}})
    }
  }
  gotoCreate (broadcast) {
    this.props.history.push({
      pathname: `/createsmsBroadcast`,
      state: {number: this.state.numberValue}
    })
  }
  
  gotoView (broadcast) {
    this.props.saveCurrentSmsBroadcast(broadcast)
    this.props.history.push({
      pathname: `/viewBroadcast`,
    })
  }

  showDialog () {
    this.setState({isShowingModal: true, showPopover: false})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
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
    if (data.selected === 0) {
      this.props.loadBroadcastsList({title: this.state.searchValue, last_id: 'none', number_of_records: 10, first_page: 'first', filter_criteria: {followup_value: this.state.isFollowupFilter}})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadBroadcastsList({
        title: this.state.searchValue,
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        filter_criteria: {followup_value: this.state.isFollowupFilter}
      })
    } else {
      this.props.loadBroadcastsList({
        title: this.state.searchValue,
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[0]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        filter_criteria: {followup_value: this.state.isFollowupFilter}
      })
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.broadcasts)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Broadcasts`
  }
  isFilterApplied () {
    let isFilter = false
    if (this.state.searchValue !== '' || (this.state.isFollowupFilter !== '' && this.state.isFollowupFilter !== 'all')) {
      isFilter = true
    }
    return isFilter
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('in UNSAFE_componentWillReceiveProps of smsBroadcasts', nextProps)
    if (nextProps.broadcasts && nextProps.count) {
      this.displayData(0, nextProps.broadcasts)
      this.setState({ totalLength: nextProps.count, loading: false })
    } else {
      this.setState({ broadcastsData: [], totalLength: 0, loading: false })
    }
    if (nextProps.twilioNumbers && nextProps.twilioNumbers.length > 0) {
      console.log('inside', nextProps.twilioNumbers[0])
      this.setState({numberValue: nextProps.twilioNumbers[0]})
    }
    if (nextProps.newSmsBroadcast && this.state.pageNumber === 0 && !this.isFilterApplied() && nextProps.newSmsBroadcast.user !== this.props.user._id) {
     nextProps.updateSmsBroadcasts(nextProps.newSmsBroadcast.broadcast)
    }
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        
        <div className='m-subheader '>
          {
            this.props.contacts && this.props.contacts.length === 0 &&
            <div className='m-alert m-alert--icon m-alert--icon-solid m-alert--outline alert alert-warning alert-dismissible fade show' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation-1' style={{color: 'white'}} />
                <span />
              </div>
              <div className='m-alert__text'>
                <strong>
                0 Subscribers!&nbsp;
                </strong>
                You do not have any subscribers. Please click <Link style={{cursor: 'pointer'}} to='/uploadContacts' >here</Link> to add subscribers
              </div>
            </div>
          }
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title">
                  Create Broadcast
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Select your Twilio Number to send broadcast from:</p>
                <div style={{width: '100%', textAlign: 'center'}}>
                  <div className='form-group m-form__group'>
                    <select className='custom-select' style={{width: '100%'}} value={this.state.numberValue} onChange={this.onNumberChange} >
                      {this.props.twilioNumbers && this.props.twilioNumbers.length > 0 && this.props.twilioNumbers.map((number) => (
                        <option value={number}>{number}</option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <div style={{display: 'inline-block', padding: '5px'}}>
                    <button style={{color: 'white'}} onClick={this.gotoCreate} className='btn btn-primary'
                    data-dismiss='modal'>
                      Create New Broadcast
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Broadcasts</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding broadcasts? Here is the <a href='https://kibopush.com/twilio/' target='_blank' rel='noopener noreferrer'>documentation</a>.
            </div>
          </div>
          <div className='row'>
           { this.state.loading
            ? <div className='align-center col-12'><center><RingLoader color='#FF5E3A' /></center></div>
            : <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <h3 className='m-portlet__head-text'>
                          Broadcasts
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      <div className='m-dropdown m-dropdown--inline m-dropdown--arrow' data-dropdown-toggle='click' aria-expanded='true' onClick={() => {this.setState({showPopover: true})}} disabled={this.props.contacts && this.props.contacts.length === 0}>
                        <a href='#/' className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill m-dropdown__toggle btn btn-primary dropdown-toggle'>
                        Create New
                        </a>
                        {
                            this.state.showPopover &&
                            <div className='m-dropdown__wrapper' style={{width: '200px'}}>
                              <span className='m-dropdown__arrow m-dropdown__arrow--left m-dropdown__arrow--adjust' />
                              <div className='m-dropdown__inner'>
                                <div className='m-dropdown__body'>
                                  <div className='m-dropdown__content'>
                                    <ul className='m-nav'>
                                      <li className='m-nav__item'>
                                        <a href='#/' data-toggle="modal" data-target="#create" onClick={this.showDialog} className='m-nav__link' style={{cursor: 'pointer'}}>
                                          <span className='m-nav__link-text'>
                                            New Broadcast
                                          </span>
                                        </a>
                                      </li>
                                      { this.state.broadcastsData && this.state.broadcastsData.length > 0  
                                      ? <li className='m-nav__item'>
                                        <a href='#/' onClick={this.createFollowUp} className='m-nav__link' style={{cursor: 'pointer'}}>
                                          <span className='m-nav__link-text'>
                                            Follow-up Broadcast
                                          </span>
                                        </a>
                                      </li>
                                      : <li className='m-nav__item'>
                                          <span className='m-nav__link-text' style={{color: 'lightgrey', cursor: 'not-allowed'}}>
                                            Follow-up Broadcast
                                          </span>
                                      </li>
                                      }
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    <div className='row' style={{marginBottom: '20px'}}>
                      <div className='col-md-8'>
                          <div className='m-input-icon m-input-icon--left'>
                              <input type='text' className='form-control m-input m-input--solid' value={this.state.searchValue} placeholder='Search broadcasts by title' onChange={this.searchBroadcast} />
                              <span className='m-input-icon__icon m-input-icon__icon--left'>
                                <span><i className='la la-search' /></span>
                              </span>
                          </div>
                        </div>
                        <div className= 'col-md-4'>
                          <select className='custom-select' style={{width: '100%'}} value= {this.state.isFollowupFilter} onChange={this.isFollowupFilter}>
                            <option value='' disabled>Filter by Follow-up...</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                            <option value='all'>All</option>
                          </select>
                        </div>
                      </div>
                    { this.state.broadcastsData && this.state.broadcastsData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='platform'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Platform</span>
                          </th>
                          <th data-field='title'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Title</span>
                          </th>
                          <th data-field='createdAt'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Created At</span>
                          </th>
                          <th data-field='sentFrom'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Sent From</span>
                          </th>
                          <th data-field='sent'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Sent</span>
                          </th>
                          <th data-field='isFollowUp'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Is Follow Up</span>
                          </th>
                          <th data-field='action'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Action</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {this.state.broadcastsData.map((broadcast, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='platform' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.platform}</span></td>
                            <td data-field='title' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.title}</span></td>
                            <td data-field='createAt' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.datetime}</span></td>
                            <td data-field='sentFrom' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.phoneNumber}</span></td>
                            <td data-field='sent' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.sent}</span></td>
                            <td data-field='isFollowUp' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.followUp ? "Yes" : "No"}</span></td>
                            <td data-field='action' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}><button style={{width: '60px'}} className='btn btn-primary btn-sm m-btn--pill' onClick={() => {this.gotoView(broadcast)}}>View</button></span></td>
                          </tr>
                        ))
                      }
                      </tbody>
                    </table>
                    <div className='pagination'>
                      <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a href='#/'>...</a>}
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
          }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    broadcasts: (state.smsBroadcastsInfo.broadcasts),
    count: (state.smsBroadcastsInfo.count),
    twilioNumbers: (state.smsBroadcastsInfo.twilioNumbers),
    contacts: (state.contactsInfo.contacts),
    newSmsBroadcast: (state.smsBroadcastsInfo.newSmsBroadcast),
    user: (state.basicInfo.user),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList,
    loadTwilioNumbers,
    loadContactsList,
    saveCurrentSmsBroadcast,
    clearSmsAnalytics,
    updateSmsBroadcasts
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SmsBroadcast)
