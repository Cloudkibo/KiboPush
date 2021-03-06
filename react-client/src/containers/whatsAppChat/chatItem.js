/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import {
  fetchChat,
  sendChatMessage,
  markRead
} from '../../redux/actions/whatsAppChat.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  displayDate,
  showDate
} from '../liveChat/utilities'
import {getVideoId} from '../../utility/utils'
import { Element, Events, scrollSpy, scroller } from 'react-scroll'
import ReactPlayer from 'react-player'
import YouTube from 'react-youtube'
import { getmetaurl } from '../liveChat/utilities'

// import MediaCapturer from 'react-multimedia-capture'

class ChatItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.previousScrollHeight = undefined
    this.newMessage = false
    this.state = {
      changedActiveSession: true,
      sessionExpired: false
    }
    this.showContent = this.showContent.bind(this)
    this.shouldLoad = this.shouldLoad.bind(this)
    this.loadMoreMessage = this.loadMoreMessage.bind(this)
    this.updateScrollTop = this.updateScrollTop.bind(this)
    this.onTestURLAudio = this.onTestURLAudio.bind(this)
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
    this.scrollToMessage = this.scrollToMessage.bind(this)

  }
  scrollToMessage (messageId) {
    this.props.scrollToMessage(messageId)
  }
  getRepliedByMsg (msg) {
    if (
      (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') &&
      msg.replied_by && msg.replied_by.type === 'agent' && this.props.user._id !== msg.replied_by.id
    ) {
      return `${msg.replied_by.name} replied`
    } else {
      return 'You replied'
    }
  }

  onTestURLAudio (url) {
    var AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|mp4)($|\?)/i
    var truef = AUDIO_EXTENSIONS.test(url)

    if (truef === false) {
    }
  }
  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  showContent (msg, type, index) {
    let content = []
    if (msg.payload.componentType !== 'text') {
      content.push(<div className='m-messenger__message-content'>
        <div className='m-messenger__message-username'>
          {type === 'whatsApp' ? `${this.props.activeSession.name} shared` : this.getRepliedByMsg(msg) }
        </div>
        {msg.payload.componentType === 'image'
          ? <a key={index} href={msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url} target='_blank' rel='noopener noreferrer'>
            <img
              alt=''
              src={msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url}
              style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
            />
          </a>
        : msg.payload.componentType === 'file'
        ? <a key={index} href={msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file.fileurl.url } target='_blank' rel='noopener noreferrer' style={{color: type === 'kibopush' ? 'white' : '#5867dd'}}>
          <h6 style={{marginTop: '10px'}}><i className='fa fa-file-text-o' /><strong>{msg.payload.fileName ? msg.payload.fileName : msg.payload.file && msg.payload.file.fileName}</strong></h6>
        </a>
        : msg.payload.componentType === 'sticker'
        ? <a key={index} href={msg.payload.fileurl.url} target='_blank' rel='noopener noreferrer'>
            <img
              alt=''
              src={msg.payload.fileurl.url}
              style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
            />
        </a>
        :msg.payload.componentType === 'gif'
        ? <a key={index} href={msg.payload.fileurl.url} target='_blank' rel='noopener noreferrer'>
            <img
              alt=''
              src={msg.payload.fileurl.url}
              style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
            />
        </a>
        :msg.payload.componentType === 'video'
        ? <div key={index}>
          <ReactPlayer
            url={msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url}
            controls
            width='230px'
            height='200px'
            onPlay={this.onTestURLVideo(msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url)}
          />
        </div>
        :msg.payload.componentType === 'thumbsUp'
        ? <a key={index} href={msg.payload.fileurl.url} target='_blank' rel='noopener noreferrer'>
            <img
              alt=''
              src={msg.payload.fileurl.url}
              style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
            />
        </a>
      : msg.payload.componentType === 'audio'
      ? <div key={index}>
          <ReactPlayer
            url={msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url}
            controls
            width='230px'
            height='60px'
            onPlay={this.onTestURLAudio(msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url)}
          />
        </div>
      : msg.payload.componentType === 'media' && msg.payload.mediaType === 'audio'
      ? <div key={index}>
          <ReactPlayer
          url={msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url}
          controls
          width='230px'
          height='60px'
          onPlay={this.onTestURLAudio(msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url)} />
      </div>
      : msg.payload.componentType === 'media' && msg.payload.mediaType === 'video'
      ? <div key={index}>
          <ReactPlayer
            url={msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url}
            controls
            width='230px'
            height='200px'
            onPlay={this.onTestURLVideo(msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url)}
          />
        </div>
      : msg.payload.componentType === 'media' && msg.payload.mediaType === 'image' &&
      <a key={index} href={msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url} target='_blank' rel='noopener noreferrer'>
            <img
              alt=''
              src={msg.payload.fileurl ? msg.payload.fileurl.url : msg.payload.file && msg.payload.file.fileurl.url}
              style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
            />
          </a>
      }
      </div>)
    } else if (msg.payload.componentType === 'text' && msg.url_meta){
      let metaUrl = getmetaurl(msg.payload.text)
      let text = msg.payload.text.replace(metaUrl, '')
      content.push(<div className='m-messenger__message-content'>
        <div className='m-messenger__message-username'>
          {type === 'whatsApp' ? `${this.props.activeSession.name} shared` : this.getRepliedByMsg(msg)}
        </div>
        <div style={{display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
          {text}
          {getVideoId(metaUrl)
           ? <div>
           <YouTube
             videoId={getVideoId(metaUrl)}
             opts={{
               height: '150',
               width: '200',
               playerVars: { // https://developers.google.com/youtube/player_parameters
                 autoplay: 0
               }
             }}/>
           <a href={metaUrl} target='_blank' rel='noopener noreferrer'>
               <p style={{fontSize: '13px', fontWeight: 'bold', color: type==='whatsApp' ? 'black' : 'white'}}>{msg.url_meta.title}</p>
             </a>
             <br />
             {
               msg.url_meta.description &&
                 <p style={{marginTop: '-35px'}}>{msg.url_meta.description.length > 25 ? msg.url_meta.description.substring(0, 24) + '...' : msg.url_meta.description}</p>
             }
             </div>
          : <table style={{maxWidth: '318px', margin: '10px'}}>
           <tbody>
               <tr>
                 <td>
                   <div style={{width: 45, height: 45}}>
                     {
                       msg.url_meta.image &&
                         <img alt='' src={msg.url_meta.image.url} style={{width: 45, height: 45}} />
                     }
                   </div>
                 </td>
                 <td>
                   <div>
                     <a href={metaUrl} target='_blank' rel='noopener noreferrer'>
                       <p style={{fontSize: '13px', fontWeight: 'bold', color: type==='whatsApp' ? 'black' : 'white'}}>{msg.url_meta.title}</p>
                     </a>
                     <br />
                     {
                       msg.url_meta.description &&
                         <p style={{marginTop: '-35px'}}>{msg.url_meta.description.length > 25 ? msg.url_meta.description.substring(0, 24) + '...' : msg.url_meta.description}</p>
                     }
                   </div>
                 </td>
               </tr>
             </tbody>
          </table>
        }
        </div>
      </div>)
    } else {
      content.push(<div className='m-messenger__message-content'>
        <div className='m-messenger__message-username'>
          {type === 'whatsApp' ? `${this.props.activeSession.name} wrote` : this.getRepliedByMsg(msg)}
        </div>
        <div style={{display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
          {msg.payload.text}
        </div>
      </div>)
    }
    return content
  }
  shouldLoad () {
    if (this.props.chat.length < this.props.chatCount) {
      return true
    } else {
      return false
    }
  }

  loadMoreMessage () {
    this.props.fetchChat(this.props.activeSession._id, {page: 'next', number: 25, last_id: this.props.chat[0]._id}, this.props.chat[0]._id, this.scrollToMessage)
  }

  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)
    if (this.refs.chatScroll) {
      this.refs.chatScroll.addEventListener('scroll', () => {
        this.previousScrollHeight = this.refs.chatScroll.scrollHeight
        if (this.refs.chatScroll.scrollTop === 0) {
          if (this.shouldLoad()) {
            this.setState({changedActiveSession: true})
            this.loadMoreMessage()
            // this.updateScrollTop()
          }
        }
      })
    }
    Events.scrollEvent.register('begin', function (to, element) {
      // console.log('begin', arguments)
    })

    Events.scrollEvent.register('end', function (to, element) {
      // console.log('end', arguments)
    })

    scrollSpy.update()
  }

  updateScrollTop () {
    if (this.previousScrollHeight && this.previousScrollHeight !== this.refs.chatScroll.scrollHeight) {
      this.refs.chatScroll.scrollTop = this.refs.chatScroll.scrollHeight - this.previousScrollHeight
    } else if (this.props.chat) {
      this.scrollToTop()
      setTimeout(scroller.scrollTo(this.props.chat[this.props.chat.length - 1]._id, {delay: 300, containerId: 'whatsappchat-container'}), 3000)
      // this.props.disableScroll()
    }
  }

  componetWillUnmount () {
    Events.scrollEvent.remove('begin')
    Events.scrollEvent.remove('end')
  }

  scrollToTop () {
    // this.top.scrollIntoView({behavior: 'instant'})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.state.changedActiveSession) {
      this.previousScrollHeight = undefined
    }
    // // this.getDisabledValue()
    // if (nextProps.urlMeta) {
    //   if (!nextProps.urlMeta.type) {
    //     this.setState({displayUrlMeta: false})
    //   }
    //   this.setState({urlmeta: nextProps.urlMeta})
    // }
    // this.props.markRead(this.props.activeSession._id, this.props.sessions)
  }

  componentDidUpdate (nextProps) {
    if (nextProps.chat && nextProps.chat.length > 0 && nextProps.chat[0].contactId === this.props.activeSession._id) {
      this.props.markRead(this.props.activeSession._id, this.props.sessions)
      this.props.updateUnreadCount(this.props.activeSession)
    }
  }

  render () {
    console.log('render in chatitem', this.props.chat)
    return (
      <div style={{height: '420px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
        <div id='whatsappchat-container' ref='chatScroll' style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
          <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
            {
              (this.props.chatCount && this.props.chat && this.props.chatCount > this.props.chat.length) &&
              <p style={{textAlign: 'center'}}>Loading...</p>
            }
            {
                this.props.chat && this.props.chat.map((msg, index) => (
                  msg.format === 'whatsApp'
                  ? <div key={index} style={{marginLeft: 0, marginRight: 0, display: 'block', clear: 'both'}} className='row'>
                    <Element name={msg._id}>
                      {
                        index === 0
                        ? <div className='m-messenger__datetime'>
                          {displayDate(msg.datetime)}
                        </div>
                        : index > 0 && showDate(this.props.chat[index - 1].datetime, msg.datetime) &&
                        <div className='m-messenger__datetime'>
                          {displayDate(msg.datetime)}
                        </div>
                      }
                      <div style={{minWidth: '200px', maxWidth: '200px'}} key={msg._id} className='m-messenger__message m-messenger__message--in'>
                        <div className='m-messenger__message-pic'>
                          <img src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg' alt='' />
                        </div>
                        <div className='m-messenger__message-body'>
                          <div className='m-messenger__message-arrow' />
                          {this.showContent(msg, 'whatsApp', index)}
                        </div>
                      </div>
                    </Element>
                  </div>
                  : <div key={index} style={{marginLeft: 0, marginRight: 0, display: 'block', clear: 'both'}} className='row'>
                    <Element name={msg._id}>
                      {
                        index === 0
                        ? <div className='m-messenger__datetime'>
                          {displayDate(msg.datetime)}
                        </div>
                        : index > 0 && showDate(this.props.chat[index - 1].datetime, msg.datetime) &&
                        <div className='m-messenger__datetime'>
                          {displayDate(msg.datetime)}
                        </div>
                      }
                      <div style={{minWidth: '200px'}} key={msg._id} className='m-messenger__message m-messenger__message--out'>
                        <div className='m-messenger__message-body'>
                          <div className='m-messenger__message-arrow' />
                          <div>
                            {this.showContent(msg, 'kibopush', index)}
                            {index === this.props.chat.length - 1 && msg.status === 'seen' &&
                              <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    </Element>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    chatCount: (state.whatsAppChatInfo.chatCount)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchChat,
    sendChatMessage,
    markRead
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatItem)
