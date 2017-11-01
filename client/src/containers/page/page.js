/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { connect } from 'react-redux'
import {
  addPages,
  loadMyPagesList,
  removePage

} from '../../redux/actions/pages.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import ReactPaginate from 'react-paginate'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'

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
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
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
        if (this.props.pages[i].pageName && this.props.pages[i].pageName.toLowerCase().includes(event.target.value.toLowerCase())) {
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
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                {
                  this.props.subscribers &&
                  this.props.subscribers.length === 0 &&
                  <div className='alert alert-success'>
                    <h4 className='block'>0 Subscribers</h4>
                    Your connected pages have zero subscribers. Unless you don't
                    have any subscriber, you will not be able to broadcast
                    message, polls and surveys.
                    Lets invite subscribers first. Dont worry, we will guide
                    you on how you can invite subscribers.
                    Click on 'Invite Subscribers' button on right side of the
                    page title.

                  </div>
                }
                <br />
                <div className='birthday-item inline-items badges'>
                  <h3>Pages</h3>
                  <Link to='/addPages' className='btn btn-primary btn-sm'
                    style={{float: 'right'}}>Add Pages</Link>
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
                  { this.props.pages && this.props.pages.length
                  ? <div className='table-responsive'>
                    <div>
                      <label> Search </label>
                      <input type='text' placeholder='Search Pages' className='form-control' onChange={this.searchPages} />
                    </div>
                    {
                      this.state.pagesData && this.state.pagesData.length > 0
                    ? <div>

                      <table className='table table-striped'>
                        <thead>
                          <tr>
                            <th>Page Pic</th>
                            <th>Page Name</th>
                            <th>Likes</th>
                            <th>Subscribers</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                        this.state.pagesData.map((page, i) => (
                          (page.connected &&
                            <tr>
                              <td><img alt='pic'
                                src={(page.pagePic) ? page.pagePic : ''}
                                className='img-rounded' width='60' height='60' /></td>
                              <td>{page.pageName}</td>
                              <td>{page.likes}</td>
                              <td>{page.subscribers}</td>
                              <td>
                                <button onClick={() => this.showDialog(page)}
                                  className='btn btn-primary btn-sm'
                                  style={{float: 'left', margin: 2}}>
                                  Remove
                                </button>
                                <button
                                  onClick={() => this.inviteSubscribers(page)}
                                  className='btn btn-primary btn-sm'
                                  style={{float: 'left', margin: 2}}>Invite
                                  Subscribers
                                </button>
                              </td>

                            </tr>
                          )

                        ))
                      }

                        </tbody>
                      </table>
                      <ReactPaginate previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 5)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'} />
                    </div>
                    : <p> No search results found. </p>

                }
                  </div>
                  : <div className='table-responsive'>
                    <p> No data to display </p>
                  </div>
                }
                </div>
              </div>

            </main>

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
