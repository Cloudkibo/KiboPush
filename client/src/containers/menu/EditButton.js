/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Popover from 'react-simple-popover'
import { isWebURL } from './../../utility/utils'

class EditButton extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      openPopover: false,
      title: this.props.data.title,
      url: this.props.data.url,
      disabled: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.changeTitle = this.changeTitle.bind(this)
    this.changeUrl = this.changeUrl.bind(this)
  }

  componentDidMount () {
  }

  handleClick (e) {
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false})
  }

  handleDone () {
    this.setState({openPopover: false})
    this.props.onEdit({
      id: this.props.data.id,
      url: this.state.url, // User defined link,
      title: this.state.title // User defined label
    })
  }

  changeTitle (event) {
    this.setState({title: event.target.value})
  }

  changeUrl (event) {
    if (isWebURL(event.target.value)) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({url: event.target.value})
  }

  handleRemove () {
    this.props.onRemove({
      id: this.props.data.id,
      url: this.state.url, // User defined link,
      title: this.state.title // User defined label
    })
    this.setState({openPopover: false})
  }

  render () {
    return (
      <div id='target' ref={(b) => { this.target = b }} className='align-center'>
        <button onClick={this.handleClick} className='btn btn-primary btn-sm' style={{width: 100 + '%', margin: 0, border: 2 + 'px', borderStyle: 'solid', borderColor: '#FF5E3A'}}>{this.props.data.title}</button>
        <Popover
          style={{width: '300px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px'}}
          placement='left'
          target={this.target}
          show={this.state.openPopover}
          onHide={this.handleClose} >
          <div className='card' style={{padding: 10}}>
            <h5 className='card-header'> Edit Button </h5>
            {/* <button onClick={this.handleRemove.bind(this)} className='btn btn-primary btn-sm pull-right'> Remove Button </button> */}
            <div className='card-block' style={{padding: 10}}>
              <h7 className='card-text'> Button Title: </h7>
              <input type='text' className='form-control' value={this.state.title} onChange={this.changeTitle} />
              <h7 className='card-text'> Open this website when user press this button: </h7>
              <input type='text' className='form-control' value={this.state.url} onChange={this.changeUrl} placeholder='Enter a link...' />
              <br />
              <button onClick={this.handleDone} className='btn btn-primary btn-sm pull-right' disabled={(this.state.disabled)}> Done </button>
              <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleRemove.bind(this)} className='btn pull-left'> Remove </button>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditButton)
