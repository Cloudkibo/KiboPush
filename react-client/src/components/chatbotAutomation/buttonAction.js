import React from 'react'
import PropTypes from 'prop-types'
import { isWebURL } from '../../utility/utils'

class ButtonAction extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      title: props.title,
      url: props.url,
      invalidUrl: false,
      helpMessage: '',
      typingInterval: 1000
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onUrlChange = this.onUrlChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  componentDidMount () {
    let typingTimer
    let doneTypingInterval = this.state.typingInterval
    let input = document.getElementById(`_button_action_url_in_chatbot`)
    input.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(() => {
        if (isWebURL(this.state.url)) {
          this.setState({invalidUrl: false})
        } else {
          this.setState({
            helpMessage: 'Please provide a valid url',
            invalidUrl: true
          })
        }
      }, doneTypingInterval)
    })
    input.addEventListener('keydown', () => {clearTimeout(typingTimer)})
  }

  onTitleChange (e) {
    if (e.target.value.length <= 20) {
      this.setState({title: e.target.value})
    }
  }

  onUrlChange (e) {
    this.setState({url: e.target.value})
  }

  onSave () {
    if (!this.state.title) {
      this.props.alertMsg.error('Title cannot empty')
    } else if (!isWebURL(this.state.url)) {
      this.props.alertMsg.error('Please provide a valid url')
    } else {
      this.props.onSave({title: this.state.title, url: this.state.url})
    }
  }

  render () {
    return (
      <div>
        <i onClick={this.props.onCancel} style={{cursor: 'pointer'}} className='la la-close pull-right' />
        <div style={{padding: '10px', overflow: 'hidden'}}>
          <div className="form-group m-form__group">
            <span>Title:</span>
  					<input
              type="text"
              className="form-control m-input"
              placeholder="Enter title..."
              value={this.state.title}
              onChange={this.onTitleChange}
            />
          </div>
          <div className='m--space-10' />
          <div className="form-group m-form__group">
            <span>Url:</span>
  					<input
              type="text"
              id='_button_action_url_in_chatbot'
              className="form-control m-input"
              placeholder="Enter url..."
              value={this.state.url}
              onChange={this.onUrlChange}
            />
            {
              this.state.invalidUrl &&
              <span className='m-form__help m--font-danger'>
                {this.state.helpMessage}
              </span>
            }
          </div>
            {
              this.props.showRemove &&
              <button
                type='button'
                className='btn btn-danger btn-sm pull-left'
                onClick={this.props.onRemove}
              >
                Remove
              </button>
            }
            <button
              type='button'
              className='btn btn-primary btn-sm pull-right'
              onClick={this.onSave}
              disabled={!(this.state.title && this.state.url && !this.state.invalidUrl)}
            >
              Save
            </button>
          </div>
      </div>
    )
  }
}

ButtonAction.propTypes = {
  'title': PropTypes.string.isRequired,
  'url': PropTypes.string.isRequired,
  'onSave': PropTypes.func.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'onRemove': PropTypes.func.isRequired,
  'showRemove': PropTypes.bool.isRequired
}

export default ButtonAction
