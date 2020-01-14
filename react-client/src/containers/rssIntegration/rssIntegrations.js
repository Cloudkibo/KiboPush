/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import RssFeed from './RssFeed'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import { Link } from 'react-router-dom'
import { fetchRssFeed, deleteRssFeed, saveCurrentFeed, updateFeed, checkSubscriptionPermissions, saveNewsPages  } from '../../redux/actions/rssIntegration.actions'
import ReactPaginate from 'react-paginate'
import { RingLoader } from 'halogenium'

class RssIntegrations extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newsPages: [],
      smpStatus: [],
      deleteId: '',
      searchValue: '',
      status: '',
      pageNumber: 0,
      feeds: [],
      page_value: '',
      filter: false,
      loading: true
    }
    props.fetchRssFeed({last_id: 'none',
      number_of_records: 10,
      first_page: 'first',
      search_value: '',
      status_value: '',
    })
    props.saveCurrentFeed(null)
    this.gotoSettings = this.gotoSettings.bind(this)
    this.gotoMessages = this.gotoMessages.bind(this)
    this.setDeleteId = this.setDeleteId.bind(this)
    this.viewGuide = this.viewGuide.bind(this)
    this.searchFeeds = this.searchFeeds.bind(this)
    this.onStatusFilter = this.onStatusFilter.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.resetFilters = this.resetFilters.bind(this)
    this.setStatus = this.setStatus.bind(this)
    this.onPageFilter = this.onPageFilter.bind(this)
    this.getNewsPages = this.getNewsPages.bind(this)
    this.setPageStatus = this.setPageStatus.bind(this)
    this.handlePermissions = this.handlePermissions.bind(this)
    this.getStatusValue = this.getStatusValue.bind(this)
    this.props.checkSubscriptionPermissions(this.handlePermissions)
  }
  getStatusValue(status) {
    var value = 'Not Found'
    if (status === 'notApplied') {
      value = 'Not Applied'
    } else if (status === 'approved') {
      value = 'Approved'
    } else if (status === 'pending') {
      value = 'Pending'
    } else if (status === 'rejected') {
      value = 'Rejected'
    }
    return value
  }
  getNewsPages (permissions) {
    var newsPages = []
    for (var i = 0 ; i < this.props.pages.length; i++) {
      if (this.props.pages[i].connected) {
        for (var j=0; j < permissions.length; j++) {
          if (this.props.pages[i]._id === permissions[j].pageId && permissions[j].smpStatus === 'approved') {
            newsPages.push(this.props.pages[i])
            break
          }
        }
      }
    }
    this.props.saveNewsPages(newsPages)
    return newsPages
  }
  setPageStatus (permissions) {
    var pageStatus = []
    for (var i = 0 ; i < this.props.pages.length; i++) {
      if (this.props.pages[i].connected) {
        for (var j=0; j < permissions.length; j++) {
          if (this.props.pages[i]._id === permissions[j].pageId) {
            var status = permissions[j]
            status.pageName = this.props.pages[i].pageName
            status.pagePic = this.props.pages[i].pagePic
            pageStatus.push(status)
          }
        }
      }
    }
    return pageStatus
  } 
  resetFilters () {
    this.setState({
      searchValue: '',
      status: '',
      pageNumber: 0,
    })
  }
  setStatus (feed) {
    var updated = {
      feedUrl: feed.feedUrl,
      title: feed.title,
      storiesCount: feed.storiesCount,
      defaultFeed: feed.defaultFeed,
      isActive: !feed.isActive, 
      pageIds: [feed.pageIds[0]]
    }
    var data = {
      feedId: feed._id,
      updatedObject: updated
    }
    this.props.updateFeed(data, this.msg, true)
  }
  onPageFilter (e) {
    this.setState({page_value: e.target.value, pageNumber: 0})
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({pageNumber: 0, filter: true})
      this.props.fetchRssFeed({last_id: this.props.rssFeeds.length > 0 ? this.props.rssFeeds[this.props.rssFeeds.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, status_value: this.state.status, page_value: e.target.value})
    } else {
      this.setState({filter: false})
      this.props.fetchRssFeed({last_id: this.props.rssFeeds.length > 0 ? this.props.rssFeeds[this.props.rssFeeds.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, status_value: this.state.status, page_value: ''})
    }
  }
  onStatusFilter (e) {
    this.setState({status: e.target.value, pageNumber: 0})
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({pageNumber: 0, filter: true})
      this.props.fetchRssFeed({last_id: this.props.rssFeeds.length > 0 ? this.props.rssFeeds[this.props.rssFeeds.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, status_value: e.target.value, page_value: this.state.page_value})
    } else {
      this.setState({filter: false})
      this.props.fetchRssFeed({last_id: this.props.rssFeeds.length > 0 ? this.props.rssFeeds[this.props.rssFeeds.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, status_value: '', page_value: this.state.page_value})
    }
  }

  searchFeeds (event) {
    this.setState({
      searchValue: event.target.value, pageNumber:0
    })
    if (event.target.value !== '') {
      this.setState({filter: true})
      this.props.fetchRssFeed({last_id: this.props.rssFeeds.length > 0 ? this.props.rssFeeds[this.props.rssFeeds.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: event.target.value.toLowerCase(), status_value: this.state.status, page_value: this.state.page_value})
    } else {
      this.setState({filter: false})
      this.props.fetchRssFeed({last_id: this.props.rssFeeds.length > 0 ? this.props.rssFeeds[this.props.rssFeeds.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: '', status_value: this.state.status, page_value: this.state.page_value})
    }
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  setDeleteId (id) {
    this.setState({deleteId: id})
  }

  displayData (n, feeds) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > feeds.length) {
      limit = feeds.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = feeds[i]
      index++
    }
    this.setState({feeds: data})
  }
  handlePermissions (permissions) {
    var newsPages = this.getNewsPages(permissions)
    this.setState({
      newsPages: newsPages,
      loading: false
    })
    if (newsPages.length < 1) {
      var permissionStatus = this.setPageStatus(permissions)
      this.setState({smpStatus: permissionStatus})
    }
  }
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Rss Integration for News Publishers`;
    //this.props.checkSubscriptionPermissions(this.handlePermissions)
  }
  viewGuide () {
    this.refs.guide.click()
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.rssFeeds) {
      this.displayData(0, nextProps.rssFeeds)
    }
    if (nextProps.count) {
      this.setState({ totalLength: nextProps.count })
    }
  }
  handlePageClick(data) {
    console.log('data.selected', data.selected)
    if (data.selected === 0) {
      this.props.fetchRssFeed({
        last_id: 'none',
        number_of_records: 10,
        first_page: 'first',
        search_value: this.state.searchValue,
        status_value: this.state.status,
        page_value: this.state.page_value
      })
    } else if (this.state.pageNumber < data.selected) {
      this.props.fetchRssFeed({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.rssFeeds.length > 0 ? this.props.rssFeeds[this.props.rssFeeds.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        search_value: this.state.searchValue,
        status_value: this.state.status,
        page_value: this.state.page_value
      })
    } else {
      this.props.fetchRssFeed({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.rssFeeds.length > 0 ? this.props.rssFeeds[this.props.rssFeeds.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        search_value: this.state.searchValue,
        status_value: this.state.status,
        page_value: this.state.page_value
      })
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.rssFeeds)
  }
  updateDeleteID (id) {
    this.setState({deleteid: id})
  }

  gotoSettings (feed) {
    this.props.saveCurrentFeed(feed)
    this.props.history.push({
      pathname: `/editFeed`,
    })
  }

  gotoMessages (feed) {
    this.props.saveCurrentFeed(feed)
    this.props.history.push({
      pathname: `/feedPosts`
    })
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div>
        { this.state.loading
        ? <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div style={{ width: '100vw', height: '100vh', position: 'fixed', zIndex: '99999', top: '0px' }}>
              <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
                className='align-center'>
                <center><RingLoader color='#716aca' /></center>
              </div>
            </div>
          </div>
        : <div className='m-grid__item m-grid__item--fluid m-wrapper'>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <div style={{float: 'left', clear: 'both'}} ref={(el) => { this.top = el }} />
            <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
                <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    RssFeeds Integrations Video Tutorial
                  </h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
                      </span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                  <YouTube
                    videoId='Rt4uOwG9vQE'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: { // https://developers.google.com/youtube/player_parameters
                        autoplay: 0
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="deleteFeed" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Delete Integration
                  </h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
                    </span>
                  </button>
                </div>
                <div style={{ color: 'black' }} className="modal-body">
                  <p>Are you sure you want to delete this Rss Feed Integration?</p>
                  <button style={{ float: 'right' }}
                    className='btn btn-primary btn-sm'
                    onClick={() => {
                      this.props.deleteRssFeed(this.state.deleteId, this.msg, this.resetFilters)
                    }}
                    data-dismiss='modal'>Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='m-subheader '>
            <div className='d-flex align-items-center'>
              <div className='mr-auto'>
                <h3 className='m-subheader__title'>Rss Integration</h3>
              </div>
            </div>
          </div>
          <div className='m-content'>
            {this.state.newsPages.length > 0 &&
            <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-technology m--font-accent' />
              </div>
              <div className='m-alert__text'>
                Need help in understanding Rss Integration? Here is the <a href='https://kibopush.com/rss-integration/' target='_blank' rel='noopener noreferrer'>documentation</a>.
                Or check out this <a href='#/' data-toggle="modal" data-target="#video">video tutorial</a>
              </div>
            </div>
            }
            {this.state.newsPages.length === 0 &&
              <div
                className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
                role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-exclamation m--font-brand' />
                </div>
                <div className='m-alert__text'>
                  RssFeeds Integration is available for pages registered with Facebook's News Page Index (NPI) only. To register for NPI follow the link: <a href='https://www.facebook.com/help/publisher/377680816096171' target='_blank' rel='noopener noreferrer'>Register to News Page Index</a>.
                  Click here to review <a href='https://developers.facebook.com/docs/messenger-platform/policy/page-subscription-messaging' target='_blank' rel='noopener noreferrer'>Facebook's Subcription Messaging Policy</a>
                </div>
              </div>
            }
            {
              this.state.newsPages.length === 0
            ? <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h5 className='m-portlet__head-text'>
                    You do not have page level subscription permission on any of your connected pages.
            </h5>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <p></p>
              {this.state.smpStatus.map((item, i) => (
                <span>
                  <span>
                    <img alt='pic' src={item.pagePic}/>&nbsp;&nbsp;
                    <span>{item.pageName}</span>&nbsp;&nbsp;&nbsp;
                    <span className='m-badge m-badge--wide m-badge--success'> {this.getStatusValue(item.smpStatus)}</span>
                  </span>
                  <br /><br />
                </span>
              ))
              }
              <p>You will not be able to send subscription messages to subscribers of those pages that have not been granted this permission. Please click <a href='https://kibopush.com/2019/12/24/facebook-subscription-messaging-policy/' target='_blank' rel='noopener noreferrer' onClick={this.closeModal}>Here</a> to know how you can apply for this permission.</p>
            </div>
          </div>
          :<div className='m-portlet m-portlet--mobile'>
              <div className='m-portlet__head'>
                <div className='m-portlet__head-caption'>
                  <div className='m-portlet__head-title'>
                    <span className='m-portlet__head-icon'>
                      <i className='fa fa-feed' style={{color: '#365899'}} />
                    </span>
                    <h3 className='m-portlet__head-text'>
                      Connected Rss Feeds
                    </h3>
                  </div>
                </div>
                <div className='m-portlet__head-tools'>
                  <Link to='/editFeed'
                    className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                    <span>
                      <i className='la la-plus' />
                      <span>
                        Add Feed
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
              <div className='m-portlet__body'>
                <div className='col-12'>
                  <p>A daily update will be sent to your subscribers from default news feed. Your subscribers can choose to subscribe from the Rss feeds you have enabled.</p>
                </div>
                <div className='col-12'>
                  <p> <b>Note:</b> Subscribers who are engaged in live chat with an agent, will receive autoposts after 30 mins of ending the conversation.</p>
                </div>
                <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                  <div className='row align-items-center'>
                    <div className='col-xl-8 order-2 order-xl-1' />
                    <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                      <div className='m-separator m-separator--dashed d-xl-none' />
                    </div>
                  </div>
                </div>
                { (this.state.feeds && this.state.feeds.length > 0) || this.state.filter
                ? <div className='row' style={{marginBottom: '15px', marginLeft: '5px'}}>
                    <div className='col-md-4'>
                      <input type='text' placeholder='Search Feeds..' className='form-control' value={this.state.searchValue} onChange={this.searchFeeds} />
                    </div>
                    <div className='col-md-4'>
                      <select className='custom-select' style={{width: '100%'}} value= {this.state.status} onChange={this.onStatusFilter}>
                        <option value='' disabled>Filter by Status...</option>
                        <option value=''>All</option>
                        <option value='true'>Enabled</option>
                        <option value='false'>Disabled</option>
                      </select>
                    </div>
                    <div className='col-md-4'>
                      <select className='custom-select' style={{width: '100%'}} value= {this.state.page_value} onChange={this.onPageFilter}>
                        <option value='' disabled>Filter by Page...</option>
                        <option value=''>All</option>
                        {
                          this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                            page.connected && page.gotPageSubscriptionPermission &&
                            <option key={page._id} value={page._id} selected={page._id === this.state.page_value}>{page.pageName}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                : <div />
                }
                <div className='row' >
                  { this.state.feeds && this.state.feeds.length > 0 
                  ? <div className='col-12 m-widget5'>
                    { this.state.feeds.map((feed, i) => (
                      <RssFeed feed={feed}
                        page={this.props.pages.filter((page) => page._id === feed.pageIds[0])[0]} 
                        openSettings={this.gotoSettings} 
                        gotoMessages={this.gotoMessages}
                        setDeleteId={this.setDeleteId}
                        setStatus={this.setStatus}
                      />
                    ))
                    }
                    <div className='pagination'>
                      <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a href='#/'>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        forcePage={this.state.pageNumber}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'} />
                    </div>
                  </div>
                  : <div>
                    { this.state.filter 
                      ? <div className='col-12'>No records found</div>
                      : <div className='col-12'>You have no connected Rss Feeds</div>
                    }
                    </div>
                  }
                </div>
              </div>
            </div>
          }
          </div>
        </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages),
    rssFeeds: (state.feedsInfo.rssFeeds),
    count: (state.feedsInfo.count)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchRssFeed: fetchRssFeed,
    deleteRssFeed: deleteRssFeed,
    saveCurrentFeed: saveCurrentFeed,
    updateFeed: updateFeed,
    saveNewsPages: saveNewsPages,
    checkSubscriptionPermissions: checkSubscriptionPermissions
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(RssIntegrations)
