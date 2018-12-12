/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import {fetchLandingPages, deleteLandingPage} from '../../redux/actions/landingPages.actions'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class LandingPage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      landingPagesData: [],
      totalLength: 0,
      isShowingModalDelete: false,
      deleteid: '',
      showVideo: false
    }
    props.fetchLandingPages()

    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.onEdit = this.onEdit.bind(this)
  }
  onEdit () {
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
                    <Link to='/createPost' className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
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
                              <span style={{width: '150px'}}>{landingPage.title}</span></td>
                            <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '100px'}}>{landingPage.isActive ? 'Active' : 'Disabled'}</span></td>
                            <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '150px'}}>
                                <Link to='/editLandingPage' className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.onEdit(landingPage)}>
                                    Edit
                                </Link>
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
    landingPages: (state.landingPagesInfo.landingPages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchLandingPages: fetchLandingPages,
    deleteLandingPage: deleteLandingPage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)
