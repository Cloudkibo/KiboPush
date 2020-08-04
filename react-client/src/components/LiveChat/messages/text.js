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
    console.log('this.props.urlMeta', this.props.urlMeta)
    const image = this.props.urlMeta.image || this.props.urlMeta.ogImage
    const card = {
      title: this.props.urlMeta.title || this.props.urlMeta.ogTitle,
      description: this.props.urlMeta.description || this.props.urlMeta.ogDescription,
      imageUrl: image && image.url,
      url: this.props.urlMeta.url || this.props.urlMeta.ogUrl
    }
    return card
  }

  getText (text) {
    if (text.length === 2 && isEmoji(text)) {
      return (
        <div style={{fontSize: '30px'}}>
          {text}
        </div>
      )
    } else {
      let words = text.replace(/\n/g, " \r\n").split(" ")
      let wordElements = words.map((word, index) => {
        if (validURL(word.trim())) {
          let url= word.trim()
          var pattern = /^((http|https|ftp):\/\/)/
          if(!pattern.test(word.trim())) {
              url = "http://" + url
          }
          return (
            <a style={{color: this.props.color, whiteSpace: 'break-spaces'}} href={url} target='_blank' rel='noopener noreferrer'>
              {word + (index < words.length - 1 ? " " : "")}
            </a>
          )
        } else {
          return (
            <span style={{whiteSpace: 'break-spaces'}}>
              {word + (index < words.length - 1 ? " " : "")}
            </span>
          )
        }
      })
      return (
        <div style={{wordBreak: 'break-word', display: 'block', overflow: 'hidden'}}>
          {wordElements}
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
