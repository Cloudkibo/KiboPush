import React from 'react'
import PropTypes from 'prop-types'
import { validURL, isEmoji } from '../../../containers/liveChat/utilities'

class Text extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.getText = this.getText.bind(this)
  }

  getText (text) {
    if (validURL(text)) {
      return (
        <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}}>
          <a href={text} target='_blank' rel='noopener noreferrer'>
            {text}
          </a>
        </div>
      )
    } else if (isEmoji(text)) {
      return (
        <div style={{fontSize: '30px'}}>
          {text}
        </div>
      )
    } else {
      return (
        <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}}>
          {text}
        </div>
      )
    }
  }

  render() {
    return (
      <div className='m-messenger__message-text'>
        {this.getText(this.props.text.text)}
        {
          this.props.text.buttons &&
          this.props.text.buttons.length > 0 &&
          this.props.text.buttons.map((b, i) => (
            <button
              key={i}
              style={{
                margin: '3px 3px -4px 3px',
                borderRadius: this.props.text.buttons.length === i + 1 ? '0px 0px 10px 10px' : 0,
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
      </div>
    )
  }
}

Text.propTypes = {
  'text': PropTypes.object.isRequired
}

export default Text
