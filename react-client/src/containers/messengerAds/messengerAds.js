/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import {fetchMessengerAds, deleteMessengerAd, setDefaultAdMessage} from '../../redux/actions/messengerAds.actions'
import { Link } from 'react-router-dom'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'

class MessengerAds extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      messengerAdsData: [],
      totalLength: 0,
      isShowingModalDelete: false,
      deleteid: '',
      showVideo: false
    }
    props.fetchMessengerAds()

    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
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

    document.title = `${title} | Messenger Ads`
  }

  gotoCreate () {
    this.props.setDefaultAdMessage(defaultAdMessage().messengerAd)
    this.props.history.push({
      pathname: `/createAdMessage`,
      state: {module: 'create'}
    })
  }
  onEdit (adId) {
    this.props.history.push({
      pathname: `/editAdMessage`,
      state: {module: 'edit', jsonAdId: adId._id}
    })
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }
  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }
  displayData (n, messengerAds) {
    console.log('in displayData', messengerAds)
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > messengerAds.length) {
      limit = messengerAds.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = messengerAds[i]
      index++
    }
    this.setState({messengerAdsData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.messengerAds)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.messengerAds) {
      this.displayData(0, nextProps.messengerAds)
      this.setState({totalLength: nextProps.messengerAds.length})
    }
    if (nextProps.pages) {
      this.setState({pageSelected: nextProps.pages[0]._id})
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
        {/*
          this.state.showVideo &&
          <ModalContainer style={{ width: '680px', top: 100 }}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px', top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='MmneT96VVqI'
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
          this.state.isShowingModalDelete &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialogDelete}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialogDelete}>
              <h3>Delete Ad?</h3>
              <p>Are you sure you want to delete this Ad?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.props.deleteMessengerAd(this.state.deleteid, this.msg)
                  this.closeDialogDelete()
                }}>Delete
              </button>
            </ModalDialog>
          </ModalContainer>
        */}
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Messenger Ads</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Messenger Ads? Here is the <a href='http://kibopush.com/messengerAds' target='_blank'>documentation</a>.
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
                        Messenger Ads
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <Link onClick={this.gotoCreate} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
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
                    { this.state.messengerAdsData && this.state.messengerAdsData.length > 0
                  ? <div className='col-md-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='url'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Title</span>
                          </th>
                          <th data-field='actions'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                        this.state.messengerAdsData.map((messengerAd, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='url' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '150px'}}>{messengerAd.title}</span></td>
                            <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '150px'}}>
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.onEdit(messengerAd)}>
                                    Edit
                                </button>
                                <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.showDialogDelete(messengerAd._id)}>
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
function defaultAdMessage () {
  const defaultMessage = { messengerAd: {
    jsonAdId: '',
    title: '',
    jsonAdMessages: [{
      jsonAdMessageId: 1,
      title: 'Opt In Message',
      jsonAdMessageParentId: null,
      messageContent: [{
        id: new Date().getTime(),
        text: 'Welcome! Thank you for being interested in our product! The next post about it is coming soon, stay tuned!\nAre you interested in having a discount?',
        componentType: 'text',
        buttons: [{
          type: 'postback',
          title: 'Sure I do!',
          payload: 2
        }]
      }]
    },
    {
      jsonAdMessageId: 2,
      title: 'Sure I do!',
      jsonAdMessageParentId: 1,
      messageContent: [{
        id: new Date().getTime() + 1,
        text: 'Great. We will contact you as soon as we have a deal for you!',
        componentType: 'text'
      }]
    }]
  }}
  return defaultMessage
}
function mapStateToProps (state) {
  console.log(state)
  return {
    messengerAds: (state.messengerAdsInfo.messengerAds)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchMessengerAds: fetchMessengerAds,
    deleteMessengerAd: deleteMessengerAd,
    setDefaultAdMessage: setDefaultAdMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessengerAds)
