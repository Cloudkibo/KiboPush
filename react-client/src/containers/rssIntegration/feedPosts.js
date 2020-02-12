/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { fetchFeedPosts } from '../../redux/actions/rssIntegration.actions'
import ReactPaginate from 'react-paginate'
import moment from 'moment'
import { handleDate } from '../../utility/utils'

class FeedPosts extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newsPages: [],
      deleteId: '',
      startDate: '',
      endDate: '',
      status: '',
      pageNumber: 0,
      feedPosts: [],
      dateRangeWarning: ''
    }
    props.fetchFeedPosts({
      feedId: props.currentFeed && props.currentFeed._id ? props.currentFeed._id: '',
      last_id: 'none',
      number_of_records: 10,
      first_page: 'first',
      start_date: '',
      end_date: ''
    })

    this.changeDateFrom = this.changeDateFrom.bind(this)
    this.changeDateTo = this.changeDateTo.bind(this)
    this.validDateRange = this.validDateRange.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }
  validDateRange (startDate, endDate) {
    var valid = false
    if (startDate === '' && endDate === '') {
       valid = true
       this.setState({
        dateRangeWarning: ''
      })
    } else if (startDate === '' && endDate !== '') {
      this.setState({
        dateRangeWarning: {type: 'start', warning: 'Select start date to apply filter'}
      })
      valid = false
    } else if (startDate !== '' && endDate === '') {
      this.setState({
        dateRangeWarning: {type: 'end', warning: 'Select end date to apply filter'}
      })
      valid = false
    } else if (moment(startDate).isAfter(endDate)) {
      this.setState({
        dateRangeWarning: {type: 'start', warning: 'Incorrect Range'}
      })
      valid = false
    } else {
      this.setState({
        dateRangeWarning: ''
      })
      valid = true
    }
    return valid
  }
  changeDateTo (e) {
    this.setState({
      endDate: e.target.value
    })
    if (this.validDateRange(this.state.startDate, e.target.value)) {
      this.setState({pageNumber: 0})
      this.props.fetchFeedPosts({feedId: this.props.currentFeed._id, last_id: this.props.feedPosts.length > 0 ? this.props.feedPosts[this.props.feedPosts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', startDate: this.state.startDate, endDate: e.target.value})
    } else {
      this.setState({pageNumber: 0})
      this.props.fetchFeedPosts({ feedId: this.props.currentFeed._id, last_id: this.props.feedPosts.length > 0 ? this.props.feedPosts[this.props.feedPosts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', startDate: '', endDate: ''})
    }
  }
  changeDateFrom (e) {
    this.setState({
      startDate: e.target.value
    })
    if (this.validDateRange(e.target.value, this.state.endDate)) {
      this.setState({pageNumber: 0})
      this.props.fetchFeedPosts({feedId: this.props.currentFeed._id, last_id: this.props.feedPosts.length > 0 ? this.props.feedPosts[this.props.feedPosts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', startDate: e.target.value, endDate: this.state.endDate})
    } else {
      this.setState({pageNumber: 0})
      this.props.fetchFeedPosts({feedId: this.props.currentFeed._id, last_id: this.props.feedPosts.length > 0 ? this.props.feedPosts[this.props.feedPosts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', startDate: '', endDate: ''})
    }
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  displayData (n, feedPosts) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > feedPosts.length) {
      limit = feedPosts.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = feedPosts[i]
      index++
    }
    this.setState({feedPosts: data})
  }
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Feed Posts`

    if(this.props.pages){
      let newsPages = this.props.pages.filter((component) => { return (component.gotPageSubscriptionPermission)})
      this.setState({newsPages: newsPages})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if(nextProps.pages) {
      this.setState({newsPages: nextProps.pages.filter((component) => { return (component.gotPageSubscriptionPermission) })})
    }
    if (nextProps.feedPosts) {
      this.displayData(0, nextProps.feedPosts)
    }
    if (nextProps.postsCount) {
      this.setState({ totalLength: nextProps.postsCount })
    }
  }
  handlePageClick(data) {
    console.log('data.selected', data.selected)
    if (data.selected === 0) {
      this.props.fetchFeedPosts({
        feedId: this.props.currentFeed._id,
        last_id: 'none',
        number_of_records: 10,
        first_page: 'first',
        startDate: this.state.startDate,
        endDate: this.state.endDate
      })
    } else if (this.state.pageNumber < data.selected) {
      this.props.fetchFeedPosts({
        feedId: this.props.currentFeed._id,
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.feedPosts.length > 0 ? this.props.feedPosts[this.props.feedPosts.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        startDate: this.state.startDate,
        endDate: this.state.endDate
      })
    } else {
      this.props.fetchFeedPosts({
        feedId: this.props.currentFeed._id,
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.feedPosts.length > 0 ? this.props.feedPosts[this.props.feedPosts.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        startDate: this.state.startDate,
        endDate: this.state.endDate
      })
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.feedPosts)
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    {this.props.currentFeed.title}
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='row' style={{marginBottom: '30px'}}>
                <div className='col-md-4' style={{ display: 'inherit'}}>
                  <label style={{marginTop: '7px'}} className="col-md-3 col-lg-3 col-sm-12">
                    Page
                  </label>
                  <span style={{marginTop: '7px'}}>{this.props.pages.filter((page) => page._id === this.props.currentFeed.pageIds[0])[0].pageName}</span>
                </div>
                <div className='col-md-8' style={{ display: 'inherit' }}>
                  <label style={{marginTop: '7px', marginLeft: '30px'}} className="col-md-3 col-lg-3 col-sm-12">
                    Filter by Date
                  </label>
                  <span style={{marginTop: '7px', marginRight: '10px'}}>From:</span>
                  <div className='col-md-3'>
                    <input className='form-control m-input'
                      onChange={(e) => this.changeDateFrom(e)}
                      value={this.state.startDate}
                      id='text'
                      placeholder='Value'
                      max= {moment().format('YYYY-MM-DD')}
                      type='date'/>
                    { this.state.dateRangeWarning !== '' && this.state.dateRangeWarning.type === 'start' && <span style={{color: 'red'}}className='m-form__help'>
                      {this.state.dateRangeWarning.warning}
                    </span> }
                  </div>
                  <span style={{marginTop: '7px', marginLeft: '10px',marginRight: '10px'}}>To:</span>
                  <div className='col-md-3'>
                    <input className='form-control m-input'
                      onChange={(e) => this.changeDateTo(e)}
                      value={this.state.endDate}
                      id='text'
                      placeholder='Value'
                      max= {moment().format('YYYY-MM-DD')}
                      type='date'/>
                    { this.state.dateRangeWarning !== '' && this.state.dateRangeWarning.type === 'end' && <span style={{color: 'red'}}className='m-form__help'>
                        {this.state.dateRangeWarning.warning}
                      </span> }
                  </div>
                </div>
              </div>
              <div className='row' >
              {this.props.feedPosts && this.props.feedPosts.length > 0
              ? <div className='col-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data' style={{width: '100%'}}>
                <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                  <thead className='m-datatable__head'>
                    <tr className='m-datatable__row'
                      style={{height: '53px'}}>
                      <th data-field='page'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '100px'}}>Sent At</span>
                      </th>
                      <th data-field='datetime'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '100px'}}>Sent</span>
                      </th>
                      <th data-field='sent'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '100px'}}>Seen</span>
                      </th>
                      <th data-field='clicked'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '100px'}}>clicked</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='m-datatable__body'>
                    { this.state.feedPosts.map((post, i) => (
                    <tr
                      className='m-datatable__row m-datatable__row--even'
                      style={{height: '55px'}}>
                      <td data-field='datetime' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{new Date(post.datetime).toUTCString()}</span></td>
                      <td data-field='sent' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{post.sent ? post.sent : 0}</span></td>
                      <td data-field='seen' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{post.seen ? post.seen : 0}</span></td>
                    <td data-field='clicked' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{post.clicked ? post.clicked: 0}</span></td>
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
                    forcePage={this.state.pageNumber}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'} />
                </div>
              </div>
            : <div className= 'col-12' style={{margin: '10px', height: '100px'}}>
              <span>No records found</span>
              </div>
            }
            </div>
            <div className='m-portlet__foot m-portlet__foot--fit'>
              <div className='col-12' style={{textAlign: 'right', paddingTop: '30px', paddingBottom: '30px'}}>
                <Link to='/rssIntegration'>
                  <button className='btn btn-secondary'>
                    Back
                  </button>
                </Link>
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
    feedPosts: (state.feedsInfo.feedPosts),
    postsCount: (state.feedsInfo.postsCount),
    currentFeed: (state.feedsInfo.currentFeed)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchFeedPosts: fetchFeedPosts
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FeedPosts)
