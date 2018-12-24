/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ChatItemLeft from './chatItemLeft'
import ChatItemRight from './chatItemRight'

class ChatBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
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
                        <ChatItemRight />
                        <ChatItemLeft type='text' />
                        <ChatItemLeft type='image' />
                        <ChatItemLeft type='card' />
                        <ChatItemLeft type='media' />
                        <ChatItemLeft type='quick-reply' />
                      </div>
                    </div>
                  </div>
                  <div style={{margin: '10px 0'}} className='m-messenger__seperator' />
                  <div style={{padding: '0 1rem 1rem 1rem'}} className='m-messenger__form'>
                    <div className='m-messenger__form-controls'>
                      <input autoFocus ref={(input) => { this.textInput = input }} type='text' name='' placeholder='Type here...' className='m-messenger__form-input' />
                    </div>
                    <div className='m-messenger__form-tools'>
                      <a className='m-messenger__form-attachment'>
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
  console.log(state)
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
