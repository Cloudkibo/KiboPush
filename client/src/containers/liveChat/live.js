/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { fetchSessions, fetchSingleSession, fetchUserChats, resetSocket } from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import ChatBox from './chatbox'
import Profile from './profile'
// import Halogen from 'halogen'
// import Notification from 'react-web-notification'
var _ = require('lodash/core')

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeSession: '',
      loading: true,
      ignore: true,
      sessionsData: [],
      searchValue: '',
      filterValue: '',
      sortValue: '',
      showDropDown: false
    }
    props.fetchSessions({ company_id: this.props.user._id })
    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.filterSession = this.filterSession.bind(this)
    this.showDropdown = this.showDropdown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
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
    addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)
    document.title = 'KiboPush | Live Chat'
    if (!this.state.ignore) {
      this.setState({ignore: true})
    }
  }

  componentWillMount () {
    console.log('Fetch Sessions')
  }

  changeActiveSession (session) {
    console.log('active session updated')
    this.props.fetchUserChats(session._id)
    this.setState({activeSession: session})
  }

  handleSearch (e) {
    console.log('handle search', e.target.value)
    this.setState({searchValue: e.target.value})
    this.filterSession()
  }

  handleSort (value) {
    console.log('handle sort', value)
    if (value !== this.state.sortValue) {
      this.setState({sortValue: value})
    } else {
      this.setState({sortValue: ''})
    }
    this.filterSession()
  }

  handleFilter (value) {
    console.log('handle filter', value)
    if (value !== this.state.filterValue) {
      this.setState({filterValue: value})
    } else {
      this.setState({filterValue: ''})
    }
    this.filterSession()
  }

  filterSession () {
    console.log('filter sessions', this.state)
    var temp = this.props.sessions

    // For Search
    if (this.state.searchValue !== '') {
      temp = _.filter(temp, function (item) {
        var name = item.subscriber_id.firstName + ' ' + item.subscriber_id.lastName
        if (name.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) > -1) {
          return item
        }
      })
      console.log('Array After Search', temp)
    }

    // For Sort
    if (this.state.sortValue !== '') {
      if (this.state.sortValue === 'old') {
        console.log('Sorting Oldest to Newest')
        temp = temp.sort(function (a, b) {
          return (a.request_time < b.request_time) ? -1 : ((a.request_time > b.request_time) ? 1 : 0)
        })
      } else {
        console.log('Sorting Newest to Oldest')
        temp = temp.sort(function (a, b) {
          return (a.request_time > b.request_time) ? -1 : ((a.request_time < b.request_time) ? 1 : 0)
        })
      }
      console.log('Array After Sorting', temp)
    }

    // For Filter
    if (this.state.filterValue !== '') {
      var filterValue = this.state.filterValue
      temp = _.filter(temp, function (item) {
        if (item.page_id.pageId === filterValue) {
          return item
        }
      })
      console.log('Array After Page Filter', temp)
    }

    this.setState({sessionsData: temp})
  }

  showDropdown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    this.setState({ignore: true})

    if (nextProps.sessions) {
      this.setState({loading: false})
      this.setState({activeSession: nextProps.sessions[0], sessionsData: nextProps.sessions})
    }

    if (nextProps.socketSession !== '' && nextProps.socketSession !== this.props.socketSession) {
      this.setState({ignore: false, body: 'You got a new message from ' + nextProps.socketData.name + ' : ' + nextProps.socketData.text})
    }

    if (nextProps.socketSession && nextProps.socketSession !== '') {
      console.log('New Message Received at following session id', nextProps.socketSession)
      console.log('New Message data', nextProps.socketData)
      if (this.props.userChat && this.props.userChat.length > 0 && nextProps.socketSession !== '' && this.props.userChat[0].session_id === nextProps.socketSession) {
        this.props.fetchUserChats(nextProps.socketSession)
      } else if (nextProps.socketSession !== '') {
        var isPresent = false
        this.props.sessions.map((sess) => {
          if (sess._id === nextProps.socketSession) {
            isPresent = true
          }
        })

        if (isPresent) {
          console.log('Session exists ignoring the message')
          this.props.resetSocket()
        } else {
          console.log('New Session Detected, initiating session fetch')
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
    console.log('Notificaation was clicked')
    this.setState({ignore: true})
  }

  render () {
    console.log('sessions: ', this.props.sessions)
    console.log('state: ', this.state)
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Live Chat</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              {
                this.props.sessions && this.props.sessions.length > 0
                ? <div className='row'>
                  <div className='col-xl-4'>
                    <div className='m-portlet m-portlet--full-height' >
                      <div style={{paddingRight: '10px'}} className='m-portlet__head'>
                        <div style={{paddingTop: '20px'}} className='row'>
                          <div className='col-md-10'>
                            <div className='m-input-icon m-input-icon--left'>
                              <input type='text' onChange={() => this.handleSearch} className='form-control m-input m-input--solid' placeholder='Search...' id='generalSearch' />
                              <span className='m-input-icon__icon m-input-icon__icon--left'>
                                <span><i className='la la-search' /></span>
                              </span>
                            </div>
                          </div>
                          <div className='col-md-2'>
                            <div className='m-portlet__head-tools'>
                              <ul className='m-portlet__nav'>
                                <li onClick={this.showDropDown} className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                                  <a className='m-portlet__nav-link m-portlet__nav-link--icon m-dropdown__toggle'>
                                    <i onClick={this.showDropdown} style={{cursor: 'pointer', fontSize: '35px', float: 'right'}} className='la la-ellipsis-h' />
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
                                                  ? <a onClick={() => this.hideDropDown} className='btn btn-outline-success m-btn m-btn--pill m-btn--wide btn-sm'>
                                                    Done
                                                  </a>
                                                  : <a onClick={() => this.hideDropDown} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
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
                      <div className='m-portlet__body'>
                        <div className='tab-content'>
                          <div className='tab-pane active' id='m_widget4_tab1_content'>
                            <div className='m-widget4'>
                              {
                                this.state.sessionsData.map((session) => (
                                  <div key={session._id} style={{cursor: 'pointer'}} onClick={() => this.changeActiveSession(session)} className='m-widget4__item'>
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
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChatBox currentSession={this.state.activeSession} />
                  <Profile currentSession={this.state.activeSession} />
                </div>
                : <div className='col-xl-12'>
                  <h3>Right now you dont have any chat sessions</h3>
                </div>
              }
            </div>
          </div>
        </div>
        {/**
        <div>
          <Header />
          <HeaderResponsive />
          <Sidebar />
          <Responsive />
          <div className='container'>
            <br /><br /><br /><br /><br /><br />
            <div className='row'>
              {
                this.state.loading
                ? <div style={{position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em'}}
                  className='align-center'>
                  <center><Halogen.RingLoader color='#FF5E3A' /></center>
                </div>
                : (this.props.sessions && this.props.sessions.length === 0
                ? <div className='col-xl-12 col-lg-12 col-md-4 col-sm-12 col-xs-12'>
                  <h3>Right now you dont have any chat sessions</h3>
                </div>
                : <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                  <Sessions activeSession={this.state.activeSession === '' ? this.props.sessions[0] : this.state.activeSession} changeActiveSession={this.changeActiveSession} />
                </div>
                )
              }
              {
                this.props.sessions && this.props.sessions.length > 0 && (
                  this.state.activeSession === ''
                    ? <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                      <ChatBox session={this.props.sessions[0]} />
                    </div>
                    : <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                      <ChatBox session={this.state.activeSession} />
                    </div>
                )
              }
              {
                this.props.sessions && this.props.sessions.length > 0 && (
                  this.state.activeSession === ''
                    ? <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                      <Profile session={this.props.sessions[0]} profile={(this.props.sessions[0] && Object.keys(this.state.currentProfile).length === 0) ? this.props.sessions[0].subscriber_id : this.state.currentProfile} />
                    </div>
                    : <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                      <Profile session={this.state.activeSession} profile={(this.props.sessions[0] && Object.keys(this.state.currentProfile).length === 0) ? this.props.sessions[0].subscriber_id : this.state.currentProfile} />
                    </div>
                )
              }
            </div>
          </div>
        </div>
      **/}
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
    fetchSingleSession: fetchSingleSession
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
