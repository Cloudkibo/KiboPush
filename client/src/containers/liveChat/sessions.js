/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */
//
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Popover from 'react-simple-popover'
import { Link } from 'react-router'
import Select from 'react-select'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { resetUnreadSession } from '../../redux/actions/livechat.actions'
import NotificationBadge, {Effect} from 'react-notification-badge'
var _ = require('lodash/core')

class Sessions extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    this.state = {
      openPopover: false,
      logOptions: [
        { value: 'new', label: 'Newest to oldest' },
        { value: 'old', label: 'Oldest to newest' }],
      pageOptions: [],
      list: []
    }
    this.searchValue = ''
    this.logValue = 'old'
    this.pageValue = null
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.logChange = this.logChange.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.changeSession = this.changeSession.bind(this)
    this.filterSession = this.filterSession.bind(this)
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
      console.log('Got some pages', nextProps.pages)
      var myPages = []
      nextProps.pages.map((page) => {
        if(page.connected){
          myPages.push({value: page.pageId, label: page.pageName})
        }
      })
      this.setState({pageOptions: myPages})
    }

    if (nextProps.sessions) {
      this.setState({list: nextProps.sessions})
    }

    if (nextProps.userChat.length > this.props.userChat.length) {
      var sess = this.state.list
      for (var j = 0; j < sess.length; j++) {
        if (sess[j]._id === nextProps.userChat[0].session_id) {
          sess[j].unreadCount = 0
          this.setState({list: sess}, () => {
            console.log(this.state.list)
          })
        }
      }
    }

    if (nextProps.unreadSession) {
      var temp = this.state.list
      for (var i = 0; i < temp.length; i++) {
        if (temp[i]._id === nextProps.unreadSession) {
          temp[i].unreadCount = temp[i].unreadCount ? temp[i].unreadCount + 1 : 1
          this.setState({list: temp}, () => {
            console.log(this.state.list)
          })
        }
      }
      this.props.resetUnreadSession()
    }
  }

  handleClick (e) {
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false})
  }

  handleDone () {
    this.setState({openPopover: false})
  }

  filterSession () {
    var temp = this.props.sessions

    if (this.pageValue !== null) {
      var search = this.pageValue
      console.log('Page Value', search)
      temp = _.filter(temp, function (item) {
        if (item.page_id.pageId === search) {
          return item
        }
      })
      console.log('Array After Page Filter', temp)
    }

    if (this.searchValue !== '') {
      var search = this.searchValue
      temp = _.filter(temp, function (item) {
        var name = item.subscriber_id.firstName + ' ' + item.subscriber_id.lastName
        if (name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
          return item
        }
      })
      console.log('Array After Search', temp)
    }

    if (this.logValue !== null) {
      if (this.logValue === 'old') {
        console.log('Sorting using new')
        temp = temp.sort(function (a, b) {
          return (a.request_time < b.request_time) ? -1 : ((a.request_time > b.request_time) ? 1 : 0)
        })
      } else {
        console.log('Sorting using old')
        temp = temp.sort(function (a, b) {
          return (a.request_time > b.request_time) ? -1 : ((a.request_time < b.request_time) ? 1 : 0)
        })
      }
      console.log('Array After Sorting', temp)
    }

    this.setState({list: temp})
  }

  logChange (val) {
    console.log('(In Log Change) Val', val)
    if (val === null) {
      this.logValue = val
    } else {
      this.logValue = val.value
    }
    this.filterSession()
  }
  pageChange (val) {
    console.log('(In Page Change) Val', val)
    if (val === null) {
      this.pageValue = val
    } else {
      this.pageValue = val.value
    }
    this.filterSession()
  }

  handleSearch (event) {
    console.log('(In Handle Search) Search', event.target.value)
    // this.setState({searchValue: event.target.value})
    this.searchValue = event.target.value
    this.filterSession()
    // this.setState({logValue: null, pageValue: null})
  }

  changeSession (item) {
    var temp = this.state.list
    for (var i = 0; i < temp.length; i++) {
      if (temp[i]._id === item._id && temp[i].unreadCount) {
        temp[i].unreadCount = 0
        this.setState({list: temp})
      }
    }
    this.props.changeActiveSession(item, item.subscriber_id)
  }

  render () {
    return (
      <div className='ui-block'>
        <div className='ui-block-title'>
          <input type='text' onChange={this.handleSearch} placeholder='Search Customers...' className='form-control' />
          <div id='target' ref={(b) => { this.target = b }} style={{paddingTop: '5px', paddingLeft: '10px'}} className='align-center' style={{zIndex: 6}}>
            <Link onClick={this.handleClick} style={{padding: 10 + 'px'}}> <i className='icon-ellipsis-vertical' /> </Link>
            <Popover
              style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
              placement='bottom'
              target={this.target}
              show={this.state.openPopover}
              onHide={this.handleClose} >
              <Select
                name='form-field-name'
                options={this.state.logOptions}
                onChange={this.logChange}
                placeholder='Sort Sessions'
                value={this.logValue}
              />
              <br />
              <Select
                name='pageSelect'
                options={this.state.pageOptions}
                onChange={this.pageChange}
                placeholder='Select Page'
                value={this.pageValue}
              />
            </Popover>
          </div>
        </div>
        <ul className='widget w-activity-feed notification-list'>
          {this.state.list.map((item) => (
            <li key={item._id} onClick={() => { this.changeSession(item) }}>
              <div className='author-thumb'>
                <img src={item.subscriber_id.profilePic} alt='author' />
              </div>
              <div className='notification-event'>
                <a className='h6 notification-friend'>{item.subscriber_id.firstName + ' ' + item.subscriber_id.lastName}</a>
                <div style={{width: '15px', height: '15px', display: 'inline-block', marginLeft: '20px'}} >
                  {
                    this.props.activeSession._id !== item._id &&
                    <NotificationBadge count={item.unreadCount > 99 ? '99+' : item.unreadCount} className='abc' effect={Effect.SCALE} />
                  }
                </div>
                {/**
                 <span className='notification-date'><time className='entry-date updated' datetime='2004-07-24T18:18'>2 mins ago</time></span>
                 **/}
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    sessions: (state.liveChat.sessions),
    userChat: (state.liveChat.userChat),
    unreadSession: (state.liveChat.unreadSession),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    resetUnreadSession: resetUnreadSession
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sessions)
