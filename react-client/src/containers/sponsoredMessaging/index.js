/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import {deleteSponsoredMessage, createSponsoredMessage, fetchSponsoredMessages} from '../../redux/actions/sponsoredMessaging.actions'
import { Link, browserHistory } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class sponsoredMessaging extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      sponsoredMessages: [],
      totalLength: 0,
      isShowingModalDelete: false,
      isShowingCreate: false,
      deleteid: '',
      showVideo: false,
      pageSelected: {},
      pages: [],
      isSetupShow: false,
    }
     props.fetchSponsoredMessages()
     this.displayData = this.displayData.bind(this)
      this.closeDialogDelete = this.closeDialogDelete.bind(this)
      this.showDialogDelete = this.showDialogDelete.bind(this)
      this.onEdit = this.onEdit.bind(this)
      this.gotoCreate = this.gotoCreate.bind(this)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Sponsored Messaging`
  }

  changePage (e) {
    this.setState({pageSelected: e.target.value})
  }

  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }

  gotoCreate () {
    browserHistory.push({
      pathname: `/createsponsoredMessage`,
    })
  }
  onEdit (sponsoredMessage) {
    browserHistory.push({
      pathname: '/editSponsoredMessage',
      state: {module: 'edit', sponsoredMessage: sponsoredMessage}
    })
  }
  
  displayData (n, sponsoredMessages) {
    console.log('in displayData', sponsoredMessages)
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > sponsoredMessages.length) {
      limit = sponsoredMessages.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = sponsoredMessages[i]
      index++
    }
    this.setState({sponsoredMessages: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.sponsoredMessages)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.sponsoredMessages) {
      this.displayData(0, nextProps.sponsoredMessages)
      this.setState({totalLength: nextProps.sponsoredMessages.length})
    }
  }

 
 
  closeDialogSetup () {
    this.setState({isSetupShow: false})
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
    {
          this.state.isShowingModalDelete &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialogDelete}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialogDelete}>
              <h3>Delete Sponsored Message?</h3>
              <p>Are you sure you want to delete this sponsored message?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.props.deleteSponsoredMessage(this.state.deleteid, this.msg)
                  this.closeDialogDelete()
                }}>Delete
              </button>
            </ModalDialog>
          </ModalContainer>
        }
        
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Sponsored Messages</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Sponsored Messages? Here is the <a href='#' target='_blank'>documentation</a>.
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
                        Sponsored Messages
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <Link onClick={ () => {this.props.createSponsoredMessage(this.gotoCreate, {status:'draft'});}} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                      <span>
                        <i className='la la-plus' />
                        <span>
                          Create New
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='form-row'>
                    { this.state.sponsoredMessages && this.state.sponsoredMessages.length > 0
                  ? <div className='col-md-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Id</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Status</span>
                          </th>
                          <th data-field='actions'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '290px'}}>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                        this.state.sponsoredMessages.map((sponsoredMessage, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='page' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{sponsoredMessage._id}</span></td>
                            <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '100px'}}>{sponsoredMessage.status}</span></td>
                            <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '400px'}}>
                                <Link className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} to='/sponsoredMessaging/insights'>
                                    Insights
                                </ Link>
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.onEdit(sponsoredMessage)}>
                                    Edit
                                </button>
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.showDialogDelete(sponsoredMessage._id)}>
                                    Delete
                                </button>
                              </span>
                            </td>
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
                        activeClassName={'active'} />
                    </div>
                  </div>
                  : <div className='col-12'>
                    <p> No data to display </p>
                  </div>
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
    console.log('hhastate')
    console.log(state)
  return {
    sponsoredMessages: (state.sponsoredMessagingInfo.sponsoredMessages),
    //pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSponsoredMessages: fetchSponsoredMessages,
    createSponsoredMessage: createSponsoredMessage,
    deleteSponsoredMessage: deleteSponsoredMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(sponsoredMessaging)
