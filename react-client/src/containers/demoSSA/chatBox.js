/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ChatItemLeft from './chatItemLeft'
import ChatItemRight from './chatItemRight'
import { getResponse, updateChat } from '../../redux/actions/demoSSA.actions'

class ChatBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      textAreaValue: ''
    }
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.clickQuickReply = this.clickQuickReply.bind(this)
  }

  scrollToBottom () {
    this.refs.chatScroll.scrollTop = this.refs.chatScroll.scrollHeight
  }

  handleTextChange (e) {
    this.setState({textAreaValue: e.target.value})
  }

  onEnter (e) {
    if (e.which === 13) {
      this.sendMessage()
    }
  }

  sendMessage () {
    this.setState({textAreaValue: ''})
    let data = {
      message: {
        text: this.state.textAreaValue
      }
    }
    this.props.updateChat([data])
    console.log('sendMessage data', data)
    this.props.getResponse(data)
  }

  clickQuickReply (message) {
    let data = {
      message: {
        text: message
      }
    }
    this.props.updateChat([data])
    console.log('sendMessage data', data)
    this.props.getResponse(data)
  }

  componentDidMount () {
    this.scrollToBottom()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.chat && nextProps.chat.length > 0) {
      console.log('demoSSA responses', nextProps.chat)
      this.scrollToBottom()
    }
  }

  componentDidUpdate (nextProps) {
    this.scrollToBottom()
  }

  render () {
    return (
      <div>
        <div style={{margin: '0px'}} className='m-portlet m-portlet--mobile'>
          <div style={{padding: '1rem', borderBottom: '1px solid #ebedf2', background: '#282a3c'}}>
            <label style={{color: 'white', fontSize: '1.2rem'}}>DemoSSA</label>
          </div>
          <div style={{padding: '0px'}} className='m-portlet__body'>
            <div className='tab-content'>
              <div className='tab-pane active m-scrollable' role='tabpanel'>
                <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                  <div style={{padding: '1rem 0 0 1rem', height: '393px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                    <div id='chat-container' ref='chatScroll' style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                      <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                        {
                          this.props.chat && this.props.chat.length > 0 &&
                          this.props.chat.map(c => (
                            c.recipient
                            ? <ChatItemLeft message={c.message} clickQuickReply={this.clickQuickReply} />
                            : <ChatItemRight message={c.message} />
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  <div style={{margin: '10px 0'}} className='m-messenger__seperator' />
                  <div style={{padding: '0 1rem 1rem 1rem'}} className='m-messenger__form'>
                    <div className='m-messenger__form-controls'>
                      <input autoFocus ref={(input) => { this.textInput = input }} type='text' name='' placeholder='Type here...' onChange={this.handleTextChange} value={this.state.textAreaValue} onKeyPress={this.onEnter} className='m-messenger__form-input' />
                    </div>
                    <div className='m-messenger__form-tools'>
                      <a href='#/' onClick={this.sendMessage} className='m-messenger__form-attachment'>
                        <i className='flaticon-paper-plane' />
                      </a>
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
  console.log('DemoSSA state', state)
  return {
    chat: (state.demoSSAInfo.chat)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getResponse,
    updateChat
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
