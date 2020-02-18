import React from 'react'
import PropTypes from 'prop-types'

class Card extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: props.card.title,
      subtitle: props.card.subtitle,
      image: props.card.image_url
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps called in card preview', nextProps)
    if (nextProps.card) {
      this.setState({
        title: nextProps.card.title,
        subtitle: nextProps.card.subtitle,
        image: nextProps.card.image_url
      })
    }
  }

  render () {
    console.log('props in card preview', this.state)
    return (
      <div
        style={{
          border: '1px solid rgba(0,0,0,.1)',
          borderRadius: '10px',
          width: '150px',
          maxWidth: '150px',
          margin: 'auto 15px',
          transform: this.props.currentIndex === (this.props.selectedIndex - 1) ? 'translate3d(20%, 0, 0)' : this.props.currentIndex === (this.props.selectedIndex + 1) && 'translate3d(-20%, 0, 0)'
        }}
        className={
          `carousel-item carousel-item-preview${
            this.props.currentIndex === this.props.selectedIndex ? ' active'
            : this.props.currentIndex === (this.props.selectedIndex + 1) ? ' next'
            : this.props.currentIndex === (this.props.selectedIndex - 1) && ' prev'
          }`
        }
      >
        <img
          src={this.state.image}
          alt=''
          style={{
            objectFit: 'cover',
            paddingRight: '2px',
            minHeight: '105px',
            minWidth: '150px',
            maxHeight: '105px',
            maxWidth: '150px',
            paddingTop: '15px',
            margin: '-10px auto',
            width: '100%',
            height: '100%'
          }}
        />
        <hr style={{marginBottom: '5px'}} />
        <div style={{textAlign: 'left', margin: '0px 10px', minHeight: '25px'}}>
          <span className='m--font-boldest'>
            {this.state.title.length > 15 ? `${this.state.title.substring(0, 15)}...` : this.state.title}
          </span>
        </div>
        <div style={{textAlign: 'left', margin: '0px 10px', minHeight: '20px'}}>
          <span>
            {this.state.subtitle.length > 25 ? `${this.state.subtitle.substring(0, 25)}...` : this.state.subtitle}
          </span>
        </div>
      </div>
    )
  }
}

Card.propTypes = {
  'card': PropTypes.object.isRequired
}

export default Card
