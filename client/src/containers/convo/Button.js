/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Popover from 'react-simple-popover'

class Button extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      openPopover: false,
      title: '',
      url: ''
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.changeTitle = this.changeTitle.bind(this)
    this.changeUrl = this.changeUrl.bind(this)
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

  handleClick (e) {
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false, title: '', url: ''})
  }

  handleDone () {
    this.props.onAdd({
      type: 'web_url',
      url: this.state.url, // User defined link,
      title: this.state.title // User defined label
    })

    this.setState({openPopover: false, title: '', url: ''})
  }

  changeTitle (event) {
    this.setState({title: event.target.value})
  }

  changeUrl (event) {
    this.setState({url: event.target.value})
  }

  render () {
    return (
      <div id='target' ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
        <h6 onClick={this.handleClick}> + Add Button </h6>
        <Popover
          style={{width: '300px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px'}}
          placement='left'
          target={this.target}
          show={this.state.openPopover}
          onHide={this.handleClose} >
          <div className='card'>
            <h5 className='card-header'> Add Button </h5>
            <div className='card-block'>
              <h7 className='card-text'> Button Title: </h7>
              <input type='text' onChange={this.changeTitle} />
              <h7 className='card-text'> Open this website when user press this button: </h7>
              <input type='text' onChange={this.changeUrl} placeholder='Enter a link...' />
              <br />
              <button onClick={this.handleDone} className='btn btn-primary btn-sm pull-right'> Done </button>
              <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleClose} className='btn pull-left'> Cancel </button>
            </div>
          </div>
        </Popover>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Button)
