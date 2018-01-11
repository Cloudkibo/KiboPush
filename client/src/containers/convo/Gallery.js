/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Card from './Card'
import Slider from 'react-slick'
import RightArrow from './RightArrow'
import LeftArrow from './LeftArrow'
import AlertContainer from 'react-alert'

class Gallery extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleChange = this.handleChange.bind(this)
    this.addSlide = this.addSlide.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.state = {
      broadcast: [],
      cards: [{element: <Card id={1} handleCard={this.handleCard} />, key: 1}, {element: <Card id={2} handleCard={this.handleCard} />, key: 2}],
      showPlus: false,
      pageNumber: 1,
    }
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }

  handleChange (index) {
    this.setState({pageNumber: index + 1})
    if (index === this.state.cards.length - 1) {
      this.setState({showPlus: true})
    } else {
      this.setState({showPlus: false})
    }
  }

  addSlide () {
    if(this.state.cards.length >= 10){
      return this.msg.error('You cant add more than 10 cards.');
    }
    var temp = this.state.cards
    this.setState({cards: [...temp, {element: <Card id={temp.length + 1} handleCard={this.handleCard} />, key: temp.length + 1}]})
    this.slider.slickNext()
  }

  handleCard (obj) {
    var temp = this.state.broadcast
    console.log('Handle Card Object Receeived', obj)
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data.image_url = obj.image_url
        data.title = obj.title
        data.buttons = obj.buttons
        data.subtitle = obj.description
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push({id: obj.id, title: obj.title, image_url: obj.fileurl, subtitle: obj.description, buttons: obj.buttons})
    }
    this.setState({broadcast: temp})
    this.props.handleGallery({id: this.props.id, componentType: 'gallery', cards: JSON.parse(JSON.stringify(this.state.broadcast))})
  }

  render () {
    console.log('Gallary State', this.state)
     var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    var settings = {
      arrows: true,
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <RightArrow />,
      prevArrow: <LeftArrow />,
      afterChange: this.handleChange
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{position: 'absolute', right: '-10px', top: '-5px', zIndex: 6, marginTop: '-5px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>


        {
          <div onClick={this.addSlide} style={{position: 'absolute', float: 'left', zIndex: '2', marginTop: '-10px'}}>
            <span className="m-badge m-badge--brand m-badge--wide" style={{cursor: 'pointer', marginRight: '15px'}}>Add</span>
            <span className="m-badge m-badge--brand m-badge--wide" style={{cursor: 'pointer'}}>Page {this.state.pageNumber} x</span>
          </div>
        }

        
        <div>
          <Slider ref={(c) => { this.slider = c }} {...settings}>
            {
              this.state.cards.map((card, i) => (
                <div key={card.key}>{card.element}</div>
              ))
            }
          </Slider>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Gallery)
