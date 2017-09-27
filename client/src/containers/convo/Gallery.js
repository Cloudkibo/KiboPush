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

class Gallery extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      broadcast: [],
      cards: [{element: <Card id={1} handleCard={this.handleCard} />, key: 1}, {element: <Card  id={2} handleCard={this.handleCard} />, key: 2}],
      showPlus: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.addSlide = this.addSlide.bind(this)
    this.handleCard = this.handleCard.bind(this)
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
    if (index === this.state.cards.length - 1) {
      this.setState({showPlus: true})
    } else {
      this.setState({showPlus: false})
    }
  }

  addSlide () {
    var temp = this.state.cards
    this.setState({cards: [...temp, {element: <Card id={temp.length + 1} handleCard={this.handleCard} />, key: temp.length + 1}]})
    this.slider.slickNext()
  }

    handleCard (obj) {
      var temp = this.state.broadcast
      var isPresent = false
      temp.map((data) => {
        if (data.id === obj.id) {
          data.fileName = obj.fileName
          data.fileurl = obj.fileurl
          data.size = obj.size
          data.type = obj.type
          data.title = obj.title
          data.buttons = obj.buttons
          data.description = obj.description
          isPresent = true
        }
      })
      if (!isPresent) {
        temp.push(obj)
      }
      this.setState({broadcast: temp})
  }

  render () {

    console.log("Gallary Array", this.state.broadcast)

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
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{position: 'absolute', right: '-10px', top: '-5px', zIndex: 6, marginTop: '-5px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i style={{color: '#ccc'}} className='fa fa-circle fa-stack-2x' />
            <i className='fa fa-times fa-stack-1x fa-inverse' />
          </span>
        </div>

        {
          this.state.showPlus &&
          <div onClick={this.addSlide} style={{position: 'absolute', float: 'left', top: '-5px', left: '-10px', zIndex: '2', marginTop: '-5px'}}>
            <span style={{cursor: 'pointer'}} className='fa-stack'>
              <i style={{color: '#ccc'}} className='fa fa-circle fa-stack-2x' />
              <i className='fa fa-plus fa-stack-1x fa-inverse' />
            </span>
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
