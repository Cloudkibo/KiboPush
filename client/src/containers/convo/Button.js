/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllSequence } from '../../redux/actions/sequence.action'
import { isWebURL } from './../../utility/utils'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'

class Button extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      openPopover: false,
      title: '',
      url: '',
      disabled: true,
      openWebsite: false,
      openSubscribe: false,
      openUnsubscribe: false,
      sequenceValue: ''
    }
    props.fetchAllSequence()
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.changeTitle = this.changeTitle.bind(this)
    this.changeUrl = this.changeUrl.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.showWebsite = this.showWebsite.bind(this)
    this.showSubscribe = this.showSubscribe.bind(this)
    this.showUnsubscribe = this.showUnsubscribe.bind(this)
    this.closeWebsite = this.closeWebsite.bind(this)
    this.closeSubscribe = this.closeSubscribe.bind(this)
    this.closeUnsubscribe = this.closeUnsubscribe.bind(this)
    this.onSequenceChange = this.onSequenceChange.bind(this)
  }

  showWebsite () {
    this.setState({openWebsite: true})
  }

  showSubscribe () {
    this.setState({openSubscribe: true})
  }

  showUnsubscribe () {
    this.setState({openUnsubscribe: true})
  }

  closeWebsite () {
    this.setState({openWebsite: false, url: '', disabled: true})
  }

  closeSubscribe () {
    this.setState({openSubscribe: false, sequenceValue: '', disabled: true})
  }

  closeUnsubscribe () {
    this.setState({openUnsubscribe: false, sequenceValue: '', disabled: true})
  }

  onSequenceChange (e) {
    this.setState({sequenceValue: e.target.value, disabled: false})
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
    if (this.state.url !== '') {
      this.props.onAdd({
        type: 'web_url',
        url: this.state.url, // User defined link,
        title: this.state.title // User defined label
      })
    } else if (this.state.sequenceValue !== '') {
      if (this.state.openSubscribe && !this.state.openUnsubscribe) {
        this.props.onAdd({
          type: 'postback',
          title: this.state.title, // User defined label
          payload: JSON.stringify({
            sequenceId: this.state.sequenceValue,
            action: 'subscribe'
          })
        })
      } else if (!this.state.openSubscribe && this.state.openUnsubscribe) {
        this.props.onAdd({
          type: 'postback',
          title: this.state.title, // User defined label
          payload: JSON.stringify({
            sequenceId: this.state.sequenceValue,
            action: 'unsubscribe'
          })
        })
      }
    }

    this.setState({
      openPopover: false,
      title: '',
      url: '',
      sequenceValue: '',
      openWebsite: false,
      openSubscribe: false,
      openUnsubscribe: false
    })
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
    console.log('event', event.target.value)
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
          <PopoverHeader><strong>Add Button</strong></PopoverHeader>
          <PopoverBody>
            <div>
              <h6>Button Title:</h6>
              <input type='text' className='form-control' onChange={this.changeTitle} placeholder='Enter button title' />
              <h6 style={{marginTop: '10px'}}>When this button is pressed:</h6>
              {
                !this.state.openWebsite && !this.state.openSubscribe && !this.state.openUnsubscribe &&
                <div>
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebsite}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a website</h7>
                  </div>
                  {
                    this.props.sequences && this.props.sequences.length > 0 &&
                    <div style={{border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer'}} onClick={this.showSubscribe}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='la la-check-circle' />  Subscribe to Sequence</h7>
                    </div>
                  }
                  {
                    this.props.sequences && this.props.sequences.length > 0 &&
                    <div style={{border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer'}} onClick={this.showUnsubscribe}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='la la-times-circle' />  Unsubscribe to Sequence</h7>
                    </div>
                  }
                </div>
              }
              {
                this.state.openWebsite &&
                <div className='card'>
                  <h7 className='card-header'>Open Website <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeWebsite} /></h7>
                  <div style={{padding: '10px'}} className='card-block'>
                    <input type='text' className='form-control' onChange={this.changeUrl} placeholder='Enter link...' />
                  </div>
                </div>
              }
              {
                this.state.openSubscribe &&
                <div className='card'>
                  <h7 className='card-header'>Subscribe to Sequence <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeSubscribe} /></h7>
                  <div style={{padding: '10px'}} className='card-block'>
                    <select className='form-control m-input m-input--square' value={this.state.sequenceValue} onChange={this.onSequenceChange}>
                      <option key='' value='' disabled>Select Sequence...</option>
                      {
                        this.props.sequences.map((seq, i) => (
                          <option key={i} value={seq.sequence._id}>{seq.sequence.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              }
              {
                this.state.openUnsubscribe &&
                <div className='card'>
                  <h7 className='card-header'>Unsubscribe from Sequence <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeUnsubscribe} /></h7>
                  <div style={{padding: '10px'}} className='card-block'>
                    <select className='form-control m-input m-input--square' value={this.state.sequenceValue} onChange={this.onSequenceChange}>
                      <option key='' value='' disabled>Select Sequence...</option>
                      {
                        this.props.sequences.map((seq, i) => (
                          <option key={i} value={seq.sequence._id}>{seq.sequence.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              }
              <hr style={{color: '#ccc'}} />
              <button onClick={this.handleDone} className='btn btn-primary btn-sm pull-right' disabled={(this.state.disabled)}> Done </button>
              <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleClose} className='btn pull-left'> Cancel </button>
              <br />
              <br />
            </div>
          </PopoverBody>
        </Popover>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    sequences: (state.sequenceInfo.sequences)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAllSequence: fetchAllSequence
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Button)
