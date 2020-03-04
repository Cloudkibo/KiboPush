import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'

// components
import CARD from './card'
import RIGHTARROW from './rightArrow'
import LEFTARROW from './leftArrow'

class Gallery extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const settings = {
      arrows: true,
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <RIGHTARROW />,
      prevArrow: <LEFTARROW />
    }
    return (
      <Slider ref={(c) => { this.slider = c }} {...settings}>
        {
          this.props.gallery.cards.map((card, i) => (
            <div key={i} style={{width: '200px'}}>
              <CARD card={card} />
            </div>
          ))
        }
      </Slider>
    )
  }
}

Gallery.propTypes = {
  'gallery': PropTypes.object.isRequired
}

export default Gallery
