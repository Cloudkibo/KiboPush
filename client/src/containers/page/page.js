/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { connect } from 'react-redux'
import {
  addPages,
  loadMyPagesList,
  removePage

} from '../../redux/actions/pages.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isShowingModal: false,
      page: {},
      pagesData: [],
      totalLength: 0
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
    this.props.loadMyPagesList()
    this.props.loadSubscribersList()
  }

  displayData (n, pages) {
    console.log(pages)
    let offset = n * 5
    let data = []
    let limit
    let index = 0
    if ((offset + 5) > pages.length) {
      limit = pages.length
    } else {
      limit = offset + 5
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pages[i]
      index++
    }
    this.setState({pagesData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.pages)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    document.body.appendChild(addScript)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.pages) {
      console.log('Pages Updated', nextProps.pages)
      this.displayData(0, nextProps.pages)
      this.setState({ totalLength: nextProps.pages.length })
    }
  }

  // addPages(fbId){
  //  this.props.addPages(fbId);
  //  // this.props.history
  // }

  removePage (page) {
    console.log('This is the page', page)
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
    console.log('invite Subscribers')
    this.props.history.push({
      pathname: `/invitesubscribers`,
      state: page

    })
  }
  searchPages (event) {
    var filtered = []
    if (event.target.value !== '') {
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageName && this.props.pages[i].pageName.toLowerCase().includes(event.target.value.toLowerCase()) && this.props.pages[i].connected) {
          console.log('filtered', filtered)
          filtered.push(this.props.pages[i])
        }
      }
    } else {
      filtered = this.props.pages
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  render () {
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Manage Pages</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              {
                  this.props.subscribers &&
                  this.props.subscribers.length === 0 &&
                  <div className='alert alert-success'>
                    <h4 className='block'>0 Subscribers</h4>
                    Your connected pages have zero subscribers. Unless you don not
                    have any subscriber, you will not be able to broadcast
                    message, polls and surveys.
                    Lets invite subscribers first. Dont worry, we will guide
                    you on how you can invite subscribers.
                    Click on 'Invite Subscribers' button on right side of the
                    page title.

                  </div>
                }
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in configuring your pages? <a href='#'>Click Here </a>
                  <br />
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
                              <Link to='/addPages' >
                                <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                                  <span>
                                    <i className='la la-plus' />
                                    <span>
                                      Add Pages
                                    </span>
                                  </span>
                                </button>
                              </Link>
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
                              (page.connected) ?
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='platform' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span><img src={page.pagePic} /></span></td>
                                <td data-field='statement' style={{width: 150, textAlign: 'center'}} className='m-datatable__cell'><span >{page.pageName}</span></td>
                                <td data-field='datetime' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span>{page.likes}</span></td>
                                <td data-field='sent' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span >{page.subscribers}</span></td>
                                <td data-field='seen' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'>
                                  <span >
                                    <button className='btn btn-primary btn-sm'
                                      style={{float: 'left', margin: 2}}
                                      onClick={() => this.showDialog(page)}>
                                      Remove
                                    </button>

                                    <button className='btn btn-primary btn-sm'
                                      style={{float: 'left', margin: 2}}
                                      onClick={() => this.inviteSubscribers(page)}>
                                      Invite Subscribers
                                    </button>

                                  </span>
                                </td>
                              </tr> : ""
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
                            pageCount={Math.ceil(this.state.totalLength / 5)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination pagination-lg'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'} />
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
      </div>

    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    getuserdetails: getuserdetails,
    removePage: removePage,
    addPages: addPages,
    loadSubscribersList: loadSubscribersList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Page)
