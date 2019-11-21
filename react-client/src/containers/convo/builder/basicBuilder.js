/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import Targeting from '../Targeting'
import GenericMessage from '../../../components/SimplifiedBroadcastUI/GenericMessage'

class BasicBuilder extends React.Component {
  constructor (props, context) {
    super(props, context)
    let currentId = new Date().getTime()
    this.state = {
      linkedMessages: this.props.linkedMessages ? this.props.linkedMessages : [{title: this.props.convoTitle, id: currentId, messageContent: []}],
      unlinkedMessages: this.props.unLinkedMessages ? this.props.unLinkedMessages : [],
      currentId
    }
    this.handleChange = this.handleChange.bind(this)
    this.addLinkedMessage = this.addLinkedMessage.bind(this)
    this.editLinkedMessage = this.editLinkedMessage.bind(this)
    this.updateLinkedMessagesPayload = this.updateLinkedMessagesPayload.bind(this)
    this.changeMessage = this.changeMessage.bind(this)
    this.createLinkedMessagesFromButtons = this.createLinkedMessagesFromButtons.bind(this)
  }

  componentDidMount () {
    console.log('componentDidMount for BasicBuilder', this.state)
    this.props.handleChange({linkedMessages: this.state.linkedMessages, unLinkedMessages: this.state.unlinkedMessages})
  }

  handleChange (broadcast, event) {
    console.log('handleChange broadcast in basicBuilder', broadcast)
    console.log('handleChange event in basciBuilder', event)
    if (broadcast.convoTitle) {
      this.updateLinkedMessagesTitle(broadcast.convoTitle)
      this.props.handleChange({convoTitle: broadcast.convoTitle, linkedMessages: this.state.linkedMessages})
    } else {
      broadcast = broadcast.broadcast
      if (event && event.deletePayload) {
        console.log('deletePayload', event)
        this.removeLinkedMessages(event.deletePayload)
      }
      this.updateLinkedMessagesPayload (broadcast)
      for (let i = 0; i < broadcast.length; i++) {
        let broadcastComponent = broadcast[i]
        console.log('broadcastComponent', broadcastComponent)
        if (broadcastComponent.buttons) {
          this.createLinkedMessagesFromButtons(broadcastComponent.buttons)
        }
        if (broadcastComponent.cards) {
          for (let j = 0; j < broadcastComponent.cards.length; j++) {
            let card = broadcastComponent.cards[j]
            this.createLinkedMessagesFromButtons(card.buttons)
          }
        }
      }
      this.props.handleChange({broadcast: broadcast, linkedMessages: this.state.linkedMessages, unLinkedMessages: this.state.unlinkedMessages})
    }
  }

  removeLinkedMessages (deletePayload) {
    let linkedMessages = this.state.linkedMessages
    let unlinkedMessages = this.state.unlinkedMessages
    deletePayload = deletePayload.map(payload => {
      return JSON.parse(payload).blockUniqueId
    })
    for (let i = 0; i < deletePayload.length; i++) {
      for (let j = linkedMessages.length-1; j >= 0; j--) {
        if (linkedMessages[j].id === deletePayload[i]) {
          console.log(`deleting linkedMessage ${j}`, linkedMessages)

          for (let m = 0; m < linkedMessages[j].messageContent.length; m++) {
            let component = linkedMessages[j].messageContent[m]
            if (component.buttons) {
              let buttons = component.buttons
              this.addDeletePayloads(deletePayload, buttons)
            }
            if (component.cards) {
              let cards = component.cards
              for (let k = 0; k < cards.length; k++) {
                if (cards[k].buttons) {
                  this.addDeletePayloads(deletePayload, cards[k].buttons)
                }
              }
            }
          }
          unlinkedMessages = unlinkedMessages.concat(linkedMessages.splice(j, 1))
        }
      }
    }
    this.setState({linkedMessages, unlinkedMessages})
  }

  addDeletePayloads (deletePayload, buttons) {
    for (let k = 0; k < buttons.length; k++) {
      let buttonPayload = JSON.parse(buttons[k].payload)
      if (buttons[k].type === 'postback' && buttonPayload.blockUniqueId) {
        deletePayload.push(buttonPayload.blockUniqueId)
      }
    }
  }

  createLinkedMessagesFromButtons(buttons) {
    for (let j = 0; j < buttons.length; j++) {
      let button = buttons[j]
      if (button.type === 'postback' && button.payload === null) {
        console.log('found create new message button')
        this.addLinkedMessage(button)
      } else {
        this.editLinkedMessage(button)
      }
    }
  }

