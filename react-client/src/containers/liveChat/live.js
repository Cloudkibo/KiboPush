/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  fetchOpenSessions, fetchCloseSessions,
  fetchSingleSession,
  fetchUserChats,
  resetSocket,
  resetUnreadSession,
  showChatSessions,
  updateUserChat,
  clearSearchResult,
  markRead
} from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import { loadTeamsList } from '../../redux/actions/teams.actions'
import { getSubscriberTags } from '../../redux/actions/tags.actions'
import { Link } from 'react-router'
import ChatBox from './chatbox'
import Profile from './profile'
import Search from './search'
import Halogen from 'halogen'
import AlertContainer from 'react-alert'
import { timeSince } from './utilities'
import { registerAction } from '../../utility/socketio'
import YouTube from 'react-youtube'

const styles = {
  sessionStyle: {
    cursor: 'pointer',
    padding: '1rem'
  },
  activeSessionStyle: {
    cursor: 'pointer',
    backgroundColor: '#f0f1f4',
    padding: '1rem'
  }
}

class LiveChat extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      activeSession: '',
      showSearch: false,
      loading: true,
      ignore: true,
      searchValue: '',
      filterValue: '',
      sortValue: -1,
      showDropDown: false,
      tabValue: 'open',
      filter: false,
      scroll: true,
    }
    props.fetchOpenSessions({ first_page: true, last_id: 'none', number_of_records: 10, filter: false, filter_criteria: { sort_value: 1, page_value: '', search_value: '' } })
    props.fetchCloseSessions({ first_page: true, last_id: 'none', number_of_records: 10, filter: false, filter_criteria: { sort_value: 1, page_value: '', search_value: '' } })
    props.loadTeamsList()
    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.showDropdown = this.showDropdown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.changeTab = this.changeTab.bind(this)
    this.changeActiveSessionFromChatbox = this.changeActiveSessionFromChatbox.bind(this)
    this.loadMoreOpen = this.loadMoreOpen.bind(this)
    this.loadMoreClose = this.loadMoreClose.bind(this)
    this.showSearch = this.showSearch.bind(this)
    this.hideSearch = this.hideSearch.bind(this)
    this.disableScroll = this.disableScroll.bind(this)
  }

  disableScroll() {
    this.setState({ scroll: false })
  }

  showSearch() {
    this.setState({ showSearch: true })
  }

  hideSearch() {
    this.setState({ showSearch: false })
    this.props.clearSearchResult()
  }

  componentDidMount() {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Live Chat`
    if (!this.state.ignore) {
      this.setState({ ignore: true })
    }
    var compProp = this.props
    registerAction({
      event: 'agent_replied',
      action: function (data) {
        if (data.user_id !== compProp.user._id && this.state.activeSession !== '' && this.state.activeSession !== 'none' && this.state.activeSession._id === data.subscriber_id) {
          // compProp.fetchUserChats(data.session_id)
        }
      }
    })
  }

  loadMoreOpen() {
    this.props.fetchOpenSessions({ first_page: false, last_id: this.props.openSessions.length > 0 ? this.props.openSessions[this.props.openSessions.length - 1]._id : 'none', number_of_records: 10, filter: this.state.filter, filter_criteria: { sort_value: this.state.sortValue, page_value: this.state.filterValue, search_value: this.state.searchValue } })
  }

  loadMoreClose() {
    this.props.fetchCloseSessions({ first_page: false, last_id: this.props.closeSessions.length > 0 ? this.props.closeSessions[this.props.closeSessions.length - 1]._id : 'none', number_of_records: 10, filter: this.state.filter, filter_criteria: { sort_value: this.state.sortValue, page_value: this.state.filterValue, search_value: this.state.searchValue } })
  }

  changeActiveSessionFromChatbox() {
    console.log('in changeActiveSessionFromChatbox')
    this.setState({ activeSession: 'none' })
  }

  changeTab(value) {
    if (value === 'open') {
      this.setState({ tabValue: 'open' })
    } else {
      this.setState({ tabValue: 'closed' })
    }
  }

  changeActiveSession(session) {
    this.setState({ activeSession: session, scroll: true })
    if (this.state.tabValue === 'open') {
      var temp = this.props.openSessions
      for (var i = 0; i < temp.length; i++) {
        if (temp[i]._id === session._id && temp[i].unreadCount) {
          delete temp[i].unreadCount
        }
      }
    } else {
      var tempClose = this.props.closeSessions
      for (var j = 0; j < tempClose.length; j++) {
        if (tempClose[j]._id === session._id && tempClose[j].unreadCount) {
          delete tempClose[j].unreadCount
        }
      }
    }

    this.props.fetchUserChats(session._id, { page: 'first', number: 25 })
    console.log('session in changeActiveSession', session)
    this.props.markRead(session._id)
    this.props.getSubscriberTags(session._id, this.msg)
  }

  handleSearch(e) {
    this.setState({ searchValue: e.target.value.toLowerCase(), filter: true })
    this.props.fetchCloseSessions({ first_page: true, last_id: 'none', number_of_records: 10, filter: true, filter_criteria: { sort_value: this.state.sortValue, page_value: this.state.filterValue, search_value: e.target.value.toLowerCase() } })
    this.props.fetchOpenSessions({ first_page: true, last_id: 'none', number_of_records: 10, filter: true, filter_criteria: { sort_value: this.state.sortValue, page_value: this.state.filterValue, search_value: e.target.value.toLowerCase() } })
  }

  handleSort(value) {
    this.setState({ sortValue: value, filter: true })
    if (value === -1) {
      this.props.openSessions.sort(function (a, b) {
        return new Date(b.last_activity_time) - new Date(a.last_activity_time)
      })
      this.props.closeSessions.sort(function (a, b) {
        return new Date(b.last_activity_time) - new Date(a.last_activity_time)
      })
    } else if (value === 1) {
      this.props.openSessions.sort(function (a, b) {
        return new Date(a.last_activity_time) - new Date(b.last_activity_time)
      })
      this.props.closeSessions.sort(function (a, b) {
        return new Date(a.last_activity_time) - new Date(b.last_activity_time)
      })
    }
  }

  handleFilter(value) {
    this.setState({ filterValue: value, filter: true })
    this.props.fetchCloseSessions({ first_page: true, last_id: 'none', number_of_records: 10, filter: true, filter_criteria: { sort_value: this.state.sortValue, page_value: value, search_value: this.state.searchValue } })
    this.props.fetchOpenSessions({ first_page: true, last_id: 'none', number_of_records: 10, filter: true, filter_criteria: { sort_value: this.state.sortValue, page_value: value, search_value: this.state.searchValue } })
  }

  showDropdown() {
    this.setState({ showDropDown: true })
  }

  hideDropDown() {
    this.setState({ showDropDown: false })
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps in live.js')
    this.setState({ ignore: true })
    if (nextProps.openSessions && nextProps.closeSessions) {
      console.log('open sessions', nextProps.openSessions)
      console.log('close sessions', nextProps.closeSessions)
      console.log(nextProps.openCount + ' : ' + nextProps.closeCount)
      if (this.state.loading) {
        this.setState({ loading: false })
      }
      if (this.props.location.state && this.state.activeSession === '') {
        console.log('updating active session')
        let newSessions = nextProps.openSessions.filter(session => session._id === this.props.location.state.id)
        let oldSessions = nextProps.closeSessions.filter(session => session._id === this.props.location.state.id)
        this.setState({ activeSession: newSessions.length > 0 ? newSessions[0] : oldSessions.length > 0 ? oldSessions[0] : '' })
        if (newSessions.length > 0 && newSessions[0].status === 'new') {
          this.setState({ tabValue: 'open' })
        } else if (oldSessions.length > 0 && oldSessions[0].status === 'resolved') {
          this.setState({ tabValue: 'closed' })
        }
      } else if (this.state.activeSession === '') {
        if (this.state.tabValue === 'open') {
          this.setState({ activeSession: nextProps.openSessions.length > 0 ? nextProps.openSessions[0] : '' })
        } else {
          this.setState({ activeSession: nextProps.closeSessions.length > 0 ? nextProps.closeSessions[0] : '' })
        }
      }
    }
    if (!nextProps.subscriberTags) {
      if (nextProps.openSessions[0] && nextProps.openSessions[0]._id) {
        this.props.getSubscriberTags(nextProps.openSessions[0]._id)
      } else if (nextProps.closeSessions[0] && nextProps.closeSessions[0]._id) {
        this.props.getSubscriberTags(nextProps.closeSessions[0]._id)
      }
    }
    if (nextProps.unreadSession && nextProps.openSessions.length > 0) {
      var temp = nextProps.openSessions
      for (var z = 0; z < temp.length; z++) {
        if (temp[z]._id === nextProps.unreadSession) {
          temp[z].unreadCount = temp[z].unreadCount ? temp[z].unreadCount + 1 : 1
        }
      }
      this.props.resetUnreadSession()
    }
    if (this.props.location.state && this.props.location.state.subscriberToRespond) {
      console.log('Subscriber To Respond', this.props.location.state.subscriberToRespond)
      var sessions = nextProps.openSessions
      var subscriber = this.props.location.state.subscriberToRespond
      for (let j = 0; j < sessions.length; j++) {
        if (sessions[j]._id === subscriber._id) {
          this.setState({ activeSession: sessions[j] })
          break
        }
      }
    }

    if (nextProps.userChat && this.props.userChat && nextProps.userChat.length > this.props.userChat.length) {
      var sess = this.props.openSessions
      for (var j = 0; j < sess.length; j++) {
        if (sess[j]._id === nextProps.userChat[0].subscriber_id) {
          sess[j] = {
            companyId: sess[j].companyId,
            last_activity_time: sess[j].last_activity_time,
            pageId: sess[j].pageId,
            request_time: sess[j].request_time,
            status: sess[j].status,
            subscriber_id: sess[j]._id,
            _id: sess[j]._id,
            lastPayload: nextProps.userChat[0].lastPayload,
            lastDateTime: nextProps.userChat[0].lastDateTime,
            lastRepliedBy: nextProps.userChat[0].lastRepliedBy
          }
        }
      }
    }

    if (nextProps.socketSession && nextProps.socketSession !== '' && nextProps.openSessions && nextProps.closeSessions) {
      if (this.props.userChat && this.props.userChat.length > 0 && nextProps.socketSession !== '' && this.props.userChat[0].subscriber_id === nextProps.socketSession) {
        this.props.updateUserChat(nextProps.socketMessage, this.props.userChat)
        this.props.resetSocket()
      } else if (nextProps.socketSession !== '') {
        this.props.fetchSingleSession(nextProps.socketSession, { appendTo: 'open', deleteFrom: 'close' })
        this.props.resetSocket()
      }
    }
  }

  handleNotificationOnShow() {
    this.setState({ ignore: true })
  }

  onNotificationClick() {
    window.focus()
    this.setState({ ignore: true })
  }

  render() {
    console.log('State in live', this.state)
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="guidline" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Dashboard Video Tutorial
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <YouTube
                  videoId='XUXc2ZD_lQY'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col'>
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding this page? <a href='http://kibopush.com/live-chat/' target='_blank'>Click Here. </a>
                  Or check out this <a href='#' data-toggle="modal" data-target="#video">video tutorial.</a>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-exclamation m--font-brand' />
                </div>
                <div className='m-alert__text'>
                  To view Facebook guidelines regarding types of messages <Link className='linkMessageTypes' style={{ color: '#5867dd', cursor: 'pointer' }} data-toggle="modal" data-target="#guideline"  >Click here.</Link>
                </div>
              </div>
            </div>
          </div>
          {
            this.state.loading
              ? <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
                className='align-center'>
                <center><Halogen.RingLoader color='#716aca' /></center>
              </div>
              : <div className='row'>
                <div className='col-xl-4'>
                  <div className='m-portlet m-portlet--full-height' >
                    <div className='m-portlet__head'>
                      <div style={{ paddingTop: '20px' }} className='row'>
                        <div className='col-md-10'>
                          <div className='m-input-icon m-input-icon--left'>
                            <input type='text' onChange={this.handleSearch} className='form-control m-input m-input--solid' placeholder='Search...' id='generalSearch' />
                            <span className='m-input-icon__icon m-input-icon__icon--left'>
                              <span><i className='la la-search' /></span>
                            </span>
                          </div>
                        </div>
                        <div style={{ paddingLeft: 0 }} className='col-md-2'>
                          <div className='m-portlet__head-tools'>
                            <ul className='m-portlet__nav'>
                              <li onClick={this.showDropDown} className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                                <a className='m-portlet__nav-link m-portlet__nav-link--icon m-dropdown__toggle'>
                                  <i onClick={this.showDropdown} style={{ cursor: 'pointer', fontSize: '40px' }} className='la la-ellipsis-h' />
                                </a>
                                {
                                  this.state.showDropDown &&
                                  <div className='m-dropdown__wrapper'>
                                    <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                                    <div className='m-dropdown__inner'>
                                      <div className='m-dropdown__body'>
                                        <div className='m-dropdown__content'>
                                          <ul className='m-nav'>
                                            <li className='m-nav__section m-nav__section--first'>
                                              <span className='m-nav__section-text'>
                                                Sort By:
                                              </span>
                                            </li>
                                            <li className='m-nav__item'>
                                              <a onClick={() => this.handleSort(1)} className='m-nav__link' style={{ cursor: 'pointer' }}>
                                                {
                                                  this.state.sortValue === 1
                                                    ? <span style={{ fontWeight: 600 }} className='m-nav__link-text'>
                                                      <i className='la la-check' /> Oldest to Newest
                                                    </span>
                                                    : <span className='m-nav__link-text'>
                                                      Oldest to Newest
                                                    </span>
                                                }
                                              </a>
                                            </li>
                                            <li className='m-nav__item'>
                                              <a onClick={() => this.handleSort(-1)} className='m-nav__link' style={{ cursor: 'pointer' }}>
                                                {
                                                  this.state.sortValue === -1
                                                    ? <span style={{ fontWeight: 600 }} className='m-nav__link-text'>
                                                      <i className='la la-check' /> Newest to Oldest
                                                    </span>
                                                    : <span className='m-nav__link-text'>
                                                      Newest to Oldest
                                                    </span>
                                                }
                                              </a>
                                            </li>
                                            <li className='m-nav__section m-nav__section--first'>
                                              <span className='m-nav__section-text'>
                                                Filter by:
                                              </span>
                                            </li>
                                            {
                                              this.props.pages.map((page, i) => (
                                                <li key={page.pageId} className='m-nav__item'>
                                                  <a onClick={() => this.handleFilter(page._id)} className='m-nav__link' style={{ cursor: 'pointer' }}>
                                                    {
                                                      page.pageId === this.state.filterValue
                                                        ? <span style={{ fontWeight: 600 }} className='m-nav__link-text'>
                                                          <i className='la la-check' /> {page.pageName}
                                                        </span>
                                                        : <span className='m-nav__link-text'>
                                                          {page.pageName}
                                                        </span>
                                                    }
                                                  </a>
                                                </li>
                                              ))
                                            }
                                            <li className='m-nav__item'>
                                              <a onClick={() => this.handleFilter('')} className='m-nav__link' style={{ cursor: 'pointer' }}>
                                                <span className='m-nav__link-text'>
                                                  All
                                                </span>
                                              </a>
                                            </li>
                                            <li className='m-nav__separator m-nav__separator--fit' />
                                            <li className='m-nav__item'>
                                              {
                                                (this.state.filterValue !== '' || this.state.sortValue !== '')
                                                  ? <a onClick={() => this.hideDropDown} style={{ borderColor: '#34bfa3', color: '#34bfa3' }} className='btn btn-outline-success m-btn m-btn--pill m-btn--wide btn-sm'>
                                                    Done
                                                  </a>
                                                  : <a onClick={() => this.hideDropDown} style={{ borderColor: '#f4516c' }} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
                                                    Cancel
                                                  </a>
                                              }
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                }
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0rem 2.2rem' }}>
                    <ul className='nav nav-tabs m-tabs-line' role='tablist'>
                      <li className='nav-item m-tabs__item'>
                        <a className='nav-link m-tabs__link active' data-toggle='tab' role='tab' style={{ cursor: 'pointer' }} onClick={() => this.changeTab('open')}>
                          Open
                        </a>
                      </li>
                      <li className='nav-item m-tabs__item'>
                        <a className='nav-link m-tabs__link' data-toggle='tab' role='tab' style={{ cursor: 'pointer' }} onClick={() => this.changeTab('closed')}>
                          Closed
                        </a>
                      </li>
                    </ul>
                  </div>
                  {this.props.openSessions && this.props.closeSessions && this.props.openSessions.length === 0 && this.props.closeSessions.length === 0
                    ? <center><p>No data to display</p></center>
                    : <div style={{ height: '525px', overflowY: 'scroll', padding: '0rem' }} className='m-portlet__body'>
                      <div className='tab-content'>
                        {
                          this.state.tabValue === 'open'
                            ? <div className='tab-pane active' id='m_widget4_tab1_content'>
                              <div className='m-widget4'>
                                {
                                  this.props.openSessions && this.props.openSessions.length > 0
                                    ? (this.props.openSessions.map((session) => (
                                      <div key={session._id}>
                                        <div style={session._id === ((this.state.activeSession !== '' && this.state.activeSession !== 'none') && this.state.activeSession._id) ? styles.activeSessionStyle : styles.sessionStyle} onClick={() => this.changeActiveSession(session)} className='m-widget4__item'>
                                          <div className='m-widget4__img m-widget4__img--pic'>
                                            <img style={{ width: '56px', height: '56px' }} src={session.profilePic} alt='' />
                                          </div>
                                          <div className='m-widget4__info'>
                                            <span className='m-widget4__title'>
                                              {session.firstName + ' ' + session.lastName}
                                            </span>
                                            <br />
                                            {(session.lastPayload && ((!session.lastPayload.componentType && session.lastPayload.text) || (session.lastPayload.componentType && session.lastPayload.componentType === 'text'))) &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{(session.lastPayload.text.length > 30) ? session.lastPayload.text.slice(0, 30) + '...' : session.lastPayload.text}</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You: {(session.lastPayload.text.length > 30) ? session.lastPayload.text.slice(0, 25) + '...' : session.lastPayload.text}</span>
                                                    : <span>{(session.lastPayload.text.length > 30) ? session.lastPayload.text.slice(0, 20) + '...' : session.lastPayload.text}</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'image' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent an image</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent an image</span>
                                                    : <span>{session.lastRepliedBy.name} sent an image</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'video' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a video</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a video</span>
                                                    : <span>{session.lastRepliedBy.name} sent a video</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'audio' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent an audio</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent an audio</span>
                                                    : <span>{session.lastRepliedBy.name} sent an audio</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'file' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a file</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a file</span>
                                                    : <span>{session.lastRepliedBy.name} sent a file</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'card' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a card</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a card</span>
                                                    : <span>{session.lastRepliedBy.name} sent a card</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'gallery' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a gallery</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a gallery</span>
                                                    : <span>{session.lastRepliedBy.name} sent a gallery</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'gif' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a gif</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a gif</span>
                                                    : <span>{session.lastRepliedBy.name} sent a gif</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'sticker' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a sticker</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a sticker</span>
                                                    : <span>{session.lastRepliedBy.name} sent a sticker</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'thumbsUp' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy.type
                                                  ? <span>{session.firstName}: <i className='fa fa-thumbs-o-up' /></span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You:&nbsp;<i className='fa fa-thumbs-o-up' /></span>
                                                    : <span>{session.lastRepliedBy.name}: <i className='fa fa-thumbs-o-up' /></span>
                                                }
                                              </span>
                                            }
                                            <br />
                                            <span className='m-widget4__sub'>
                                              <i className='fa fa-facebook-square' />&nbsp;&nbsp;
                                        {(session.pageId.pageName.length > 10) ? session.pageId.pageName.slice(0, 10) + '...' : session.pageId.pageName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <i className='fa fa-calendar' />&nbsp;&nbsp;
                                        {timeSince(session.lastDateTime)}
                                            </span>
                                          </div>
                                          <div className='m-widget4__ext'>
                                            {
                                              session.unreadCount &&
                                              <a style={{ backgroundColor: '#d9534f', color: '#fff' }} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-danger'>
                                                {session.unreadCount}
                                              </a>
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    )))
                                    : <p style={{ marginLeft: '30px' }}>No data to display</p>
                                }
                                {this.props.openSessions.length < this.props.openCount &&
                                  <center>
                                    <i className='fa fa-refresh' style={{ color: '#716aca' }} />&nbsp;
                              <a id='assignTag' className='m-link' style={{ color: '#716aca', cursor: 'pointer', marginTop: '20px' }} onClick={this.loadMoreOpen}>Load More</a>
                                  </center>
                                }
                              </div>
                            </div>
                            : <div className='tab-pane active' id='m_widget4_tab1_content'>
                              <div className='m-widget4'>
                                {
                                  this.props.closeSessions && this.props.closeSessions.length > 0
                                    ? (this.props.closeSessions.map((session) => (
                                      <div key={session._id}>
                                        <div style={session._id === ((this.state.activeSession !== '' && this.state.activeSession !== 'none') && this.state.activeSession._id) ? styles.activeSessionStyle : styles.sessionStyle} onClick={() => this.changeActiveSession(session)} className='m-widget4__item'>
                                          <div className='m-widget4__img m-widget4__img--pic'>
                                            <img style={{ width: '56px', height: '56px' }} src={session.profilePic} alt='' />
                                          </div>
                                          <div className='m-widget4__info'>
                                            <span className='m-widget4__title'>
                                              {session.firstName + ' ' + session.lastName}
                                            </span>
                                            <br />
                                            {(session.lastPayload && ((!session.lastPayload.componentType && session.lastPayload.text) || (session.lastPayload.componentType && session.lastPayload.componentType === 'text'))) &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{(session.lastPayload.text.length > 30) ? session.lastPayload.text.slice(0, 30) + '...' : session.lastPayload.text}</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You: {(session.lastPayload.text.length > 25) ? session.lastPayload.text.slice(0, 25) + '...' : session.lastPayload.text}</span>
                                                    : <span>{session.lastRepliedBy.name}: {(session.lastPayload.text.length > 20) ? session.lastPayload.text.slice(0, 20) + '...' : session.lastPayload.text}</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'image' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent an image</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent an image</span>
                                                    : <span>{session.lastRepliedBy.name} sent an image</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'video' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a video</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a video</span>
                                                    : <span>{session.lastRepliedBy.name} sent a video</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'audio' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent an audio</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent an audio</span>
                                                    : <span>{session.lastRepliedBy.name} sent an audio</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'file' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a file</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a file</span>
                                                    : <span>{session.lastRepliedBy.name} sent a file</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'card' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a card</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a card</span>
                                                    : <span>{session.lastRepliedBy.name} sent a card</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'gallery' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a gallery</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a gallery</span>
                                                    : <span>{session.lastRepliedBy.name} sent a gallery</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'gif' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a gif</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a gif</span>
                                                    : <span>{session.lastRepliedBy.name} sent a gif</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'sticker' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy
                                                  ? <span>{session.firstName} sent a sticker</span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You sent a sticker</span>
                                                    : <span>{session.lastRepliedBy.name} sent a sticker</span>
                                                }
                                              </span>
                                            }
                                            {session.lastPayload && session.lastPayload.componentType && session.lastPayload.componentType === 'thumbsUp' &&
                                              <span className='m-widget4__sub'>
                                                {!session.lastRepliedBy.type
                                                  ? <span>{session.firstName}: <i className='fa fa-thumbs-o-up' /></span>
                                                  : session.lastRepliedBy.type === 'agent' && session.lastRepliedBy.id === this.props.user._id
                                                    ? <span>You:&nbsp;<i className='fa fa-thumbs-o-up' /></span>
                                                    : <span>{session.lastRepliedBy.name}: <i className='fa fa-thumbs-o-up' /></span>
                                                }
                                              </span>
                                            }
                                            <br />
                                            <span className='m-widget4__sub'>
                                              <i className='fa fa-facebook-square' />&nbsp;&nbsp;
                                        {(session.pageId.pageName.length > 10) ? session.pageId.pageName.slice(0, 10) + '...' : session.pageId.pageName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <i className='fa fa-calendar' />&nbsp;&nbsp;
                                        {timeSince(session.lastDateTime)}
                                            </span>
                                          </div>
                                          <div className='m-widget4__ext'>
                                            {
                                              session.unreadCount &&
                                              <a style={{ backgroundColor: '#d9534f', color: '#fff' }} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-danger'>
                                                {session.unreadCount}
                                              </a>
                                            }
                                          </div>
                                        </div>
                                      </div>
                              </div>
                              }
                        </div>
                      </div>
                      }
                  </div>
                </div>
                {
                  (this.state.activeSession === '' || this.state.activeSession === 'none') &&
                  <div className='col-xl-8'>
                    <div className='m-portlet m-portlet--full-height'>
                      <div style={{ textAlign: 'center' }} className='m-portlet__body'>
                        <p>Please select a session to view its chat.</p>
                      </div>
                    </div>
                  </div>
                }
                {
                  this.state.activeSession !== '' && this.state.activeSession !== 'none' &&
                  <ChatBox scroll={this.state.scroll} disableScroll={this.disableScroll} showSearch={this.showSearch} currentSession={this.state.activeSession} changeActiveSessionFromChatbox={this.changeActiveSessionFromChatbox} />
                }
                {
                  this.state.activeSession !== '' && this.state.activeSession !== 'none' && !this.state.showSearch &&
                  <Profile teams={this.props.teams} agents={this.props.teamUniqueAgents} subscriberTags={this.props.subscriberTags} currentSession={this.state.activeSession} changeActiveSessionFromChatbox={this.changeActiveSessionFromChatbox} />
                }
                {
                  this.state.activeSession !== '' && this.state.activeSession !== 'none' && this.state.showSearch &&
                  <Search currentSession={this.state.activeSession} hideSearch={this.hideSearch} />
                }
              </div>
          }
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="guideline" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Message Types
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
              <p> Following are the types of messages that can be sent to facebook messenger.</p>
              <div className='panel-group accordion' id='accordion1'>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>Subscription Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
                    <div className='panel-body'>
                      <p>Subscription messages can&#39;t contain ads or promotional materials, but can be sent at any time regardless of time passed since last user activity. In order to send Subscription Messages, please apply for Subscription Messages Permission by following the steps given on this&nbsp;
                        <a href='https://developers.facebook.com/docs/messenger-platform/policy/app-to-page-subscriptions' target='_blank'>link.</a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>Promotional Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
                    <div className='panel-body'>
                      Promotional messages can contain ads and promotional materials, but can only be sent to subscribers who were active in the past 24 hours.
                    </div>
                  </div>
                </div>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_3' aria-expanded='false'>Follow-Up Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_3' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
                    <div className='panel-body'>
                      After the end of the 24 hours window you have an ability to send "1 follow up message" to these recipients. After that you won&#39;t be able to send them ads or promotional messages until they interact with you again.
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

function mapStateToProps(state) {
  console.log('live.js', state)
  return {
    openSessions: (state.liveChat.openSessions),
    openCount: (state.liveChat.openCount),
    closeCount: (state.liveChat.closeCount),
    closeSessions: (state.liveChat.closeSessions),
    user: (state.basicInfo.user),
    socketSession: (state.liveChat.socketSession),
    activeSession: (state.liveChat.activeSession),
    unreadSession: (state.liveChat.unreadSession),
    changedStatus: (state.liveChat.changedStatus),
    userChat: (state.liveChat.userChat),
    pages: (state.pagesInfo.pages),
    socketData: (state.liveChat.socketData),
    teams: (state.teamsInfo.teams),
    teamUniqueAgents: (state.teamsInfo.teamUniqueAgents),
    subscriberTags: (state.tagsInfo.subscriberTags),
    socketMessage: (state.liveChat.socketMessage)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchOpenSessions: fetchOpenSessions,
    fetchCloseSessions: fetchCloseSessions,
    fetchUserChats: fetchUserChats,
    resetSocket: resetSocket,
    fetchSingleSession: fetchSingleSession,
    resetUnreadSession: resetUnreadSession,
    markRead: markRead,
    showChatSessions: showChatSessions,
    loadTeamsList: loadTeamsList,
    getSubscriberTags: getSubscriberTags,
    updateUserChat: updateUserChat,
    clearSearchResult: clearSearchResult
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
