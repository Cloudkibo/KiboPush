import React from 'react'
import PropTypes from 'prop-types'

class Text extends React.Component {
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
        </div>
        {
          this.props.message.payload.buttons &&
          this.props.message.payload.buttons.length > 0 &&
          this.props.message.payload.buttons.map((b, i) => (
            <button
              key={i}
              style={{
                margin: '3px 3px -4px 3px',
                borderRadius: this.props.message.payload.buttons.length === i + 1 ? '0px 0px 10px 10px' : 0,
                borderColor: '#716aca',
                width: '230px'
              }}
              type='button'
              className='btn btn-outline-primary btn-block'
            >
              {b.type === 'element_share' ? 'Share' : b.title}
            </button>
          ))
        }
        {this.props.seenElement}
      </div>
    )
  }
}

Text.propTypes = {
  'message': PropTypes.object.isRequired,
  'repliedByMessage': PropTypes.string.isRequired,
  'seenElement': PropTypes.element.isRequired
}

export default Text
