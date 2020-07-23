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
          return (
            <a style={{color: this.props.color, whiteSpace: 'break-spaces'}} href={text} target='_blank' rel='noopener noreferrer'>
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
      <div className='m-widget4'>
        <div className='m-widget4__item' style={{paddingTop: '3px', paddingBottom: '3px'}}>
          <div className='m-widget4__img m-widget4__img--pic'>
            <img style={{width: '40px', height: '40px'}} src='https://cdn.cloudkibo.com/public/icons/users.jpg' alt='' />
          </div>
          <div className='m-widget4__info' style={{paddingLeft: '1rem'}}>
            <span className='m-widget4__title'>
              {this.props.name}
            </span>
            <br />
            <span className='m-widget4__sub'>
              {this.props.number}
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Text.propTypes = {
  'name': PropTypes.string.isRequired,
  'number': PropTypes.string.isRequired
}

export default Text
