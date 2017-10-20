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
import Select from 'react-select';

class Sessions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      openPopover: false,
      logOptions: [
                  { value: 'new', label: 'Newest to oldest' },
                  { value: 'old', label: 'Oldest to newest' }],
    },
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
    if(nextProps.pages){
      console.log("Got some pages", nextProps.pages)
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

  logChange(val) {
    console.log("Selected: " + JSON.stringify(val));
  }
  pageChange(val) {
    console.log("Selected: " + JSON.stringify(val));
  }

  render () {
    return (
      <div className='ui-block'>
        <div className='ui-block-title'>
          <input type='text' placeholder='Search Customers...' className='form-control' />
          <div id='target' ref={(b) => { this.target = b }} style={{paddingTop: '5px', paddingLeft: '10px'}} className='align-center'>
  <Link onClick={this.handleClick}> <img src="https://openclipart.org/image/2400px/svg_to_png/241758/Menu-Circles.png" style={{maxHeight: 20}} /> </Link>
            <Popover
              style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 5}}
              placement='bottom'
              target={this.target}
              show={this.state.openPopover}
              onHide={this.handleClose} >
              <Select
                name="form-field-name"
                options={this.state.logOptions}
                onChange={this.logChange}
              />
              <Select
                name="form-field-name"
                options={this.state.logOptions}
                onChange={this.pageChange}
              />
            </Popover>
          </div>
        </div>
        <ul className='widget w-activity-feed notification-list'>
          {this.props.sessions.map((item) => (
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
    pages: (state.pagesInfo.pages),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sessions)
