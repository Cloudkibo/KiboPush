import React from 'react'
import PropTypes from 'prop-types'

// components
import LEFTCHATITEM from './leftChatItem'
import RIGHTCHATITEM from './rightChatItem'

class Body extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.getSeen = this.getSeen.bind(this)
  }

  getSeen (message, index) {
    if (index === (this.props.userChat.length - 1) && message.seen) {
      return (
        <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
          <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{this.props.displayDate(message.seenDateTime)}
        </div>
      )
    } else {
      return <div />
    }
  }

  render() {
    return (
      <div style={{padding: '2.2rem 0rem 2.2rem 2.2rem'}} className='m-portlet__body'>
        <div className='tab-content'>
          <div className='tab-pane active m-scrollable' role='tabpanel'>
            <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                {
                  this.props.loadingChat
                  ? <div style={{height: '55vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}} className='m-messenger__messages'>
                    <div>
                      <div className="m-loader" style={{width: "30px", display: "inline-block"}} />
                      <span>Loading Chat...</span>
                    </div>
                  </div>
                  : this.props.userChat.length > 0
                  ? <div style={{height: '55vh', position: 'relative', overflow: 'hidden', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                    <div id='chat-container' style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                      <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                        {
                          this.props.userChat.map((chat, index) => (
                            chat.format === 'facebook'
                            ? <LEFTCHATITEM
                              message={chat}
                              index={index}
                              showDate={this.props.showDate}
                              displayDate={this.props.displayDate}
                              activeSession={this.props.activeSession}
                              previousMessage={this.props.userChat[index - 1]}
                            />
                            : <RIGHTCHATITEM
                              message={chat}
                              index={index}
                              showDate={this.props.showDate}
                              displayDate={this.props.displayDate}
                              activeSession={this.props.activeSession}
                              previousMessage={this.props.userChat[index - 1]}
                              user={this.props.user}
                              seenElement={this.getSeen(chat, index)}
                            />
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  : <div style={{height: '55vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}} className='m-messenger__messages'>
                    <div>
                      <span>No chat history found</span>
                    </div>
                  </div>
                }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Body.propTypes = {
  'userChat': PropTypes.array.isRequired,
  'showDate': PropTypes.func.isRequired,
  'displayDate': PropTypes.func.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'loadingChat': PropTypes.bool.isRequired,
  'user': PropTypes.object.isRequired
}

export default Body
