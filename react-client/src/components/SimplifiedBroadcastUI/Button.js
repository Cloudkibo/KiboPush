import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { fetchAllSequence } from '../../redux/actions/sequence.action'
import { getIntegrations } from '../../redux/actions/settings.actions'
import { addButton, editButton } from '../../redux/actions/broadcast.actions'
import { isWebURL, isWebViewUrl, getHostName } from './../../utility/utils'
import { checkWhitelistedDomains } from '../../redux/actions/broadcast.actions'
import { fetchWhiteListedDomains } from '../../redux/actions/settings.actions'
import { loadCustomFields } from '../../redux/actions/customFields.actions'
import CustomFields from '../customFields/customfields'
import GoogleSheetActions from './GoogleSheetActions'
import HubspotActions from './hubspot/HubspotActions'
import ActionsPopover from './ActionsPopover'

class Button extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      postbackPayload: props.button && props.button.type === 'postback' ? JSON.parse(props.button.payload) : [],
      buttonActions: [],
      showButtonActionPopover: false,
      openPopover: false,
      title: this.props.button ? this.props.button.title : this.props.title,
      url: this.props.button ? (!this.props.button.messenger_extensions ? this.props.button.url : '') : '',
      openWebsite: this.props.button ? this.props.button.type === 'web_url' && !this.props.button.messenger_extensions : false,
      sendSequenceMessageButton: this.props.button ? this.props.button.type === 'postback' && !this.props.button.payload : false,
      openWebView: this.props.button ? this.props.button.messenger_extensions : false,
      webviewurl: this.props.button ? (this.props.button.messenger_extensions ? this.props.button.url : '') : '',
      webviewsize: this.props.button ? (this.props.button.webview_height_ratio ? this.props.button.webview_height_ratio : 'FULL') : 'FULL',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      openCreateMessage: this.props.button ? (this.props.button.type === 'postback' && this.props.button.payload && typeof this.props.button.payload  === 'number') : false,
      showSequenceMessage: true,
      buttonDisabled: this.props.button ? false : true,
      errorMsg: '',
    }
    props.fetchAllSequence()
    props.getIntegrations()
    props.loadCustomFields()
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
    this.removeReplyWithMessage = this.removeReplyWithMessage.bind(this)
    this.resetButton = this.resetButton.bind(this)
    this.handleFetch = this.handleFetch.bind(this)
    this.showCustomField = this.showCustomField.bind(this)
    this.closeCustomField = this.closeCustomField.bind(this)
    this.showGoogleSheets = this.showGoogleSheets.bind(this)
    this.closeGoogleSheets = this.closeGoogleSheets.bind(this)
    this.saveGoogleSheet = this.saveGoogleSheet.bind(this)
    this.removeGoogleAction = this.removeGoogleAction.bind(this)
    this.showHubspot = this.showHubspot.bind(this)
    this.updateHubspotAction = this.updateHubspotAction.bind(this)
    this.removeHubspotAction = this.removeHubspotAction.bind(this)
    this.closeHubspot = this.closeHubspot.bind(this)
    this.savehubSpotForm = this.savehubSpotForm.bind(this)
    this.weburlDebounce = this.weburlDebounce.bind(this)
    this.webviewUrlDebounce = this.webviewUrlDebounce.bind(this)
    props.fetchWhiteListedDomains(props.pageId, this.handleFetch)
    this.buttonId = (this.props.cardId ? `card${this.props.cardId}` : '') + 'button' + this.props.index
    this.typingTimer = null
    this.doneTypingInterval = 500
    this.createButtonActions = this.createButtonActions.bind(this)
    this.showButtonActionPopover = this.showButtonActionPopover.bind(this)
    this.toggleButtonActionPopover = this.toggleButtonActionPopover.bind(this)
  }

  createButtonActions () {
    let buttonActions = []
    for (let i = 0; i < this.props.buttonActions.length; i++) {
      let buttonAction = this.props.buttonActions[i]
      if (buttonAction === 'open website' && this.state.postbackPayload.length === 0 && !this.state.openCreateMessage) {
        buttonActions.push({title: 'Open website', action: this.showWebsite})
      }
      if (buttonAction === 'open webview' && this.state.postbackPayload.length === 0 && !this.state.openCreateMessage) {
        buttonActions.push({title: 'Open webview', action: this.showWebView})
      }
      if (buttonAction === 'create message' && !this.state.openCreateMessage) {
        buttonActions.push({title: 'Reply with a message', action: this.replyWithMessage})
      }
      if (buttonAction === 'send sequence message') {
        buttonActions.push({title: 'Send sequence message', action: this.sendSequenceMessageButton})
      }
      if (buttonAction === 'subscribe sequence') {
        buttonActions.push({title: 'Subscribe to sequence', action: this.showSubscribe})
      }
      if (buttonAction === 'unsubscribe sequence') {
        buttonActions.push({title: 'Unsubscribe from sequence', action: this.showUnsubscribe})
      }
      if (buttonAction === 'set custom field') {
        buttonActions.push({title: 'Set custom field', action: this.showCustomField})
      }
      if (buttonAction === 'google sheets' && this.state.googleIntegration) {
        buttonActions.push({title: 'Google Sheets', action: this.showGoogleSheets})
      }
      if (buttonAction === 'hubspot' && this.state.hubspotIntegration) {
        buttonActions.push({title: 'Hubspot', action: this.showHubspot})
      }
    }
    return buttonActions
  }

  handleFetch(resp) {
    console.log('done fetching whitelisted domains', resp)
    if (resp.status === 'success') {
      console.log('fetched whitelisted domains', resp.payload)
      this.setState({ whitelistedDomains: resp.payload })
    }
  }

  savehubSpotForm(hubSpotFormPayload, index) {
    console.log('hubSpotFormPayload', hubSpotFormPayload)
    let postbackPayload = this.state.postbackPayload
    postbackPayload[index] = Object.assign(postbackPayload[index], {
      hubspotAction: hubSpotFormPayload.hubspotAction,
      hubSpotForm: hubSpotFormPayload.hubSpotForm,
      portalId: hubSpotFormPayload.portalId,
      mapping: hubSpotFormPayload.mapping,
      identityFieldValue: hubSpotFormPayload.identityFieldValue
    })
    this.setState({postbackPayload})
    if (this.state.title !== '') {
      let buttonData = {
        title: this.state.title, visible: true,
        hubspotAction: hubSpotFormPayload.hubspotAction,
        formId: hubSpotFormPayload.hubSpotForm,
        mapping: hubSpotFormPayload.mapping,
        portalId: hubSpotFormPayload.portalId,
        identityCustomFieldValue: hubSpotFormPayload.identityFieldValue,
        index: this.props.index
      }
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() }, buttonData)
      }
    }
  }

  componentDidMount() {
    console.log('in componentDidMount of button', this.props.button)
    if (this.props.button && this.props.button.payload && typeof this.props.button.payload === 'string') {
      let buttonPayload = JSON.parse(this.props.button.payload)
      console.log('button payload for work', buttonPayload)
      if (buttonPayload.googleSheetAction) {
        this.setState({
          spreadSheet: buttonPayload.spreadSheet,
          worksheet: buttonPayload.worksheet,
          worksheetName: buttonPayload.worksheetName,
          mapping: buttonPayload.mapping,
          googleSheetAction: buttonPayload.googleSheetAction,
          lookUpValue: buttonPayload.lookUpValue,
          lookUpColumn: buttonPayload.lookUpColumn,
          openGoogleSheets: true,
          openCreateMessage: false
        })
      }
      else if (buttonPayload.hubspotAction) {
        this.setState({
          mapping: buttonPayload.mapping,
          hubspotAction: buttonPayload.googleSheetAction,
          portalId: buttonPayload.portalId,
          identityFieldValue: buttonPayload.identityCustomFieldValue,
          openHubspot: true,
          openCreateMessage: false
        })
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let newState = {
      title: nextProps.tempButton
        ? nextProps.tempButton.title
        : nextProps.title,
      url: nextProps.tempButton ? nextProps.tempButton.url : '',
      openWebsite: nextProps.tempButton && nextProps.tempButton.url ? true : false,
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
    if (nextProps.integrations && nextProps.integrations.length > 0) {
      let googleIntegration = nextProps.integrations.filter(integration => integration.integrationName === 'Google Sheets')
      let hubspotIntegration = nextProps.integrations.filter(integration => integration.integrationName === 'Hubspot')
      if (googleIntegration && googleIntegration.length > 0) {
        this.setState({ googleIntegration: googleIntegration[0] })
      }
      if (hubspotIntegration && hubspotIntegration.length > 0) {
        this.setState({ hubspotIntegration: hubspotIntegration[0] })
      }
    }
  }

  checkValid () {
    if (!this.state.title) {
      return false
    }
    if (this.state.url || this.state.webviewurl) {
      return true
    } else {
      if (this.state.postbackPayload.length === 0) {
        return false
      }
      for (let i = 0; i < this.state.postbackPayload.length; i++) {
        let postbackPayload = this.state.postbackPayload[i]
        if (postbackPayload.action === 'subscribe' || postbackPayload.action === 'subscribe') {
          if (!postbackPayload.sequenceId) {
            return false
          }
        }
        if (postbackPayload.action === 'set_custom_field') {
          if (!postbackPayload.customFieldId && !postbackPayload.customFieldValue) {
            return false
          }
        }
        if (postbackPayload.action === 'google_sheets') {
          if (!postbackPayload.googleSheetAction && !postbackPayload.mapping) {
            return false
          }
        }
        if (postbackPayload.action === 'hubspot') {
          if (!postbackPayload.hubspotAction && !postbackPayload.mapping) {
            return false
          }
        }
      }
    }
    return true
  }

  onChangeWebviewSize(event) {
    if (event.target.value !== -1) {
      let buttonData = { title: this.state.title, visible: true, webviewurl: this.state.webviewurl, index: this.props.index, webviewsize: event.target.value }
      this.setState({ webviewsize: event.target.value })
      this.props.updateButtonStatus({ buttonData })
    }
  }

  sendSequenceMessageButton() {
    this.setState({ sendSequenceMessageButton: true, title: '' })
    if (this.props.updateButtonStatus) {
      let buttonData = { title: '', visible: true, sendSequenceMessageButton: true, index: this.props.index }
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid(), buttonData })
    }
  }

  showCustomField() {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.push({
      action: 'set_custom_field',
      customFieldId: '',
      customFieldValue: ''
    })
    this.setState({ openCustomField: true, postbackPayload })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  showGoogleSheets() {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.push({
      action: 'google_sheets',
      googleSheetAction: '',
      spreadSheet: '',
      worksheet: '',
      worksheetName: '',
      mapping: '',
      lookUpValue: '',
      lookUpColumn: ''
    })
    this.setState({ postbackPayload })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  showHubspot() {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.push({
      action: 'hubspot',
      hubspotAction: '',
      formId: '',
      portalId: '',
      mapping: '',
      identityCustomFieldValue: ''
    })
    this.setState({ postbackPayload })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  showWebsite() {
    this.setState({ openWebsite: true })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }
  showWebView() {
    this.setState({ openWebView: true })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  showSubscribe() {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.push({
      action: 'subscribe',
      sequenceId: ''
    })
    this.setState({ postbackPayload })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  showUnsubscribe() {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.push({
      action: 'unsubscribe',
      sequenceId: ''
    })
    this.setState({ postbackPayload})
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  closeWebview() {
    this.setState({ openWebView: false, webviewurl: '', webviewsize: 'FULL' })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }
  closeWebsite() {
    this.setState({ openWebsite: false, url: '', })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  closeSendSequenceMessageButton() {
    this.setState({ sendSequenceMessageButton: false, title: '' })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }
  closeSubscribe(index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.splice(index, 1)
    this.setState({ postbackPayload })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  closeCustomField(index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.splice(index, 1)
    this.setState({ postbackPayload })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  closeUnsubscribe(index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.splice(index, 1)
    this.setState({ postbackPayload })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid })
    }
  }

  closeGoogleSheets(index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.splice(index, 1)
    this.setState({
      postbackPayload
    })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  closeHubspot(index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.splice(index, 1)
    this.setState({ postbackPayload})
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }


  onSequenceChange(e, index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload[index].sequenceId = e.target.value
    this.setState({ postbackPayload })
    if (this.state.title !== '') {
      this.setState({ buttonDisabled: false })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false })
      }
    }
  }

  handleClick(e) {
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
    this.setState({ openPopover: !this.state.openPopover })
  }

  handleClose(e) {
    this.setState({ openPopover: false, title: '', url: '' })
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
  handleToggle() {
    this.setState({ openPopover: !this.state.openPopover })
  }
  resetButton() {
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

  handleDoneEdit() {
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
    }  else if (this.state.webviewurl && this.state.webviewurl !== '') {
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
    } else {
      let data = {
        id: this.props.index,
        type: 'postback',
        title: this.state.title,
        payload: JSON.stringify(this.state.postbackPayload)
      }
      this.props.editButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.handleClose, this.msg)
    }
  }

  handleDone() {
    console.log('button handleDone')
    if (this.state.url) {
      let data = {
        type: 'web_url',
        url: this.state.url, // User defined link,
        title: this.state.title, // User defined label
        module: {
          type: this.props.module ? this.props.module : 'broadcast',
          id: ''// messageId
        }
      }
      this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
    }  else if (this.state.webviewurl) {
      let data = {
        type: 'web_url',
        url: this.state.webviewurl, // User defined link,
        title: this.state.title, // User defined label
        messenger_extensions: true,
        webview_height_ratio: this.state.webviewsize,
        pageId: this.props.pageId
      }
      this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
    } else  {
      let data = {
        id: this.props.index,
        type: 'postback',
        title: this.state.title,
        payload: JSON.stringify(this.state.postbackPayload)
      }
      this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
    }
  }

  replyWithMessage() {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.push({
      action: 'send_message_block'
    })
    this.setState({
      openCreateMessage: true,
      postbackPayload
    }, () => {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
      }
    })
  }

  removeReplyWithMessage(index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload.splice(index, 1)
    this.setState({
      openCreateMessage: false,
      postbackPayload
    }, () => {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
      }
    })
  }

  changeTitle(event) {
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
    this.setState({ title: event.target.value })
    if (this.props.handleTitleChange) {
      this.props.handleTitleChange(event.target.value, this.props.button_id)
    }
  }

  weburlDebounce () {
    let buttonData = { title: this.state.title, visible: true, url: this.state.url, index: this.props.index }
    if (isWebURL(this.state.url) && this.state.title !== '') {
      console.log('buttonDisabled: false')
      this.setState({ buttonDisabled: false })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false, buttonData })
      }
    } else {
      this.setState({ buttonDisabled: true })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: true, buttonData })
      }
    }
  }

  webviewUrlDebounce () {
    let buttonData = { title: this.state.title, visible: true, webviewurl: this.state.webviewurl, index: this.props.index }
    if (!isWebURL(this.state.webviewurl)) {
      this.setState({ buttonDisabled: true, errorMsg: '' })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: true, buttonData })
      }
    } else {
      if (!isWebViewUrl(this.state.webviewurl)) {
        this.setState({ buttonDisabled: true, errorMsg: 'Webview must include a protocol identifier e.g.(https://)' })
        if (this.props.updateButtonStatus) {
          this.props.updateButtonStatus({ buttonDisabled: true, buttonData })
        }
        return
      }
      let validDomain = false
      for (let i = 0; i < this.state.whitelistedDomains.length; i++) {
        let domain = this.state.whitelistedDomains[i]
        if (getHostName(this.state.webviewurl) === getHostName(domain)) {
          validDomain = true
          break
        }
      }

      if (validDomain) {
        this.setState({ errorMsg: '', buttonDisabled: false })
        if (this.props.updateButtonStatus) {
          this.props.updateButtonStatus({ buttonDisabled: false, buttonData })
        }
      } else {
        this.setState({ buttonDisabled: true, errorMsg: 'The given domain is not whitelisted. Please add it to whitelisted domains.' })
        if (this.props.updateButtonStatus) {
          this.props.updateButtonStatus({ buttonDisabled: true, buttonData })
        }
      }
    }
  }

  changeUrl(event) {
    console.log('changing website url', event.target.value)
    this.setState({ url: event.target.value }, () => {
      clearTimeout(this.typingTimer)
      this.typingTimer = setTimeout(this.weburlDebounce, this.doneTypingInterval)
    })
  }

  changeWebviewUrl(e) {
    console.log('changing webviewurl', e.target.value)
    this.setState({ webviewurl: e.target.value }, () => {
      clearTimeout(this.typingTimer)
      this.typingTimer = setTimeout(this.webviewUrlDebounce, this.doneTypingInterval)
    })
  }

  updateCustomFieldId(event, index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload[index].customFieldId =  event.target.value
    this.setState({ postbackPayload })
    let buttonData = { title: this.state.title, visible: true, index: this.props.index, payload: postbackPayload }
    if (postbackPayload[index].customFieldValue) {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: !this.checkValid(), buttonData })
      }
    }
  }

  saveGoogleSheet(googleSheetPayload, index) {
    console.log('saveGoogleSheet', googleSheetPayload)
    let postbackPayload = this.state.postbackPayload
    postbackPayload[index] = Object.assign(postbackPayload[index], {
      googleSheetAction: googleSheetPayload.googleSheetAction,
      spreadSheet: googleSheetPayload.spreadSheet,
      worksheet: googleSheetPayload.worksheet,
      worksheetName: googleSheetPayload.worksheetName,
      mapping: googleSheetPayload.mapping,
      lookUpValue: googleSheetPayload.lookUpValue,
      lookUpColumn: googleSheetPayload.lookUpColumn
    })
    this.setState({ postbackPayload })
    if (this.state.title !== '') {
      let buttonData = {
        title: this.state.title, visible: true,
        googleSheetAction: googleSheetPayload.googleSheetAction,
        spreadSheet: googleSheetPayload.spreadSheet,
        worksheet: googleSheetPayload.worksheet,
        worksheetName: googleSheetPayload.worksheetName,
        mapping: googleSheetPayload.mapping,
        lookUpValue: googleSheetPayload.lookUpValue,
        lookUpColumn: googleSheetPayload.lookUpColumn,
        index: this.props.index
      }
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() }, buttonData)
      }
    }
  }

  updateHubspotAction(hubspotAction) {
    this.setState({ hubspotAction: hubspotAction })
    let buttonData = { title: this.state.title, visible: true, hubspotAction: hubspotAction, index: this.props.index }
    if (this.state.hubspotAction) {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: !this.checkValid(), buttonData })
      }
    }
  }
  removeGoogleAction(index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload[index] = Object.assign(postbackPayload[index], {
      googleSheetAction: '',
      spreadSheet: '',
      worksheet: '',
      worksheetName: '',
      mapping: '',
      lookUpValue: '',
      lookUpColumn: ''
    })
    this.setState({
      postbackPayload
    })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  removeHubspotAction(index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload[index] = Object.assign(postbackPayload[index], {
      hubspotAction: '',
      hubSpotForm: '',
      portalId: '',
      mapping: '',
      identityFieldValue: ''
    })
    this.setState({ postbackPayload })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: !this.checkValid() })
    }
  }

  updateCustomFieldValue(event, index) {
    let postbackPayload = this.state.postbackPayload
    postbackPayload[index].customFieldValue =  event.target.value
    this.setState({ postbackPayload })
    let buttonData = { title: this.state.title, visible: true, index: this.props.index, payload: postbackPayload }
    if (postbackPayload[index].customFieldId && event.target.value !== '' && this.state.title !=='') {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: !this.checkValid(), buttonData })
      }
    }
    else {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: !this.checkValid(), buttonData })
      }
    }
  }

  showButtonActionPopover () {
    this.setState({showButtonActionPopover: true})
  }

  toggleButtonActionPopover () {
    this.setState({showButtonActionPopover: !this.state.showButtonActionPopover})
  }

  getPostbackActions () {
    let postbackPayload = this.state.postbackPayload
    let postbackActions = []
    for (let i = 0; i < postbackPayload.length; i++) {
      if (postbackPayload[i].action === 'set_custom_field') {
        postbackActions.push((
          <div style={{ marginTop: '30px' }}className='card'>
            <h7 className='card-header'>Set custom field <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeCustomField} /></h7>
            <div style={{ padding: '10px' }} className='card-block'>
              <select value={postbackPayload[i].customFieldId ? postbackPayload[i].customFieldId : ''} style={{ borderColor: !postbackPayload[i].customFieldId ? 'red' : '' }} className='form-control m-input' onChange={(event) => this.updateCustomFieldId(event, i)}>
                <option value={''} disabled>Select a custom field</option>
                {
                  this.props.customFields.map((customField, index) => {
                    return (
                      <option key={index} value={customField._id}>{customField.name}</option>
                    )
                  })
                }
              </select>
              {
                postbackPayload[i].customFieldId &&
                <div style={{ marginTop: '25px' }}>
                  <input style={{ borderColor: !postbackPayload[i].customFieldValue ? 'red' : '' }} value={postbackPayload[i].customFieldValue} onChange={(event) => this.updateCustomFieldValue(event, i)} placeholder='Enter value here...' className='form-control' />
                  <div style={{ color: 'red', textAlign: 'left' }}>{!postbackPayload[i].customFieldValue ? '*Required' : ''}</div>
                </div>
              }
              <div style={{ color: 'red', textAlign: 'left' }}>{!postbackPayload[i].customFieldId ? '*Required' : ''}</div>
              {/* <button id='customfieldid' data-toggle='modal' data-target='#cf_modal' style={{marginTop: '30px', marginLeft: '10px'}} className='btn btn-primary btn-sm'>
                      Manage Custom Fields
                  </button> */}
            </div>
          </div>
        ))
      } else if (postbackPayload[i].action === 'subscribe') {
        postbackActions.push((
          <div style={{ marginTop: '30px' }} className='card'>
            <h7 className='card-header'>Subscribe to Sequence <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={() => this.closeSubscribe(i)} /></h7>
            <div style={{ padding: '10px' }} className='card-block'>
              <select className='form-control m-input m-input--square' value={postbackPayload[i].sequenceId} onChange={(e) => this.onSequenceChange(e, i)}>
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
        ))
      } else if (postbackPayload[i].action === 'unsubscribe') {
        postbackActions.push((
          <div style={{ marginTop: '30px' }} className='card'>
            <h7 className='card-header'>Unsubscribe from Sequence <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={() => this.closeUnsubscribe(i)} /></h7>
            <div style={{ padding: '10px' }} className='card-block'>
              <select className='form-control m-input m-input--square' value={postbackPayload[i].sequenceId} onChange={(e) => this.onSequenceChange(e, i)}>
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
        ))
      } else if (postbackPayload[i].action === 'google_sheets') {
        postbackActions.push((
          <div style={{ marginTop: '30px' }} className='card'>
            <h7 className='card-header'>Google Sheets <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={(index) => this.closeGoogleSheets(i)} /></h7>
            <div style={{ padding: '10px' }} className='card-block'>
              <GoogleSheetActions
                saveGoogleSheet={(googleSheetPayload) => this.saveGoogleSheet(googleSheetPayload, i)}
                removeGoogleAction={() => this.removeGoogleAction(i)}
                googleSheetAction={postbackPayload[i].googleSheetAction}
                worksheet={postbackPayload[i].worksheet}
                worksheetName={postbackPayload[i].worksheetName}
                spreadSheet={postbackPayload[i].spreadSheet}
                mapping={postbackPayload[i].mapping}
                lookUpValue={postbackPayload[i].lookUpValue}
                lookUpColumn={postbackPayload[i].lookUpColumn}
                toggleGSModal={this.props.toggleGSModal}
                closeGSModal={this.props.closeGSModal}
                GSModalTarget='ActionModal'
              />
            </div>
          </div>
        ))
      } else if (postbackPayload[i].action === 'hubspot') {
        postbackActions.push((
          <div style={{ marginTop: '30px' }} className='card'>
            <h7 className='card-header'>Hubspot <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={() => this.closeHubspot(i)} /></h7>
            <div style={{ padding: '10px' }} className='card-block'>
              <HubspotActions
                savehubSpotForm={(hubspotPayload) => this.savehubSpotForm(hubspotPayload, i)}
                hubspotAction={postbackPayload[i].hubspotAction}
                removeHubspotAction={() => this.removeHubspotAction(i)}
                hubSpotForm={postbackPayload[i].hubSpotForm}
                portalId={postbackPayload[i].portalId}
                mapping={postbackPayload[i].mapping}
                identityFieldValue={postbackPayload[i].identityFieldValue}
                index={this.props.index}
                toggleGSModal={this.props.toggleGSModal}
                closeGSModal={this.props.closeGSModal}
                GSModalTarget='ActionModal'
              />
            </div>
          </div>
        ))
      } else if (postbackPayload[i].action === 'send_message_block') {
        postbackActions.push((
          <div style={{ marginTop: '30px' }} className='card'>
          <h7 className='card-header'>Reply with a Message <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={() => this.removeReplyWithMessage(i)} />
          </h7>
          <div style={{ margin: '5px', textAlign: 'left' }}>New message will be created when you click on next button</div>
        </div>
        ))
      }
    }
    return postbackActions
  }

  render() {
    return (
      <div id={this.buttonId} className='ui-block' style={{ border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', marginBottom: '30px', padding: '20px' }} >
        <CustomFields onLoadCustomFields={this.onLoadCustomFields} />
        <div onClick={this.props.closeButton} style={{ marginLeft: '100%', marginTop: '-10px', marginBottom: '15px', cursor: 'pointer' }}><span role='img' aria-label='times'>❌</span></div>
        <div>
          <h6>Button Title:</h6>
          <input style={{ borderColor: this.state.title === '' ? 'red' : '' }} type='text' className='form-control' value={this.state.title} onChange={this.changeTitle} placeholder='Enter button title' />
          <div style={{ color: 'red', textAlign: 'left' }}>{this.state.title === '' ? '*Required' : ''}</div>

          <div>
            {
              this.state.openWebsite &&
              <div style={{ marginTop: '30px' }} className='card'>
                <h7 className='card-header'>Open Website <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeWebsite} /></h7>
                <div style={{ padding: '10px' }} className='card-block'>
                  <input id='button-weburl-input' type='text' value={this.state.url} className='form-control' onChange={this.changeUrl} placeholder='Enter link...' />
                </div>
              </div>
            }
            {
              this.state.openWebView &&
              <div style={{ marginTop: '30px' }} className='card'>
                <h7 className='card-header'>Open WebView <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeWebview} /></h7>
                <div style={{ padding: '10px' }} className='card-block'>
                  <div>
                    Need help in understanding webview? click <a href='https://kibopush.com/webview/' target='_blank' rel='noopener noreferrer'>here.</a>
                  </div>
                  <div>
                    <Link to='/settings' state={{ tab: 'whitelistDomains' }} style={{ color: '#5867dd', cursor: 'pointer', fontSize: 'small' }}>Whitelist url domains to open in-app browser</Link>
                  </div>
                  <label className='form-label col-form-label' style={{ textAlign: 'left' }}>Url</label>
                  <input type='text' value={this.state.webviewurl} className='form-control' onChange={this.changeWebviewUrl} placeholder='Enter link...' />
                  <div style={{ marginBottom: '30px', color: 'red' }}>{this.state.errorMsg}</div>
                  <label className='form-label col-form-label' style={{ textAlign: 'left' }}>WebView Size</label>
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
              this.getPostbackActions()
            }
            {
              !this.state.openWebsite && !this.state.openWebView &&
              <div style={{ marginTop: '30px' }}>
                  <button
                    data-tip={'Assign action(s) to this button'}
                    id={`addAction-${this.buttonId}`}
                    onClick={this.showButtonActionPopover}
                    style={{border: '1px dashed #36a3f7', cursor: 'pointer', marginLeft: '22%', marginRight: '22%'}}
                    type="button"
                    className="btn m-btn--pill btn-outline-info btn-sm m-btn m-btn--custom">
                    + Add Action
                  </button>

                  <ActionsPopover
                    showPopover={this.state.showButtonActionPopover}
                    togglePopover={this.toggleButtonActionPopover}
                    targetId={`addAction-${this.buttonId}`}
                    actions={this.createButtonActions()}
                  />
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    sequences: (state.sequenceInfo.sequences),
    customFields: (state.customFieldInfo.customFields),
    integrations: (state.settingsInfo.integrations)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAllSequence: fetchAllSequence,
    loadCustomFields: loadCustomFields,
    editButton: editButton,
    addButton: addButton,
    checkWhitelistedDomains: checkWhitelistedDomains,
    fetchWhiteListedDomains,
    getIntegrations
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Button)
