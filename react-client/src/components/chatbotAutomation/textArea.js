import React from 'react'
import PropTypes from 'prop-types'
import { Popover, PopoverBody} from 'reactstrap'
import { Picker } from 'emoji-mart'

class TextArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      text: props.text,
      showPopover: false,
      popoverOptions: {
        placement: 'left',
        target: '_picker_in_chatbot',
        content: (<div />)
      }
    }
    this.onTextChange = this.onTextChange.bind(this)
    this.togglePopover = this.togglePopover.bind(this)
    this.getPicker = this.getPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this.appendUserName = this.appendUserName.bind(this)
  }


  togglePopover () {
    this.setState({showPopover: !this.state.showPopover})
  }

  onTextChange (e) {
    if (e.target.value.length <= 2000) {
      let text = e.target.value
      this.setState({text})
      this.props.updateParentState({text})
    }
  }
  getPicker (type, popoverOptions) {
    switch (type) {
      case 'emoji':
        popoverOptions.content = (
          <Picker
            style={{paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
            emojiSize={24}
            perLine={6}
            skin={1}
            set='facebook'
            showPreview={false}
            showSkinTones={false}
            custom={[]}
            autoFocus={false}
            onClick={(emoji) => this.setEmoji(emoji)}
          />
        )
        break
      case 'user':
        popoverOptions.content = (
          <div>
            <span style={{cursor: 'pointer'}} onClick={() => this.appendUserName('first')}>First Name</span>
            <div className='m--space-10' />
            <span style={{cursor: 'pointer'}} onClick={() => this.appendUserName('last')}>Last Name</span>
            <div className='m--space-10' />
            <span style={{cursor: 'pointer'}} onClick={() => this.appendUserName('full')}>Full Name</span>
          </div>
        )
        break
      default:
    }
    this.setState({
      showPopover: true,
      popoverOptions
    })
  }

  setEmoji (emoji) {
    let text = `${this.state.text}${emoji.native}`
    this.setState({text})
    this.props.updateParentState({text})
  }

  openPicker (type) {
    const popoverOptions = {
      placement: 'left',
      target: `_${type}_picker_chatbot`
    }
    this.getPicker(type, popoverOptions)
  }

  appendUserName (nameType) {
    let text = `${this.state.text}{{user_${nameType}_name}}`
    this.setState({text})
    this.props.updateParentState({text})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.text) {
      this.setState({text: nextProps.text})
    } else {
      this.setState({text: ''})
    }
  }

  render () {
    return (
      <div id='_chatbot_message_area_text' className='row'>
        <div className='col-md-12'>
          <div style={{position: 'relative'}} className="form-group m-form__group">
            <span className='m--font-boldest'>{`${this.props.label}:`}</span>
            <textarea
              id='_chatbot_message_area_text_input'
              placeholder='Please type here...'
              rows='3'
              value={this.state.text}
              onChange={this.onTextChange}
              className='form-control'
              disabled={this.props.disabled}
            />
            <span style={{position: 'absolute', bottom: 0, right: '10px'}}>
              <i
                style={{fontSize: '20px', margin: '5px', cursor: 'pointer'}}
                className='fa fa-user'
                id='_user_picker_chatbot'
                onClick={() => {!this.props.disabled && this.openPicker('user')}}
              />
              <i
                style={{fontSize: '20px', margin: '5px', cursor: 'pointer'}}
                className='fa fa-smile-o'
                id='_emoji_picker_chatbot'
                onClick={() => {!this.props.disabled && this.openPicker('emoji')}}
              />
            </span>
          </div>
        </div>
        <div id='_picker_in_chatbot'>
          <Popover
            placement={this.state.popoverOptions.placement}
            isOpen={this.state.showPopover}
            className='chatPopover _popover_max_width_400'
            target={this.state.popoverOptions.target}
            toggle={this.togglePopover}
          >
            <PopoverBody>
              {this.state.popoverOptions.content}
            </PopoverBody>
          </Popover>
        </div>
      </div>
    )
  }
}

TextArea.defaultProps = {
  'label': 'Text',
  'disabled': false
}

TextArea.propTypes = {
  'text': PropTypes.string.isRequired,
  'updateParentState': PropTypes.func.isRequired,
  'label': PropTypes.string,
  'disabled': PropTypes.bool
}

export default TextArea
