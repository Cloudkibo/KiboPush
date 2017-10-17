/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
//  import { Alert } from 'react-bs-notifier'
// import Sidebar from '../../components/sidebar/sidebar'
// import Responsive from '../../components/sidebar/responsive'
// import Header from '../../components/header/header'
// import HeaderResponsive from '../../components/header/headerResponsive'
// import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
const styles = {
  iconclass: {
    height: 24,
    padding: '0 15px',
    width: 24,
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer'
  },
  inputf: {
    display: 'none'
  }
}
class ChatBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
  }

  render () {
    return (
      <div className='ui-block popup-chat'>
        <div className='ui-block-title'>
          <span className='icon-status online' />
          <h6 className='title'>Mathilda Brinker</h6>
        </div>
        <div className='mCustomScrollbar ps ps--theme_default' data-mcs-theme='dark' data-ps-id='380aaa0a-c1ab-f8a3-1933-5a0d117715f0'>
          <ul className='notification-list chat-message chat-message-field'>
            {
              this.props.chat[0].messages.map((msg) => {
                return <li>
                  <div className='author-thumb'>
                    <img src='img/avatar14-sm.jpg' alt='author' />
                  </div>
                  <div className='notification-event'>
                    <span className='chat-message-item'>{msg.message}</span>
                    <span className='notification-date'><time className='entry-date updated' datetime='2004-07-24T18:18'>{msg.timestamp}</time></span>
                  </div>
                </li>
              })
            }
          </ul>
          <div className='ps__scrollbar-x-rail' ><div className='ps__scrollbar-x' tabindex='0' /></div></div>
        <form>
          <div className='form-group label-floating is-empty'>
            <label className='control-label'>Press enter to post...</label>
            <textarea className='form-control' placeholder='' />
            <div>
              <div style={{display: 'inline-block'}} data-tip='emoticons'>
                <i style={styles.iconclass} onClick={() => {
                  this.refs.selectFile.click()
                }}>
                  <i style={{
                    fontSize: '20px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '1em',
                    margin: '5px',
                    textAlign: 'center'
                  }} className='fa fa-file-image-o' />
                </i>
              </div>
              <div style={{display: 'inline-block'}} data-tip='attachments'>
                <i style={styles.iconclass} onClick={() => {
                  this.refs.selectFile.click()
                }}>
                  <i style={{
                    fontSize: '20px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '2em',
                    margin: '5px',
                    textAlign: 'center'
                  }} className='fa fa-paperclip' />
                </i>
                <input ref='selectFile' type='file' onChange={this._onChange} style={styles.inputf} />
              </div>
              <div style={{display: 'inline-block'}} data-tip='emoticons'>
                <i style={styles.iconclass}>
                  <i style={{
                    fontSize: '20px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '2em',
                    margin: '5px',
                    textAlign: 'center',
                    color: '#787878'
                  }} className='fa fa-smile-o' />
                </i>
              </div>
              <div style={{display: 'inline-block'}} data-tip='stickers'>
                <i style={styles.iconclass}>
                  <i style={{
                    fontSize: '20px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '2em',
                    margin: '5px',
                    textAlign: 'center'
                  }} className='fa fa-file-o' />
                  <i style={{
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    margin: '5px',
                    fontSize: '12px',
                    bottom: -4
                  }}
                     className='center fa fa-smile-o' />
                </i>
              </div>
              <div style={{display: 'inline-block'}} data-tip='GIF'>
                <i style={styles.iconclass}>
                  <i style={{
                    fontSize: '20px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '2em',
                    margin: '5px',
                    textAlign: 'center'
                  }} className='fa fa-file-o' />
                  <p style={{
                    position: 'absolute',
                    text: 'GIF',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    margin: '5px',
                    fontSize: '8px',
                    bottom: -5
                  }}>GIF</p>
                </i>
              </div>
              <div style={{display: 'inline-block', float: 'right'}} data-tip='Thumbs Up'>
                <i style={styles.iconclass}>
                  <i style={{
                    fontSize: '20px',
                    color: '#0099e6',
                    position: 'absolute',
                    right: '0',
                    width: '100%',
                    height: '2.5em',
                    margin: '5px',
                    textAlign: 'center'
                  }} className='fa fa-thumbs-up' />
                </i>
              </div>
            </div>
            <div className='add-options-message'>

              <div className='options-message smile-block'>

                <ul className='more-dropdown more-with-triangle triangle-bottom-right'>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat1.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat2.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat3.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat4.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat5.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat6.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat7.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat8.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat9.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat10.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat11.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat12.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat13.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat14.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat15.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat16.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat17.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat18.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat19.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat20.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat21.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat22.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat23.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat24.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat25.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat26.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat27.png' alt='icon' />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <span className='material-input' /></div>

        </form>

      </div>

    )
  }
}
function mapStateToProps (state) {
  console.log(state)
  return {
    chat: (state.liveChat.chat)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
