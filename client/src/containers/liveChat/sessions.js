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
      logValue: 'old',
      pageValue: '',
      list: []
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.logChange = this.logChange.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
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
        myPages.push({value: page.pageId, label: page.pageName})
      })
      this.setState({pageOptions: myPages})
    }

    if (nextProps.sessions) {
      this.setState({list: nextProps.sessions})
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

  logChange (val) {
    console.log('Selected: ' + JSON.stringify(val))
    if (val === null) {
      this.setState({list: this.props.sessions, logValue: val})
      return
    }
    if (val.value == 'old') {
      console.log('Sorting using new')
      var temp = this.props.sessions.sort(function (a, b) {
        return (a.request_time < b.request_time) ? -1 : ((a.request_time > b.request_time) ? 1 : 0)
      })
    } else {
      console.log('Sorting using old')
      var temp = this.props.sessions.sort(function (a, b) {
        return (a.request_time > b.request_time) ? -1 : ((a.request_time < b.request_time) ? 1 : 0)
      })
    }
    console.log('Sorted Array', temp)
    this.setState({list: temp, logValue: val.value})
    this.setState({pageValue: null})
  }
  pageChange (val) {
    console.log('Selected: ' + JSON.stringify(val))
    if (val === null) {
      this.setState({list: this.props.sessions, pageValue: val})
      return
    }
    var search = val.value
    console.log('Page Value', search)
    var results = _.filter(this.props.sessions, function (item) {
      if (item.page_id.pageId === search) {
        return item
      }
    })
    console.log('Page Filter', results)
    this.setState({list: results, pageValue: val.value})
    this.setState({logValue: null})
  }

  handleSearch (event) {
    console.log('Search', event.target.value)

    var search = event.target.value
    var results = _.filter(this.props.sessions, function (item) {
      var name = item.subscriber_id.firstName + ' ' + item.subscriber_id.lastName
      if (name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
        return item
      }
    })
    console.log(results)
    this.setState({list: results})
    this.setState({logValue: null, pageValue: null})
  }

  render () {
    console.log('Logvalue', this.state.logValue)
    console.log('Sessions', this.state.list)
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
                value={this.state.logValue}
              />
              <br />
              <Select
                name='pageSelect'
                options={this.state.pageOptions}
                onChange={this.pageChange}
                placeholder='Select Page'
                value={this.state.pageValue}
              />
            </Popover>
          </div>
        </div>
        <ul className='widget w-activity-feed notification-list'>
          {this.state.list.map((item) => (
            <li key={item._id} onClick={() => { this.props.changeActiveSession(item, item.subscriber_id) }}>
              <div className='author-thumb'>
                <img src={item.subscriber_id.profilePic} alt='author' />
              </div>
              <div className='notification-event'>
                <a className='h6 notification-friend'>{item.subscriber_id.firstName + ' ' + item.subscriber_id.lastName}</a>
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
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sessions)
