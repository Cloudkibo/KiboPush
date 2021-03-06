/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  addPages,
  loadMyPagesListNew,
  removePage
} from '../../redux/actions/pages.actions'
import { loadSubscribersCount } from '../../redux/actions/subscribers.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import YouTube from 'react-youtube'
import AlertMessageModal from '../../components/alertMessages/alertMessageModal'
import AlertContainer from 'react-alert'

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowingZeroSubModal: false,
      isShowingZeroPageModal: false,
      displayVideo: true,
      page: {},
      pagesData: [],
      totalLength: 0,
      filter: false,
      search_value: '',
      connectedPages: false,
      pageNumber: 0,
      showingSearchResult: true,
      openVideo: false
    }
    this.removePage = this.removePage.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchPages = this.searchPages.bind(this)
    this.goToAddPages = this.goToAddPages.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }

  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoManagePages.click()
  }

  UNSAFE_componentWillMount() {
    this.props.loadMyPagesListNew({ last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: { search_value: '' } })
    this.props.loadSubscribersCount({})
  }

  displayData(n, pages) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > pages.length) {
      limit = pages.length
    } else {
      limit = offset + 10
    }
    for (let i = offset; i < limit; i++) {
      data[index] = pages[i]
      index++
    }
    this.setState({ pagesData: data })
  }

  handlePageClick(data) {
    if (data.selected === 0) {
      this.props.loadMyPagesListNew({ last_id: 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: { search_value: this.state.searchValue } })
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadMyPagesListNew({ last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, first_page: 'next', filter: this.state.filter, filter_criteria: { search_value: this.state.searchValue }, current_page: this.state.pageNumber,requested_page: data.selected})
    } else {
      this.props.loadMyPagesListNew({ last_id: this.props.pages.length > 0 ? this.props.pages[0]._id : 'none', number_of_records: 10, first_page: 'previous', filter: this.state.filter, filter_criteria: { search_value: this.state.searchValue }, current_page: this.state.pageNumber, requested_page: data.selected })
    }
    this.setState({ pageNumber: data.selected })
    this.displayData(data.selected, this.props.pages)
  }

  componentDidMount() {
    // require('https://cdn.cloudkibo.com/public/js/jquery-3.2.0.min.js')
    // require('https://cdn.cloudkibo.com/public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Page`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('nextProps in pages', nextProps)
    if (nextProps.pages && nextProps.count) {
      var connectedPages = []
      for(let a = 0; a < nextProps.pages.length; a++) {
        let page = nextProps.pages[a]
        if (page.connected) {
          connectedPages.push(page)
        }
      }
      this.displayData(0, connectedPages)
      this.setState({ totalLength: nextProps.count, connectedPages: true })
    } else {
      this.setState({ pagesData: [], totalLength: 0 })
    }
    if (this.state.showingSearchResult && (nextProps.subscribersCount === 0 ||
      (nextProps.pages && nextProps.pages.length === 0))
    ) {
      this.setState({displayVideo: true, showingSearchResult: false})
      this.refs.zeroModal.click()
    }
  }

  // addPages(fbId){
  //  this.props.addPages(fbId);
  //  // this.props.history
  // }

  removePage(page) {
    let index
    for (let i = 0; i < this.state.pagesData.length; i++) {
      if (this.state.pagesData[i].pageId === page.pageId) {
        index = i
        break
      }
    }
    this.state.pagesData.splice(index, 1)
    this.props.removePage(page, this.msg)
  }

  showDialog(page) {
    this.setState({
      page: page
    })
  }

  inviteSubscribers(page) {
    this.props.history.push({
      pathname: `/invitesubscribers`,
      state: page

    })
  }
  searchPages(event) {
    // var filtered = []
    if (event.target.value !== '') {
      this.setState({ searchValue: event.target.value, filter: true, showingSearchResult: false, pageNumber:0 })
      this.props.loadMyPagesListNew({ last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: { search_value: event.target.value } })

      // for (let i = 0; i < this.props.pages.length; i++) {
      //   if (this.props.pages[i].pageName && this.props.pages[i].pageName.toLowerCase().includes(event.target.value.toLowerCase()) && this.props.pages[i].connected) {
      //     filtered.push(this.props.pages[i])
      //   }
      // }
    } else {
      this.props.loadMyPagesListNew({ last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: { search_value: '' } })
      this.setState({ filter: false, search_value: '', showingSearchResult: false,pageNumber:0 })
      // filtered = this.props.pages
    }
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }
  goToAddPages() {
    this.props.history.push({
      pathname: `/addPages`,
      state: { module: 'page' }
    })
  }
  render() {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('showingSearchResult', this.state.showingSearchResult)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='videoManagePages' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoManagePages">videoManagePages</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoManagePages" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Pages Video Tutorial
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
                  videoId='9kY3Fmj_tbM'
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
        <a href='#/' style={{ display: 'none' }} ref='zeroModal' data-toggle="modal" data-target="#zeroModal">ZeroModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="zeroModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                {(this.props.pages && this.props.pages.length === 0)
                  ? <AlertMessageModal type='page' />
                  : <AlertMessageModal type='subscriber' />
                }
                <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  this.setState({
                    displayVideo: false
                  })}}>
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <center>
                {this.state.displayVideo && <YouTube
                    videoId='9kY3Fmj_tbM'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: {
                        autoplay: 0
                      }
                    }}
                  />
                  }
                </center>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Pages</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {/* {
            this.props.pages && this.props.pages.length === 0 && !this.state.showingSearchResult
            ? <AlertMessage type='page' />
          : this.props.subscribers && this.props.subscribers.length === 0 &&
            <AlertMessage type='subscriber' />
          } */}
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding pages? Here is the <a href='http://kibopush.com/manage-pages/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this  <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <span className='m-portlet__head-icon'>
                          <i className='flaticon-calendar' />
                        </span>
                        <h3 className='m-portlet__head-text m--font-primary'>
                          Pages
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      <ul className='m-portlet__nav'>
                        <li className='m-portlet__nav-item'>
                          <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.goToAddPages}>
                            <span>
                              <i className='la la-plus' />
                              <span>
                                Connect New
                              </span>
                            </span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="removePage" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div style={{ display: 'block' }} className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Remove Page
									        </h5>
                          <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">
                              &times;
											      </span>
                          </button>
                        </div>
                        <div style={{ color: 'black' }} className="modal-body">
                          <p>If you remove this page you will loose all of its
                            subscribers and you will not be able to send messages,
                            polls, and surveys to them. Are you sure to remove
                          this page?</p>
                          <button style={{ float: 'right' }}
                            className='btn btn-primary btn-sm'
                            onClick={() => this.removePage(
                              this.state.page)}
                              data-dismiss='modal'>Remove
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    <div className='row align-items-center'>
                      <div className='col-xl-4 col-lg-4 col-md-4'>
                        <div className='m-input-icon m-input-icon--left'>
                          <input type='text' className='form-control m-input m-input--solid' onChange={this.searchPages} placeholder='Search...' id='generalSearch' />
                          <span className='m-input-icon__icon m-input-icon__icon--left'>
                            <span><i className='la la-search' /></span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    {this.state.pagesData && this.state.pagesData.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{ height: '53px' }}>
                              <th data-field='platform'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Page Pic</span>
                              </th>
                              <th data-field='statement'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Page Name</span>
                              </th>
                              <th data-field='datetime'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Likes</span>
                              </th>
                              <th data-field='sent'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Subscribers</span>
                              </th>
                              <th data-field='seen'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '150px' }}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                              this.state.pagesData.filter((p) => p.connected).map((page, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{ height: '55px' }} key={i}>
                                  <td data-field='platform' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}><img src={page.pagePic} alt='' /></span></td>
                                  <td data-field='statement' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{page.pageName}</span></td>
                                  <td data-field='datetime' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{page.likes}</span></td>
                                  <td data-field='sent' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{page.subscribers}</span></td>
                                  <td data-field='seen' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '150px' }}>
                                      <button className='btn btn-primary btn-sm'
                                        style={{ float: 'right', margin: 2 }}
                                        onClick={() => this.showDialog(page)}
                                        data-toggle="modal" data-target="#removePage">
                                        Remove
                                </button>

                                      <button className='btn btn-primary btn-sm'
                                        style={{ float: 'right', margin: 2 }}
                                        onClick={() => this.inviteSubscribers(page)}>
                                        Invite Subscribers
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
                            activeClassName={'active'}
                            forcePage={this.state.pageNumber} />
                        </div>
                      </div>
                      : <span>
                        <p> No data to display </p>
                      </span>
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
    count: (state.pagesInfo.count),
    user: (state.basicInfo.user),
    subscribersCount: (state.subscribersInfo.subscribersCount)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadMyPagesListNew: loadMyPagesListNew,
    removePage: removePage,
    addPages: addPages,
    loadSubscribersCount: loadSubscribersCount
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Page)
