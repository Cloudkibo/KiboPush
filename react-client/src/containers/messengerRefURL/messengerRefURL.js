/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import {fetchURLs, deleteURL, resetState} from '../../redux/actions/messengerRefURL.actions'
import { Link } from 'react-router-dom'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'

class MessengerRefURL extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      messengerRefURLsData: [],
      totalLength: 0,
      isShowingModalDelete: false,
      isShowingCreate: false,
      deleteid: '',
      showVideo: false,
      pageSelected: {}
    }
    props.loadMyPagesList()
    props.fetchURLs()

    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeCreateDialog = this.closeCreateDialog.bind(this)
    this.showCreateDialog = this.showCreateDialog.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.changePage = this.changePage.bind(this)
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Messenger References`
  }

  changePage (e) {
    this.setState({pageSelected: e.target.value})
  }
  gotoCreate () {
    this.props.resetState()
    let pageId = this.props.pages.filter((page) => page._id === this.state.pageSelected)[0].pageId
    console.log('pageId', pageId)
    this.props.history.push({
      pathname: `/createMessengerRefURL`,
      state: {_id: this.state.pageSelected, pageId: pageId, module: 'createMessage'}
    })
  }
  onEdit (messengerRefURL) {
    this.props.history.push({
      pathname: `/editMessengerRefURL`,
      state: {module: 'edit', messengerRefURL: messengerRefURL}
    })
  }
  showCreateDialog () {
    this.setState({isShowingCreate: true})
  }
  closeCreateDialog () {
    this.setState({isShowingCreate: false})
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }
  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }
  displayData (n, messengerRefURLs) {
    console.log('in displayData', messengerRefURLs)
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > messengerRefURLs.length) {
      limit = messengerRefURLs.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = messengerRefURLs[i]
      index++
    }
    this.setState({messengerRefURLsData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.messengerRefURLs)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.messengerRefURLs) {
      this.displayData(0, nextProps.messengerRefURLs)
      this.setState({totalLength: nextProps.messengerRefURLs.length})
    }
    if (nextProps.pages) {
      this.setState({pageSelected: nextProps.pages[0]._id})
    }
  }

  render () {
    console.log('this.props.messengerRefURLs', this.props.messengerRefURLs)
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
        {/*
          this.state.isShowingModalDelete &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialogDelete}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialogDelete}>
              <h3>Delete Messenger Ref URL?</h3>
              <p>Are you sure you want to delete this messenger Ref URL?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.props.deleteURL(this.state.deleteid, this.msg)
                  this.closeDialogDelete()
                }}>Delete
              </button>
            </ModalDialog>
          </ModalContainer>
        */}
        {/*
          this.state.isShowingCreate &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeCreateDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeCreateDialog}>
              <h3>Create Messenger Ref URL</h3>
              <div className='m-form'>
                <div className='form-group m-form__group'>
                  <label className='control-label'>Select Page:&nbsp;&nbsp;&nbsp;</label>
                  <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.pageSelected} onChange={this.changePage}>
                    {
                      this.props.pages.map((page, i) => (
                        <option key={i} value={page._id}>{page.pageName}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px', float: 'right'}}>
                  <button className='btn btn-primary' onClick={() => this.gotoCreate()}>
                    Create
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        */}
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Messenger Ref URL</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Messenfer Ref URLs? Here is the <a href='http://kibopush.com/comment-capture' target='_blank'>documentation</a>.
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
                        Messenger Ref Urls
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <Link onClick={this.showCreateDialog} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
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
                    { this.state.messengerRefURLsData && this.state.messengerRefURLsData.length > 0
                  ? <div className='col-md-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Page</span>
                          </th>
                          <th data-field='url'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '300px'}}>URL</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '200px'}}>Ref-Parameter</span>
                          </th>
                          <th data-field='actions'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                        this.state.messengerRefURLsData.map((messengerRefURL, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='page' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{messengerRefURL.pageId.pageName}</span></td>
                            <td data-field='url' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '300px'}}>{`https://m.me/${messengerRefURL.pageId.pageId}?ref=${messengerRefURL.ref_parameter}`}</span></td>
                            <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '200px'}}>{messengerRefURL.ref_parameter}</span></td>
                            <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '150px'}}>
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.onEdit(messengerRefURL)}>
                                    Edit
                                </button>
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.showDialogDelete(messengerRefURL._id)}>
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
  console.log(state)
  return {
    messengerRefURLs: (state.messengerRefURLInfo.messengerRefURLs),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchURLs: fetchURLs,
    deleteURL: deleteURL,
    resetState: resetState,
    loadMyPagesList: loadMyPagesList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessengerRefURL)
