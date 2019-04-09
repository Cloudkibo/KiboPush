/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadBroadcastsList, loadTwilioNumbers } from '../../redux/actions/smsBroadcasts.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { browserHistory, Link } from 'react-router'
import { loadContactsList } from '../../redux/actions/uploadContacts.actions'

class SmsBroadcast extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      broadcastsData: [],
      totalLength: 0,
      pageNumber: 0,
      isShowingModal: false,
      numberValue: ''
    }

    props.loadContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
    props.loadBroadcastsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
    props.loadTwilioNumbers()

    this.displayData = this.displayData.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.onNumberChange = this.onNumberChange.bind(this)
  }

  onNumberChange (e) {
    this.setState({numberValue: e.target.value})
  }

  gotoCreate (broadcast) {
    browserHistory.push({
      pathname: `/createsmsBroadcast`,
      state: {number: this.state.numberValue}
    })
  }

  showDialog () {
    this.setState({isShowingModal: true})
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
      this.props.loadBroadcastsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadBroadcastsList({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next'
      })
    } else {
      this.props.loadBroadcastsList({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[0]._id : 'none',
        number_of_records: 10,
        first_page: 'previous'
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

  componentWillReceiveProps (nextProps) {
    console.log('in componentWillReceiveProps of smsBroadcasts', nextProps)
    if (nextProps.broadcasts && nextProps.count) {
      this.displayData(0, nextProps.broadcasts)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({ broadcastsData: [], totalLength: 0 })
    }
    if (nextProps.twilioNumbers && nextProps.twilioNumbers.length > 0) {
      console.log('inside', nextProps.twilioNumbers[0])
      this.setState({numberValue: nextProps.twilioNumbers[0]})
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
          {
            this.state.isShowingModal &&
            <ModalContainer style={{width: '500px'}}
              onClose={this.closeDialog}>
              <ModalDialog style={{width: '500px'}}
                onClose={this.closeDialog}>
                <h3>Create Broadcast</h3>
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
                    <button style={{color: 'white'}} onClick={this.gotoCreate} className='btn btn-primary'>
                      Create New Broadcast
                    </button>
                  </div>
                </div>
              </ModalDialog>
            </ModalContainer>
          }
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
              Need help in understanding broadcasts? Here is the <a href='https://kibopush.com/twilio/' target='_blank'>documentation</a>.
            </div>
          </div>
          <div className='row'>
            <div
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
                      <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog} disabled={this.props.contacts && this.props.contacts.length === 0}>
                        <span>
                          <i className='la la-plus' />
                          <span>Create New</span>
                        </span>
                      </button>

                    </div>
                  </div>
                  <div className='m-portlet__body'>
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
                          <th data-field='sent'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Sent From</span>
                          </th>
                          <th data-field='delivered'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Delivered</span>
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
                            <td data-field='sent' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.phoneNumber}</span></td>
                            <td data-field='delivered' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.sent}</span></td>
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
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    broadcasts: (state.smsBroadcastsInfo.broadcasts),
    count: (state.smsBroadcastsInfo.count),
    twilioNumbers: (state.smsBroadcastsInfo.twilioNumbers),
    contacts: (state.contactsInfo.contacts)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList,
    loadTwilioNumbers,
    loadContactsList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SmsBroadcast)
