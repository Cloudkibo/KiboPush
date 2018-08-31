/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editButton, deleteButton } from '../../redux/actions/broadcast.actions'
import { isWebURL } from './../../utility/utils'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'

class EditButton extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('this.props', this.props)
    this.state = {
      openPopover: false,
      title: this.props.data.button.title,
      url: this.props.data.button.url,
      disabled: false,
      sequenceValue: this.props.data.button.sequenceValue,
      openWebsite: this.props.data.button.openWebsite,
      openSubscribe: this.props.data.button.openSubscribe,
      openUnsubscribe: this.props.data.button.openUnsubscribe
    }
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

  componentDidMount () {
    if (this.props.data.button.type === 'postback') {
      console.log('this.props.data', this.props.data)
      if (this.props.data.button.payload.action === 'subscribe') {
        this.setState({sequenceValue: this.props.data.button.payload.sequenceId})
      } else if (this.props.data.button.payload.action === 'unsubscribe') {
        this.setState({sequenceValue: this.props.data.button.payload.sequenceId})
      }
    } else {
      this.setState({sequenceValue: this.props.data.button.url})
    }
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
    this.setState({openWebsite: false})
  }

  closeSubscribe () {
    this.setState({openSubscribe: false, sequenceValue: ''})
  }

  closeUnsubscribe () {
    this.setState({openUnsubscribe: false, sequenceValue: ''})
  }

  onSequenceChange (e) {
    this.setState({sequenceValue: e.target.value, disabled: false})
  }

  handleClick (e) {
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false})
  }
  handleToggle () {
    this.setState({openPopover: !this.state.openPopover})
  }
  handleDone () {
    console.log('this.state', this.state)
    if (this.state.url !== '') {
      let data = {
        id: this.props.index,
        type: 'web_url',
        oldUrl: this.props.data.button.newUrl,
        newUrl: this.state.url, // User defined link,
        title: this.state.title // User defined label
      }
      this.props.editButton(data, this.props.onEdit)
    } else if (this.state.sequenceValue !== '') {
      if (this.state.openSubscribe && !this.state.openUnsubscribe) {
        let data = {
          id: this.props.index,
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'subscribe'
        }
        this.props.editButton(data, this.props.onEdit)
      } else if (!this.state.openSubscribe && this.state.openUnsubscribe) {
        let data = {
          id: this.props.index,
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'unsubscribe'
        }
        this.props.editButton(data, this.props.onEdit)
      }
    }
    this.setState({
      openPopover: false
    })
  }

  changeTitle (event) {
    if ((this.state.sequenceValue !== '' || isWebURL(this.state.url)) && event.target.value !== '') {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({title: event.target.value})
    console.log('The title value is ' + this.state.title)
    console.log('The event.target.value value is ' + event.target.value)
  }

  changeUrl (event) {
    if (isWebURL(event.target.value) && this.state.title !== '') {
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
    this.setState({
      openPopover: false,
      title: '',
      url: '',
      sequenceValue: '',
      openWebsite: false,
      openSubscribe: false,
      openUnsubscribe: false
    })
    let temp = this.props.data.button.newUrl.split('/')
    let id = temp[temp.length - 1]
    this.props.deleteButton(id)
  }

  render () {
    console.log('EditButton state', this.state)
    console.log('EditButton state', this.props.data)
    return (
      <div>
        <div id={'editButtonTarget-' + this.props.button_id} ref={(b) => { this.target = b }} className='align-center' onClick={this.handleClick}>
          <button className='btn btn-primary btn-sm' style={{width: 100 + '%', margin: 0, border: 2 + 'px', borderStyle: 'solid', borderColor: '#FF5E3A'}}>{this.props.data.button.title}</button>
        </div>
        <Popover placement='right-end' isOpen={this.state.openPopover} className='buttonPopover' target={'editButtonTarget-' + this.props.button_id} toggle={this.handleToggle}>
          <PopoverHeader><strong>Edit Button</strong></PopoverHeader>
          <PopoverBody>
            <div>
              <h6>Button Title:</h6>
              <input type='text' className='form-control' value={this.state.title} onChange={this.changeTitle} placeholder='Enter button title' />
              <h6 style={{marginTop: '10px'}}>When this button is pressed:</h6>
              {
                !this.state.openWebsite && !this.state.openSubscribe && !this.state.openUnsubscribe &&
                <div>
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebsite}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a website</h7>
                  </div>
                  {
                    this.props.module !== 'sequenceMessaging' && this.props.sequences && this.props.sequences.length > 0 &&
                    <div style={{border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer'}} onClick={this.showSubscribe}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='la la-check-circle' />  Subscribe to Sequence</h7>
                    </div>
                  }
                  {
                    this.props.module !== 'sequenceMessaging' && this.props.sequences && this.props.sequences.length > 0 &&
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
                    <input type='text' className='form-control' value={this.state.url} onChange={this.changeUrl} placeholder='Enter link...' />
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
              <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleRemove.bind(this)} className='btn pull-left'> Remove </button>
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
    editButton,
    deleteButton
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(EditButton)
