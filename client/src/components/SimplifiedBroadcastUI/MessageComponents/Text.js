/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'
import EditButton from './EditButton'
import { Popover, PopoverBody } from 'reactstrap'

class Text extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleChange = this.handleChange.bind(this)
    this.addButton = this.addButton.bind(this)
    this.editButton = this.editButton.bind(this)
    this.removeButton = this.removeButton.bind(this)
    this.state = {
      buttons: props.buttons ? props.buttons : [],
      text: props.message ? props.message : '',
      showEmojiPicker: false,
      count: 0,
      showUserOptions: false,
      numOfButtons: 0,
      styling: {
        minHeight: 30, width: 100 + '%', marginLeft: 0 + 'px'
      },
      buttonActions: this.props.buttonActions.slice(0, 2)
    }
    this.showEmojiPicker = this.showEmojiPicker.bind(this)
    this.closeEmojiPicker = this.closeEmojiPicker.bind(this)
    this.getName = this.getName.bind(this)
    this.toggleUserOptions = this.toggleUserOptions.bind(this)
    this.showUserOptions = this.showUserOptions.bind(this)
  }
  componentDidMount () {
    if (this.props.message && this.props.message !== '') {
      this.setState({text: this.props.message})
    }
    if (this.props.buttons && this.props.buttons.length > 0) {
      if (this.state.buttons.length < 1) {
        this.setState({
          buttons: this.props.buttons
        })
      }
    }
  }
  toggleUserOptions () {
    this.setState({showUserOptions: !this.state.showUserOptions})
  }

  showUserOptions () {
    this.setState({showUserOptions: true})
  }

  showEmojiPicker () {
    this.setState({showEmojiPicker: true})
  }

  closeEmojiPicker () {
    this.setState({showEmojiPicker: false})
  }

  setEmoji (emoji) {
    this.setState({
      text: this.state.text + emoji.native

    })
  }

  getName (e, name) {
    var message = this.state.text + `{{${name}}}`
    var textCount = 160 - message.length
    if (textCount > 0) {
      this.props.handleText({id: this.props.id, text: message, buttons: this.state.buttons})
      this.setState({
        count: textCount,
        text: message,
        showUserOptions: false
      })
    } else {
      this.setState({showUserOptions: false})
    }
  }

  handleChange (event) {
    this.props.handleText({id: this.props.id, text: event.target.value, buttons: this.state.buttons})
    this.setState({text: event.target.value})
  }

  addButton (obj) {
    var temp = this.state.buttons
    temp.push(obj)

    this.setState({buttons: temp, count: 1, numOfButtons: ++this.state.numOfButtons})
    this.props.handleText({id: this.props.id, text: this.state.text, buttons: this.state.buttons})
  }
  editButton (obj) {
    var temp = this.state.buttons.map((elm, index) => {
      if (index === obj.id) {
        elm = obj.button
      }
      return elm
    })
    this.props.handleText({id: this.props.id, text: this.state.text, buttons: temp})
    this.setState({buttons: temp})
  }
  removeButton (obj) {
    this.state.buttons.map((elm, index) => {
      if (index === obj.id) {
        this.state.buttons.splice(index, 1)
      }
    })
    if (obj.button && obj.button.type === 'postback') {
      var deletePayload = obj.button.payload
    }
    var temp = this.state.buttons
    this.setState({buttons: temp, numOfButtons: --this.state.numOfButtons})
    this.props.handleText({id: this.props.id, text: this.state.text, buttons: temp, deletePayload: deletePayload})
  }

  render () {
    let textStyles
    if (this.props.removeState) {
      textStyles = {marginBottom: 70 + 'px'}
    } else {
      textStyles = {marginBottom: 70 + 'px', width: '60%'}
    }
    return (

      <div className='broadcast-component' style={textStyles}>
        {this.props.removeState &&
          <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: this.state.buttons.map((button) => button.payload)}) }} style={{ float: 'right', height: 20 + 'px' }}>
            <span style={{cursor: 'pointer'}} className='fa-stack'>
              <i className='fa fa-times fa-stack-2x' />
            </span>
          </div>
      }
        <section className='discussion'>
          <div className='bubble recipient' style={{marginRight: '120px', marginTop: '100px', fontSize: '20px'}}>{this.state.text}</div>
        </section>
        {
            this.state.buttons.map((button, index) => {
              if (button.visible) {
                return (
                  <section className='discussion'>
                    <div className='bubble recipient' style={{margin: 'auto', marginTop: '5px', fontSize: '18px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', wordBreak: 'break-all'}}>{button.title}</div>
                  </section>
                )
              }
            })
        }

      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Text)
