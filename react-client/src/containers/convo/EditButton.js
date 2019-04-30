/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editButton, deleteButton } from '../../redux/actions/broadcast.actions'
import { isWebURL, isWebViewUrl } from './../../utility/utils'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import { Link } from 'react-router'
import AlertContainer from 'react-alert'

class EditButton extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('EditButton this.props', this.props)
    this.state = {
      openPopover: false,
      title: this.props.data.button.type === 'element_share' ? 'Share' : this.props.data.button.title,
      url: !this.props.data.button.messenger_extensions ? this.props.data.button.url : '',
      disabled: false,
      sequenceValue: this.props.data.button.sequenceValue,
      openWebsite: this.props.data.button.type === 'web_url' && !this.props.data.button.messenger_extensions,
      openSubscribe: this.props.data.button.openSubscribe,
      openUnsubscribe: this.props.data.button.openUnsubscribe,
      shareButton: this.props.data.button.type === 'element_share',
      openWebView: this.props.data.button.messenger_extensions,
      webviewurl: this.props.data.button.messenger_extensions ? this.props.data.button.url : '',
      webviewsize: this.props.data.button.webview_height_ratio ? this.props.data.button.webview_height_ratio : 'FULL',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      openCreateMessage: false,
      showSequenceMessage: false
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
    this.shareButton = this.shareButton.bind(this)
    this.closeShareButton = this.closeShareButton.bind(this)
    this.changeWebviewUrl = this.changeWebviewUrl.bind(this)
    this.onChangeWebviewSize = this.onChangeWebviewSize.bind(this)
    this.closeWebview = this.closeWebview.bind(this)
    this.showWebView = this.showWebView.bind(this)
    this.replyWithMessage = this.replyWithMessage.bind(this)
    this.setButtonProperties = this.setButtonProperties.bind(this)
  }
  componentDidMount () {
    console.log('this.props.data', this.props.data)
    if (this.props.data.button.type === 'postback') {
      if (this.props.data.button.payload && this.props.data.button.payload.action && this.props.data.button.payload.action === 'subscribe') {
        this.setState({sequenceValue: this.props.data.button.payload.sequenceId})
      } else if (this.props.data.button.payload && this.props.data.button.payload.action && this.props.data.button.payload.action === 'unsubscribe') {
        this.setState({sequenceValue: this.props.data.button.payload.sequenceId})
      } else {
        this.setState({openCreateMessage: true})
      }
    } else {
      if (this.props.data.button.type !== 'web_url') {
        this.setState({sequenceValue: this.props.data.button.url})
      }
    }
  }
  replyWithMessage () {
    let data = {
      type: 'postback',
      title: this.state.title,
      payload: this.props.data.button.payload
    }
    this.setState({
      openPopover: false
    })
    this.props.onEdit({
      id: this.props.index,
      button: data
    })
    this.props.replyWithMessage(data)
  }
  showWebsite () {
    this.setState({openWebsite: true})
    this.setState({
      webviewurl: '',
      openWebView: false,
      sequenceValue: '',
      openSubscribe: false,
      openUnsubscribe: false,
      shareButton: false,
      openCreateMessage: false,
      webviewsize: 'FULL',
      webviewsizes: ['COMPACT', 'TALL', 'FULL']
    })
  }
  onChangeWebviewSize (event) {
    if (event.target.value !== -1) {
      this.setState({webviewsize: event.target.value})
    }
  }
  showWebView () {
    this.setState({openWebView: true})
    this.setState({
      url: '',
      sequenceValue: '',
      openWebsite: false,
      openSubscribe: false,
      openUnsubscribe: false,
      shareButton: false,
      openCreateMessage: false
    })
  }
  closeWebview () {
    this.setState({openWebView: false})
  }
  changeWebviewUrl (e) {
    if (isWebURL(this.state.webviewurl) && this.state.title !== '') {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({webviewurl: e.target.value})
  }
  showSubscribe () {
    this.setState({openSubscribe: true})
  }

  showUnsubscribe () {
    this.setState({openUnsubscribe: true})
  }
  shareButton () {
    this.setState({shareButton: true, disabled: false, title: 'Share'})
    this.setState({
      url: '',
      webviewurl: '',
      sequenceValue: '',
      openWebsite: false,
      openWebView: false,
      openSubscribe: false,
      openUnsubscribe: false,
      webviewsize: 'FULL',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      openCreateMessage: false
    })
  }
  closeShareButton () {
    this.setState({shareButton: false, disabled: true, title: ''})
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
    this.setButtonProperties()
  }
  setButtonProperties () {
    this.setState({
      title: this.props.data.button.type === 'element_share' ? 'Share' : this.props.data.button.title,
      url: !this.props.data.button.messenger_extensions ? this.props.data.button.url : '',
      disabled: false,
      sequenceValue: this.props.data.button.sequenceValue,
      openWebsite: this.props.data.button.type === 'web_url' && !this.props.data.button.messenger_extensions,
      openSubscribe: this.props.data.button.openSubscribe,
      openUnsubscribe: this.props.data.button.openUnsubscribe,
      shareButton: this.props.data.button.type === 'element_share',
      openWebView: this.props.data.button.messenger_extensions,
      webviewurl: this.props.data.button.messenger_extensions ? this.props.data.button.url : '',
      webviewsize: this.props.data.button.webview_height_ratio ? this.props.data.button.webview_height_ratio : 'FULL',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      openCreateMessage: !!(!this.props.data.button.sequenceValue && this.props.data.button.type === 'postback')
    })
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
      this.props.editButton(data, this.props.onEdit, this.handleClose, this.msg)
    } else if (this.state.shareButton) {
      let data = {
        id: this.props.index,
        type: 'element_share',
        title: this.state.title
      }
      this.props.editButton(data, this.props.onEdit, this.handleClose, this.msg)
    } else if (this.state.sequenceValue && this.state.sequenceValue !== '') {
      if (this.state.openSubscribe && !this.state.openUnsubscribe) {
        let data = {
          id: this.props.index,
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'subscribe'
        }
        this.props.editButton(data, this.props.onEdit, this.handleClose, this.msg)
      } else if (!this.state.openSubscribe && this.state.openUnsubscribe) {
        let data = {
          id: this.props.index,
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'unsubscribe'
        }
        this.props.editButton(data, this.props.onEdit, this.handleClose, this.msg)
      }
    } else if (this.state.webviewurl && this.state.webviewurl !== '') {
      if (!isWebViewUrl(this.state.webviewurl)) {
        return this.msg.error('Webview must include a protocol identifier e.g.(https://)')
      }
      let data = {
        id: this.props.index,
        type: 'web_url',
        url: this.state.webviewurl, // User defined link,
        title: this.state.title, // User defined label
        messenger_extensions: true,
        webview_height_ratio: this.state.webviewsize,
        pageId: this.props.pageId
      }
      this.props.editButton(data, this.props.onEdit, this.handleClose, this.msg)
    }
  }

  changeTitle (event) {
    if ((this.state.sequenceValue !== '' || isWebURL(this.state.webviewurl) || isWebURL(this.state.url)) && event.target.value !== '') {
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

  handleRemove () {
    this.props.onRemove({
      id: this.props.data.id,
      button: this.props.data.button,
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
      openUnsubscribe: false,
      webviewurl: '',
      webviewsize: 'FULL'
    })
    if (this.props.data.button && this.props.data.button.newUrl) {
      let temp = this.props.data.button.newUrl.split('/')
      let id = temp[temp.length - 1]
      this.props.deleteButton(id)
    }
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div id={'editButtonTarget-' + this.props.button_id} ref={(b) => { this.target = b }} className='align-center' onClick={this.handleClick}>
          <button className='btn btn-primary btn-sm' style={{width: 100 + '%', margin: 0, border: 2 + 'px', borderStyle: 'solid', borderColor: '#FF5E3A'}}>{this.props.data.button.type === 'element_share' ? 'Share' : this.props.data.button.title}</button>
        </div>
        <Popover placement='right-end' isOpen={this.state.openPopover} className='buttonPopover' target={'editButtonTarget-' + this.props.button_id} toggle={this.handleToggle}>
          <PopoverHeader><strong>Edit Button</strong></PopoverHeader>
          <PopoverBody>
            <div>
              <h6>Button Title:</h6>
              <input type='text' className='form-control' value={this.state.title} onChange={this.changeTitle} placeholder='Enter button title' disabled={this.state.shareButton} />
              <h6 style={{marginTop: '10px'}}>When this button is pressed:</h6>
              {
                !this.state.openWebsite && !this.state.openSubscribe && !this.state.openUnsubscribe && !this.state.shareButton && !this.state.openWebView && !(this.state.openCreateMessage) &&
                <div>
                  {
                  (this.props.buttonActions.indexOf('open website') > -1) &&
                    <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebsite}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a website</h7>
                    </div>
                  }
                  { (this.props.buttonActions.indexOf('open webview') > -1) &&
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebView}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open webview</h7>
                  </div>
                  }
                  { (this.props.buttonActions.indexOf('create message') > -1) && !(this.props.isGalleryCard === 'true') &&
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={() => {
                    this.setState({
                      openCreateMessage: true
                    })
                  }}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Reply with a message</h7>
                  </div>
                  }
                  {
                    (this.props.buttonActions.indexOf('add share') > -1) &&
                    <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.shareButton}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-share' /> Add Share button</h7>
                    </div>
                  }
                  { this.state.showSequenceMessage &&
                    (this.props.buttonActions.indexOf('subscribe sequence') > -1) && this.props.sequences && this.props.sequences.length > 0 &&
                    <div style={{border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer'}} onClick={this.showSubscribe}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='la la-check-circle' />  Subscribe to Sequence</h7>
                    </div>
                  }
                  { this.state.showSequenceMessage &&
                    (this.props.buttonActions.indexOf('unsubscribe sequence') > -1) && this.props.sequences && this.props.sequences.length > 0 &&
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
                this.state.openCreateMessage &&
                <div className='card'>
                  <h7 className='card-header'>Create Message <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={() => {
                    this.setState({openCreateMessage: false})
                  }} />
                  </h7>
                  <div style={{padding: '10px'}} className='card-block'>
                    { this.props.data.button.type === 'postback' && this.props.data.button.payload
                      ? <button className='btn btn-success m-btn m-btn--icon replyWithMessage' disabled={this.state.title === ''} onClick={this.replyWithMessage}>
                       Edit Message
                       </button>
                       : <button className='btn btn-success m-btn m-btn--icon replyWithMessage' disabled={this.state.title === ''} onClick={this.replyWithMessage}>
                        Create Message
                      </button>
                     }
                  </div>
                </div>
              }
              {
                this.state.shareButton &&
                <div className='card'>
                  <h7 className='card-header'>Share this message <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeShareButton} /></h7>
                </div>
              }
              {
                this.state.openWebView &&
                <div className='card'>
                  <h7 className='card-header'>Open WebView <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeWebview} /></h7>
                  <div style={{padding: '10px'}} className='card-block'>
                    <div>
                      <Link to='/settings' state={{tab: 'whitelistDomains'}} style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}}>Whitelist url domains to open in-app browser</Link>
                    </div>
                    <label className='form-label col-form-label' style={{textAlign: 'left'}}>Url</label>
                    <input type='text' value={this.state.webviewurl} className='form-control' onChange={this.changeWebviewUrl} placeholder='Enter link...' />
                    <label className='form-label col-form-label' style={{textAlign: 'left'}}>WebView Size</label>
                    <select className='form-control m-input' value={this.state.webviewsize} onChange={this.onChangeWebviewSize}>
                      {
                        this.state.webviewsizes && this.state.webviewsizes.length > 0 && this.state.webviewsizes.map((size, i) => (
                          <option key={i} value={size} selected={size === this.state.webviewsize}>{size}</option>
                        ))
                      }
                    </select>
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
                        seq.sequence.trigger.event === 'subcribes_to_sequence'
                        ? <option key={i} value={seq.sequence._id}>{seq.sequence.name}</option> : ''
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
                        seq.sequence.trigger.event === 'subscribes_to_sequence'
                         ? <option key={i} value={seq.sequence._id}>{seq.sequence.name}</option> : ''
                        ))
                      }
                    </select>
                  </div>
                </div>
              }
              { !this.state.openCreateMessage &&
                <div>
                  <hr style={{color: '#ccc'}} />
                  <button onClick={this.handleDone} className='btn btn-primary btn-sm pull-right' disabled={(this.state.disabled)}> Done </button>
                  <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleRemove.bind(this)} className='btn pull-left'> Remove </button>
                  <br />
                  <br />
                </div>
              }
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
