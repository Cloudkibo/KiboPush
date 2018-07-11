/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { connect } from 'react-redux'
import {
  addPages,
  loadMyPagesListNew,
  removePage
} from '../../redux/actions/pages.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import YouTube from 'react-youtube'

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isShowingModal: false,
      page: {},
      pagesData: [],
      totalLength: 0,
      filter: false,
      search_value: '',
      connectedPages: false,
      pageNumber: 0
    }
    this.removePage = this.removePage.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchPages = this.searchPages.bind(this)
  }

  componentWillMount () {
    this.props.getuserdetails()
    this.props.loadMyPagesListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: ''}})
    this.props.loadSubscribersList()
  }

  displayData (n, pages) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > pages.length) {
      limit = pages.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pages[i]
      index++
    }
    this.setState({pagesData: data})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadMyPagesListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue}})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadMyPagesListNew({last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, first_page: 'next', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue}})
    } else {
      this.props.loadMyPagesListNew({last_id: this.props.pages.length > 0 ? this.props.pages[0]._id : 'none', number_of_records: 10, first_page: 'previous', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue}})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.pages)
  }

  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
  }

  componentWillReceiveProps (nextProps) {
    console.log('nextProps in pages', nextProps)
    if (nextProps.pages && nextProps.count) {
      var connectedPages = []
      nextProps.pages.map((page, i) => {
        if (page.connected) {
          connectedPages.push(page)
        }
      })
      this.displayData(0, connectedPages)
      this.setState({ totalLength: nextProps.count, connectedPages: true })
    } else {
      this.setState({ pagesData: [], totalLength: 0 })
    }
  }

  // addPages(fbId){
  //  this.props.addPages(fbId);
  //  // this.props.history
  // }

  removePage (page) {
    this.closeDialog()
    let index
    for (let i = 0; i < this.state.pagesData.length; i++) {
      if (this.state.pagesData[i].pageId === page.pageId) {
        index = i
        break
      }
    }
    this.state.pagesData.splice(index, 1)
    this.props.removePage(page)
  }

  showDialog (page) {
    this.setState({
      isShowingModal: true,
      page: page
    })
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  inviteSubscribers (page) {
    this.props.history.push({
      pathname: `/invitesubscribers`,
      state: page

    })
  }
  searchPages (event) {
    // var filtered = []
    if (event.target.value !== '') {
      this.setState({searchValue: event.target.value, filter: true})
      this.props.loadMyPagesListNew({last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: event.target.value}})

      // for (let i = 0; i < this.props.pages.length; i++) {
      //   if (this.props.pages[i].pageName && this.props.pages[i].pageName.toLowerCase().includes(event.target.value.toLowerCase()) && this.props.pages[i].connected) {
      //     filtered.push(this.props.pages[i])
      //   }
      // }
    } else {
      this.setState({filter: false, search_value: ''})
      this.props.loadMyPagesListNew({last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: ''}})

      // filtered = this.props.pages
    }
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }
  goToAddPages () {
    browserHistory.push({
      pathname: `/addPages`,
      state: {module: 'page'}
    })
  }
  render () {
    return (
      <div>
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='3XenbHoDZkA'
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
        }
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
          <div className='m-subheader '>
            <div className='d-flex align-items-center'>
              <div className='mr-auto'>
                <h3 className='m-subheader__title'>Manage Pages</h3>
              </div>
            </div>
          </div>
          <div className='m-content'>
            { !this.state.connectedPages
              ? <div className='alert alert-success'>
                <h4 className='block'>0 Connected Pages</h4>
                You do not have any connected pages. Please click on Connect Facebook Pages to connect your Facebook Pages.
              </div>
            : <div>
              { this.props.subscribers &&
                this.props.subscribers.length === 0 &&
                <div className='alert alert-success'>
                  <h4 className='block'>0 Subscribers</h4>
                  Your connected pages have zero subscribers. Unless you do not
                  have any subscriber, you will not be able to broadcast
                  message, polls and surveys.
                  Lets invite subscribers first. Dont worry, we will guide
                  you on how you can invite subscribers.
                  Click on 'Invite Subscribers' button on right side of the
                  page title.
                </div>
              }
            </div>
            }
            <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-technology m--font-accent' />
              </div>
              <div className='m-alert__text'>
                Need help in understanding pages? Here is the <a href='http://kibopush.com/manage-pages/' target='_blank'>documentation</a>.
                Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
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
                                  Connect Facebook Pages
                                </span>
                              </span>
                            </button>
                          </li>

                        </ul>
                      </div>

                    </div>
                    {
                  this.state.isShowingModal &&
                  <ModalContainer style={{width: '500px'}}
                    onClose={this.closeDialog}>
                    <ModalDialog style={{width: '500px'}}
                      onClose={this.closeDialog}>
                      <h3>Remove Page</h3>
                      <p>If you remove this page you will loose all of its
                        subscribers and you will not be able to send messages,
                        polls, and surveys to them. Are you sure to remove
                        this page?</p>
                      <button style={{float: 'right'}}
                        className='btn btn-primary btn-sm'
                        onClick={() => this.removePage(
                                this.state.page)}>Remove
                      </button>
                    </ModalDialog>
                  </ModalContainer>
                }
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

                      { this.state.pagesData && this.state.pagesData.length > 0
                    ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                      <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                        <thead className='m-datatable__head'>
                          <tr className='m-datatable__row'
                            style={{height: '53px'}}>
                            <th data-field='platform' style={{width: 100}}
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span >Page Pic</span>
                            </th>
                            <th data-field='statement' style={{width: 100}}
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span>Page Name</span>
                            </th>
                            <th data-field='datetime' style={{width: 100}}
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span>Likes</span>
                            </th>
                            <th data-field='sent' style={{width: 100}}
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span >Subscribers</span>
                            </th>
                            <th data-field='seen' style={{width: 100}}
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span>Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className='m-datatable__body'>
                          {
                          this.state.pagesData.map((page, i) => (
                            (page.connected) ? <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
                              <td data-field='platform' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span><img src={page.pagePic} /></span></td>
                              <td data-field='statement' style={{width: 150, textAlign: 'center'}} className='m-datatable__cell'><span >{page.pageName}</span></td>
                              <td data-field='datetime' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span>{page.likes}</span></td>
                              <td data-field='sent' style={{width: 100, paddingLeft: 75 + 'px', textAlign: 'center'}} className='m-datatable__cell'><span >{page.subscribers}</span></td>
                              <td data-field='seen' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'>
                                <span >
                                  <button className='btn btn-primary btn-sm'
                                    style={{float: 'right', margin: 2}}
                                    onClick={() => this.showDialog(page)}>
                                    Remove
                                  </button>

                                  <button className='btn btn-primary btn-sm'
                                    style={{float: 'right', margin: 2}}
                                    onClick={() => this.inviteSubscribers(page)}>
                                    Invite Subscribers
                                  </button>

                                </span>
                              </td>
                            </tr> : ''
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
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    count: (state.pagesInfo.count),
    user: (state.basicInfo.user),
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesListNew: loadMyPagesListNew,
    getuserdetails: getuserdetails,
    removePage: removePage,
    addPages: addPages,
    loadSubscribersList: loadSubscribersList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Page)
