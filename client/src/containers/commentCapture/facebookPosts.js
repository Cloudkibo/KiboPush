/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import {
  fetchAllPosts, deletePost, saveCurrentPost
} from '../../redux/actions/commentCapture.actions'
import { Link } from 'react-router'
import { handleDate } from '../../utility/utils'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class FacebookPosts extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      postsData: [],
      totalLength: 0,
      searchValue: '',
      isShowingModalDelete: false,
      deleteid: ''
    }
    props.fetchAllPosts()
    props.saveCurrentPost(null)
    this.displayData = this.displayData.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchPosts = this.searchPosts.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.getPostText = this.getPostText.bind(this)
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }
  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }
  componentDidMount () {
    document.title = 'KiboPush | Comment Capture'
  }
  getPostText (payload) {
    var text = ''
    var videoPost = false
    var imagePost = false
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
    return text
  }
  onEdit (post) {
    this.props.saveCurrentPost(post)
  }
  displayData (n, posts, searchValue) {
    console.log('searchVal', searchValue)
    var searchVal = ''
    if (searchValue && searchValue === 'empty') {
      searchValue = ''
    } else if (searchValue) {
      searchVal = searchValue
    } else {
      searchVal = this.state.searchValue
    }
    console.log('in display data', searchVal)
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > posts.length) {
      limit = posts.length
    } else {
      limit = offset + 10
    }
    console.log('offset', offset)
    for (var i = offset; i < limit; i++) {
      if (searchVal !== '') {
        let postText = this.getPostText(posts[i].payload)
        if (postText.toLowerCase().includes(searchVal.toLowerCase())) {
          data[index] = posts[i]
          index++
        }
      } else {
        data[index] = posts[i]
        index++
      }
    }
    this.setState({postsData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.posts)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.posts) {
      this.displayData(0, nextProps.posts)
      this.setState({totalLength: nextProps.posts.length})
    }
  }

  searchPosts (event) {
    console.log('event.target.value', event.target.value)
    this.setState({
      searchValue: event.target.value
    })
    var filtered = []
    if (event.target.value !== '') {
      for (let i = 0; i < this.props.posts.length; i++) {
        if (this.props.posts[i].payload) {
          let postText = this.getPostText(this.props.posts[i].payload)
          if (postText.toLowerCase().includes(event.target.value.toLowerCase())) {
            filtered.push(this.props.posts[i])
          }
        }
      }
      this.displayData(0, filtered, event.target.value)
      this.setState({ totalLength: filtered.length })
    } else {
      filtered = this.props.posts
      this.displayData(0, filtered, 'empty')
      this.setState({ totalLength: filtered.length })
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
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          {
            this.state.isShowingModalDelete &&
            <ModalContainer style={{width: '500px'}}
              onClose={this.closeDialogDelete}>
              <ModalDialog style={{width: '500px'}}
                onClose={this.closeDialogDelete}>
                <h3>Delete Post</h3>
                <p>Are you sure you want to delete this post?</p>
                <button style={{float: 'right'}}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deletePost(this.state.deleteid, this.msg)
                    this.closeDialogDelete()
                  }}>Delete
                </button>
              </ModalDialog>
            </ModalContainer>
          }
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
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
                  Need help in understanding Comment Capture? Here is the <a href='http://kibopush.com/commentCapture' target='_blank'>documentation</a>.
                </div>
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
                              Create New Facebook Post
                            </span>
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='form-row'>
                        <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                          <input type='text' placeholder='Search Posts..' className='form-control' value={this.state.searchValue} onChange={this.searchPosts} />
                        </div>
                        { this.state.postsData && this.state.postsData.length > 0
                      ? <div className='col-md-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{height: '53px'}}>
                              <th data-field='posts' style={{width: 150}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span >Posts</span>
                              </th>
                              <th data-field='reply' style={{width: 150}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span>Reply</span>
                              </th>
                              <th data-field='commentsCount' style={{width: 100}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span>Comments Count</span>
                              </th>
                              <th data-field='dateCreated' style={{width: 100}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span >Date Created</span>
                              </th>
                              <th data-field='dateCreated' style={{width: 150}}
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span >Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                            this.state.postsData.map((post, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='post' style={{width: 150, textAlign: 'center'}} className='m-datatable__cell'><span>{this.getPostText(post.payload)}</span></td>
                                <td data-field='keywords' style={{width: 150, textAlign: 'center'}} className='m-datatable__cell'><span>{post.reply}</span></td>
                                <td data-field='commentsCount' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span>{post.commentsCount ? post.commentCount : '0'}</span></td>
                                <td data-field='dateCreated' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span >{handleDate(post.datetime)}</span></td>
                                <td data-field='actions' style={{width: 150, textAlign: 'center'}} className='m-datatable__cell'>
                                  <span>
                                    <Link to='/createPost' className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.onEdit(post)}>
                                        Edit
                                    </Link>
                                    <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.showDialogDelete(post._id)}>
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
        </div>

      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    posts: (state.postsInfo.posts)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAllPosts: fetchAllPosts,
    deletePost: deletePost,
    saveCurrentPost: saveCurrentPost
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FacebookPosts)
