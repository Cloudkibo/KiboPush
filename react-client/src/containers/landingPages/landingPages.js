/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import CopyToClipboard from 'react-copy-to-clipboard'
import {fetchLandingPages, deleteLandingPage, setInitialState, editLandingPage} from '../../redux/actions/landingPages.actions'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import {deleteFiles, deleteFile, getFileIdFromUrl} from '../../utility/utils'
import YouTube from 'react-youtube'

class LandingPage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      landingPagesData: [],
      totalLength: 0,
      isShowingModalDelete: false,
      isShowingCreate: false,
      deleteid: '',
      showVideo: false,
      pageSelected: {},
      pages: [],
      isSetupShow: false,
      landing_Page_Url: '',
      openVideo: false
    }
    props.loadMyPagesList()
    props.fetchLandingPages()
    props.setInitialState()
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeCreateDialog = this.closeCreateDialog.bind(this)
    this.showCreateDialog = this.showCreateDialog.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.changePage = this.changePage.bind(this)
    this.updateAllowedPages = this.updateAllowedPages.bind(this)
    this.perviewLink = this.perviewLink.bind(this)
    this.setupLandingPage = this.setupLandingPage.bind(this)
    this.closeDialogSetup = this.closeDialogSetup.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }

  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoLandingPage.click()
  }

  activateLandingPage (landingPage) {
    this.props.editLandingPage(landingPage._id, { initialState: landingPage.initialState,
    submittedState: landingPage.submittedState,
    optInMessage: landingPage.optInMessage,
      isActive: true}, this.msg, 'Landing Page activated Successfully')
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Landing Pages`
  }

  changePage (e) {
    this.setState({pageSelected: e.target.value})
  }
  gotoCreate () {
    let pageId = this.props.pages.filter((page) => page._id === this.state.pageSelected)[0].pageId
    this.props.history.push({
      pathname: `/createLandingPage`,
      state: {pageId: pageId, _id: this.state.pageSelected}
    })
  }
  updateAllowedPages (pages, landingPages) {
    var temp = pages.filter((page) => {
      for (let i = 0; i < landingPages.length; i++) {
        // console.log('Comparing the two', bots[i].pageId._id, page._id, bots[i].pageId._id === page._id)
        if (landingPages[i].pageId._id === page._id) {
          return false
        }
      }
      return true
    })
    // console.log('Updating the allowed pages', temp)
    this.setState({pages: temp, pageSelected: temp && temp.length > 0 ? temp[0]._id : []})
  }
  onEdit (landingPage) {
    console.log('edit landing page called', landingPage)
    landingPage.currentTab= 'initialState'
    this.props.history.push({
      pathname: `/editLandingPage`,
      state: {module: 'edit', landingPage: landingPage}
    })
  }
  showCreateDialog () {
    if (this.state.pages.length === 0) {
      this.msg.error('You have already created landing pages for all pages.')
      return
    }
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
  displayData (n, landingPages) {
    console.log('in displayData', landingPages)
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > landingPages.length) {
      limit = landingPages.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = landingPages[i]
      index++
    }
    this.setState({landingPagesData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.landingPages)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.landingPages) {
      this.displayData(0, nextProps.landingPages)
      this.setState({totalLength: nextProps.landingPages.length})
    }
    if (nextProps.pages) {
      this.setState({pageSelected: nextProps.pages[0]._id})
    }
    if (nextProps.pages && nextProps.pages.length > 0 && nextProps.landingPages) {
      // this.state.pageSelected = nextProps.pages[0]._id
      this.updateAllowedPages(nextProps.pages, nextProps.landingPages)
    }
  }

  perviewLink (id) {
    window.open(`https://kiboengage.cloudkibo.com/landingPage/${id}`, '_blank')
  }
  setupLandingPage (id) {
    console.log('true in setup landing page')
    this.setState({isSetupShow: true, landing_Page_Url: `https://kiboengage.cloudkibo.com/landingPage/${id}`})
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
        <a href='#/' style={{ display: 'none' }} ref='videoLandingPage' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoLandingPage">videoLandingPage</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoLandingPage" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  LandingPage Video Tutorial
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
                  videoId='uiIiA-tiN4I'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
                }
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Delete Landing Page?
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Are you sure you want to delete this landing page?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  let landingPage = this.state.landingPagesData.find(m => m._id === this.state.deleteid)
                  if (landingPage.initialState && landingPage.initialState.mediaLink) {
                    let fileId = getFileIdFromUrl(landingPage.initialState.mediaLink)
                    deleteFile(fileId)
                  }
                  deleteFiles(landingPage.optInMessage)
                  this.props.deleteLandingPage(this.state.deleteid, this.msg)
                  this.closeDialogDelete()
                }} data-dismiss='modal'>Delete
              </button>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="setup" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    URL
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <div>
                <div className='form-group m-form__group m--margin-top-10'>
            Landing Page URL
            <input className='form-control m-input m-input--air' value={this.state.landing_Page_Url} />
                </div>
                <CopyToClipboard text={this.state.landing_Page_Url}
                  onCopy={() => {
                    this.setState({copied: true})
                    toastr.options = {
                      'closeButton': true,
                      'debug': false,
                      'newestOnTop': false,
                      'progressBar': false,
                      'positionClass': 'toast-bottom-right',
                      'preventDuplicates': false,
                      'showDuration': '300',
                      'hideDuration': '1000',
                      'timeOut': '5000',
                      'extendedTimeOut': '1000',
                      'showEasing': 'swing',
                      'hideEasing': 'linear',
                      'showMethod': 'fadeIn',
                      'hideMethod': 'fadeOut'
                    }

                    toastr.success('Link Copied Successfully', 'Copied!')
                  }
        }>
                  <button type='button' className='btn btn-success'>
            Copy Link
          </button>
                </CopyToClipboard>
              </div>
                </div>
              </div>
            </div>
          </div>
        {this.state.isShowingCreate &&
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Create Landing Page
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
                      this.state.pages.map((page, i) => (
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
        }
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Landing Pages</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Landing Pages? Here is the <a href='https://kibopush.com/landing-page' target='_blank' rel='noopener noreferrer'>documentation</a>.
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
                        Landing Pages
                      </h3>
                    </div>
                  </div>
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
                </div>
                <div className='m-portlet__body'>
                  <div className='form-row'>
                    { this.state.landingPagesData && this.state.landingPagesData.length > 0
                  ? <div className='col-md-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Page</span>
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
                        this.state.landingPagesData.map((landingPage, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='page' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{landingPage.pageId.pageName}</span></td>
                            <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '100px'}}>{landingPage.isActive ? 'Active' : 'Disabled'}</span></td>
                            <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '290px'}}>
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.onEdit(landingPage)}>
                                    Edit
                                </button>
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} data-toggle="modal" data-target="#delete" onClick={() => this.showDialogDelete(landingPage._id)}>
                                    Delete
                                </button>
                                {landingPage.isActive &&
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.perviewLink(landingPage._id)}>
                                    Preview
                                </button>
                                }
                                {landingPage.isActive &&
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} data-toggle="modal" data-target="#setup" onClick={() => this.setupLandingPage(landingPage._id)}>
                                    Setup
                                </button>
                                }
                                {!landingPage.isActive &&
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.activateLandingPage(landingPage)}>
                                    Activate
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
    landingPages: (state.landingPagesInfo.landingPages),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchLandingPages: fetchLandingPages,
    deleteLandingPage: deleteLandingPage,
    loadMyPagesList: loadMyPagesList,
    setInitialState: setInitialState,
    editLandingPage: editLandingPage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)
