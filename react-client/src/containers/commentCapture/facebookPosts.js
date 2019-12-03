/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import {
  fetchAllPosts, deletePost, saveCurrentPost, fetchPostsAnalytics,
  resetComments
} from '../../redux/actions/commentCapture.actions'
import { Link } from 'react-router-dom'
import { handleDate } from '../../utility/utils'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import CardBoxesContainer from './CardBoxesContainer'
import moment from 'moment'

class FacebookPosts extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      postsData: [],
      totalLength: 0,
      searchValue: '',
      deleteid: '',
      captureType: '',
      filter: false,
      pageNumber: 0,
      startDate: '',
      endDate: '',
      dateRangeWarning: ''
    }
    props.fetchAllPosts({last_id: 'none',
      number_of_records: 10,
      first_page: 'first',
      search_value: '',
      type_value: '',
      startDate: '',
      endDate: ''})
    props.fetchPostsAnalytics()
    props.saveCurrentPost(null)
    props.resetComments(null)
    this.displayData = this.displayData.bind(this)
    this.onTypeFilter = this.onTypeFilter.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onView = this.onView.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchPosts = this.searchPosts.bind(this)
    this.getPostText = this.getPostText.bind(this)
    this.changeDateFrom = this.changeDateFrom.bind(this)
    this.changeDateTo = this.changeDateTo.bind(this)
    this.validDateRange = this.validDateRange.bind(this)
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
        dateRangeWarning: 'Select start date to apply filter'
      })
      valid = false
    } else if (startDate !== '' && endDate === '') {
      this.setState({
        dateRangeWarning: 'Select end date to apply filter'
      })
      valid = false
    } else if (moment(startDate).isAfter(endDate)) {
      this.setState({
        dateRangeWarning: 'Incorrect Range'
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
      this.props.fetchAllPosts({last_id: this.props.posts.length > 0 ? this.props.posts[this.props.posts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, type_value: e.target.value, startDate: this.state.startDate, endDate: e.target.value})
    } else {
      this.setState({pageNumber: 0})
      this.props.fetchAllPosts({last_id: this.props.posts.length > 0 ? this.props.posts[this.props.posts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, type_value: e.target.value, startDate: '', endDate: ''})
    }
  }
  changeDateFrom (e) {
    this.setState({
      startDate: e.target.value
    })
    if (this.validDateRange(e.target.value, this.state.endDate)) {
      this.setState({pageNumber: 0})
      this.props.fetchAllPosts({last_id: this.props.posts.length > 0 ? this.props.posts[this.props.posts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, type_value: e.target.value, startDate: e.target.value, endDate: this.state.endDate})
    } else {
      this.setState({pageNumber: 0})
      this.props.fetchAllPosts({last_id: this.props.posts.length > 0 ? this.props.posts[this.props.posts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, type_value: e.target.value, startDate: '', endDate: ''})
    }
  }
  showDialogDelete(id) {
    this.setState({ deleteid: id })
  }
  onTypeFilter (e) {
    console.log('e.target type', e.target.value)
    this.setState({captureType: e.target.value, pageNumber: 0})
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({pageNumber: 0})
      this.props.fetchAllPosts({last_id: this.props.posts.length > 0 ? this.props.posts[this.props.posts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, type_value: e.target.value, startDate: '', endDate: ''})
    } else {
      this.props.fetchAllPosts({last_id: this.props.posts.length > 0 ? this.props.posts[this.props.posts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: this.state.searchValue, type_value: '', startDate: '', endDate: ''})
    }
  }
  componentDidMount() {
    $('#sidebarDiv').removeClass('hideSideBar')
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Comment Capture`
  }
  getPostText(payload) {
    var text = ''
    var videoPost = false
    var imagePost = false
    if (payload) {
        for (var i = 0; i < payload.length; i++) {
          if (payload[i].componentType === 'text') {
            text = payload[i].text
            break
          }
          if (payload[i].componentType === 'video') {
            videoPost = true
          }
          if (payload[i].componentType === 'image') {
            imagePost = true
          }
        }
    if (i === payload.length && text === '') {
        if (videoPost) {
          text = 'Video'
        }
        if (imagePost) {
          text = 'Image'
        }
      }
    }
    return text
  }
  onEdit(post) {
    this.props.saveCurrentPost(post)
  }
  onView(post) {
    this.props.saveCurrentPost(post)
    this.props.history.push({
      pathname: `/PostResult`,
      state: post
    })
  }
  displayData (n, posts) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > posts.length) {
      limit = posts.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = posts[i]
      index++
    }
    this.setState({postsData: data})
  }

  handlePageClick(data) {
    console.log('data.selected', data.selected)
    if (data.selected === 0) {
      this.props.fetchAllPosts({
        last_id: 'none',
        number_of_records: 10,
        first_page: 'first',
        search_value: this.state.searchValue,
        type_value: this.state.captureType === 'all' ? '' : this.state.captureType,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      })
    } else if (this.state.pageNumber < data.selected) {
      this.props.fetchAllPosts({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.posts.length > 0 ? this.props.posts[this.props.posts.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        search_value: this.state.searchValue,
        type_value: this.state.captureType === 'all' ? '' : this.state.captureType,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      })
    } else {
      this.props.allBroadcasts({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.posts.length > 0 ? this.props.posts[this.props.posts.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        search_value: this.state.searchValue,
        type_value: this.state.captureType === 'all' ? '' : this.state.captureType,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      })
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.posts)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.posts) {
      this.displayData(0, nextProps.posts)
    }
    if (nextProps.postsCount) {
      this.setState({ totalLength: nextProps.postsCount })
    }
  }

  searchPosts(event) {
    this.setState({
      searchValue: event.target.value, pageNumber:0
    })
    if (event.target.value !== '') {
      this.props.fetchAllPosts({last_id: this.props.posts.length > 0 ? this.props.posts[this.props.posts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: event.target.value.toLowerCase(), type_value: this.state.captureType, startDate: '', endDate: ''})
    } else {
      this.props.fetchAllPosts({last_id: this.props.posts.length > 0 ? this.props.posts[this.props.posts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', search_value: '', type_value: this.state.captureType, startDate: '', endDate: ''})
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Comment Capture Video Tutorial
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <YouTube
                  videoId='p1LekqTN-3Y'
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete Post
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>If you delete this post, it will be deleted from your Facebook page timeline as well. Are you sure you want to delete this?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deletePost(this.state.deleteid, this.msg)
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
              <h3 className='m-subheader__title'>Comment Capture</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Comment Capture? Here is the <a href='http://kibopush.com/comment-capture' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' data-toggle="modal" data-target="#video">video tutorial</a>
            </div>
          </div>
          <div className='row'>
              {
                <CardBoxesContainer data= {this.props.allPostsAnalytics} />
              }
            </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Facebook Posts
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <Link to='/createPost' className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
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
                    <div style={{ display: 'inline-block' }} className='col-md-3'>
                      <select className='custom-select' style={{width: '100%'}} value= {this.state.captureType} onChange={this.onTypeFilter}>
                        <option value='' disabled>Filter by Type...</option>
                        <option value='any'>Any Post</option>
                        <option value='existing'>Existing Post</option>
                        <option value='new'>New post</option>
                        <option value='all'>All</option>
                      </select>
                    </div>
                    <div className='col-md-9' style={{ display: 'inherit' }}>
                      <label style={{marginTop: '7px', marginLeft: '30px'}} class="col-md-3 col-lg-3 col-sm-12">
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
                        { this.state.dateRangeWarning !== '' &&<span style={{color: '#ffb822'}}className='m-form__help'>
                          {this.state.dateRangeWarning}
                        </span> }
                      </div>
                      <span style={{marginTop: '7px', marginLeft: '10px',marginRight: '10px'}}>To:</span>
                      <input className='form-control col-md-3 m-input'
                        onChange={(e) => this.changeDateTo(e)}
                        value={this.state.endDate}
                        id='text'
                        placeholder='Value'
                        max= {moment().format('YYYY-MM-DD')}
                        type='date'/>
                    </div>
                  </div>
                  <div className='form-row'>
                    <div style={{ display: 'inline-block', marginTop: '20px', marginBottom: '20px' }} className='col-md-12'>
                      <input type='text' style={{width: '50%'}} placeholder='Search Posts..' className='form-control' value={this.state.searchValue} onChange={this.searchPosts} />
                    </div>
                    { this.state.postsData && this.state.postsData.length > 0
                  ? <div className='col-md-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='posts'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                          <span style={{width: '150px'}}>Title</span>
                          </th>
                          <th data-field='posts'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Type</span>
                          </th>
                          <th data-field='commentsCount'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Comments</span>
                          </th>
                          <th data-field='conversions'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Conversions</span>
                          </th>
                          <th data-field='dateCreated'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Date</span>
                          </th>
                          <th data-field='dateCreated'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                        this.state.postsData.map((post, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px', whiteSpace: 'nowrap'}} key={i}>
                            <td data-field='title' title={post.title} className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{post.title ? post.title: 'Comment Capture'}</span></td>
                            <td data-field='type' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{post.payload && post.payload.length > 0 ? 'New Post': (post.post_id && post.post_id !== ''? 'Existing Post': 'Any Post')}</span></td>
                            <td data-field='commentsCount' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{post.count ? post.count : '0'}</span></td>
                            <td data-field='conversions' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{post.conversionCount ? post.conversionCount : '0'}</span></td>
                            <td data-field='dateCreated' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{handleDate(post.datetime)}</span></td>
                            <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '150px'}}>
                              {/* <Link to='/PostResult' state={{mode: 'view'}} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.onEdit(post)}>
                                    View
                                </Link> */}
                                <button className='btn btn-primary btn-sm' style={{ float: 'left', margin: 2, marginLeft: '40px' }}  onClick={() => this.onView(post)}>
                                    View
                                </button>
                                <Link to='/editPost' state={{post: post}} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.onEdit(post)}>
                                    Edit
                                </Link>
                                      <button className='btn btn-primary btn-sm' style={{ float: 'left', margin: 2 }} data-toggle="modal" data-target="#delete" onClick={() => this.showDialogDelete(post._id)}>
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
                            forcePage={this.state.pageNumber}
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
    posts: (state.postsInfo.posts),
    postsCount: (state.postsInfo.postsCount),
    allPostsAnalytics: (state.postsInfo.allPostsAnalytics)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAllPosts: fetchAllPosts,
    deletePost: deletePost,
    saveCurrentPost: saveCurrentPost,
    fetchPostsAnalytics: fetchPostsAnalytics,
    resetComments: resetComments
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FacebookPosts)
