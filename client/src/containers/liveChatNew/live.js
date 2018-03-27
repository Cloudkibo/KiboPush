/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { fetchSessions,
  fetchSingleSession,
  fetchUserChats,
  resetSocket,
  resetUnreadSession,
  showChatSessions,
  markRead } from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import ChatBox from './chatbox'
import Profile from './profile'
import Halogen from 'halogen'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
// import Notification from 'react-web-notification'
var _ = require('lodash/core')

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
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeSession: '',
      loading: true,
      ignore: true,
      sessionsData: [],
      sessionsDataNew: [],
      sessionsDataResolved: [],
      searchValue: '',
      filterValue: '',
      sortValue: '',
      showDropDown: false,
      isShowingModalGuideLines: false,
      tabValue: 'open'
    }
    props.fetchSessions({ company_id: this.props.user._id })
    this.showGuideLinesDialog = this.showGuideLinesDialog.bind(this)
    this.closeGuideLinesDialog = this.closeGuideLinesDialog.bind(this)
    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.filterSession = this.filterSession.bind(this)
    this.showDropdown = this.showDropdown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.changeTab = this.changeTab.bind(this)
    this.separateResolvedSessions = this.separateResolvedSessions.bind(this)
    this.changeActiveSessionFromChatbox = this.changeActiveSessionFromChatbox.bind(this)
  }

  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)
    document.title = 'KiboPush | Live Chat'
    if (!this.state.ignore) {
      this.setState({ignore: true})
    }
  }
  changeActiveSessionFromChatbox () {
    this.setState({activeSession: ''})
  }
  changeTab (value) {
    if (value === 'open') {
      this.setState({tabValue: 'open'})
    } else {
      this.setState({tabValue: 'closed'})
    }
  }

  separateResolvedSessions (sessions) {
    let newSessions = sessions.filter(session => session.status === 'new')
    let resolvedSessions = sessions.filter(session => session.status === 'resolved')

    this.setState({
      sessionsDataNew: newSessions,
      sessionsDataResolved: resolvedSessions
    })
  }

  changeActiveSession (session) {
    this.setState({activeSession: session})
    var temp = this.state.sessionsData
    for (var i = 0; i < temp.length; i++) {
      if (temp[i]._id === session._id && temp[i].unreadCount) {
        temp[i] = {
          company_id: temp[i].company_id,
          last_activity_time: temp[i].last_activity_time,
          page_id: temp[i].page_id,
          request_time: temp[i].request_time,
          status: temp[i].status,
          subscriber_id: temp[i].subscriber_id,
          _id: temp[i]._id
        }
        this.setState({sessionsData: temp})
        this.separateResolvedSessions(temp)
      }
    }
    this.props.fetchUserChats(session._id)
    this.props.markRead(session._id, this.props.sessions)
  }

  handleSearch (e) {
    this.setState({searchValue: e.target.value}, function () {
      this.filterSession()
    })
  }

  handleSort (value) {
    this.setState({sortValue: value}, function () {
      this.filterSession()
    })
  }

  handleFilter (value) {
    if (value !== this.state.filterValue) {
      this.setState({filterValue: value}, function () {
        this.filterSession()
      })
    } else {
      this.setState({filterValue: ''}, function () {
        this.filterSession()
      })
    }
  }

  filterSession () {
    var temp = this.props.sessions

    // For Search
    if (this.state.searchValue !== '') {
      var search = this.state.searchValue
      temp = _.filter(temp, function (item) {
        var name = item.subscriber_id.firstName + ' ' + item.subscriber_id.lastName
        if (name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
          return item
        }
      })
    }

    // For Sort
    if (this.state.sortValue !== '') {
      if (this.state.sortValue === 'old') {
        temp = temp.sort(function (a, b) {
          return (a.request_time < b.request_time) ? -1 : ((a.request_time > b.request_time) ? 1 : 0)
        })
      } else {
        temp = temp.sort(function (a, b) {
          return (a.request_time > b.request_time) ? -1 : ((a.request_time < b.request_time) ? 1 : 0)
        })
      }
    }

    // For Filter
    if (this.state.filterValue !== '') {
      var filterValue = this.state.filterValue
      temp = _.filter(temp, function (item) {
        if (item.page_id.pageId === filterValue) {
          return item
        }
      })
    }

    this.setState({sessionsData: temp})
    this.separateResolvedSessions(temp)
  }

  showDropdown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ignore: true})

    if (nextProps.sessions) {
      this.setState({loading: false})
      this.setState({sessionsData: nextProps.sessions})
      this.separateResolvedSessions(nextProps.sessions)
      if (this.state.activeSession === '') {
        // if (this.props.location.state && this.props.location.state.session_id) {
        //   for (var p = 0; p < nextProps.sessions.length; p++) {
        //     if (nextProps.sessions[p]._id === this.props.location.state.session_id) {
        //       this.setState({activeSession: nextProps.sessions[p]})
        //       break
        //     }
        //   }
        // } else {
        //   for (var a = 0; a < nextProps.sessions.length; a++) {
        //     if (nextProps.sessions[a].subscriber_id !== null) {
        //       this.setState({activeSession: nextProps.sessions[a]})
        //       break
        //     }
        //   }
        // }
        console.log('in componentWillReceiveProps', nextProps.sessions)
        for (var a = 0; a < nextProps.sessions.length; a++) {
          if (nextProps.sessions[a].status === 'new') {
            this.setState({activeSession: nextProps.sessions[a]})
            break
          }
        }
      }
      // } else if (nextProps.changedStatus) {
      //   for (var b = 0; b < nextProps.sessions.length; b++) {
      //     if (nextProps.sessions[b].status === 'new') {
      //       this.setState({activeSession: nextProps.sessions[b]})
      //       break
      //     }
      //   }
      // }
    }

    if (nextProps.unreadSession && this.state.sessionsData.length > 0) {
      var temp = this.state.sessionsData
      for (var i = 0; i < temp.length; i++) {
        if (temp[i]._id === nextProps.unreadSession) {
          temp[i].unreadCount = temp[i].unreadCount ? temp[i].unreadCount + 1 : 1
          this.setState({sessionsData: temp})
          this.separateResolvedSessions(temp)
        }
      }
      this.props.resetUnreadSession()
    }

    if (nextProps.userChat.length > this.props.userChat.length) {
      var sess = this.state.sessionsData
      for (var j = 0; j < sess.length; j++) {
        if (sess[j]._id === nextProps.userChat[0].session_id) {
          sess[j] = {
            company_id: sess[j].company_id,
            last_activity_time: sess[j].last_activity_time,
            page_id: sess[j].page_id,
            request_time: sess[j].request_time,
            status: sess[j].status,
            subscriber_id: sess[j].subscriber_id,
            _id: sess[j]._id
          }
          this.setState({sessionsData: sess})
          this.separateResolvedSessions(sess)
        }
      }
    }

    if (nextProps.socketSession !== '' && nextProps.socketSession !== this.props.socketSession) {
      this.setState({ignore: false, body: 'You got a new message from ' + nextProps.socketData.name + ' : ' + nextProps.socketData.text})
    }

    if (nextProps.socketSession && nextProps.socketSession !== '' && nextProps.sessions) {
      if (this.props.userChat && this.props.userChat.length > 0 && nextProps.socketSession !== '' && this.props.userChat[0].session_id === nextProps.socketSession) {
        this.props.fetchUserChats(nextProps.socketSession)
      } else if (nextProps.socketSession !== '') {
        var isPresent = false
        nextProps.sessions.map((sess) => {
          if (sess._id === nextProps.socketSession) {
            isPresent = true
          }
        })

        if (isPresent) {
          this.props.fetchSessions({ company_id: this.props.user._id })
          // this.props.resetSocket()
        } else {
          this.props.fetchSessions({ company_id: this.props.user._id })
        }
      }
    }
  }

  handleNotificationOnShow () {
    this.setState({ignore: true})
  }

  onNotificationClick () {
    window.focus()
    this.setState({ignore: true})
  }

  showGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: true})
  }

  closeGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: false})
  }

  render () {
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              {
                this.state.loading
                ? <div style={{position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em'}}
                  className='align-center'>
                  <center><Halogen.RingLoader color='#716aca' /></center>
                </div>
                : (this.props.sessions && this.props.sessions.length === 0
                ? <div className='col-xl-12'>
                  <h3>Right now you dont have any chat sessions</h3>
                </div>
                : <div className='row'>
                  <div className='col-12'>
                    <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                      <div className='m-alert__icon'>
                        <i className='flaticon-exclamation m--font-brand' />
                      </div>
                      <div className='m-alert__text'>
                        View Facebook guidelines regarding types of messages here: <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer'}} onClick={this.showGuideLinesDialog} >Message Types</Link>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-4'>
                    <div className='m-portlet m-portlet--full-height' >
                      <div className='m-portlet__head'>
                        <div style={{paddingTop: '20px'}} className='row'>
                          <div className='col-md-10'>
                            <div className='m-input-icon m-input-icon--left'>
                              <input type='text' onChange={this.handleSearch} className='form-control m-input m-input--solid' placeholder='Search...' id='generalSearch' />
                              <span className='m-input-icon__icon m-input-icon__icon--left'>
                                <span><i className='la la-search' /></span>
                              </span>
                            </div>
                          </div>
                          <div style={{paddingLeft: 0}} className='col-md-2'>
                            <div className='m-portlet__head-tools'>
                              <ul className='m-portlet__nav'>
                                <li onClick={this.showDropDown} className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                                  <a className='m-portlet__nav-link m-portlet__nav-link--icon m-dropdown__toggle'>
                                    <i onClick={this.showDropdown} style={{cursor: 'pointer', fontSize: '40px'}} className='la la-ellipsis-h' />
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
                                                <a onClick={() => this.handleSort('old')} className='m-nav__link' style={{cursor: 'pointer'}}>
                                                  {
                                                    this.state.sortValue === 'old'
                                                    ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                                      <i className='la la-check' /> Oldest to Newest
                                                    </span>
                                                    : <span className='m-nav__link-text'>
                                                      Oldest to Newest
                                                    </span>
                                                  }
                                                </a>
                                              </li>
                                              <li className='m-nav__item'>
                                                <a onClick={() => this.handleSort('new')} className='m-nav__link' style={{cursor: 'pointer'}}>
                                                  {
                                                    this.state.sortValue === 'new'
                                                    ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
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
                                                    <a onClick={() => this.handleFilter(page.pageId)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                                      {
                                                        page.pageId === this.state.filterValue
                                                        ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
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
                                              <li className='m-nav__separator m-nav__separator--fit' />
                                              <li className='m-nav__item'>
                                                {
                                                  (this.state.filterValue !== '' || this.state.sortValue !== '')
                                                  ? <a onClick={() => this.hideDropDown} style={{borderColor: '#34bfa3', color: '#34bfa3'}} className='btn btn-outline-success m-btn m-btn--pill m-btn--wide btn-sm'>
                                                    Done
                                                  </a>
                                                  : <a onClick={() => this.hideDropDown} style={{borderColor: '#f4516c'}} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
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
                      <div style={{padding: '0rem 2.2rem'}}>
                        <ul className='nav nav-tabs m-tabs-line' role='tablist'>
                          <li className='nav-item m-tabs__item'>
                            <a className='nav-link m-tabs__link active' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.changeTab('open')}>
                              Open
                            </a>
                          </li>
                          <li className='nav-item m-tabs__item'>
                            <a className='nav-link m-tabs__link' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.changeTab('closed')}>
                              Closed
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div style={{height: '525px', overflowY: 'scroll', padding: '0rem'}} className='m-portlet__body'>
                        <div className='tab-content'>
                          {
                            this.state.tabValue === 'open'
                            ? <div className='tab-pane active' id='m_widget4_tab1_content'>
                              <div className='m-widget4'>
                                {
                                  this.state.sessionsDataNew && this.state.sessionsDataNew.length > 0
                                  ? (this.state.sessionsDataNew.map((session) => (
                                    <div key={session._id} style={session._id === this.state.activeSession._id ? styles.activeSessionStyle : styles.sessionStyle} onClick={() => this.changeActiveSession(session)} className='m-widget4__item'>
                                      <div className='m-widget4__img m-widget4__img--pic'>
                                        <img style={{width: '56px', height: '56px'}} src={session.subscriber_id.profilePic} alt='' />
                                      </div>
                                      <div className='m-widget4__info'>
                                        <span className='m-widget4__title'>
                                          {session.subscriber_id.firstName + ' ' + session.subscriber_id.lastName}
                                        </span>
                                        <br />
                                        <span className='m-widget4__sub'>
                                          {session.page_id.pageName}
                                        </span>
                                      </div>
                                      <div className='m-widget4__ext'>
                                        {
                                          session.unreadCount &&
                                          <a style={{backgroundColor: '#d9534f', color: '#fff'}} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-danger'>
                                            {session.unreadCount}
                                          </a>
                                        }
                                      </div>
                                    </div>
                                  )))
                                  : <p style={{marginLeft: '30px'}}>No data to display</p>
                                }
                              </div>
                            </div>
                            : <div className='tab-pane active' id='m_widget4_tab1_content'>
                              <div className='m-widget4'>
                                {
                                  this.state.sessionsDataResolved && this.state.sessionsDataResolved.length > 0
                                  ? (this.state.sessionsDataResolved.map((session) => (
                                    <div key={session._id} style={session._id === this.state.activeSession._id ? styles.activeSessionStyle : styles.sessionStyle} onClick={() => this.changeActiveSession(session)} className='m-widget4__item'>
                                      <div className='m-widget4__img m-widget4__img--pic'>
                                        <img style={{width: '56px', height: '56px'}} src={session.subscriber_id.profilePic} alt='' />
                                      </div>
                                      <div className='m-widget4__info'>
                                        <span className='m-widget4__title'>
                                          {session.subscriber_id.firstName + ' ' + session.subscriber_id.lastName}
                                        </span>
                                        <br />
                                        <span className='m-widget4__sub'>
                                          {session.page_id.pageName}
                                        </span>
                                      </div>
                                      <div className='m-widget4__ext'>
                                        {
                                          session.unreadCount &&
                                          <a style={{backgroundColor: '#d9534f', color: '#fff'}} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-danger'>
                                            {session.unreadCount}
                                          </a>
                                        }
                                      </div>
                                    </div>
                                  )))
                                  : <p style={{marginLeft: '30px'}}>No data to display</p>
                                }
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  { console.log('this.state.activeSession', activeSession) }
                  {this.state.activeSession &&
                  <ChatBox currentSession={this.state.activeSession} changeActiveSessionFromChatbox={this.changeActiveSessionFromChatbox} />
                  }
                  {this.state.activeSession && <Profile currentSession={this.state.activeSession} /> }
                </div>
                )
              }
            </div>
          </div>
        </div>
        {
          this.state.isShowingModalGuideLines &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeGuideLinesDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeGuideLinesDialog}>
              <h4>Message Types</h4>
              <p> Following are the types of messages that can be sent to facebook messenger.</p>
              <div className='panel-group accordion' id='accordion1'>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>Subscription Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      <p>Subscription messages can&#39;t contain ads or promotional materials, but can be sent at any time regardless of time passed since last user activity.</p>
                    </div>
                  </div>
                </div>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>Promotional Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
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
                  <div id='collapse_3' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      After the end of the 24 hours window you have an ability to send "1 follow up message" to these recipients. After that you won&#39;t be able to send them ads or promotional messages until they interact with you again.
                    </div>
                  </div>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    sessions: (state.liveChat.sessions),
    user: (state.basicInfo.user),
    socketSession: (state.liveChat.socketSession),
    unreadSession: (state.liveChat.unreadSession),
    changedStatus: (state.liveChat.changedStatus),
    userChat: (state.liveChat.userChat),
    pages: (state.pagesInfo.pages),
    socketData: (state.liveChat.socketData)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSessions: fetchSessions,
    fetchUserChats: fetchUserChats,
    resetSocket: resetSocket,
    fetchSingleSession: fetchSingleSession,
    resetUnreadSession: resetUnreadSession,
    markRead: markRead,
    showChatSessions: showChatSessions
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