  editLinkedMessage (button) {
    let linkedMessages = this.state.linkedMessages
    let buttonPayload = JSON.parse(button.payload)
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      if (linkedMessages[i].id === buttonPayload.blockUniqueId) {
        // linkedMessages[i].title = button.title
        linkedMessages[i].linkedButton = button
      }
    }
    this.setState({linkedMessages})
  }

  changeMessage (id) {
    let messages = this.state.linkedMessages.concat(this.state.unlinkedMessages)
    let messageIndex = messages.findIndex(m => m.id === id)
    if (messageIndex > -1) {
      console.log('changing message', this.state.linkedMessages[messageIndex])
      this.setState({currentId: id}, () => {
        this.props.handleChange({broadcast: messages[messageIndex].messageContent, convoTitle: messages[messageIndex].title})
      })
    }
  }

  updateLinkedMessagesTitle (title) {
    let linkedMessages = this.state.linkedMessages
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      if (linkedMessages[i].id === this.state.currentId) {
        linkedMessages[i].title = title
        // linkedMessages[i].linkedButton.title = title
      }
    }
    this.setState({linkedMessages})
  }

  updateLinkedMessagesPayload (broadcast) {
    let linkedMessages = this.state.linkedMessages
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      if (linkedMessages[i].id === this.state.currentId) {
        linkedMessages[i].messageContent = broadcast
      }
    }
    this.setState({linkedMessages})
  }

  addLinkedMessage (button) {
    let id = new Date().getTime()
    let data = {
      id,
      title: button.title,
      messageContent: [],
      linkedButton: button
    }
    button.payload = JSON.stringify({
      blockUniqueId: id,
      action: 'send_message_block'
    })
    let linkedMessages = this.state.linkedMessages
    linkedMessages.push(data)
    this.setState({linkedMessages})
  }


  render () {
    return (
      <div className='m-content'>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <div className='m-portlet m-portlet--mobile'>
              <div className='m-portlet__body'>
                <div className='row'>
                  <div className='col-12'>
                    {
                      this.props.showTabs &&
                      <ul className='nav nav-tabs'>
                      {
                        this.state.linkedMessages.map((message, index) =>
                        <li key={message.id}>
                          <a href='#/' className={'broadcastTabs' + (this.state.currentId === message.id ? ' active' : '')} onClick={() => this.changeMessage(message.id)} id={'tab-' + message.id} data-toggle='tab' role='tab' style={{cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px'}}>
                            {message.title}
                          </a>
                        </li>
                        )
                      }
                      {
                        this.state.unlinkedMessages.map((message, index) =>
                        <li key={message.id}>
                          <a href='#/' className={'broadcastTabs' + (this.state.currentId === message.id ? ' active' : '')} onClick={() => this.changeMessage(message.id)} id={'tab-' + message.id} data-toggle='tab' role='tab' style={{cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px', color: 'red'}}>
                            {message.title}
                          </a>
                        </li>
                        )
                      }
                      </ul>
                    }
                    <div className='tab-content'>
                      <div className='tab-pane fade active in' id='tab_1'>
                        <GenericMessage
                          titleEditable
                          convoTitle={this.props.convoTitle}
                          showDialog={this.props.showDialog}
                          hiddenComponents={this.props.hiddenComponents}
                          showAddComponentModal={this.props.showAddComponentModal}
                          list={this.props.list}
                          module={this.props.module}
                          noDefaultHeight={this.props.noDefaultHeight}
                          getItems={this.props.getItems}
                          handleChange={this.handleChange}
                          setReset={this.props.reset}
                          pageId={this.props.pageId.pageId}
                          pages={this.props.location.state && this.props.locationPages}
                          buttonActions={this.props.buttonActions} />
                      </div>
                      <div className='tab-pane' id='tab_2'>
                        <Targeting
                          handleTargetValue={this.props.handleTargetValue}
                          subscriberCount={this.props.subscriberCount}
                          resetTarget={this.props.resetTarget}
                          page={this.props.pageId}
                          component='broadcast'
                        />
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

BasicBuilder.propTypes = {
  'onBroadcastClick': PropTypes.func.isRequired,
  'onTargetClick': PropTypes.func.isRequired,
  'handleChange': PropTypes.func.isRequired,
  'reset': PropTypes.func.isRequired,
  'convoTitle': PropTypes.string.isRequired,
  'pageId': PropTypes.object.isRequired,
  'location': PropTypes.object.isRequired,
  'locationPages': PropTypes.object.isRequired,
  'buttonActions': PropTypes.array.isRequired,
  'handleTargetValue': PropTypes.func.isRequired,
  'subscriberCount': PropTypes.number.isRequired,
  'resetTarget': PropTypes.bool.isRequired,
  'showTabs': PropTypes.bool.isRequired,
  'showDialog': PropTypes.func.isRequired,
  'hiddenComponents': PropTypes.array.isRequired,
  'showAddComponentModal': PropTypes.func.isRequired,
  'list': PropTypes.array.isRequired,
  'noDefaultHeight': PropTypes.bool.isRequired
}

export default BasicBuilder
