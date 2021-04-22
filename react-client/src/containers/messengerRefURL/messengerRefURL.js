/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import {fetchURLs, deleteURL, resetState} from '../../redux/actions/messengerRefURL.actions'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import YouTube from 'react-youtube'
import { deleteFiles } from '../../utility/utils'

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
      pageSelected: {},
      openVideo: false,
      pageName: ''
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
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
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
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoMessengerRef.click()
  }
  changePage (e) {
    let pageName = this.props.pages.filter((page) => page._id === e.target.value)[0].pageName
    console.log('pageName', pageName)
    this.setState({pageSelected: e.target.value , pageName:pageName})

  }
  gotoCreate () {
    this.props.resetState()
    let pageId = this.props.pages.filter((page) => page._id === this.state.pageSelected)[0].pageId
    console.log('pageId', pageId)
    this.props.history.push({
      pathname: `/createMessengerRefURL`,
      state: {_id: this.state.pageSelected, pageId: pageId, pageName:this.state.pageName, module: 'createMessage'}
    })
  }
  onEdit (messengerRefURL) {
    this.props.history.push({
      pathname: `/editMessengerRefURL`,
      state: {module: 'edit', messengerRefURL: messengerRefURL, pageName:messengerRefURL.pageId.pageName}
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

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.messengerRefURLs) {
      this.displayData(0, nextProps.messengerRefURLs)
      this.setState({totalLength: nextProps.messengerRefURLs.length})
    }
    if (nextProps.pages) {
      this.setState({pageSelected: nextProps.pages[0]._id, pageName: nextProps.pages[0].pageName})
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
        <a href='#/' style={{ display: 'none' }} ref='videoMessengerRef' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoMessengerRef">videoMessengerRefModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoMessengerRef" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Messenger Ref Url Video Tutorial
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      this.setState({
                        openVideo: false
                      })}}>
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                {this.state.openVideo && <YouTube
                  videoId='QIg23sgjmzo'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />}
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Delete Messenger Ref URL?
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Are you sure you want to delete this messenger Ref URL?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  let messengerRefURLReply = this.state.messengerRefURLsData.find(m => m._id === this.state.deleteid).reply
                  deleteFiles(messengerRefURLReply)
                  this.props.deleteURL(this.state.deleteid, this.msg)
                  this.closeDialogDelete()
                }} data-dismiss='modal'>Delete
              </button>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Create Messenger Ref URL
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
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
                  <button className='btn btn-primary' onClick={() => this.gotoCreate()} data-dismiss='modal'>
                    Create
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
              Need help in understanding Messenfer Ref URLs? Here is the <a href='http://kibopush.com/messenger-ref-url' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
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
                  {
                    this.props.user.permissions['create_messnger_ref_urls'] &&
                    <div className='m-portlet__head-tools'>
                      <a href='#/' data-toggle="modal" data-target="#create" onClick={this.showCreateDialog} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Create New
                          </span>
                        </span>
                      </a>
                    </div>
                  }
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
                                {
                                  this.props.user.permissions['update_messenger_ref_urls'] &&
                                  <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.onEdit(messengerRefURL)}>
                                      Edit
                                  </button>
                                }
                                {
                                  this.props.user.permissions['delete_messenger_ref_urls'] &&
                                  <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} data-toggle="modal" data-target="#delete" onClick={() => this.showDialogDelete(messengerRefURL._id)}>
                                      Delete
                                  </button>
                                }
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
                        breakLabel={<a href='#/'>...</a>}
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
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user)
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
