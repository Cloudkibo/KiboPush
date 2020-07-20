import React from 'react'
import PropTypes from 'prop-types'
import TEXT from '../messages/text'
import { validURL } from '../../../containers/liveChat/utilities'

class Card extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.getSubtitle = this.getSubtitle.bind(this)
    this.getFirstUrl = this.getFirstUrl.bind(this)
  }

  getSubtitle (card) {
    let subtitle = card.subtitle || card.description
    if (subtitle.length > 30) {
      subtitle = `${subtitle.substring(0, 30)}...`
    }
    return subtitle
  }

  getFirstUrl () {
    let words = this.props.card.text.replace(/\n/g, " \r\n").split(" ")
    for (let i = 0; i < words.length; i++) {
      if (validURL(words[i].trim())) {
        return words[i].trim()
      }
    }
  }

  render() {
    console.log('this.props.card', this.props.card)
    let card = (
      <div
        style={{
          border: '1px solid rgba(0,0,0,.1)',
          borderRadius: (this.props.card.buttons && this.props.card.buttons.length > 0) ? '10px 10px 0px 0px' : '10px',
          backgroundColor: 'white'
        }}
        className='carousel-item carousel-item-preview active'
      >
      <a href={this.props.card.url} target='_blank' rel='noopener noreferrer'>
      {
        (this.props.card.image_url || this.props.card.imageUrl) &&
        <img
          src={this.props.card.image_url || this.props.card.imageUrl}
          alt=''
          style={{
            objectFit: 'cover',
            paddingRight: '2px',
            minHeight: '105px',
            minWidth: '150px',
            paddingTop: '15px',
            margin: '-10px auto',
            width: '100%',
            height: '100%'
          }}
        />
      }
      {
        (this.props.card.image_url || this.props.card.imageUrl)  &&
        <hr style={{marginBottom: '5px'}} />
      }
      <div style={{textAlign: 'left', margin: '0px 10px', minHeight: '25px', color: 'rgb(87, 89, 98)'}}>
        <span className='m--font-boldest'>
          {this.props.card.title.length > 20 ? `${this.props.card.title.substring(0, 20)}...` : this.props.card.title}
        </span>
      </div>
      {
        (this.props.card.subtitle || this.props.card.description) &&
        <div style={{textAlign: 'left', margin: '0px 10px', minHeight: '20px', color: 'rgb(87, 89, 98)'}}>
          <span>
            {this.getSubtitle(this.props.card)}
          </span>
        </div>
      }
      </a>
      </div>
    )
    return (
      <div style={{width: '215px', color: this.props.color}}>
        {
          this.props.type === 'url-card' && this.props.card.text &&
          <TEXT
            text={{text: this.props.card.text}}
          />
        }
        {
          this.props.type === 'url-card' ?
          <a href={this.getFirstUrl()} style={{color: 'inherit'}} target='_blank' rel='noopener noreferrer'>
            {card}
          </a> :
          card
        }
        {
          this.props.card.buttons &&
          this.props.card.buttons.length > 0 &&
          this.props.card.buttons.map((b, i) => (
            <button
              key={i}
              style={{
                borderRadius: this.props.card.buttons.length === (i + 1) && '0px 0px 10px 10px',
                width: '100%',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                pointerEvents: 'none',
                backgroundColor: 'white'
              }}
              className='btn btn-outline-brand btn-sm'
            >
              {b.type === 'element_share' ? 'Share' : b.title}
            </button>
          ))
        }
      </div>
    )
  }
}

Card.propTypes = {
  'card': PropTypes.object.isRequired
}

export default Card
