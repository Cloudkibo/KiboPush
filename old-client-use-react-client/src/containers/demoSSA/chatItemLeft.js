/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Text from './text'
import Image from './image'
import QuickReply from './quick-reply'
import Card from './card'
import Media from './media'

class ChatItemLeft extends React.Component {
  render () {
    return (
      <div style={{minWidth: '200px', maxWidth: '200px'}} className='m-messenger__message m-messenger__message--in'>
        <div className='m-messenger__message-pic'>
          <img src='https://www.ssa.gov/framework/images/icons/svg/logo-red.svg' alt='' />
        </div>
        {
          this.props.message.quick_replies && this.props.message.quick_replies.length > 0
          ? <QuickReply
            text={this.props.message.text}
            quick_replies={this.props.message.quick_replies}
            clickQuickReply={this.props.clickQuickReply}
          />
          : this.props.message.text
          ? <Text
            text={this.props.message.text}
          />
          : this.props.message.attachment && this.props.message.attachment.type === 'template'
          ? (
              this.props.message.attachment.payload.template_type === 'button'
              ? <Text
                text={this.props.message.attachment.payload.text}
                buttons={this.props.message.attachment.payload.buttons}
              />
              : this.props.message.attachment.payload.template_type === 'generic'
              ? <Card
                card={this.props.message.attachment.payload.elements[0]}
              />
              : this.props.message.attachment.payload.template_type === 'media' &&
              <Media
                videoUrl={this.props.message.attachment.payload.elements[0].buttons[0].url}
                buttons={this.props.message.attachment.payload.elements[0].buttons}
              />
            )
          : this.props.message.attachment &&
          <Image
            url={this.props.message.attachment.payload.url}
          />
          }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatItemLeft)
