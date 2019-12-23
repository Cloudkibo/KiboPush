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

class Button extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      openPopover: false,
      title: this.props.button ? this.props.button.title : this.props.title,
      url: this.props.button ? (!this.props.button.messenger_extensions ? this.props.button.url : '') : '',
      sequenceValue: this.props.button ? this.props.button.sequenceValue : '',
      openWebsite: this.props.button ? this.props.button.type === 'web_url' && !this.props.button.messenger_extensions : false,
      openSubscribe: this.props.button ? this.props.button.openSubscribe : '',
      openUnsubscribe: this.props.button ? this.props.button.openUnsubscribe : false,
      openCustomField: this.props.button ? this.props.button.openCustomField : false,
      openGoogleSheets: this.props.button ? this.props.button.openGoogleSheets : false,
      openHubspot: this.props.button && this.props.button.payload && this.props.button.payload.action === 'hubspot' ? true : false,
      sendSequenceMessageButton: this.props.button ? this.props.button.type === 'postback' && !this.props.button.payload : false,
      openWebView: this.props.button ? this.props.button.messenger_extensions : false,
      webviewurl: this.props.button ? (this.props.button.messenger_extensions ? this.props.button.url : '') : '',
      webviewsize: this.props.button ? (this.props.button.webview_height_ratio ? this.props.button.webview_height_ratio : 'FULL') : 'FULL',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      openCreateMessage: this.props.button ? (this.props.button.type === 'postback' && this.props.button.payload && this.props.button.payload.action !== 'hubspot') : false,
      showSequenceMessage: true,
      buttonDisabled: this.props.button ? false : true,
      errorMsg: '',
      customFieldId: this.props.button && this.props.button.payload ? this.props.button.payload.customFieldId : '',
      customFieldValue: this.props.button && this.props.button.payload ? this.props.button.payload.customFieldValue : '',

      googleSheetAction: this.props.button && this.props.button.payload ? this.props.button.payload.googleSheetAction : '',
      spreadSheet: this.props.button && this.props.button.payload ? this.props.button.payload.spreadSheet : '',
      worksheet: this.props.button && this.props.button.payload ? this.props.button.payload.worksheet : '',
      worksheetName: this.props.button && this.props.button.payload ? this.props.button.payload.worksheetName : '',
      lookUpValue: this.props.button && this.props.button.payload ? this.props.button.payload.lookUpValue : '',
      lookUpColumn: this.props.button && this.props.button.payload ? this.props.button.payload.lookUpColumn : '',
      hubspotIntegration: '',
      hubspotAction: this.props.button && this.props.button.payload ? this.props.button.payload.hubspotAction : '',
      mapping: this.props.button && this.props.button.payload ? this.props.button.payload.mapping : '',
      hubSpotForm: this.props.button && this.props.button.payload ? this.props.button.payload.formId : '',
      portalId: this.props.button && this.props.button.payload ? this.props.button.payload.portalId : '',
      identityFieldValue: this.props.button && this.props.button.payload ? this.props.button.payload.identityCustomFieldValue : ''
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
  }

  handleFetch(resp) {
    console.log('done fetching whitelisted domains', resp)
    if (resp.status === 'success') {
      console.log('fetched whitelisted domains', resp.payload)
      this.setState({ whitelistedDomains: resp.payload })
    }
  }

  savehubSpotForm(hubSpotFormPayload) {
    console.log('hubSpotFormPayload', hubSpotFormPayload)
    this.setState({
      hubspotAction: hubSpotFormPayload.hubspotAction,
      hubSpotForm: hubSpotFormPayload.hubSpotForm,
      portalId: hubSpotFormPayload.portalId,
      mapping: hubSpotFormPayload.mapping,
      identityFieldValue: hubSpotFormPayload.identityFieldValue
    })
    let buttonData = {
      title: this.state.title, visible: true,
      hubspotAction: hubSpotFormPayload.hubspotAction,
      formId: hubSpotFormPayload.hubSpotForm,
      mapping: hubSpotFormPayload.mapping,
      portalId: hubSpotFormPayload.portalId,
      identityCustomFieldValue: hubSpotFormPayload.identityFieldValue,
      index: this.props.index
    }
    console.log('this.props.updateButtonStatus' ,this.props.updateButtonStatus)
    if ((hubSpotFormPayload.hubspotAction !== '' && hubSpotFormPayload.hubSpotForm !== '' && hubSpotFormPayload.mapping !== '' && this.state.title !== '') || (hubSpotFormPayload.hubspotAction !== '' && hubSpotFormPayload.identityFieldValue !== '' && hubSpotFormPayload.mapping !== '' && this.state.title !== '')) {
      this.setState({ buttonDisabled: false })
      console.log('this.props.updateButtonStatus in if condition' ,this.props.updateButtonStatus)
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false }, buttonData)
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
          openGoogleSheets: true, openCreateMessage: false
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
      this.props.updateButtonStatus({ buttonDisabled: true, buttonData })
    }
  }

  showCustomField() {
    this.setState({ openCustomField: true })
  }

  showGoogleSheets() {
    this.setState({ openGoogleSheets: true })
  }

  showHubspot() {
    this.setState({ openHubspot: true })
  }

  showWebsite() {
    this.setState({ openWebsite: true })
  }
  showWebView() {
    this.setState({ openWebView: true })
  }
  showSubscribe() {
    this.setState({ openSubscribe: true })
  }

  showUnsubscribe() {
    this.setState({ openUnsubscribe: true })
  }
  closeWebview() {
    this.setState({ openWebView: false, webviewurl: '', webviewsize: 'FULL', buttonDisabled: true })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }
  closeWebsite() {
    this.setState({ openWebsite: false, url: '', buttonDisabled: true })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }

  closeSendSequenceMessageButton() {
    this.setState({ sendSequenceMessageButton: false, buttonDisabled: true, title: '' })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }
  closeSubscribe() {
    this.setState({ openSubscribe: false, sequenceValue: '', buttonDisabled: true })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }

  closeCustomField() {
    this.setState({ openCustomField: false, customFieldId: '', buttonDisabled: true, customFieldValue: '' })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }

  closeUnsubscribe() {
    this.setState({ openUnsubscribe: false, sequenceValue: '', buttonDisabled: true })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }

  closeGoogleSheets() {
    this.setState({
      googleSheetAction: '',
      spreadSheet: '',
      worksheet: '',
      worksheetName: '',
      mapping: '',
      buttonDisabled: true,
      lookUpValue: '',
      lookUpColumn: '',
      openGoogleSheets: false
    })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }

  closeHubspot() {
    this.setState({ openHubspot: false, buttonDisabled: true })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }


  onSequenceChange(e) {
    if (this.state.title !== '') {
      this.setState({ buttonDisabled: false })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false })
      }
    }
    this.setState({ sequenceValue: e.target.value })
  }

  handleClick(e) {
    this.setState({ buttonDisabled: true })
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
    } else if (this.state.sendSequenceMessageButton) {
      let data = {
        id: this.props.index,
        type: 'postback',
        title: this.state.title,
        messageId: 'messageId'
      }
      this.props.editButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.handleClose, this.msg)
    } else if (this.state.openCreateMessage) {
      let data = {
        id: new Date().getTime() + (Math.floor(Math.random() * 100)),
        type: 'postback',
        title: this.state.title,
        payload: this.props.button.payload ? this.props.button.payload : null
      }
      this.props.onAdd(data, this.props.index)
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

    } else if (this.state.openHubspot) {
      let data = {
        id: this.props.index,
        type: 'postback',
        title: this.state.title,
        payload: JSON.stringify({
          action: 'hubspot',
          hubspotAction: this.state.hubspotAction,
          formId: this.state.hubSpotForm,
          portalId: this.state.portalId,
          mapping: this.state.mapping,
          identityCustomFieldValue: this.state.identityFieldValue

        })
      }
      this.props.editButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.handleClose, this.msg)
    } else if (this.state.openGoogleSheets) {
      let data = {
        id: this.props.index,
        type: 'postback',
        title: this.state.title,
        payload: JSON.stringify({
          action: 'google_sheets',
          googleSheetAction: this.state.googleSheetAction,
          spreadSheet: this.state.spreadSheet,
          worksheet: this.state.worksheet,
          worksheetName: this.state.worksheetName,
          mapping: this.state.mapping,
          lookUpValue: this.state.lookUpValue,
          lookUpColumn: this.state.lookUpColumn
        })
      }
      this.props.editButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.handleClose, this.msg)
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
    } else if (this.state.sequenceValue) {
      if (this.state.openSubscribe && !this.state.openUnsubscribe) {
        let data = {
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'subscribe',
          module: { type: 'sequenceMessaging' }
        }
        this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
      } else if (!this.state.openSubscribe && this.state.openUnsubscribe) {
        let data = {
          type: 'postback',
          title: this.state.title, // User defined label
          sequenceId: this.state.sequenceValue,
          action: 'unsubscribe',
          module: { type: 'sequenceMessaging' }
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
    } else if (this.state.openCreateMessage) {
      let data = {
        id: new Date().getTime() + (Math.floor(Math.random() * 100)),
        type: 'postback',
        title: this.state.title,
        payload: null
      }
      console.log('creating new message block button', data)
      this.props.onAdd(data, this.props.index)
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
    } else if (this.state.openCustomField) {
      let data = {
        type: 'postback',
        title: this.state.title,
        payload: JSON.stringify({
          action: 'set_custom_field',
          customFieldId: this.state.customFieldId,
          customFieldValue: this.state.customFieldValue
        })
      }
      this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
    } else if (this.state.openHubspot) {
      let data = {
        id: this.props.index,
        type: 'postback',
        title: this.state.title,
        payload: JSON.stringify({
          action: 'hubspot',
          hubspotAction: this.state.hubspotAction,
          formId: this.state.hubSpotForm,
          portalId: this.state.portalId,
          mapping: this.state.mapping,
          identityCustomFieldValue: this.state.identityFieldValue
        })
      }
      this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)

    } else if (this.state.openGoogleSheets) {
      let data = {
        type: 'postback',
        title: this.state.title,
        payload: JSON.stringify({
          action: 'google_sheets',
          googleSheetAction: this.state.googleSheetAction,
          spreadSheet: this.state.spreadSheet,
        	worksheet: this.state.worksheet,
          worksheetName: this.state.worksheetName,
        	mapping: this.state.mapping,
          lookUpValue: this.state.lookUpValue,
          lookUpColumn: this.state.lookUpColumn
        })
      }
      this.props.addButton(data, (btn) => this.props.onAdd(btn, this.props.index), this.msg, this.resetButton)
    }
  }

  replyWithMessage() {
    this.setState({
      openCreateMessage: true
    }, () => {
      if (this.props.updateButtonStatus && this.state.title) {
        this.props.updateButtonStatus({ buttonDisabled: false })
      }
    })
  }

  removeReplyWithMessage() {
    this.setState({
      openCreateMessage: false
    }, () => {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: true })
      }
    })
  }

  changeTitle(event) {
    if (((this.state.sequenceValue !== '' || isWebURL(this.state.url) || isWebURL(this.state.webviewurl)) || (this.state.customFieldId && this.state.customFieldValue)) && event.target.value !== '') {
      this.setState({ buttonDisabled: false })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false })
      }
    } else if (this.state.sendSequenceMessageButton && event.target.value !== '') {
      this.setState({ buttonDisabled: false })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false })
      }
    } else if (this.state.openCreateMessage && event.target.value !== '') {
      this.setState({ buttonDisabled: false })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false })
      }
    } else if (this.state.openCustomField && event.target.value !== '') {
      this.setState({ buttonDisabled: false })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false })
      }
    }

    else if (this.state.openHubspot && this.state.hubspotAction !== '' && event.target.value !== '') {
      this.setState({ buttonDisabled: false })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false })
      }
    }
    else if (this.state.openGoogleSheets && this.state.googleSheetAction !== '' &&  event.target.value !== '') {
      this.setState({ buttonDisabled: false })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false })
      }
    }
    else {
      this.setState({ buttonDisabled: true })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: true })
      }
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
    console.log('chaning website url', event.target.value)
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

  updateCustomFieldId(event) {
    this.setState({ customFieldId: event.target.value })
    let buttonData = { title: this.state.title, visible: true, customFieldId: event.target.value, customFieldValue: this.state.customFieldValue, index: this.props.index }
    if (this.state.customFieldValue) {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false, buttonData })
      }
    }
  }

  saveGoogleSheet(googleSheetPayload) {
    console.log('saveGoogleSheet', googleSheetPayload)
    this.setState({
      googleSheetAction: googleSheetPayload.googleSheetAction,
      spreadSheet: googleSheetPayload.spreadSheet,
      worksheet: googleSheetPayload.worksheet,
      worksheetName: googleSheetPayload.worksheetName,
      mapping: googleSheetPayload.mapping,
      lookUpValue: googleSheetPayload.lookUpValue,
      lookUpColumn: googleSheetPayload.lookUpColumn
    })
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
    if (googleSheetPayload.googleSheetAction !== '' &&
      googleSheetPayload.spreadSheet !== '' &&
      googleSheetPayload.worksheet !== '' &&
      googleSheetPayload.mapping !== '' &&
      this.state.title !== ''
    ) {
      this.setState({ buttonDisabled: false })
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false }, buttonData)
      }
    }
  }

  updateHubspotAction(hubspotAction) {
    this.setState({ hubspotAction: hubspotAction })
    let buttonData = { title: this.state.title, visible: true, hubspotAction: hubspotAction, index: this.props.index }
    if (this.state.hubspotAction) {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false, buttonData })
      }
    }
  }
  removeGoogleAction() {
    this.setState({
      googleSheetAction: '',
      spreadSheet: '',
      worksheet: '',
      worksheetName: '',
      mapping: '',
      buttonDisabled: true,
      lookUpValue: '',
      lookUpColumn: ''
    })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }

  removeHubspotAction() {
    this.setState({ hubspotAction: '', mapping: '', buttonDisabled: true })
    if (this.props.updateButtonStatus) {
      this.props.updateButtonStatus({ buttonDisabled: true })
    }
  }

  updateCustomFieldValue(event) {
    this.setState({ customFieldValue: event.target.value })
    let buttonData = { title: this.state.title, visible: true, customFieldValue: this.state.customFieldValue, customFieldId: event.target.value, index: this.props.index }
    if (this.state.customFieldId && event.target.value !== '' && this.state.title !=='') {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: false, buttonData })
      }
    }
    else {
      if (this.props.updateButtonStatus) {
        this.props.updateButtonStatus({ buttonDisabled: true, buttonData })
      }
    }
  }

  render() {
    return (
      <div id={this.buttonId} className='ui-block' style={{ border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '300px', marginBottom: '30px', padding: '20px' }} >
        <CustomFields onLoadCustomFields={this.onLoadCustomFields} />
        <div onClick={this.props.closeButton} style={{ marginLeft: '100%', marginTop: '-10px', marginBottom: '15px', cursor: 'pointer' }}><span role='img' aria-label='times'>❌</span></div>
        <div>
          <h6>Button Title:</h6>
          <input style={{ borderColor: this.state.title === '' ? 'red' : '' }} type='text' className='form-control' value={this.state.title} onChange={this.changeTitle} placeholder='Enter button title' />
          <div style={{ color: 'red', textAlign: 'left' }}>{this.state.title === '' ? '*Required' : ''}</div>

          <div style={{ marginTop: '30px' }}>
            {
              !this.state.openCustomField && !this.state.openWebsite && !this.state.openSubscribe && !this.state.openUnsubscribe && !this.state.sendSequenceMessageButton && !this.state.openWebView && !this.state.openCreateMessage && !this.state.openGoogleSheets && !this.state.openHubspot &&
              <div>
                <h6 style={{ color: 'red' }}>Select one of the below actions:</h6>
                {
                  (this.props.buttonActions.indexOf('open website') > -1) &&
                  <div style={{ border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginBottom: '10px' }} onClick={this.showWebsite}>
                    <h7 style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><i className='fa fa-external-link' /> Open a website</h7>
                  </div>
                }
                {(this.props.buttonActions.indexOf('open webview') > -1) &&
                  <div style={{ border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginBottom: '10px' }} onClick={this.showWebView}>
                    <h7 style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><i className='fa fa-external-link' /> Open a webview</h7>
                  </div>
                }
                {(this.props.buttonActions.indexOf('create message') > -1) && !(this.props.isGalleryCard === 'true') &&
                  <div style={{ border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginBottom: '10px' }} onClick={this.replyWithMessage}>
                    <h7 style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><i className='fa fa-external-link' /> Reply with a message</h7>
                  </div>
                }
                {
                  (this.props.buttonActions.indexOf('send sequence message') > -1) &&
                  <div style={{ border: '1px dashed #ccc', padding: '10px', cursor: 'pointer' }} onClick={this.sendSequenceMessageButton}>
                    <h7 style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><i className='fa fa-share' /> Send Sequence Message</h7>
                  </div>
                }
                {(this.props.buttonActions.indexOf('subscribe sequence') > -1) && this.state.showSequenceMessage &&
                  this.props.sequences && this.props.sequences.length > 0 &&
                  <div style={{ border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer' }} onClick={this.showSubscribe}>
                    <h7 style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><i className='la la-check-circle' />  Subscribe to Sequence</h7>
                  </div>
                }
                {(this.props.buttonActions.indexOf('unsubscribe sequence') > -1) && this.state.showSequenceMessage &&
                  this.props.sequences && this.props.sequences.length > 0 &&
                  <div style={{ border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer' }} onClick={this.showUnsubscribe}>
                    <h7 style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><i className='la la-times-circle' />  Unsubscribe to Sequence</h7>
                  </div>
                }
                {(this.props.buttonActions.indexOf('set custom field') > -1) &&
                  this.props.customFields && this.props.customFields.length > 0 &&
                  <div style={{ border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer' }} onClick={this.showCustomField}>
                    <h7 style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><i className='fa fa-pencil-square-o' /> Set Custom Field</h7>
                  </div>
                }
                {(this.props.buttonActions.indexOf('google sheets') > -1) &&
                  this.state.googleIntegration !== '' &&
                  <div style={{ border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer' }} onClick={this.showGoogleSheets}>
                    <h7 style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><i className='fa fa-file-excel-o' /> Google Sheets</h7>
                  </div>
                }
                {(this.props.buttonActions.indexOf('hubspot') > -1) &&
                  //  this.state.hubspotIntegration !== '' &&
                  <div style={{ border: '1px dashed #ccc', padding: '10px', marginTop: '5px', cursor: 'pointer' }} onClick={this.showHubspot}>
                    <h7 style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><i className='fa fa-transgender-alt' /> Hubspot</h7>
                  </div>
                }
              </div>
            }
            {
              this.state.openWebsite &&
              <div className='card'>
                <h7 className='card-header'>Open Website <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeWebsite} /></h7>
                <div style={{ padding: '10px' }} className='card-block'>
                  <input id='button-weburl-input' type='text' value={this.state.url} className='form-control' onChange={this.changeUrl} placeholder='Enter link...' />
                </div>
              </div>
            }
            {
              this.state.openCustomField &&
              <div className='card'>
                <h7 className='card-header'>Set custom field <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeCustomField} /></h7>
                <div style={{ padding: '10px' }} className='card-block'>
                  <select value={this.state.customFieldId ? this.state.customFieldId : ''} style={{ borderColor: !this.state.customFieldId ? 'red' : '' }} className='form-control m-input' onChange={(event) => this.updateCustomFieldId(event)}>
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
                    this.state.customFieldId &&
                    <div style={{ marginTop: '25px' }}>
                      <input style={{ borderColor: !this.state.customFieldValue ? 'red' : '' }} value={this.state.customFieldValue} onChange={(event) => this.updateCustomFieldValue(event)} placeholder='Enter value here...' className='form-control' />
                      <div style={{ color: 'red', textAlign: 'left' }}>{!this.state.customFieldValue ? '*Required' : ''}</div>
                    </div>
                  }
                  <div style={{ color: 'red', textAlign: 'left' }}>{!this.state.customFieldId ? '*Required' : ''}</div>
                  {/* <button id='customfieldid' data-toggle='modal' data-target='#cf_modal' style={{marginTop: '30px', marginLeft: '10px'}} className='btn btn-primary btn-sm'>
                          Manage Custom Fields
                      </button> */}
                </div>
              </div>
            }
            {
              this.state.openCreateMessage &&
              <div className='card'>
                <h7 className='card-header'>Reply with a Message <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.removeReplyWithMessage} />
                </h7>
                <div style={{ margin: '5px', textAlign: 'left' }}>New message will be created when you click on next button</div>
                {/* <div style={{padding: '10px'}} className='card-block'>
                      <button className='btn btn-success m-btn m-btn--icon replyWithMessage' disabled={this.state.title === '' || this.props.disabled} onClick={this.replyWithMessage}>
                       Create Message
                       </button>
                    </div> */}
              </div>
            }
            {
              this.state.openWebView &&
              <div className='card'>
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
              this.state.sendSequenceMessageButton &&
              <div className='card'>
                <h7 className='card-header'>Send Sequence Message <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeSendSequenceMessageButton} /></h7>
              </div>
            }
            {
              this.state.openSubscribe &&
              <div className='card'>
                <h7 className='card-header'>Subscribe to Sequence <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeSubscribe} /></h7>
                <div style={{ padding: '10px' }} className='card-block'>
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
                <h7 className='card-header'>Unsubscribe from Sequence <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeUnsubscribe} /></h7>
                <div style={{ padding: '10px' }} className='card-block'>
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
              this.state.openGoogleSheets &&
              <div className='card'>
                <h7 className='card-header'>Google Sheets <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeGoogleSheets} /></h7>
                <div style={{ padding: '10px' }} className='card-block'>
                  <GoogleSheetActions
                    saveGoogleSheet={this.saveGoogleSheet}
                    removeGoogleAction={this.removeGoogleAction}
                    googleSheetAction={this.state.googleSheetAction}
                    worksheet={this.state.worksheet}
                    worksheetName={this.state.worksheetName}
                    spreadSheet={this.state.spreadSheet}
                    mapping={this.state.mapping}
                    lookUpValue={this.state.lookUpValue}
                    lookUpColumn={this.state.lookUpColumn}
                    toggleGSModal={this.props.toggleGSModal}
                    closeGSModal={this.props.closeGSModal}
                    GSModalTarget='ActionModal'
                  />
                </div>
              </div>
            }
            {
              this.state.openHubspot &&
              <div className='card'>
                <h7 className='card-header'>Hubspot <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeHubspot} /></h7>
                <div style={{ padding: '10px' }} className='card-block'>
                  <HubspotActions
                    savehubSpotForm={this.savehubSpotForm}
                    hubspotAction={this.state.hubspotAction}
                    removeHubspotAction={this.removeHubspotAction}
                    hubSpotForm={this.state.hubSpotForm}
                    portalId={this.state.portalId}
                    mapping={this.state.mapping}
                    identityFieldValue={this.state.identityFieldValue}
                    index={this.props.index}
                    toggleGSModal={this.props.toggleGSModal}
                    closeGSModal={this.props.closeGSModal}
                    GSModalTarget='ActionModal'
                  />
                </div>
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
