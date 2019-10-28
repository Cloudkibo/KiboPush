/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesListNew } from '../../redux/actions/pages.actions'
import { requestMessengerCode, resetState, fetchCodes, deleteCode, updateData } from '../../redux/actions/messengerCode.actions'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import ReactPaginate from 'react-paginate'


class MessengerCode extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      messengerCodesData: [],
      totalLength: 0,
      isShowingCreate: false,
      isShowPreview: false,
      QRCodeToPreview: '',
      pageSelected: {},
      pagesToShow: [],
      isShowingModalDelete: false,
      codetoDelete: ''
    }
    props.loadMyPagesListNew({ last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: { search_value: '' } })
    this.showCreateDialog = this.showCreateDialog.bind(this)
    this.closeCreateDialog = this.closeCreateDialog.bind(this)
    this.showPreviewDialog = this.showPreviewDialog.bind(this)
    this.closePrviewDialog = this.closePrviewDialog.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.changePage = this.changePage.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.onEdit = this.onEdit.bind(this)

  }

  showDialogDelete(id) {
    this.setState({ isShowingModalDelete: true })
    this.setState({ codetoDelete: id })
  }
  closeDialogDelete() {
    this.setState({ isShowingModalDelete: false })
  }

  displayData(n, messengerCodes) {
    console.log('in displayData', messengerCodes)
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > messengerCodes.length) {
      limit = messengerCodes.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = messengerCodes[i]
      index++
    }
    this.setState({ messengerCodesData: data })
  }

  handlePageClick(data) {
    this.displayData(data.selected, this.props.messengerCodes)
  }

  showCreateDialog() {
    this.setState({ isShowingCreate: true })
  }
  closeCreateDialog() {
    this.setState({ isShowingCreate: false })
  }
  showPreviewDialog(code) {
    this.setState({ isShowPreview: true, QRCodeToPreview: code })

  }
  closePrviewDialog() {
    this.setState({ isShowPreview: false, QRCodeToPreview: '' })

  }

  changePage(e) {
    this.setState({ pageSelected: e.target.value })
    this.props.resetState()
    var edit = {
      page_id: e.target.value._id,
      pageId: e.target.value.pageId,
      optInMessage: this.props.messengerCode.optInMessage,
      QRCode: this.props.messengerCode.QRCode
    }
    this.props.requestMessengerCode(edit)
  }

  gotoCreate() {
    console.log('this.props.messengerCode', this.props.messengerCode)
    this.props.history.push({
      pathname: `/createMessengerCode`,
      state: { module: 'createMessage', messengerCode: this.props.messengerCode }
    })
  }

  onEdit(messengerCode) {
    this.props.history.push({
      pathname: `/editMessengerCode`,
      state: { module: 'edit', messengerCode }
    })
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Messenger Code`;
    this.props.fetchCodes()
  }

  componentWillMount() {
    var edit = {
      page_id: this.props.pages[0]._id,
      pageId: this.props.pages[0].pageId,
      optInMessage: this.props.messengerCode.optInMessage,
      QRCode: this.props.messengerCode.QRCode
    }
    this.props.requestMessengerCode(edit)
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextprops', nextProps)
    if (nextProps.pages) {
      this.setState({
        pageSelected: nextProps.pages[0]
      })
      if (nextProps.messengerCodes) {
        var tempPages = []
        var codeIds = []
        nextProps.messengerCodes.map(code => {
          codeIds.push(code.pageId._id)
        })
        nextProps.pages.map(page => {
          if (!codeIds.includes(page._id)) tempPages.push(page)
        })
        this.setState({ pagesToShow: tempPages })
      }
    }
    if (nextProps.messengerCodes) {
      this.displayData(0, nextProps.messengerCodes)
      this.setState({ totalLength: nextProps.messengerCodes.length })
    }
  }

  render() {
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
          <ModalContainer style={{ width: '500px' }}
            onClose={this.closeDialogDelete}>
            <ModalDialog style={{ width: '500px' }}
              onClose={this.closeDialogDelete}>
              <h3>Delete Messenger Code?</h3>
              <p>Are you sure you want to delete this messenger Code?</p>
              <button style={{ float: 'right' }}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.props.deleteCode(this.state.codetoDelete, this.msg)
                  this.closeDialogDelete()
                }}>Delete
              </button>
            </ModalDialog>
          </ModalContainer>
        */}
        {/*
          this.state.showVideo &&
          <ModalContainer style={{ width: '680px', top: 100 }}
            onClose={() => { this.setState({ showVideo: false }) }}>
            <ModalDialog style={{ width: '680px', top: 100 }}
              onClose={() => { this.setState({ showVideo: false }) }}>
              <div>
                <YouTube
                  videoId='xpVyOxXvZPE'
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
        */}
        {/*
          this.state.isShowingCreate &&
          <ModalContainer style={{ width: '500px' }}
            onClose={this.closeCreateDialog}>
            <ModalDialog style={{ width: '500px' }}
              onClose={this.closeCreateDialog}>
              <h3>Create Messenger Code</h3>
              <div className='m-form'>
                <div className='form-group m-form__group'>
                  <label className='control-label'>Select Page:&nbsp;&nbsp;&nbsp;</label>
                  <select className='custom-select' id='m_form_type' style={{ width: '250px' }} tabIndex='-98' value={this.state.pageSelected} onChange={this.changePage}>
                    {
                      this.props.pages.map((page, i) => (
                        <option key={i} value={page._id}>{page.pageName}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '5px', float: 'right' }}>
                  <button className='btn btn-primary' onClick={() => this.gotoCreate()}>
                    Create
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        */}
        {/*
          this.state.isShowPreview &&
          <ModalContainer style={{ width: '500px' }}
            onClose={this.closePrviewDialog}>
            <ModalDialog style={{ width: '500px' }}
              onClose={this.closePrviewDialog}>
              <h3>QRCode</h3>
              <center>
                <img src={this.state.QRCodeToPreview.QRCode} style={{ display: 'block', width: '50%' }} />
              </center>
              <br />
              <center>
                <a href={this.state.QRCodeToPreview.QRCode} target='_blank' download className='btn btn-outline-success' style={{ borderColor: '#34bfa3' }}>
                  <i className='fa fa-download' />&nbsp;&nbsp;Download Image
                </a>
              </center>
            </ModalDialog>
          </ModalContainer>
        */}
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Facebook Messenger Code Generator</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Messenger Code? Here is the <a href='http://kibopush.com/messenger-codes' target='_blank'>documentation</a>.
              Or check out this <a href='#' onClick={() => { this.setState({ showVideo: true }) }}>video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Messenger Codes
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    {this.state.pagesToShow.length > 0
                      ? <Link onClick={this.showCreateDialog} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Create New
                      </span>
                        </span>
                      </Link>
                      : <Link disabled className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Create New
                    </span>
                        </span>
                      </Link>
                    }
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='form-row'>
                    {this.state.messengerCodesData && this.state.messengerCodesData.length > 0
                      ? <div className='col-md-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{ height: '53px' }}>
                              <th data-field='page'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '250px' }}>Page Name</span>
                              </th>
                              <th data-field='actions'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '250px' }}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                              this.state.messengerCodesData.map((messengerCode, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{ height: '55px' }} key={i}>
                                  <td data-field='page' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '250px' }}>{messengerCode.pageId.pageName}</span></td>
                                  <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '250px' }}>
                                      <button className='btn btn-primary btn-sm' style={{ float: 'left', margin: 2, marginLeft: '40px' }} onClick={() => this.showPreviewDialog(messengerCode)}>
                                        QRCode
                                      </button>
                                      <button className='btn btn-primary btn-sm' style={{ float: 'left', margin: 2 }} onClick={() => this.onEdit(messengerCode)}>
                                        Edit
                                      </button>
                                      <button className='btn btn-primary btn-sm' style={{ float: 'left', margin: 2 }} onClick={() => this.showDialogDelete(messengerCode._id)}>
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

function mapStateToProps(state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages),
    messengerCodes: (state.messengerCodeInfo.messengerCodes),
    messengerCode: state.messengerCodeInfo.messengerCode,

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadMyPagesListNew: loadMyPagesListNew,
    resetState: resetState,
    requestMessengerCode: requestMessengerCode,
    fetchCodes: fetchCodes,
    deleteCode: deleteCode,
    updateData: updateData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessengerCode)
