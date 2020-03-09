import React from 'react'
import PropTypes from 'prop-types'
import { validURL, isEmoji } from '../../../containers/liveChat/utilities'
import CARD from './card'

class Text extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.getText = this.getText.bind(this)
    this.getCardProps = this.getCardProps.bind(this)
  }

  getCardProps () {
    const image = this.props.urlMeta.image || this.props.urlMeta.ogImage
    const card = {
      title: this.props.urlMeta.title || this.props.urlMeta.ogTitle,
      description: this.props.urlMeta.description || this.props.urlMeta.ogDescription,
      imageUrl: image && image.url
    }
    return card
  }

  getText (text) {
    if (validURL(text)) {
      return (
        <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}}>
          <a style={{color: this.props.color}} href={text} target='_blank' rel='noopener noreferrer'>
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
                backgroundColor: 'white'
              }}
              type='button'
              className='btn btn-outline-primary btn-block'
            >
              {b.type === 'element_share' ? 'Share' : b.title}
            </button>
          ))
        }
        {
          this.props.urlMeta && this.props.urlMeta.constructor === Object && Object.keys(this.props.urlMeta).length > 0 &&
          <CARD
            card={this.getCardProps()}
            color='#575962'
          />
        }
      </div>
    )
  }
}

Text.propTypes = {
  'text': PropTypes.object.isRequired,
  'color': PropTypes.string,
  'urlMeta': PropTypes.object
}

export default Text
