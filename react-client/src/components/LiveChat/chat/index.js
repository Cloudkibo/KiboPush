import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { Popover, PopoverBody} from 'reactstrap'
import { Picker } from 'emoji-mart'
import StickerMenu from '../../StickerPicker/stickers'
import GiphySelect from 'react-giphy-select'
import moment from 'moment'
import {
  displayDate,
  showDate
} from '../../../containers/liveChat/utilities'

// components
import HEADER from './header'
import BODY from './body'
import FOOTER from './footer'
import CONFIRMATIONMODAL from '../../extras/confirmationModal'

class Chat extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showPopover: false,
      popoverOptions: {
        placement: 'left',
        target: '_chat_area',
        content: (<div />)
      }
    }
    this.togglePopover = this.togglePopover.bind(this)
    this.getPicker = this.getPicker.bind(this)
    this.overrideUserInput = this.overrideUserInput.bind(this)
  }

  togglePopover () {
    this.setState({showPopover: !this.state.showPopover})
  }

  overrideUserInput () {
    let activeSession = this.props.activeSession
    activeSession.waitingForUserInput.componentIndex = -1
    this.props.updateState({
      activeSession
    })
  }

  getPicker (type, popoverOptions, otherOptions) {
    switch (type) {
      case 'emoji':
        popoverOptions.content = (
          <Picker
            style={{paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
            emojiSize={24}
            perLine={6}
            skin={1}
            set='facebook'
            showPreview={false}
            showSkinTones={false}
            custom={[]}
            autoFocus={false}
            onClick={(emoji, event) => otherOptions.setEmoji(emoji)}
          />
        )
        break
      case 'sticker':
        popoverOptions.content = (
          <StickerMenu
            apiKey='80b32d82b0c7dc5c39d2aafaa00ba2bf'
            userId='imran.shoukat@khi.iba.edu.pk'
            sendSticker={(sticker) => { otherOptions.sendSticker(sticker) }}
          />
        )
        break
      case 'gif':
        popoverOptions.content = (
          <GiphySelect
            onEntrySelect={(gif) => { otherOptions.sendGif(gif) }}
          />
        )
        break
      default:
    }
    this.setState({
      showPopover: true,
      popoverOptions
    })
  }

  render() {
    return (
      <div id='_chat_area' style={{padding: '0px', border: '1px solid #F2F3F8', overflow: 'hidden', marginBottom: '0px'}} className='col-xl-5 m-portlet'>

        <ReactTooltip
          place='bottom'
          type='dark'
          effect='solid'
        />

        <Popover
          placement={this.state.popoverOptions.placement}
          isOpen={this.state.showPopover}
          className='chatPopover _popover_max_width_400'
          target={this.state.popoverOptions.target}
          toggle={this.togglePopover}
        >
          <PopoverBody>
            {this.state.popoverOptions.content}
          </PopoverBody>
        </Popover>

        <CONFIRMATIONMODAL
          id='_resolve-chat-session'
          title='Resolve Chat Session'
          description='Are you sure you want to resolve this chat session?'
          onConfirm={() => {this.props.changeStatus('resolved', this.props.activeSession)}}
        />

        <CONFIRMATIONMODAL
          id='_remove-pending-response'
          title='Remove Pending Response'
          description='Are you sure you want to mark this session as pending?'
          onConfirm={() => {this.props.handlePendingResponse(this.props.activeSession, false)}}
        />

        <HEADER
          activeSession={this.props.activeSession}
          showSearch={this.props.showSearch}
          changeStatus={this.props.changeStatus}
          handlePendingResponse={this.props.handlePendingResponse}
        />

        <BODY
          userChat={this.props.userChat}
          chatCount={this.props.chatCount}
          activeSession={this.props.activeSession}
          showDate={showDate}
          displayDate={displayDate}
          loadingChat={this.props.loadingChat}
          user={this.props.user}
          fetchUserChats={this.props.fetchUserChats}
        />

        {
          !moment(this.props.activeSession.lastMessagedAt).isAfter(moment().subtract(24, 'hours'))
          ? <div
            className='m-messenger'
            style={{
              position: 'absolute',
              bottom: 0,
              borderTop: '1px solid #ebedf2',
              width: '100%',
              padding: '15px'
            }}
          >
            <span>Chat's 24 hours window session has been expired for this subscriber. You cannot send a message to this subscriber until they message you.</span>
          </div>
          : this.props.activeSession.waitingForUserInput &&
          this.props.activeSession.waitingForUserInput.componentIndex > -1
          ? <div
            className='m-messenger'
            style={{
              position: 'absolute',
              bottom: 0,
              borderTop: '1px solid #ebedf2',
              width: '100%',
              padding: '15px'
            }}
          >
            <span>
              A user input component was last sent to this subscriber and we are waiting for a response from them.
            </span>
            <button
              className='m-link'
              style={{float: 'right', border: 'none', cursor: 'pointer'}}
              onClick={() => this.overrideUserInput()}
            >
              I don't want to wait
            </button>
          </div>
          : <FOOTER
            performAction={this.props.performAction}
            activeSession={this.props.activeSession}
            user={this.props.user}
            sendChatMessage={this.props.sendChatMessage}
            alertMsg={this.props.alertMsg}
            updateState={this.props.updateState}
            userChat={this.props.userChat}
            uploadAttachment={this.props.uploadAttachment}
            sendAttachment={this.props.sendAttachment}
            uploadRecording={this.props.uploadRecording}
            getPicker={this.getPicker}
            togglePopover={this.togglePopover}
          />
        }

      </div>
    )
  }
}

Chat.propTypes = {
  'userChat': PropTypes.array.isRequired,
  'chatCount': PropTypes.number.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeStatus': PropTypes.func.isRequired,
  'updateState': PropTypes.func.isRequired,
  'getChatPreview': PropTypes.func.isRequired,
  'handlePendingResponse': PropTypes.func.isRequired,
  'showSearch': PropTypes.func.isRequired,
  'performAction': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'sendChatMessage': PropTypes.func.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'sendAttachment': PropTypes.func.isRequired,
  'uploadRecording': PropTypes.func.isRequired,
  'loadingChat': PropTypes.bool.isRequired,
  'fetchUserChats': PropTypes.func.isRequired
}

export default Chat
