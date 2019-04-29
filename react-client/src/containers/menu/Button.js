/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import Popover from 'react-simple-popover'
import { isWebURL } from './../../utility/utils'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'

class Button extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      openPopover: false,
      title: '',
      url: '',
      disabled: true
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.changeTitle = this.changeTitle.bind(this)
    this.changeUrl = this.changeUrl.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentDidMount () {
  }

  handleClick (e) {
    this.setState({disabled: true})
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false, title: '', url: ''})
  }

  handleToggle () {
    this.setState({openPopover: !this.state.openPopover})
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
    if (isWebURL(this.state.url) && event.target.value !== '') {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({title: event.target.value})
  }

  changeUrl (event) {
    if (isWebURL(event.target.value) && this.state.title !== '') {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({url: event.target.value})
  }

  render () {
    return (
      <div>
        <div id={'buttonTarget-' + this.props.button_id} ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
          <h6 onClick={this.handleClick}> + Add Button </h6>
        </div>
        <Popover placement='right-end' isOpen={this.state.openPopover} className='buttonPopover' target={'buttonTarget-' + this.props.button_id} toggle={this.handleToggle}>
          <PopoverHeader>Add Tags</PopoverHeader>
          <PopoverBody>
            <div className='card'>
              <h5 className='card-header'> Add Button </h5>
              <div className='card-block' style={{padding: 5}}>
                <h7 className='card-text'> Button Title: </h7>
                <input type='text' className='form-control' onChange={this.changeTitle} placeholder='Enter button title' />
                <h7 className='card-text'> Open this website when user press this button: </h7>
                <input type='text' className='form-control' onChange={this.changeUrl} placeholder='Enter link...' />
                <br />
                <button onClick={this.handleDone} className='btn btn-primary btn-sm pull-right' disabled={(this.state.disabled)}> Done </button>
                <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleClose} className='btn pull-left'> Cancel </button>
              </div>
            </div>
          </PopoverBody>
        </Popover>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Button)
