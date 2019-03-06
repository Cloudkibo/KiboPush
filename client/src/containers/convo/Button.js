/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { fetchAllSequence } from '../../redux/actions/sequence.action'
import { addButton } from '../../redux/actions/broadcast.actions'
import { isWebURL, isWebViewUrl } from './../../utility/utils'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import AlertContainer from 'react-alert'

class Button extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      openPopover: false,
      title: '',
      url: '',
      webviewurl: '',
      disabled: true,
      openWebsite: false,
      openWebView: false,
      openSubscribe: false,
      openUnsubscribe: false,
      sequenceValue: '',
      shareButton: false,
      webviewsize: 'FULL',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      openCreateMessage: false,
      showSequenceMessage: false
    }
    props.fetchAllSequence()
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.changeTitle = this.changeTitle.bind(this)
    this.changeUrl = this.changeUrl.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.showWebsite = this.showWebsite.bind(this)
    this.showWebView = this.showWebView.bind(this)
    this.showSubscribe = this.showSubscribe.bind(this)
    this.showUnsubscribe = this.showUnsubscribe.bind(this)
    this.closeWebsite = this.closeWebsite.bind(this)
    this.closeWebview = this.closeWebview.bind(this)
    this.closeSubscribe = this.closeSubscribe.bind(this)
    this.closeUnsubscribe = this.closeUnsubscribe.bind(this)
    this.onSequenceChange = this.onSequenceChange.bind(this)
    this.shareButton = this.shareButton.bind(this)
    this.closeShareButton = this.closeShareButton.bind(this)
    this.changeWebviewUrl = this.changeWebviewUrl.bind(this)
    this.onChangeWebviewSize = this.onChangeWebviewSize.bind(this)
    this.replyWithMessage = this.replyWithMessage.bind(this)
    this.resetButton = this.resetButton.bind(this)
  }

  onChangeWebviewSize (event) {
    if (event.target.value !== -1) {
      this.setState({webviewsize: event.target.value})
    }
  }
  replyWithMessage () {
    let data = {
      type: 'postback',
      title: this.state.title,
      payload: null
    }
    this.setState({
      openPopover: false,
      title: '',
      url: '',
      webviewurl: '',
      sequenceValue: '',
      openWebsite: false,
      openWebView: false,
      openSubscribe: false,
      openUnsubscribe: false,
      openCreateMessage: false,
      shareButton: false
    })
    this.props.onAdd(data)
  }
  shareButton () {
    this.setState({shareButton: true, disabled: false, title: 'Share'})
  }
  showWebsite () {
    this.setState({openWebsite: true})
  }
  showWebView () {
    this.setState({openWebView: true})
  }
  showSubscribe () {
    this.setState({openSubscribe: true})
  }

  showUnsubscribe () {
    this.setState({openUnsubscribe: true})
  }
  closeWebview () {
    this.setState({openWebView: false, webviewurl: '', webviewsize: 'FULL', disabled: true})
  }
  closeWebsite () {
    this.setState({openWebsite: false, url: '', disabled: true})
  }
  closeShareButton () {
    this.setState({shareButton: false, disabled: true, title: ''})
  }
  closeSubscribe () {
    this.setState({openSubscribe: false, sequenceValue: '', disabled: true})
  }

  closeUnsubscribe () {
    this.setState({openUnsubscribe: false, sequenceValue: '', disabled: true})
  }

  onSequenceChange (e) {
    if (this.state.title !== '') {
      this.setState({disabled: false})
    }
    this.setState({sequenceValue: e.target.value})
  }

  handleClick (e) {
    this.setState({disabled: true})
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false, title: '', url: ''})
    if (this.state.openWebsite === true) {
      this.closeWebsite()
    } else if (this.state.openWebView === true) {
      this.closeWebview()
    } else if (this.state.shareButton === true) {
      this.closeShareButton()
    } else if (this.state.openSubscribe === true) {
      this.closeSubscribe()
    } else if (this.state.openUnsubscribe === true) {
      this.closeUnsubscribe()
    }
  }
  handleToggle () {
    this.setState({openPopover: !this.state.openPopover})
  }
  resetButton () {
    this.setState({
      openPopover: false,
      title: '',
      url: '',
      webviewurl: '',
      sequenceValue: '',
      openWebsite: false,
      openWebView: false,
      openSubscribe: false,
      openUnsubscribe: false,
      shareButton: false
    })
  }
  handleDone () {
    if (this.state.url !== '') {
      let data = {
        type: 'web_url',
        url: this.state.url, // User defined link,
        title: this.state.title, // User defined label
        module: {
          type: this.props.module,
          id: ''// messageId
        }
      }
      this.props.addButton(data, this.props.onAdd, this.msg, this.resetButton)
    } else if (this.state.sequenceValue !== '') {
      if (this.state.openSubscribe && !this.state.openUnsubscribe) {
        let data = {
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'subscribe'
        }
        this.props.addButton(data, this.props.onAdd, this.msg, this.resetButton)
      } else if (!this.state.openSubscribe && this.state.openUnsubscribe) {
        let data = {
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'unsubscribe'
        }
        this.props.addButton(data, this.props.onAdd, this.msg, this.resetButton)
      }
    } else if (this.state.shareButton) {
      let data = {
        type: 'element_share',
        title: this.state.title
      }
      this.props.addButton(data, this.props.onAdd, this.msg, this.resetButton)
    } else if (this.state.webviewurl !== '') {
      if (!isWebViewUrl(this.state.webviewurl)) {
        return this.msg.error('Webview must include a protocol identifier e.g.(https://)')
      }
      let data = {
        type: 'web_url',
        url: this.state.webviewurl, // User defined link,
        title: this.state.title, // User defined label
        messenger_extensions: true,
        webview_height_ratio: this.state.webviewsize,
        pageId: this.props.pageId
      }
      this.props.addButton(data, this.props.onAdd, this.msg, this.resetButton)
    }
    // this.setState({
    //   openPopover: false
    // })
  }

  changeTitle (event) {
    if ((this.state.sequenceValue !== '' || isWebURL(this.state.url) || isWebURL(this.state.webviewurl)) && event.target.value !== '') {
      this.setState({disabled: false})
    } else if (this.state.shareButton && event.target.value !== '') {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({title: event.target.value})
  }

  changeUrl (event) {
    console.log('event', event.target.value)
    if (isWebURL(this.state.url) && this.state.title !== '') {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({url: event.target.value})
  }
  changeWebviewUrl (e) {
    if (isWebURL(this.state.webviewurl) && this.state.title !== '') {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({webviewurl: e.target.value})
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
      <div className='ui-block hoverborder' style={this.props.styling} onClick={this.handleClick}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div>
          <div id={'buttonTarget-' + this.props.button_id} ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
            <h6> + Add Button </h6>
          </div>
          <Popover placement='right-end' isOpen={this.state.openPopover} className='buttonPopover' target={'buttonTarget-' + this.props.button_id} toggle={this.handleToggle}>
            <PopoverHeader><strong>Add Button</strong>
            </PopoverHeader>
            <PopoverBody>
              <div>
                <h6>Button Title:</h6>
                <input type='text' className='form-control' value={this.state.title} onChange={this.changeTitle} placeholder='Enter button title' disabled={this.state.shareButton} />
                <h6 style={{marginTop: '10px'}}>When this button is pressed:</h6>
                {
                  !this.state.openWebsite && !this.state.openSubscribe && !this.state.openUnsubscribe && !this.state.shareButton && !this.state.openWebView && !this.state.openCreateMessage &&
                  <div>
                    {
                      (this.props.buttonActions.indexOf('open website') > -1) &&
                      <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebsite}>
                        <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a website</h7>
                      </div>
                    }
                    { (this.props.buttonActions.indexOf('open webview') > -1) &&
                    <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebView}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a webview</h7>
                    </div>
                    }
                    {(this.props.buttonActions.indexOf('create message') > -1) && !(this.props.isGalleryCard === 'true') &&
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
                    { (this.props.buttonActions.indexOf('subscribe sequence') > -1) && this.state.showSequenceMessage &&
                       this.props.sequences && this.props.sequences.length > 0 &&
                       <div style={{border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer'}} onClick={this.showSubscribe}>
                         <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='la la-check-circle' />  Subscribe to Sequence</h7>
                       </div>
                    }
                    { (this.props.buttonActions.indexOf('unsubscribe sequence') > -1) && this.state.showSequenceMessage &&
                       this.props.sequences && this.props.sequences.length > 0 &&
                       <div style={{border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer'}} onClick={this.showUnsubscribe}>
                         <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='la la-times-circle' />  Unsubscribe to Sequence</h7>
                       </div>
                    }
                  </div>
                }
                {
                  this.state.openWebsite &&
                  <div className='card' style={{width: '200px'}}>
                    <h7 className='card-header'>Open Website <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeWebsite} /></h7>
                    <div style={{padding: '10px'}} className='card-block'>
                      <input type='text' value={this.state.url} className='form-control' onChange={this.changeUrl} placeholder='Enter link...' />
                    </div>
                  </div>
                }
                {
                  this.state.openCreateMessage &&
                  <div className='card' style={{width: '200px'}}>
                    <h7 className='card-header'>Create Message <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={() => {
                      this.setState({openCreateMessage: false})
                    }} />
                    </h7>
                    <div style={{padding: '10px'}} className='card-block'>
                      <button className='btn btn-success m-btn m-btn--icon replyWithMessage' disabled={this.state.title === ''} onClick={this.replyWithMessage}>
                       Create Message
                       </button>
                    </div>
                  </div>
                }
                {
                  this.state.openWebView &&
                  <div className='card' style={{width: '200px'}}>
                    <h7 className='card-header'>Open WebView <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeWebview} /></h7>
                    <div style={{padding: '10px'}} className='card-block'>
                      <div>
                        Need help in understanding webview? click <a href='https://kibopush.com/webview/' target='_blank'>here.</a>
                      </div>
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
                  this.state.shareButton &&
                  <div className='card'>
                    <h7 className='card-header'>Share this message <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeShareButton} /></h7>
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
                            seq.sequence.trigger.event === 'subscribes_to_sequence'
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
                    <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleClose} className='btn pull-left'> Cancel </button>
                    <br />
                    <br />
                  </div>
                }
              </div>
            </PopoverBody>
          </Popover>
        </div>
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
    fetchAllSequence: fetchAllSequence,
    addButton: addButton
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Button)
