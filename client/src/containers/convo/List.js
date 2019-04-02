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
      cards: [{element: <Card pageId={this.props.pageId} replyWithMessage={this.props.replyWithMessage} pages={this.props.pages} buttonActions={this.props.buttonActions} id={1} button_id={props.id} handleCard={this.handleCard} removeElement={this.removeElement} topElementStyle={this.topElementStyle} topStyle='compact' />, key: 1}, {element: <Card id={2} pageId={this.props.pageId} pages={this.props.pages} replyWithMessage={this.props.replyWithMessage} buttonActions={this.props.buttonActions} button_id={props.id} handleCard={this.handleCard} removeElement={this.removeElement} topStyle='compact' topElementStyle={this.topElementStyle} />, key: 2}],
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
      let cardLength = this.props.cards.length
      if (cardLength < 2) {
        cardLength = 2
      }
      for (var k = 0; k < cardLength; k++) {
        if (this.props.cards[k] && this.props.cards[k].id === k + 1) {
          tmp.push({element: <Card pages={this.props.pages} pageId={this.props.pageId} replyWithMessage={this.props.replyWithMessage} id={k + 1} buttonActions={this.props.buttonActions} button_id={this.props.id} buttons={this.props.cards[k].buttons} cardDetails={this.props.cards[k]} handleCard={this.handleCard} topElementStyle={this.topElementStyle} removeElement={this.removeElement} topStyle={this.props.list.topElementStyle} />, key: k})
        } else {
          tmp.push({element: <Card id={k + 1} pageId={this.props.pageId} replyWithMessage={this.props.replyWithMessage} pages={this.props.pages} buttonActions={this.props.buttonActions} button_id={this.props.id} handleCard={this.handleCard} removeElement={this.removeElement} topStyle='compact' topElementStyle={this.topElementStyle} />, key: k})
        }
      }
      // for (var k = 0; k < this.props.cards.length; k++) {
      //   this.props.cards[k].id = k
      //   tmp.push({element: <Card pages={this.props.pages} pageId={this.props.pageId} id={k} buttonActions={this.props.buttonActions} button_id={this.props.id} buttons={this.props.cards[k].buttons} cardDetails={this.props.cards[k]} handleCard={this.handleCard} topElementStyle={this.topElementStyle} removeElement={this.removeElement} topStyle={this.props.list.topElementStyle} />, key: k})
      // }
      console.log('list is', this.props)
      this.setState({cards: tmp, broadcast: this.props.cards})
    }
    console.log('this.props componentDidMount List', this.props)
    if (this.props.list.topElementStyle && this.props.list.buttons) {
      this.setState({topElementStyle: this.props.list.topElementStyle, buttons: this.props.list.buttons})
    }
    if (this.props.listDetails && this.props.listDetails !== '') {
      console.log('this.props.listDetails', this.props.listDetails)
      var cards = this.props.listDetails.listItems
      var card = {}
      var temp = []
      var cardMessage = []
      for (var i = 0; i < cards.length; i++) {
        //  cards[i].id = i
        card = {element: <Card pageId={this.props.pageId} pages={this.props.pages} id={i + 1} buttonActions={this.props.buttonActions} button_id={this.props.id} handleCard={this.handleCard} cardDetails={cards[i]} removeElement={this.removeElement} topElementStyle={this.topElementStyle} topStyle={this.props.listDetails.topElementStyle} />, key: i}
        cardMessage.push(cards[i])
        temp.push(card)
      }
      this.setState({cards: temp, topElementStyle: this.props.listDetails.topElementStyle})
      this.setState({showPlus: true})
      this.setState({broadcast: cardMessage})
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
    this.setState({cards: [...temp, {element: <Card pageId={this.props.pageId} pages={this.props.pages} id={timeStamp} buttonActions={this.props.buttonActions} button_id={this.props.id} handleCard={this.handleCard} removeElement={this.removeElement} />, key: timeStamp}]})
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
        console.log('data modification in list')
        data.image_url = obj.image_url
        data.title = obj.title
        data.buttons = obj.buttons
        data.subtitle = obj.description
        if (obj.default_action && obj.default_action !== '') {
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
    console.log('json parsed temp in card', JSON.parse(JSON.stringify(temp)))
    let updatedList = {id: this.props.id, componentType: 'list', listItems: temp, buttons: this.state.buttons, topElementStyle: this.state.topElementStyle}
    this.props.handleList(updatedList)
    this.setState({broadcast: temp})
    // this.setState({broadcast: temp}, () => {
    //   console.log('listItems', JSON.parse(JSON.stringify(temp)))
    //   this.props.handleList({id: this.props.id, componentType: 'list', listItems: temp, buttons: this.state.buttons, topElementStyle: this.state.topElementStyle})
    // })
  }

  addElement () {
    let timeStamp = new Date().getTime()
    var temp = this.state.cards
    temp.push({element: <Card pageId={this.props.pageId} pages={this.props.pages} id={timeStamp} buttonActions={this.props.buttonActions} button_id={this.props.id} handleCard={this.handleCard} removeElement={this.removeElement} topElementStyle={this.topElementStyle} topStyle={this.state.topElementStyle} />, key: timeStamp})
    this.setState({cards: temp, pageNumber: temp.length})
    console.log('temp in addElement', temp)
  }

  removeElement (obj) {
    console.log('obj', obj)
    console.log('this.state.broadcast', this.state.broadcast)
    console.log('this.state.cards', this.state.cards)
    if (this.state.cards.length < 3) {
      this.msg.error('A List must have at least 2 complete elements')
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
    console.log('addButton listItems', JSON.parse(JSON.stringify(this.state.broadcast)))
    this.props.handleList({id: this.props.id, componentType: 'list', listItems: JSON.parse(JSON.stringify(this.state.broadcast)), buttons: temp, topElementStyle: this.state.topElementStyle})
  }
  editButton (obj) {
    console.log('in List the value of button is ', obj.button)
    var temp = this.state.buttons.map((elm, index) => {
      console.log('index', index)
      if (index === obj.id) {
        elm = obj.button
      }
      return elm
    })
    this.setState({buttons: temp})
    this.props.handleList({id: this.props.id, listItems: this.state.broadcast, componentType: 'list', cards: JSON.parse(JSON.stringify(this.state.broadcast)), buttons: temp, topElementStyle: this.state.topElementStyle})
  }
  removeButton (obj) {
    //  var temp = this.state.buttons.filter((elm, index) => { return index !== obj.id })
    this.setState({buttons: []})
    if (obj.button && obj.button.type === 'postback') {
      var deletePayload = obj.button.payload
    }
    this.props.handleList({id: this.props.id, componentType: 'list', listItems: JSON.parse(JSON.stringify(this.state.broadcast)), buttons: [], topElementStyle: this.state.topElementStyle, deletePayload: deletePayload})
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    let buttonPayloads = this.state.buttons.map((button) => button.payload)
    for (let i = 0; i < this.state.broadcast.length; i++) {
      for (let j = 0; j < this.state.broadcast[i].buttons.length; j++) {
        buttonPayloads.push(this.state.broadcast[i].buttons[j].payload)
      }
    }
    return (
      <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: buttonPayloads}) }} style={{float: 'right', height: 20 + 'px', zIndex: 6, right: this.props.sequence ? 0 + 'px' : '100px', marginTop: '-20px', marginRight: '-10px'}}>
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
              return <EditButton index={index} pageId={this.props.pageId} buttonActions={this.props.buttonActions} replyWithMessage={this.props.replyWithMessage} button_id={(this.props.button_id !== null ? this.props.button_id + '-' + this.props.id : this.props.id) + '-' + index} data={{id: index, button: obj}} onEdit={this.editButton} onRemove={this.removeButton} />
            })
          : <Button buttonLimit={1} buttonActions={this.props.buttonActions} replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} pages={this.props.pages} button_id={this.props.button_id !== null ? (this.props.button_id + '-' + this.props.id) : this.props.id} onAdd={this.addButton} styling={this.state.styling} />
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
