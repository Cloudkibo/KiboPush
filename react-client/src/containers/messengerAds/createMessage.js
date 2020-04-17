/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  updateCurrentJsonAd
} from '../../redux/actions/messengerAds.actions'
import { bindActionCreators } from 'redux'
import { validateFields } from '../convo/utility'
import AlertContainer from 'react-alert'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import { removeButtonOldurl } from './utility'
import {deleteInitialFiles, getFileIdsOfBroadcast, deleteFile} from '../../utility/utils'

class CreateMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buttonActions: ['open website', 'create message'],
      broadcast: [],
      convoTitle: this.props.title ? this.props.title : '',
      selectedIndex: 1,
      jsonMessageProps: props.messengerAd.jsonAdMessages ? JSON.stringify(props.messengerAd.jsonAdMessages) : '',
      jsonMessages: [],
      showOptInMessage: true,
      initialFiles: this.props.location.state.initialFiles
    }
    this.saveMessage = this.saveMessage.bind(this)
    this.goBack = this.goBack.bind(this)
    this.jsonMessageClick = this.jsonMessageClick.bind(this)
    this.replyWithMessage = this.replyWithMessage.bind(this)
    this.showPayloadMessage = this.showPayloadMessage.bind(this)
    this.setNewJsonMessage = this.setNewJsonMessage.bind(this)
    this.removePayloadMessages = this.removePayloadMessages.bind(this)
    this.handleSaveMessage = this.handleSaveMessage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.createJsonMessages = this.createJsonMessages.bind(this)
  }

  createJsonMessages (buttons, jsonMessages) {
    for (let j = 0; j < buttons.length; j++) {
      if (buttons[j].type === 'postback') {
        let buttonPayload = JSON.parse(buttons[j].payload)
        for (let k = 0; k < buttonPayload.length; k++) {
          if (buttonPayload[k].action === 'send_message_block' && !buttonPayload[k].blockUniqueId) {
            buttonPayload[k].blockUniqueId = this.state.jsonMessages.length + 1
            jsonMessages = this.setNewJsonMessage(buttons[j], jsonMessages)
          } else if (buttonPayload[k].blockUniqueId) {
            let messageIndex = jsonMessages.findIndex(msg => msg.jsonAdMessageId === buttonPayload[k].blockUniqueId)
            if (messageIndex > -1) {
              jsonMessages[messageIndex].title = buttons[j].title
            }
          }
        }
        buttons[j].payload = JSON.stringify(buttonPayload)
      }
    }
    return jsonMessages
  }

  handleChange (broadcast, event) {
    this.setState(broadcast)
    console.log('messengerAd broadcast', broadcast)
    console.log('messengerAd event', event)
    if (event) {
      let jsonMessages = this.state.jsonMessages
      console.log('jsonMessages0', jsonMessages)
      if (event.cards) {
        for (let i = 0; i < event.cards.length; i++) {
          jsonMessages = this.createJsonMessages(event.cards[i].buttons, jsonMessages)
        }
      }
      if (event.buttons) {
        jsonMessages = this.createJsonMessages(event.buttons, jsonMessages)
      }
      if (event.deletePayload) {
        console.log('deleting jsonMessage', event.deletePayload)
        if (typeof event.deletePayload[Symbol.iterator] === 'function') {
          jsonMessages = this.removePayloadMessages([...event.deletePayload], jsonMessages, event)
        } else {
          jsonMessages = this.removePayloadMessages([event.deletePayload], jsonMessages, event)
        }
      }
      console.log('selectedIndex', this.state.selectedIndex)
      console.log('jsonMessages1', jsonMessages)
      for (var k = 0; k < jsonMessages.length; k++) {
        if (jsonMessages[k].jsonAdMessageId === this.state.selectedIndex) {
          console.log(`editing ${k} jsonMesssage`)
          jsonMessages[k].messageContent = broadcast.broadcast
        }
      }
      console.log('jsonMessages2', jsonMessages)
      this.setState({
        jsonMessages: jsonMessages
      }, () => {
        console.log('jsonMessages state updated', this.state.jsonMessages)
      })
    }
  }

  showPayloadMessage (data) {
    for (var i = 0; i < this.state.jsonMessages.length; i++) {
      if (this.state.jsonMessages[i].jsonAdMessageId === data.payload) {
        /* eslint-disable */
          $('.nav-link m-tabs__link').removeClass('active')
          $('#tab-' + this.state.jsonMessages[i].jsonAdMessageId ).addClass('active')
        /* eslint-enable */
        let jsonMessages = this.state.jsonMessages
        jsonMessages[i].title = data.title
        this.setState({
          jsonMessages: jsonMessages,
          convoTitle: data.title,
          broadcast: this.state.jsonMessages[i].messageContent,
          selectedIndex: this.state.jsonMessages[i].jsonAdMessageId
        })
        break
      }
    }
  }
  removePayloadMessages (tempJsonPayloads, jsonMessages, event) {
    //debugger;
    for (var l = jsonMessages.length-1; l >= 0; l--) {
      for (var m = 0; m < tempJsonPayloads.length; m++) {
        if (''+tempJsonPayloads[m].blockUniqueId === ''+jsonMessages[l].jsonAdMessageId) {
          for (let i = 0; i < jsonMessages[l].messageContent.length; i++) {
            let messageContent = jsonMessages[l].messageContent[i]
            if (messageContent.cards) {
              for (let j = 0; j < messageContent.cards.length; j++) {
                for (let k = 0; k < messageContent.cards[j].buttons.length; k++) {
                  if (messageContent.cards[j].buttons[k].payload && messageContent.cards[j].buttons[k].type === 'postback') {
                    tempJsonPayloads = tempJsonPayloads.concat(JSON.parse(messageContent.cards[j].buttons[k].payload))
                  }
                }
              }
            } else if (messageContent.buttons) {
              for (let j = 0; j < messageContent.buttons.length; j++) {
                if (messageContent.buttons[j].payload && messageContent.buttons[j].type === 'postback') {
                  tempJsonPayloads = tempJsonPayloads.concat(JSON.parse(messageContent.buttons[j].payload))
                }
              }
            }
          }
          jsonMessages.splice(l, 1)
        }
      }
    }
    return jsonMessages
  }

  setNewJsonMessage (data, jsonMessages) {
    console.log('setNewJsonMessage', data)
    var newMessage = {}
    newMessage.jsonAdMessageId = this.state.jsonMessages.length + 1
    newMessage.jsonAdMessageParentId = this.state.selectedIndex
    newMessage.title = data.title
    newMessage.messageContent = []
    jsonMessages.push(newMessage)
    return jsonMessages
  }
  replyWithMessage (data) {
    console.log('Reply with message', data)
    /* eslint-disable */
      $('.nav-link.m-tabs__link').removeClass('active')
    /* eslint-enable */
    if (data.payload && data.payload !== '') {
      console.log('showing payload message')
      this.showPayloadMessage(data)
    } else {
      var jsonMessages = this.setNewJsonMessage(data, this.state.jsonMessages)
      this.setState({
        jsonMessages: jsonMessages
      })
    }
  }
  jsonMessageClick (jsonAdMessageId) {
    for (var i = 0; i < this.state.jsonMessages.length; i++) {
      if (this.state.jsonMessages[i].jsonAdMessageId === jsonAdMessageId) {
        this.setState({
          convoTitle: this.state.jsonMessages[i].title,
          broadcast: this.state.jsonMessages[i].messageContent,
          selectedIndex: this.state.jsonMessages[i].jsonAdMessageId
        })
        break
      }
    }
  }

  componentDidMount () {
    let jsonMessages = JSON.parse(this.state.jsonMessageProps)
    let messageContent
    let messageTitle
    for (var i = 0; i < jsonMessages.length; i++) {
      if (!jsonMessages[i].jsonAdMessageParentId) {
        messageContent = jsonMessages[i].messageContent
        messageTitle = jsonMessages[i].title
        this.setState({
          selectedIndex: jsonMessages[i].jsonAdMessageId
        })
        break
      }
    }
    this.setState({
      convoTitle: messageTitle,
      jsonMessages: jsonMessages,
      broadcast: messageContent
    })
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Create Message`
  }
  goBack () {
    this.editing = true
    if (this.props.location.state.jsonAdId && this.props.location.state.jsonAdId.length !== 0) {
      this.props.history.push({
        pathname: `/editAdMessage`,
        state: {module: 'edit', jsonAdId: this.props.location.state.jsonAdId, initialFiles: this.props.location.state.realInitialFiles}
      })
    } else {
      console.log('on createAdmessage')
      this.props.history.push({
        pathname: `/createAdMessage`,
        state: {module: 'create', setupState: this.props.location.state.setupState}
      })
    }
  }
  saveMessage () {
    let jsonMessages = this.state.jsonMessages
    console.log('Save Call', this.state.jsonMessages)
    for (var i = 0; i < this.state.jsonMessages.length; i++) {
      jsonMessages[i].messageContent = removeButtonOldurl(this.state.jsonMessages[i].messageContent)
      if (this.state.jsonMessages[i].messageContent.length < 1) {
        return this.msg.error(`Postback message '${this.state.jsonMessages[i].title}' is empty`)
      }
      if (!validateFields(this.state.jsonMessages[i].messageContent, this.msg)) {
        /* eslint-disable */
          $('.nav-link.m-tabs__link').removeClass('active')
          $('#tab-' + this.state.jsonMessages[i].jsonAdMessageId ).addClass('active')
        /* eslint-enable */
        this.setState({
          convoTitle: this.state.jsonMessages[i].title,
          broadcast: this.state.jsonMessages[i].messageContent,
          selectedIndex: this.state.jsonMessages[i].jsonAdMessageId
        })
        return
      }
    }
    for (var j = 0; j < this.state.jsonMessages.length; j++) {
      if (!this.state.jsonMessages[j].jsonAdMessageParentId) {
        if (this.state.jsonMessages[j].messageContent.length > 5) {
          return this.msg.error(`Opt-In Message cannot have more than 5 elements`)
        }
      }
    }
    let newFiles = this.props.location.state.newFiles
    if (newFiles) {
      newFiles = newFiles.concat(this.state.newFiles)
    } else {
      newFiles = this.state.newFiles
    }
    let currentFiles = []
    for (let i = 0; i < this.state.jsonMessages.length; i++) {
      currentFiles = currentFiles.concat(getFileIdsOfBroadcast(this.state.jsonMessages[i].messageContent))
    }
    newFiles = deleteInitialFiles(newFiles, currentFiles)
    this.props.messengerAd.newFiles = newFiles
    this.props.updateCurrentJsonAd(this.props.messengerAd, 'jsonAdMessages', jsonMessages)
    let initialFiles = this.state.initialFiles.concat(newFiles)
    this.setState({jsonMessages: jsonMessages, newFiles: [], initialFiles})
    this.msg.success('Message saved successfully')
  }

  handleSaveMessage (resp) {
    console.log(resp)
    this.setState({
      jsonMessages: resp.jsonAdMessages
    })
  }

  componentWillUnmount () {
    if (!this.editing) {
      if (this.props.messengerAd.newFiles) {
        for (let i = 0; i < this.props.messengerAd.newFiles.length; i++) {
          deleteFile(this.props.messengerAd.newFiles[i])
        }
      }
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div
          className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible'
          role='alert'
          style={{margin: '30px 30px 0px 30px'}}
        >
          <div className='m-alert__icon'>
            <i className='flaticon-exclamation m--font-brand' />
          </div>
          <div className='m-alert__text'>
            Note: A person will get into your subscriber's list only if he presses a button with action :'Reply with a message'. So, keep in mind that the first message should contain a button.
          </div>
        </div>
        <div className='m-subheader'>
          <div className='row'>
            <div className='col-12'>
              <div className='pull-right'>
                <button className='btn btn-primary' style={{marginRight: '20px'}} onClick={this.goBack}>
                Back
              </button>
                <button className='btn btn-primary' disabled={!this.state.broadcast || this.state.broadcast.length === 0} onClick={this.saveMessage}>
                Save
              </button>
              </div>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-12'>
                      <div className='ui-block' style={{marginBottom: '-22px', border: '1px solid rgb(204, 204, 204)', paddingLeft: '10px'}}>
                        <ul className='nav nav-tabs m-tabs-line m-tabs-line--right' role='tablist' style={{float: 'none'}}>
                          { this.state.jsonMessages.map((jsonMessage, index) => (
                            <li className='nav-item m-tabs__item' style={{width: '20%', display: 'flex'}}>
                              <a href='#/' id={'tab-' + jsonMessage.jsonAdMessageId} className='nav-link m-tabs__link' data-toggle='tab' role='tab' onClick={() => this.jsonMessageClick(jsonMessage.jsonAdMessageId)} style={{cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100px'}}>
                                {jsonMessage.title}
                              </a>
                              { (index < this.state.jsonMessages.length - 1) &&
                                <i className='la la-arrow-right' style={{verticalAlign: 'middle', lineHeight: '43px'}} />
                              }
                            </li>))
                          }
                        </ul>
                        <GenericMessage
                          newFiles={this.state.newFiles}
                          initialFiles={this.state.initialFiles}
                          hiddenComponents={['video']}
                          module="jsonads"
                          hideUserOptions
                          broadcast={this.state.broadcast}
                          handleChange={this.handleChange}
                          convoTitle={this.state.convoTitle}
                          buttonActions={this.state.buttonActions}
                          replyWithMessage={this.replyWithMessage} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages),
    messengerAd: (state.messengerAdsInfo.messengerAd)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      updateCurrentJsonAd: updateCurrentJsonAd
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessage)
