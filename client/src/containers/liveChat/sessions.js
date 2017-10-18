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
class Sessions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      openPopover: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
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

  render () {
    return (
      <div className='ui-block'>
        <div className='ui-block-title'>
          <input type='text' placeholder='Search Customers...' className='form-control' />
          <div id='target' ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
            <Link onClick={this.handleClick}> ... </Link>
            <Popover
              style={{width: '120px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px'}}
              placement='bottom'
              target={this.target}
              show={this.state.openPopover}
              onHide={this.handleClose} >
              <div className='dropdown'>
                <button className='btn dropdown-toggle' type='button' data-toggle='dropdown' stye={{backgroundColor: '#e7e7e7'}}>Sort By:</button>
                <ul className='dropdown-menu'>
                  <li><a href='#'>Newest to Oldest</a></li>
                  <li><a href='#'>Oldest to Newest</a></li>
                </ul>
              </div>
              <div className='dropdown'>
                <button className='btn dropdown-toggle' type='button' data-toggle='dropdown' stye={{backgroundColor: '#e7e7e7'}}>Pages:</button>
                <ul className='dropdown-menu'>
                  <li><a href='#'>Page 1</a></li>
                  <li><a href='#'>Page 2</a></li>
                </ul>
              </div>
            </Popover>
          </div>
        </div>
        <ul className='widget w-activity-feed notification-list'>
          {this.props.sessions.map((item) => (
            <li key={item._id} onClick={() => this.props.changeActiveSession(item._id)}>
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
    sessions: (state.liveChat.sessions)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sessions)
