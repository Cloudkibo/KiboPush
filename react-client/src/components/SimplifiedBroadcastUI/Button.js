import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { fetchAllSequence } from '../../redux/actions/sequence.action'
import { addButton, editButton } from '../../redux/actions/broadcast.actions'
import { isWebURL, isWebViewUrl, getHostName } from './../../utility/utils'
import { checkWhitelistedDomains } from '../../redux/actions/broadcast.actions'
import { fetchWhiteListedDomains } from '../../redux/actions/settings.actions'

class Button extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      openPopover: false,
      title: this.props.button ? this.props.button.title : this.props.title,
      url: this.props.button ? (!this.props.button.messenger_extensions ? this.props.button.url : '') : '',
      sequenceValue: this.props.button ? this.props.button.sequenceValue : '',
      openWebsite: this.props.button ? this.props.button.type === 'web_url' && !this.props.button.messenger_extensions : false,
      openSubscribe: this.props.button ? this.props.button.openSubscribe : '',
      openUnsubscribe: this.props.button ? this.props.button.openUnsubscribe : false,
      sendSequenceMessageButton: this.props.button ? this.props.button.type === 'postback' : false,
      openWebView: this.props.button ? this.props.button.messenger_extensions : false,
      webviewurl: this.props.button ? (this.props.button.messenger_extensions ? this.props.button.url : '') : '',
      webviewsize: this.props.button ? (this.props.button.webview_height_ratio ? this.props.button.webview_height_ratio : 'FULL') : 'FULL',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      openCreateMessage: false,
      showSequenceMessage: true,
      buttonDisabled: this.props.edit ? false : true,
      errorMsg:''
    }

    props.fetchAllSequence()
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.handleDoneEdit = this.handleDoneEdit.bind(this)
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
    this.sendSequenceMessageButton = this.sendSequenceMessageButton.bind(this)
    this.closeSendSequenceMessageButton = this.closeSendSequenceMessageButton.bind(this)
    this.changeWebviewUrl = this.changeWebviewUrl.bind(this)
    this.onChangeWebviewSize = this.onChangeWebviewSize.bind(this)
    this.replyWithMessage = this.replyWithMessage.bind(this)
    this.resetButton = this.resetButton.bind(this)
    this.handleFetch = this.handleFetch.bind(this)

    props.fetchWhiteListedDomains(props.pageId, this.handleFetch)
    this.buttonId = (this.props.cardId ? `card${this.props.cardId}` : '') + 'button' + this.props.index
  }

  handleFetch (resp) {
    console.log('done fetching whitelisted domains', resp)
    if (resp.status === 'success') {
      console.log('fetched whitelisted domains', resp.payload)
      this.setState({whitelistedDomains: resp.payload})
    }
  }

  componentWillReceiveProps (nextProps) {
    let newState = {
      title: nextProps.tempButton
        ? nextProps.tempButton.title
        : nextProps.title,
      url: nextProps.tempButton ? nextProps.tempButton.url : '',
      openWebsite: nextProps.tempButton && nextProps.tempButton.url ? true: false,
      sendSequenceMessageButton: nextProps.tempButton && nextProps.tempButton.sendSequenceMessageButton,
      openWebView: nextProps.tempButton && nextProps.tempButton.webviewurl ? true : false,
      webviewurl: nextProps.tempButton ? nextProps.tempButton.webviewurl : '',
      webviewsize: nextProps.tempButton ? nextProps.tempButton.webviewsize : 'FULL',
      webviewsizes: ['COMPACT', 'TALL', 'FULL']
    }
    newState.openPopover = newState.openWebsite || newState.openWebView || newState.sendSequenceMessageButton
    console.log('Button newState', newState)
    if (newState.openPopover) {
      this.setState(newState)
    }
    if (nextProps.scrollTo) {
      document.getElementById(this.buttonId).scrollIntoView({ behavior: 'smooth' })
    }
  }



  onChangeWebviewSize (event) {
    if (event.target.value !== -1) {
      let buttonData = {title: this.state.title, visible: true, webviewurl: this.state.webviewurl, index: this.props.index, webviewsize: event.target.value}
      this.setState({webviewsize: event.target.value})
      this.props.updateButtonStatus({buttonData})
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
      sendSequenceMessageButton: false
    })
    this.props.onAdd(data, this.props.index)
  }

  sendSequenceMessageButton () {
    this.setState({sendSequenceMessageButton: true, title: ''})
    if (this.props.updateButtonStatus) {
      let buttonData = {title: '', visible: true, sendSequenceMessageButton: true, index: this.props.index}
      this.props.updateButtonStatus({buttonDisabled: true, buttonData})
    }
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
    this.setState({openWebView: false, webviewurl: '', webviewsize: 'FULL', buttonDisabled: true})
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({buttonDisabled: true})
    }
  }
  closeWebsite () {
    this.setState({openWebsite: false, url: '', buttonDisabled: true})
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({buttonDisabled: true})
    }
  }

  closeSendSequenceMessageButton () {
    this.setState({sendSequenceMessageButton: false, buttonDisabled: true, title: ''})
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({buttonDisabled: true})
    }
  }
  closeSubscribe () {
    this.setState({openSubscribe: false, sequenceValue: '', buttonDisabled: true})
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({buttonDisabled: true})
    }
  }

  closeUnsubscribe () {
    this.setState({openUnsubscribe: false, sequenceValue: '', buttonDisabled: true})
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({buttonDisabled: true})
    }
  }

  onSequenceChange (e) {
    if (this.state.title !== '') {
      this.setState({buttonDisabled: false})
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({buttonDisabled: false})
      }
    }
    this.setState({sequenceValue: e.target.value})
  }

  handleClick (e) {
    this.setState({buttonDisabled: true})
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({buttonDisabled: true})
    }
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false, title: '', url: ''})
    if (this.state.openWebsite === true) {
      this.closeWebsite()
    } else if (this.state.openWebView === true) {
      this.closeWebview()
    } else if (this.state.sendSequenceMessageButton === true) {
      this.closeSendSequenceMessageButton()
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
      sendSequenceMessageButton: false
    })
  }

  handleDoneEdit () {
    console.log('this.state', this.state)
    if (this.state.url) {
      let data = {
        id: this.props.index,
        type: 'web_url',
        oldUrl: this.props.button.newUrl,
        newUrl: this.state.url, // User defined link,
        title: this.state.title // User defined label
      }
      this.props.editButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.handleClose, this.msg)
    } else if (this.state.sendSequenceMessageButton) {
      let data = {
        id: this.props.index,
        type: 'postback',
        title: this.state.title,
        messageId: 'messageId'
      }
      this.props.editButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.handleClose, this.msg)
    } else if (this.state.sequenceValue && this.state.sequenceValue !== '') {
      if (this.state.openSubscribe && !this.state.openUnsubscribe) {
        let data = {
          id: this.props.index,
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'subscribe'
        }
        this.props.editButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.handleClose, this.msg)
      } else if (!this.state.openSubscribe && this.state.openUnsubscribe) {
        let data = {
          id: this.props.index,
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'unsubscribe'
        }
        this.props.editButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.handleClose, this.msg)
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
      this.props.editButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.handleClose, this.msg)
    }
  }

  handleDone () {
    console.log('button handleDone')
    if (this.state.url) {
      let data = {
        type: 'web_url',
        url: this.state.url, // User defined link,
        title: this.state.title, // User defined label
        module: {
          type: this.props.module,
          id: ''// messageId
        }
      }
      this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
    } else if (this.state.sequenceValue) {
      if (this.state.openSubscribe && !this.state.openUnsubscribe) {
        let data = {
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'subscribe',
          module: {type: 'sequenceMessaging'}
        }
        this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
      } else if (!this.state.openSubscribe && this.state.openUnsubscribe) {
        let data = {
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'unsubscribe',
          module: {type: 'sequenceMessaging'}
        }
        this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
      }
    } else if (this.state.sendSequenceMessageButton) {
      let data = {
        type: 'postback',
        title: this.state.title,
        messageId: 'messageId'
      }
      this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
    } else if (this.state.webviewurl) {
      let data = {
        type: 'web_url',
        url: this.state.webviewurl, // User defined link,
        title: this.state.title, // User defined label
        messenger_extensions: true,
        webview_height_ratio: this.state.webviewsize,
        pageId: this.props.pageId
      }
      this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
    }
  }

  changeTitle (event) {
    if ((this.state.sequenceValue !== '' || isWebURL(this.state.url) || isWebURL(this.state.webviewurl)) && event.target.value !== '') {
      this.setState({buttonDisabled: false})
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({buttonDisabled: false})
      }
    } else if (this.state.sendSequenceMessageButton && event.target.value !== '') {
      this.setState({buttonDisabled: false})
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({buttonDisabled: false})
      }
    } else {
      this.setState({buttonDisabled: true})
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({buttonDisabled: true})
      }
    }
    this.setState({title: event.target.value})
    if (this.props.handleTitleChange) {
      this.props.handleTitleChange(event.target.value, this.props.button_id)
    }
  }

  changeUrl (event) {
    console.log('chaning website url', event.target.value)
    let buttonData = {title: this.state.title, visible: true, url: event.target.value, index: this.props.index}
    if (isWebURL(event.target.value) && this.state.title !== '') {
      console.log('buttonDisabled: false')
      this.setState({buttonDisabled: false})
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({buttonDisabled: false, buttonData})
      }
    } else {
      this.setState({buttonDisabled: true})
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({buttonDisabled: true, buttonData})
      }
    }
    this.setState({url: event.target.value})
  }
  changeWebviewUrl (e) {
    console.log('changing webviewurl', e.target.value)
    let buttonData = {title: this.state.title, visible: true, webviewurl: e.target.value, index: this.props.index}
    if (!isWebURL(e.target.value)) {
      this.setState({buttonDisabled: true, errorMsg: ''})
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({buttonDisabled: true, buttonData})
      }
    } else {
      if (!isWebViewUrl(e.target.value)) {
        this.setState({webviewurl: e.target.value, buttonDisabled: true, errorMsg: 'Webview must include a protocol identifier e.g.(https://)'})
        if (this.props.updateButtonStatus) {
          this.props.updateButtonStatus({buttonDisabled: true, buttonData})
        }
        return
      }
      let validDomain = false
      for (let i = 0; i < this.state.whitelistedDomains.length; i++) {
        let domain = this.state.whitelistedDomains[i]
        if (getHostName(e.target.value) === getHostName(domain)) {
          validDomain = true
          break
        }
      }

      if (validDomain) {
        this.setState({errorMsg:'', buttonDisabled: false})
        if (this.props.updateButtonStatus) {
          this.props.updateButtonStatus({buttonDisabled: false, buttonData})
        }
      } else {
        this.setState({buttonDisabled: true, errorMsg: 'The given domain is not whitelisted. Please add it to whitelisted domains.'})
        if (this.props.updateButtonStatus) {
          this.props.updateButtonStatus({buttonDisabled: true, buttonData})
        }
      }
    }
    this.setState({webviewurl: e.target.value})
  }

  render () {
    return (
      <div id={this.buttonId} className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '300px', marginBottom: '30px', padding: '20px'}} >
        <div onClick={this.props.closeButton} style={{marginLeft: '100%', marginTop: '-10px', marginBottom: '15px', cursor: 'pointer'}}>❌</div>
        <div>
          <h6>Button Title:</h6>
          <input style={{borderColor: this.state.title === '' ? 'red' : ''}} type='text' className='form-control' value={this.state.title} onChange={this.changeTitle} placeholder='Enter button title' />
          <div style={{color: 'red', textAlign: 'left'}}>{this.state.title === '' ? '*Required' : ''}</div>

          <div style={{marginTop: '30px'}}>
            {
                  !this.state.openWebsite && !this.state.openSubscribe && !this.state.openUnsubscribe && !this.state.sendSequenceMessageButton && !this.state.openWebView && !this.state.openCreateMessage &&
                  <div>
                    <h6 style={{color: 'red'}}>Select one of the below actions:</h6>
                    {
                      (this.props.buttonActions.indexOf('open website') > -1) &&
                      <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginBottom: '10px'}} onClick={this.showWebsite}>
                        <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a website</h7>
                      </div>
                    }
                    { (this.props.buttonActions.indexOf('open webview') > -1) &&
                    <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginBottom: '10px'}} onClick={this.showWebView}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a webview</h7>
                    </div>
                    }
                    {(this.props.buttonActions.indexOf('create message') > -1) && !(this.props.isGalleryCard === 'true') &&
                    <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginBottom: '10px'}} onClick={() => {
                      this.setState({
                        openCreateMessage: true
                      })
                    }}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Reply with a message</h7>
                    </div>
                    }
                    {
                      (this.props.buttonActions.indexOf('send sequence message') > -1) &&
                      <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.sendSequenceMessageButton}>
                        <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-share' /> Send Sequence Message</h7>
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
                  <div className='card'>
                    <h7 className='card-header'>Open Website <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeWebsite} /></h7>
                    <div style={{padding: '10px'}} className='card-block'>
                      <input type='text' value={this.state.url} className='form-control' onChange={this.changeUrl} placeholder='Enter link...' />
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
                      <button className='btn btn-success m-btn m-btn--icon replyWithMessage' disabled={this.state.title === '' || this.props.disabled} onClick={this.replyWithMessage}>
                       Create Message
                       </button>
                    </div>
                  </div>
                }
          {
                  this.state.openWebView &&
                  <div className='card'>
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
                      <div style={{marginBottom: '30px', color: 'red'}}>{this.state.errorMsg}</div>
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
                    this.state.sendSequenceMessageButton &&
                    <div className='card'>
                      <h7 className='card-header'>Send Sequence Message <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeSendSequenceMessageButton} /></h7>
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
          </div>
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
    editButton: editButton,
    addButton: addButton,
   checkWhitelistedDomains: checkWhitelistedDomains,
   fetchWhiteListedDomains
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Button)
