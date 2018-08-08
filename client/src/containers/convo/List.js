/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Card from './CardList'
import Button from './Button'
import EditButton from './EditButton'
import AlertContainer from 'react-alert'

class List extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleChange = this.handleChange.bind(this)
    this.addSlide = this.addSlide.bind(this)
    this.removeSlide = this.removeSlide.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.addElement = this.addElement.bind(this)
    this.removeElement = this.removeElement.bind(this)
    this.removeButton = this.removeButton.bind(this)
    this.editButton = this.editButton.bind(this)
    this.addButton = this.addButton.bind(this)
    this.topElementStyle = this.topElementStyle.bind(this)
    this.state = {
      broadcast: [],
      cards: [{element: <Card id={1} button_id={props.id} handleCard={this.handleCard} removeElement={this.removeElement} topElementStyle={this.topElementStyle} topStyle='compact' />, key: 1}, {element: <Card id={2} button_id={props.id} handleCard={this.handleCard} removeElement={this.removeElement} topStyle='compact' topElementStyle={this.topElementStyle} />, key: 2}],
      showPlus: false,
      pageNumber: 2,
      buttons: [],
      topElementStyle: 'compact',
      styling: {minHeight: 30, maxWidth: 400}
    }
  }

  componentDidMount () {
    if (this.props.cards && this.props.cards.length > 0) {
      console.log('this.props.cards', this.props)
      var tmp = []
      for (var k = 0; k < this.props.cards.length; k++) {
        this.props.cards[k].id = k
        tmp.push({element: <Card id={k} button_id={this.props.id} buttons={this.props.cards[k].buttons} cardDetails={this.props.cards[k]} handleCard={this.handleCard} topElementStyle={this.topElementStyle} removeElement={this.removeElement} topStyle={this.props.list.topElementStyle} />, key: k})
      }
      console.log()
      this.setState({cards: tmp, broadcast: this.props.cards, topElementStyle: this.props.list.topElementStyle})
    }
    if (this.props.listDetails && this.props.listDetails !== '') {
      console.log('this.props.listDetails', this.props.listDetails)
      var cards = this.props.listDetails.listItems
      var card = {}
      var temp = []
      var cardMessage = []
      for (var i = 0; i < cards.length; i++) {
        //  cards[i].id = i
        card = {element: <Card id={i + 1} button_id={this.props.id} handleCard={this.handleCard} cardDetails={cards[i]} removeElement={this.removeElement} topElementStyle={this.topElementStyle} topStyle={this.props.listDetails.topElementStyle} />, key: i}
        cardMessage.push(cards[i])
        temp.push(card)
      }
      this.setState({cards: temp, topElementStyle: this.props.listDetails.topElementStyle})
      this.setState({showPlus: true})
      this.setState({broadcast: cardMessage})
    }
  }

  handleChange (index) {
    this.setState({pageNumber: index + 1})
    if (index === this.state.cards.length - 1) {
      this.setState({showPlus: true})
    } else {
      this.setState({showPlus: false})
    }
  }

  topElementStyle (value) {
    console.log('topElementStyle in', value)
    this.setState({topElementStyle: value})
    this.props.handleList({id: this.props.id, componentType: 'list', listItems: JSON.parse(JSON.stringify(this.state.broadcast)), buttons: this.state.buttons, topElementStyle: value})
  }

  removeSlide () {
    var temp = this.state.cards
    temp.splice(this.state.pageNumber - 1, 1)
    this.setState({cards: temp})
  }

  addSlide () {
    let timeStamp = new Date().getTime()
    if (this.state.cards.length >= 10) {
      return this.msg.error('You cant add more than 10 cards.')
    }
    var temp = this.state.cards
    this.setState({cards: [...temp, {element: <Card id={timeStamp} button_id={this.props.id} handleCard={this.handleCard} removeElement={this.removeElement} />, key: timeStamp}]})
    this.slider.slickNext()
  }

  handleCard (obj) {
    console.log('this.state.broadcast', this.state.broadcast)
    console.log('in card', obj)
    if (obj.error) {
      if (obj.error === 'invalid image') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
      }
      return
    }
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data.image_url = obj.image_url
        data.title = obj.title
        data.buttons = obj.buttons
        data.subtitle = obj.description
        if (obj.default_action) {
          data.default_action = obj.default_action
        } else if (data.default_action) {
          delete data.default_action
        }
        isPresent = true
      }
    })
    if (!isPresent) {
      if (obj.default_action) {
        temp.push({id: obj.id, title: obj.title, image_url: obj.image_url, subtitle: obj.description, buttons: obj.buttons, default_action: obj.default_action})
      } else {
        temp.push({id: obj.id, title: obj.title, image_url: obj.image_url, subtitle: obj.description, buttons: obj.buttons})
      }
    }
    console.log('temp in card', temp)
    this.setState({broadcast: temp})
    this.props.handleList({id: this.props.id, componentType: 'list', listItems: JSON.parse(JSON.stringify(temp)), buttons: this.state.buttons, topElementStyle: this.state.topElementStyle})
  }

  addElement () {
    let timeStamp = new Date().getTime()
    var temp = this.state.cards
    temp.push({element: <Card id={timeStamp} button_id={this.props.id} handleCard={this.handleCard} removeElement={this.removeElement} topElementStyle={this.topElementStyle} topStyle={this.state.topElementStyle} />, key: timeStamp})
    this.setState({cards: temp, pageNumber: temp.length})
    console.log('temp in addElement', temp)
  }

  removeElement (obj) {
    console.log('obj', obj)
    console.log('this.state.broadcast', this.state.broadcast)
    console.log('this.state.cards', this.state.cards)
    if (this.state.cards.length < 3) {
      this.msg.error('A List must have atleast 2 elements')
    } else {
      // var temp = this.state.cards.filter((elm, index) => {
      //   console.log('index', index)
      //   console.log('elm', elm)
      //   return index !== obj.id
      // })
      var temp = []
      var temp1 = []
      for (var i = 0; i < this.state.cards.length; i++) {
        if (obj.id !== this.state.cards[i].element.props.id) {
          temp1.push(this.state.cards[i])
          if (this.state.cards[i].element.props.cardDetails) {
            temp.push(this.state.cards[i].element.props.cardDetails)
          } else {
            for (var j = 0; j < this.state.broadcast.length; j++) {
              if (this.state.broadcast[j].id === this.state.cards[i].element.props.id) {
                temp.push(this.state.broadcast[i])
              }
            }
          }
        }
      }
      console.log('temp', temp)
      this.setState({cards: temp1, broadcast: temp})
      this.props.handleList({id: this.props.id, componentType: 'list', listItems: JSON.parse(JSON.stringify(temp)), buttons: this.state.buttons, topElementStyle: this.state.topElementStyle})
      // var temp = this.state.cards
      // temp.splice(this.state.pageNumber - 1, 1)
      //  this.props.handleList({id: this.props.id, componentType: 'list', listItems: JSON.parse(JSON.stringify(temp)), buttons: this.state.buttons, topElementStyle: this.state.topElementStyle})
    }
  //   this.props.handleCard({id: this.props.id,
  //     componentType: 'card',
  //     fileurl: this.state.fileurl,
  //     image_url: this.state.image_url,
  //     fileName: this.state.fileName,
  //     type: this.state.type,
  //     size: this.state.size,
  //     title: this.state.title,
  //     description: this.state.subtitle,
  //     buttons: this.state.button})
  }
  addButton (obj) {
    console.log('obj', obj)
    var temp = this.state.buttons
    temp.push(obj)
    this.setState({buttons: temp})
    this.props.handleList({id: this.props.id, componentType: 'list', listItems: JSON.parse(JSON.stringify(this.state.broadcast)), buttons: temp, topElementStyle: this.state.topElementStyle})
  }
  editButton (obj) {
    console.log('in List the value of title is ' + obj.button.title)
    var temp = this.state.buttons.map((elm, index) => {
      if (index === obj.id) {
        elm = obj.button
      }
      return elm
    })
    this.setState({buttons: temp})
    this.props.handleList({id: this.props.id, componentType: 'list', cards: JSON.parse(JSON.stringify(this.state.broadcast)), buttons: obj, topElementStyle: this.state.topElementStyle})
  }
  removeButton (obj) {
    //  var temp = this.state.buttons.filter((elm, index) => { return index !== obj.id })
    this.setState({buttons: []})
    this.props.handleList({id: this.props.id, componentType: 'list', listItems: JSON.parse(JSON.stringify(this.state.broadcast)), buttons: [], topElementStyle: this.state.topElementStyle})
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: 20 + 'px', zIndex: 6, right: this.props.sequence ? 0 + 'px' : '100px', marginTop: '-20px', marginRight: '-10px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
          {
            this.state.cards.map((card, i) => (
              <div key={card.key}>{card.element}</div>
            ))
          }
          { this.state.cards.length < 4 &&
          <div className='ui-block hoverborder' style={{minHeight: 30, maxWidth: 400}} onClick={this.addElement}>
            <div id={'buttonTarget-' + this.props.button_id} ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
              <h6> + Add Element </h6>
            </div>
            </div>
          }
          {this.state.buttons && this.state.buttons.length > 0
            ? this.state.buttons.map((obj, index) => {
              return <EditButton button_id={(this.props.button_id !== null ? this.props.button_id + '-' + this.props.id : this.props.id) + '-' + index} data={{id: index, button: obj}} onEdit={this.editButton} onRemove={this.removeButton} />
            })
          : <Button button_id={this.props.button_id !== null ? (this.props.button_id + '-' + this.props.id) : this.props.id} onAdd={this.addButton} styling={this.state.styling} />
        }
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
export default connect(mapStateToProps, mapDispatchToProps)(List)
