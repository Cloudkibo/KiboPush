/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { requestMessengerCode, resetState, fetchCodes, deleteCode, updateData } from '../../redux/actions/messengerCode.actions'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
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
      pageSelected: '',
      pagesToShow: [],
      isShowingModalDelete: false,
      codetoDelete: '',
      pages: [],
      openVideo: false
    }
    console.log('in constructor of messenger code')
    props.loadMyPagesList()
    props.resetState()
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
    this.updateAllowedPages = this.updateAllowedPages.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }

  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoMessengerCode.click()
  }

  showDialogDelete(id) {
    this.setState({ isShowingModalDelete: true })
    this.setState({ codetoDelete: id })
  }
  closeDialogDelete() {
    this.setState({ isShowingModalDelete: false })
  }

  displayData(n, messengerCodes) {
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
    this.updateAllowedPages(this.props.pages, this.props.messengerCodes)
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
      page_id: e.target.value,
      pageId: e.target.value,
      optInMessage: [{
        id: new Date().getTime(),
        text: 'Welcome! Thank you for subscribing. The next post is coming soon, stay tuned!\nP.S. If you ever want to unsubscribe just type "stop".',
        componentType: 'text'
      }],
      QRCode: this.props.messengerCode.QRCode
    }
    this.props.requestMessengerCode(edit)
  }

  gotoCreate() {
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

  UNSAFE_componentWillMount() {
    var edit = {
      page_id: this.props.pages[0]._id,
      pageId: this.props.pages[0].pageId,
      optInMessage: [{
        id: new Date().getTime(),
        text: 'Welcome! Thank you for subscribing. The next post is coming soon, stay tuned!\nP.S. If you ever want to unsubscribe just type "stop".',
        componentType: 'text'
      }],
      QRCode: this.props.messengerCode.QRCode
    }
    this.props.requestMessengerCode(edit)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // if (nextProps.pages) {
    //   // this.setState({
    //   //   pageSelected: nextProps.pages[0]
    //   // })
    //   if (nextProps.messengerCodes) {
    //     var tempPages = []
    //     var codeIds = []
    //     for(let a=0; a<nextProps.messengerCode.length; a++){
    //       let code = nextProps.messengerCode[a]
    //       codeIds.push(code.pageId._id)}
    //     for(let a=0; a<nextProps.pages.length; a++){
    //       let page = nextProps.pages[0]
    //       if (!codeIds.includes(page._id)) tempPages.push(page)}
    //     this.setState({ pagesToShow: tempPages })
    //   }
    // }
    if (nextProps.messengerCodes) {
      this.displayData(0, nextProps.messengerCodes)
      this.setState({ totalLength: nextProps.messengerCodes.length })
    }
  }

  updateAllowedPages(pages, messengerCodes) {
    var temp = pages.filter((page) => {
      for (let i = 0; i < messengerCodes.length; i++) {
        if (messengerCodes[i].pageId._id === page._id) {
          return false
        }
      }
      return true
    })
    this.setState({ pages: temp, pageSelected: temp && temp.length > 0 ? temp[0]._id : ''  })
    if (temp.length > 0) {
      var edit = {
        page_id: temp[0]._id,
        pageId: temp[0]._id,
        optInMessage: [{
          id: new Date().getTime(),
          text: 'Welcome! Thank you for subscribing. The next post is coming soon, stay tuned!\nP.S. If you ever want to unsubscribe just type "stop".',
          componentType: 'text'
        }],
        QRCode: this.props.messengerCode.QRCode
      }
      this.props.requestMessengerCode(edit)
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete Messenger Code?
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to delete this messenger Code?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deleteCode(this.state.codetoDelete, this.msg)
                    this.closeDialogDelete()
                  }} data-dismiss='modal'>Delete
              </button>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='videoMessengerCode' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoMessengerCode">videoMessengerCode</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoMessengerCode" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Messenger Code Video Tutorial
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
                <div style={{color: 'black'}} className="modal-body">
                {this.state.openVideo && <YouTube
                  videoId='xpVyOxXvZPE'
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
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Create Messenger Code
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                {this.state.pages.length > 0
                  ? <div className='m-form'>
                  <div className='form-group m-form__group'>
                    <label className='control-label'>Select Page:&nbsp;&nbsp;&nbsp;</label>
                    <select className='custom-select' id='m_form_type' style={{ width: '250px' }} tabIndex='-98' value={this.state.pageSelected} onChange={this.changePage}>
                      {
                        this.state.pages.length > 0 && this.state.pages.map((page, i) => (
                          <option key={i} value={page._id}>{page.pageName}</option>
                        ))
                      }
                    </select>
                  </div>
              </div>
              : <label className='control-label' style={{fontWeight: 'lighter', color: 'red'}}><b>Note:</b> You can only create one Mesenger Code per page and you have already created Messenger Codes for all of your connected pages. Hence, you cannot create more Messenger Codes.</label>
          }
            <div style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '5px', float: 'right' }}>
                  <button className='btn btn-primary' disabled={this.state.pageSelected === ''} onClick={() => this.gotoCreate()} data-dismiss='modal'>
                    Create
                  </button>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="preview" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    QRCode
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <center>
                <img src={this.state.QRCodeToPreview.QRCode} style={{ display: 'block', width: '50%' }} alt='' />
              </center>
              <br />
              <center>
                <a href={this.state.QRCodeToPreview.QRCode} target='_blank' rel="noopener noreferrer" download className='btn btn-outline-success' style={{ borderColor: '#34bfa3' }}>
                  <i className='fa fa-download' />&nbsp;&nbsp;Download Image
                </a>
              </center>
                </div>
              </div>
            </div>
          </div>
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
              Need help in understanding Messenger Code? Here is the <a href='http://kibopush.com/messenger-codes' target='_blank' rel="noopener noreferrer">documentation</a>.
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
                        Messenger Codes
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    {this.props.pages && this.props.pages.length > 0
                      ? <a href='#/' data-toggle="modal" data-target="#create" onClick={this.showCreateDialog} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Create New
                      </span>
                        </span>
                      </a>
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
                                      <button className='btn btn-primary btn-sm' style={{ float: 'left', margin: 2, marginLeft: '40px' }} data-toggle="modal" data-target="#preview" onClick={() => this.showPreviewDialog(messengerCode)}>
                                        QRCode
                                      </button>
                                      <button className='btn btn-primary btn-sm' style={{ float: 'left', margin: 2 }} onClick={() => this.onEdit(messengerCode)}>
                                        Edit
                                      </button>
                                      <button className='btn btn-primary btn-sm' style={{ float: 'left', margin: 2 }} data-toggle="modal" data-target="#delete" onClick={() => this.showDialogDelete(messengerCode._id)}>
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

function mapStateToProps(state) {
  return {
    pages: (state.pagesInfo.pages),
    messengerCodes: (state.messengerCodeInfo.messengerCodes),
    messengerCode: state.messengerCodeInfo.messengerCode,

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    resetState: resetState,
    requestMessengerCode: requestMessengerCode,
    fetchCodes: fetchCodes,
    deleteCode: deleteCode,
    updateData: updateData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessengerCode)
