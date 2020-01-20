/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import {fetchOverlayWidgets, deleteOverlayWidget, saveCurrentWidget} from '../../redux/actions/overlayWidgets.actions'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'

class OverlayWidgets extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      widgets: [],
      totalLength: 0,
      isShowingModalDelete: false,
      isShowingCreate: false,
      deleteid: '',
      showVideo: false,
      isSetupShow: false,
      filter: false,
      searchValue: '',
      pageNumber: 0,
      status: '', 
      page_value: '',
      type_value: ''
    }

    props.fetchOverlayWidgets({
      last_id: 'none', 
      number_of_records: 10, 
      first_page: 'first',
      page_value: '',
      status_value: '',
      type_value: ''
    })
    props.saveCurrentWidget(null)
    //props.setInitialState()
    this.handlePageClick = this.handlePageClick.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.closeDialogSetup = this.closeDialogSetup.bind(this)
    this.searchWidgets = this.searchWidgets.bind(this)
    this.onStatusFilter = this.onStatusFilter.bind(this)
    this.onPageFilter = this.onPageFilter.bind(this)
    this.onTypeFilter = this.onTypeFilter.bind(this)
    this.getWidgetType = this.getWidgetType.bind(this)
    this.isAnyFilter = this.isAnyFilter.bind(this)
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Overlay Widgets`
  }
  
  isAnyFilter(search, page, status, type) {
    if (search !== '' || page !== '' || status !== '' || type !== '') {
      this.setState({
        filter: true
      })
    } else {
      this.setState({
        filter: false
      })
    }
  }

  getWidgetType (type) {
    var value = ''
    if (type === 'slide_in') {
      value = 'Slide In'
    } else if (type === 'bar') {
      value= 'Bar'
    } else if (type === 'modal') {
      value = 'Modal'
    } else if (type === 'page_takeover') {
      value = 'Page Takeove'
    }
    return value
  } 
  onPageFilter (event) {
    this.setState({
      page_value: event.target.value, pageNumber:0
    })
    this.isAnyFilter(this.state.searchValue, event.target.value, this.state.status, this.state.type_value)
    if (event.target.value !== '') {
      this.props.fetchOverlayWidgets({last_id: this.props.overlayWidgets.length > 0 ? this.props.overlayWidgets[this.props.overlayWidgets.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, status_value: this.state.status, page_value: event.target.value, type_value: this.state.type_value})
    } else {
      this.props.fetchOverlayWidgets({last_id: this.props.overlayWidgets.length > 0 ? this.props.overlayWidgets[this.props.overlayWidgets.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, status_value: this.state.status, page_value: '', type_value: this.state.type_value})
    }
  }
  onTypeFilter (event) {
    this.setState({
      type_value: event.target.value, pageNumber:0
    })
    this.isAnyFilter(this.state.searchValue, this.state.page_value, this.state.status, event.target.value)
    if (event.target.value !== '') {
      this.props.fetchOverlayWidgets({last_id: this.props.overlayWidgets.length > 0 ? this.props.overlayWidgets[this.props.overlayWidgets.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, status_value: this.state.status, page_value: this.state.page_value, type_value: event.target.value})
    } else {
      this.props.fetchOverlayWidgets({last_id: this.props.overlayWidgets.length > 0 ? this.props.overlayWidgets[this.props.overlayWidgets.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, status_value: this.state.status, page_value: this.state.page_valye, type_value: ''})
    }
  }
  onStatusFilter (event) {
    this.setState({
      status: event.target.value, pageNumber:0
    })
    this.isAnyFilter(this.state.searchValue, this.state.page_value, event.target.value, this.state.type_value)
    if (event.target.value !== '') {
      this.props.fetchOverlayWidgets({last_id: this.props.overlayWidgets.length > 0 ? this.props.overlayWidgets[this.props.overlayWidgets.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, status_value: event.target.value, page_value: this.state.page_value, type_value: this.state.type_value})
    } else {
      this.props.fetchOverlayWidgets({last_id: this.props.overlayWidgets.length > 0 ? this.props.overlayWidgets[this.props.overlayWidgets.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, status_value: '', page_value: this.state.page_value, type_value: this.state.type_value})
    }
  }
  searchWidgets (event) {
    this.setState({
      searchValue: event.target.value, pageNumber:0
    })
    this.isAnyFilter(event.target.value, this.state.page_value, this.state.status, this.state.type_value)
    if (event.target.value !== '') {
      this.props.fetchOverlayWidgets({last_id: this.props.overlayWidgets.length > 0 ? this.props.overlayWidgets[this.props.overlayWidgets.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: event.target.value.toLowerCase(), status_value: this.state.status, page_value: this.state.page_value, type_value: this.state.type_value})
    } else {
      this.props.fetchOverlayWidgets({last_id: this.props.overlayWidgets.length > 0 ? this.props.overlayWidgets[this.props.overlayWidgets.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: '', status_value: this.state.status, page_value: this.state.page_value, type_value: this.state.type_value})
    }
  }
  gotoCreate () {
    this.props.history.push({
      pathname: `/createOverlayWidget`
    })
  }
  onEdit (widget) {
    this.props.saveCurrentWidget(widget)
    this.props.history.push({
      pathname: `/createOverlayWidget`
    })
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }
  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }

  displayData (n, widgets) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > widgets.length) {
      limit = widgets.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = widgets[i]
      index++
    }
    this.setState({widgets: data})
  }

  handlePageClick(data) {
    console.log('data.selected', data.selected)
    if (data.selected === 0) {
      this.props.fetchOverlayWidgets({
        last_id: 'none',
        number_of_records: 10,
        first_page: 'first',
        search_value: this.state.searchValue,
        status_value: this.state.status,
        page_value: this.state.page_value,
        type_value: this.state.type_value
      })
    } else if (this.state.pageNumber < data.selected) {
      this.props.fetchOverlayWidgets({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.overlayWidgets.length > 0 ? this.props.overlayWidgets[this.props.overlayWidgets.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        search_value: this.state.searchValue,
        status_value: this.state.status,
        page_value: this.state.page_value,
        type_value: this.state.type_value
      })
    } else {
      this.props.fetchOverlayWidgets({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.overlayWidgets.length > 0 ? this.props.overlayWidgets[this.props.overlayWidgets.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        search_value: this.state.searchValue,
        status_value: this.state.status,
        page_value: this.state.page_value,
        type_value: this.state.type_value
      })
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.overlayWidgets)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.overlayWidgets) {
      this.displayData(0, nextProps.overlayWidgets)
    }
    if (nextProps.widgetsCount) {
      this.setState({ totalLength: nextProps.widgetsCount })
    }
  }

  setupOverlayWidget (id) {
    console.log('true in setup landing page')
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Delete Overlay Widget?
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Are you sure you want to delete this overlay widget?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.props.deleteOverlayWidget(this.state.deleteid, this.msg)
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
                    Setup
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <div />
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Overlay Widgets</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Overlay Widgets? Here is the <a href='http://kibopush.com/overlay_widgets' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Overlay Widgets
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <a href='#/' data-toggle="modal" data-target="#create" onClick={this.gotoCreate} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
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
                { (this.state.widgets && this.state.widgets.length > 0) || this.state.filter
                ? <div className='row' style={{marginBottom: '15px', marginLeft: '5px'}}>
                    <div className='col-md-12' style={{marginBottom: '15px'}}>
                      <input type='text' style={{width: '50%'}} placeholder='Search Widgets..' className='form-control' value={this.state.searchValue} onChange={this.searchWidgets} />
                    </div>
                    <div className='col-md-4'>
                      <select className='custom-select' style={{width: '100%'}} value= {this.state.status} onChange={this.onStatusFilter}>
                        <option value='' disabled>Filter by Status...</option>
                        <option value=''>All</option>
                        <option value='true'>Active</option>
                        <option value='false'>In Active</option>
                      </select>
                    </div>
                    <div className='col-md-4'>
                      <select className='custom-select' style={{width: '100%'}} value= {this.state.page_value} onChange={this.onPageFilter}>
                        <option value='' disabled>Filter by Page...</option>
                        <option value=''>All</option>
                        {
                          this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                            page.connected &&
                            <option key={page._id} value={page._id} selected={page._id === this.state.page_value}>{page.pageName}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div className='col-md-4'>
                      <select className='custom-select' style={{width: '100%'}} value= {this.state.type_value} onChange={this.onTypeFilter}>
                        <option value='' disabled>Filter by Type...</option>
                        <option value=''>All</option>
                        <option value='bar'>Bar</option>
                        <option value='slide_in'>Slide In</option>
                        <option value='modal'>Modal</option>
                        <option value='page_takeover'>Page Takeover</option>
                      </select>
                    </div>
                  </div>
                : <div />
                }
                  <div className='form-row'>
                    { this.state.widgets && this.state.widgets.length > 0
                  ? <div className='col-md-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Title</span>
                          </th>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Page</span>
                          </th>
                          <th data-field='type'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Type</span>
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
                        this.props.overlayWidgets.map((widget, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='page' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{widget.title}</span></td>  
                            <td data-field='page' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{this.props.pages.filter((page) => page._id === widget.pageId)[0].pageName}</span></td>
                            <td data-field='status' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{this.getWidgetType(widget.widgetType)}</span></td>
                            <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '100px'}}>{widget.isActive ? 'Active' : 'Disabled'}</span></td>
                            <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '290px'}}>
                                <button className='btn btn-primary btn-sm' style={{margin: 2, marginLeft: '40px'}} onClick={() => this.onEdit(widget)}>
                                    Edit
                                </button>
                                <button className='btn btn-primary btn-sm' style={{margin: 2}} data-toggle="modal" data-target="#delete" onClick={() => this.showDialogDelete(widget._id)}>
                                    Delete
                                </button>
                                <button className='btn btn-primary btn-sm' style={{margin: 2}} data-toggle="modal" data-target="#setup" onClick={() => this.setupOverlayWidget(widget._id)}>
                                    Setup
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
    overlayWidgets: (state.overlayWidgetsInfo.overlayWidgets),
    widgetsCount: (state.overlayWidgetsInfo.widgetsCount),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchOverlayWidgets: fetchOverlayWidgets,
    deleteOverlayWidget: deleteOverlayWidget,
    saveCurrentWidget: saveCurrentWidget,
    loadMyPagesList: loadMyPagesList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OverlayWidgets)
