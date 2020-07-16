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
import TEMPLATESMODAL from '../../../containers/whatsAppChat/messageTemplate'

class Chat extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      chatAreaHieght: '57vh',
      showPopover: false,
      popoverOptions: {
        placement: 'left',
        target: '_picker',
        content: (<div />)
      }
    }
    this.togglePopover = this.togglePopover.bind(this)
    this.getPicker = this.getPicker.bind(this)
    this.overrideUserInput = this.overrideUserInput.bind(this)
    this.updateNewMessage = this.updateNewMessage.bind(this)
    this.updateChatAreaHeight = this.updateChatAreaHeight.bind(this)

    this.newMessage = false
  }

  updateChatAreaHeight (value) {
    this.setState({chatAreaHieght: value})
  }

  updateNewMessage (value) {
    this.newMessage = value
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

        <CONFIRMATIONMODAL
          id='_resolve-chat-session'
          title='Resolve Chat Session'
          description='Are you sure you want to resolve this chat session?'
          onConfirm={() => {this.props.changeStatus('resolved', this.props.activeSession)}}
        />

        <CONFIRMATIONMODAL
          id='_remove-pending-response'
          title='Remove Pending Response'
          description='Are you sure you want to remove the pending flag on this session?'
          onConfirm={() => {this.props.handlePendingResponse(this.props.activeSession, false)}}
        />

        <TEMPLATESMODAL
          sendChatMessage={this.props.sendChatMessage}
          setMessageData={this.props.setMessageData}
          activeSession={this.props.activeSession}
          updateState={this.props.updateState}
          userChat={this.props.userChat}
          sessions={this.props.sessions}
          updateNewMessage={this.updateNewMessage}
          updateChatAreaHeight={this.updateChatAreaHeight}
          alertMsg={this.props.alertMsg}
          id='messageTemplate'
        />

        <HEADER
          activeSession={this.props.activeSession}
          showSearch={this.props.showSearch}
          changeStatus={this.props.changeStatus}
          handlePendingResponse={this.props.handlePendingResponse}
        />

        <BODY
          chatAreaHieght={this.state.chatAreaHieght}
          userChat={this.props.userChat}
          chatCount={this.props.chatCount}
          activeSession={this.props.activeSession}
          showDate={showDate}
          displayDate={displayDate}
          loadingChat={this.props.loadingChat}
          user={this.props.user}
          fetchUserChats={this.props.fetchUserChats}
          markRead={this.props.markRead}
          updateState={this.props.updateState}
          newMessage={this.newMessage}
          updateNewMessage={this.updateNewMessage}
        />

        {
          !this.props.activeSession.lastMessagedAt || (!moment(this.props.activeSession.lastMessagedAt).isAfter(moment().subtract(24, 'hours')) && !this.props.isSMPApproved)
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
              <p>Chat's 24 hours window session has been expired for this subscriber. You cannot send a message to this subscriber until they message you.</p>
              {this.props.showTemplates &&
                <a href='#/' style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', float: 'right', marginRight: '10px'}} data-toggle="modal" data-target="#messageTemplate">Use Templates</a>
              }
            </span>
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
            cannedResponses = {this.props.cannedResponses}
            performAction={this.props.performAction}
            activeSession={this.props.activeSession}
            user={this.props.user}
            sendChatMessage={this.props.sendChatMessage}
            alertMsg={this.props.alertMsg}
            updateState={this.props.updateState}
            userChat={this.props.userChat}
            sessions={this.props.sessions}
            uploadAttachment={this.props.uploadAttachment}
            sendAttachment={this.props.sendAttachment}
            uploadRecording={this.props.uploadRecording}
            getPicker={this.getPicker}
            togglePopover={this.togglePopover}
            updateNewMessage={this.updateNewMessage}
            deletefile={this.props.deletefile}
            fetchUrlMeta={this.props.fetchUrlMeta}
            updateChatAreaHeight={this.updateChatAreaHeight}
            showUploadAttachment={this.props.showUploadAttachment}
            showRecordAudio={this.props.showRecordAudio}
            showSticker={this.props.showSticker}
            showEmoji={this.props.showEmoji}
            showGif={this.props.showGif}
            showThumbsUp={this.props.showThumbsUp}
            showZoom={this.props.showZoom}
            setMessageData={this.props.setMessageData}
            filesAccepted={this.props.filesAccepted}
            showAgentName={this.props.showAgentName}
            history={this.props.history}
            zoomIntegration={this.props.zoomIntegration}
            createZoomMeeting={this.props.createZoomMeeting}
            showCaption={this.props.showCaption}
          />
        }

        <div id='_picker'>
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
        </div>

      </div>
    )
  }
}

Chat.propTypes = {
  'cannedResponses': PropTypes.array.isRequired,
  'userChat': PropTypes.array.isRequired,
  'chatCount': PropTypes.number.isRequired,
  'sessions': PropTypes.array.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeStatus': PropTypes.func.isRequired,
  'updateState': PropTypes.func.isRequired,
  'getChatPreview': PropTypes.func.isRequired,
  'handlePendingResponse': PropTypes.func.isRequired,
  'showSearch': PropTypes.func.isRequired,
  'performAction': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'sendChatMessage': PropTypes.func.isRequired,
  'uploadAttachment': PropTypes.func,
  'sendAttachment': PropTypes.func,
  'uploadRecording': PropTypes.func,
  'loadingChat': PropTypes.bool.isRequired,
  'fetchUserChats': PropTypes.func.isRequired,
  'markRead': PropTypes.func.isRequired,
  'deletefile': PropTypes.func,
  'fetchUrlMeta': PropTypes.func.isRequired,
  'isSMPApproved': PropTypes.bool.isRequired,
  'showUploadAttachment': PropTypes.bool.isRequired,
  'showRecordAudio': PropTypes.bool.isRequired,
  'showSticker': PropTypes.bool.isRequired,
  'showEmoji': PropTypes.bool.isRequired,
  'showGif': PropTypes.bool.isRequired,
  'showThumbsUp': PropTypes.bool.isRequired
}
Chat.defaultProps = {
  showTemplates: false,
  showCaption: false
}

export default Chat
