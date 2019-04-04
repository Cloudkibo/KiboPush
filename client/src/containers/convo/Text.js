/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'
import EditButton from './EditButton'
import { Popover, PopoverBody } from 'reactstrap'

// const styles = {
//   iconclass: {
//     height: 24,
//     padding: '0 15px',
//     width: 24,
//     position: 'relative',
//     display: 'inline-block',
//     cursor: 'pointer'
//   },
//   inputf: {
//     display: 'none'
//   }
// }

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
        <div style={{marginBottom: '-14px'}}>
          <textarea value={this.state.text} className='hoverbordersolid form-control m-input' onChange={this.handleChange} rows='4' style={{maxHeight: 100, width: 100 + '%'}} placeholder='Enter your text...' />
          {
              /*
          <div ref={(c) => { this.target = c }} style={{display: 'inline-block'}} data-tip='emoticons'>
            <i onClick={this.showEmojiPicker} style={styles.iconclass}>
              <i style={{
                fontSize: '20px',
                position: 'absolute',
                left: '0',
                width: '100%',
                height: '2em',
                margin: '5px',
                textAlign: 'center',
                color: '#787878'
              }} className='fa fa-smile-o' />
            </i>
          </div>
          <Popover
            style={{paddingBottom: '100px', width: '280px', height: '390px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
            placement='bottom'
            target={this.target}
            show={this.state.showEmojiPicker}
            onHide={this.closeEmojiPicker}
        >
               <div>
              <Picker
                style={{paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
                emojiSize={24}
                perLine={7}
                skin={1}
                set='facebook'
                custom={[]}
                autoFocus={false}
                showPreview={false}
                onClick={(emoji, event) => this.setEmoji(emoji)}
            />
            </div>
          </Popover>
          */}
        </div>

        {(this.state.buttons) ? this.state.buttons.map((obj, index) => {
          return <EditButton index={index} buttonActions={this.state.buttonActions} replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} button_id={this.props.id + '-' + index} data={{id: index, button: obj}} onEdit={this.editButton} onRemove={this.removeButton} />
        }) : ''}
        {this.props.removeState && this.state.buttons.length < 3
        ? <div>
          <Button buttonLimit={3} button_id={this.props.id} pageId={this.props.pageId} buttonActions={this.state.buttonActions} replyWithMessage={this.props.replyWithMessage} onAdd={this.addButton} styling={this.state.styling} />
        </div>
        : <div>
          {this.state.buttons.length < 1 &&
            <Button buttonLimit={3} button_id={this.props.id} pageId={this.props.pageId} buttonActions={this.state.buttonActions} replyWithMessage={this.props.replyWithMessage} onAdd={this.addButton} styling={this.state.styling} />
        }
        </div>
      }
        { (!this.props.hideUserOptions) &&
          <Popover placement='left' isOpen={this.state.showUserOptions} className='greetingPopover' target='userOptions' toggle={this.toggleUserOptions}>
            <PopoverBody>
              <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_first_name')}>First Name</div>
              <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_last_name')}>Last Name</div>
              <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_full_name')}>Full Name</div>
            </PopoverBody>
          </Popover>
        }

        { (!this.props.hideUserOptions) &&
        <div className='m-messenger__form-tools pull-right messengerTools' style={{backgroundColor: '#F1F0F0', marginTop: (-75 - (35 * (this.state.numOfButtons * 0.915))), marginRight: '5px'}}>
          <div id='userOptions' data-tip='options' style={{display: 'inline-block', float: 'left'}}>
            <i onClick={this.toggleUserOptions} style={{height: '24px',
              width: '24px',
              position: 'relative',
              display: 'inline-block',
              cursor: 'pointer'}}>
              <i className='greetingMessage fa fa-user' style={{fontSize: '20px',
                left: '0px',
                width: '100%',
                height: '2em',
                textAlign: 'center',
                color: 'rgb(120, 120, 120)'}} />
            </i>
          </div>
        </div>
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
