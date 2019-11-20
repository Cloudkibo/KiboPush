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
    this.state = {
      linkedMessages: this.props.linkedMessages ? this.props.linkedMessages : [{title: this.props.convoTitle, id: 1}],
      currentId: 1
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
      this.props.handleChange({broadcast: broadcast, linkedMessages: this.state.linkedMessages})
    }
  }

  removeLinkedMessages (deletePayload) {
    let linkedMessages = this.state.linkedMessages
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
          linkedMessages.splice(j, 1)
        }
      }
    }
    this.setState({linkedMessages})
  }

  addDeletePayloads (deletePayload, buttons) {
    for (let k = 0; k < buttons.length; k++) {
      if (buttons[k].type === 'postback' && Number.isInteger(buttons[k].payload)) {
        deletePayload.push(buttons[k].payload)
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
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      if (linkedMessages[i].id === button.payload) {
        linkedMessages[i].title = button.title
        linkedMessages[i].linkedButton = button
      }
    }
    this.setState({linkedMessages})
  }

  changeMessage (id) {
    let messageIndex = this.state.linkedMessages.findIndex(m => m.id === id) 
    if (messageIndex > -1) {
      console.log('changing message', this.state.linkedMessages[messageIndex])
      this.setState({currentId: id}, () => {
        this.props.handleChange({broadcast: this.state.linkedMessages[messageIndex].messageContent, convoTitle: this.state.linkedMessages[messageIndex].title})
      })
    }
  }

  updateLinkedMessagesTitle (title) {
    let linkedMessages = this.state.linkedMessages
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      if (linkedMessages[i].id === this.state.currentId) {
        linkedMessages[i].title = title
        linkedMessages[i].linkedButton.title = title
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
    let data = {
      id: this.state.linkedMessages.length + 1,
      title: button.title,
      messageContent: [],
      linkedButton: button
    }
    button.payload = this.state.linkedMessages.length + 1
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
                    <ul className='nav nav-tabs'>
                      <li>
                        <a href='#/' id='titleBroadcast' className='broadcastTabs active' onClick={this.props.onBroadcastClick}>Broadcast </a>
                      </li>
                      <li>
                        {this.props.broadcast.length > 0
                          ? <a href='#/' id='titleTarget' className='broadcastTabs' onClick={this.props.onTargetClick}>Targeting </a>
                          : <a href='#/'>Targeting</a>
                        }
                      </li>

                    </ul>
                    <div className='tab-content'>
                      <div className='tab-pane fade active in' id='tab_1'>
                        <ul className='nav nav-tabs m-tabs-line m-tabs-line--right' role='tablist' style={{float: 'none', maxWidth: '90%', marginLeft: '5%'}}>
                            { this.state.linkedMessages.map((message, index) => (
                              <li className='nav-item m-tabs__item' style={{width: '20%', display: 'flex'}}>
                                <a href='#/' onClick={() => this.changeMessage(message.id)} id={'tab-' + message.id} className='nav-link m-tabs__link' data-toggle='tab' role='tab' style={{cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px'}}>
                                  {message.title}
                                </a>
                                { (index < this.state.linkedMessages.length - 1) &&
                                  <i className='la la-arrow-right' style={{verticalAlign: 'middle', lineHeight: '43px'}} />
                                }
                              </li>))
                            }
                          </ul>
                              <GenericMessage
                                broadcast={this.props.broadcast}
                                handleChange={this.handleChange}
                                setReset={this.props.reset}
                                convoTitle={this.props.convoTitle}
                                titleEditable
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
  'broadcast': PropTypes.array.isRequired,
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
  'resetTarget': PropTypes.bool.isRequired
}

export default BasicBuilder
