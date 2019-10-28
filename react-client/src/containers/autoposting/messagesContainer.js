/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadAutopostingMessages, loadAutopostingPosts } from '../../redux/actions/autoposting.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import MESSAGES from '../../components/autoposting/autoposting_messages'
import POSTS from '../../components/autoposting/autoposting_posts'

class MessagesContainer extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      messagesData: [],
      postsData: [],
      totalMessagesLength: 0,
      totalPostsLength: 0,
      messagesPageNumber: 0,
      postsPageNumber: 0
    }
    this.displayMessagesData = this.displayMessagesData.bind(this)
    this.displayPostsData = this.displayPostsData.bind(this)
    this.handlePageClickMessages = this.handlePageClickMessages.bind(this)
    this.handlePageClickPosts = this.handlePageClickPosts.bind(this)
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  componentWillMount () {
    if (['messenger', 'both'].indexOf(this.props.location.state.actionType) !== -1) {
      this.props.loadAutopostingMessages(this.props.location.state._id, {first_page: 'first', last_id: 'none', number_of_records: 10})
    }
    if (['facebook', 'both'].indexOf(this.props.location.state.actionType) !== -1) {
      this.props.loadAutopostingPosts(this.props.location.state._id, {first_page: 'first', last_id: 'none', number_of_records: 10})
    }
  }

  componentDidMount () {
    this.scrollToTop()
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage | Autoposting Details'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat | Autoposting Details'
    } else {
      title = 'Autoposting Details'
    }

    document.title = title
  }

  displayMessagesData (n, messages) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > messages.length) {
      limit = messages.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = messages[i]
      index++
    }
    this.setState({messagesData: data})
  }

  displayPostsData (n, posts) {
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

  handlePageClickMessages (data) {
    if (data.selected === 0) {
      this.props.loadAutopostingMessages(this.props.location.state._id, {first_page: 'first', last_id: 'none', number_of_records: 10})
    } else if (this.state.messagesPageNumber < data.selected) {
      this.props.loadAutopostingMessages(this.props.location.state._id,
        {
          first_page: 'next',
          current_page: this.state.messagesPageNumber,
          requested_page: data.selected,
          last_id: this.props.autoposting_messages.length > 0 ? this.props.autoposting_messages[this.props.autoposting_messages.length - 1]._id : 'none',
          number_of_records: 10
        }
      )
    } else {
      this.props.loadAutopostingMessages(this.props.location.state._id,
        {
          first_page: 'previous',
          current_page: this.state.messagesPageNumber,
          requested_page: data.selected,
          last_id: this.props.autoposting_messages.length > 0 ? this.props.autoposting_messages[0]._id : 'none',
          number_of_records: 10
        }
      )
    }
    this.setState({messagesPageNumber: data.selected})
    this.displayMessagesData(data.selected, this.props.autoposting_messages)
  }

  handlePageClickPosts (data) {

    if (data.selected === 0) {
      this.props.loadAutopostingPosts(this.props.location.state._id, {first_page: 'first', last_id: 'none', number_of_records: 10})
    } else if (this.state.messagesPageNumber < data.selected) {
      this.props.loadAutopostingPosts(this.props.location.state._id,
        {
          first_page: 'next',
          current_page: this.state.messagesPageNumber,
          requested_page: data.selected,
          last_id: this.props.autoposting_posts.length > 0 ? this.props.autoposting_posts[this.props.autoposting_posts.length - 1]._id : 'none',
          number_of_records: 10
        }
      )
    } else {
      this.props.loadAutopostingPosts(this.props.location.state._id,
        {
          first_page: 'previous',
          current_page: this.state.messagesPageNumber,
          requested_page: data.selected,
          last_id: this.props.autoposting_posts.length > 0 ? this.props.autoposting_posts[0]._id : 'none',
          number_of_records: 10
        }
      )
    }
    this.setState({postsPageNumber: data.selected})
    this.displayPostsData(data.selected, this.props.autoposting_posts)
  }

  componentWillReceiveProps (nextProps) {
    console.log('in componentWillReceiveProps', nextProps)
    if (nextProps.autoposting_messages && nextProps.autoposting_messages.length > 0) {
      this.displayMessagesData(0, nextProps.autoposting_messages)
      this.setState({ totalMessagesLength: nextProps.messagesCount })
    }
    if (nextProps.autoposting_posts && nextProps.autoposting_posts.length > 0) {
      this.displayPostsData(0, nextProps.autoposting_posts)
      this.setState({ totalPostsLength: nextProps.postsCount })
    }
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Autoposting Details</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding this page? Here is the <a href='https://kibopush.com/autoposting/' target='_blank'>documentation</a>.
            </div>
          </div>
          {
            ['messenger', 'both'].indexOf(this.props.location.state.actionType) !== -1 &&
            <MESSAGES
              messages={this.state.messagesData}
              totalLength={this.state.totalMessagesLength}
              handlePageClick={this.handlePageClickMessages}
              pageNumber={this.state.messagesPageNumber}
            />
          }
          {
            ['facebook', 'both'].indexOf(this.props.location.state.actionType) !== -1 &&
            <POSTS
              posts={this.state.postsData}
              totalLength={this.state.totalPostsLength}
              handlePageClick={this.handlePageClickPosts}
              pageNumber={this.state.postsPageNumber}
            />
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    autoposting_messages: (state.autopostingInfo.autoposting_messages),
    autoposting_posts: (state.autopostingInfo.autoposting_posts),
    messagesCount: (state.autopostingInfo.messagesCount),
    postsCount: (state.autopostingInfo.postsCount)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadAutopostingMessages,
    loadAutopostingPosts
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer)
