/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import {fetchLandingPages, deleteLandingPage, setInitialState} from '../../redux/actions/landingPages.actions'
import { Link, browserHistory } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'

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
      pages: []
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
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Landing Pages`;
  }

  changePage (e) {
    this.setState({pageSelected: e.target.value})
  }
  gotoCreate () {
    let pageId = this.props.pages.filter((page) => page._id === this.state.pageSelected)[0].pageId
    browserHistory.push({
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
    browserHistory.push({
      pathname: `/createLandingPage`,
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

  componentWillReceiveProps (nextProps) {
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
              <h3>Delete Landing Page?</h3>
              <p>Are you sure you want to delete this landing page?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.props.deleteLandingPage(this.state.deleteid, this.msg)
                  this.closeDialogDelete()
                }}>Delete
              </button>
            </ModalDialog>
          </ModalContainer>
        }
        {
          this.state.isShowingCreate &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeCreateDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeCreateDialog}>
              <h3>Create Landing Page</h3>
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
                  <button className='btn btn-primary' onClick={() => this.gotoCreate()}>
                    Create
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
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
              Need help in understanding Landing Pages? Here is the <a href='http://kibopush.com/comment-capture' target='_blank'>documentation</a>.
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
                        Landing Pages
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
                          <th data-field='url'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Landing Page URL</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Status</span>
                          </th>
                          <th data-field='actions'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Actions</span>
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
                            <td data-field='url' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '150px'}}>{`https://kiboengage.cloudkibo.com/landingPage/${landingPage._id}`}</span></td>
                            <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '100px'}}>{landingPage.isActive ? 'Active' : 'Disabled'}</span></td>
                            <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '150px'}}>
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.onEdit(landingPage)}>
                                    Edit
                                </button>
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.showDialogDelete(landingPage._id)}>
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
    landingPages: (state.landingPagesInfo.landingPages),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchLandingPages: fetchLandingPages,
    deleteLandingPage: deleteLandingPage,
    loadMyPagesList: loadMyPagesList,
    setInitialState: setInitialState
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)
