import React from 'react'
import PropTypes from 'prop-types'

class Poll extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <div>
        <div className='m-messenger__message-content'>
          <div className='m-messenger__message-username'>
            {this.props.repliedByMessage}
          </div>
          <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
            {this.props.message.payload.text}
          </div>
          <div>
            {
              this.props.message.payload.quick_replies &&
              this.props.message.payload.quick_replies.length > 0 &&
              this.props.message.payload.quick_replies.map((b, x) => (
                <button key={x} style={{margin: '3px'}} type='button' className='btn m-btn--pill btn-secondary m-btn m-btn--bolder btn-sm'>
                  {b.title}
                </button>
              ))
            }
          </div>
        </div>
        {this.props.seenElement}
      </div>
    )
  }
}

Poll.propTypes = {
  'message': PropTypes.object.isRequired,
  'repliedByMessage': PropTypes.string.isRequired,
  'seenElement': PropTypes.element.isRequired
}

export default Poll
