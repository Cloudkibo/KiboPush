import React from 'react'
import PropTypes from 'prop-types'
import { isWebURL, isWebViewUrl } from '../../utility/utils'

class ButtonAction extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      title: props.title,
      url: props.url,
      invalidUrl: false,
      helpMessage: '',
      typingInterval: 1000,
      webview: {
        openWebview: props.webview,
        height: props.webviewHeight || 'full',
        invalidUrl: false,
        helpMessage: ''
      },
      manageWhitelistedDomains: false
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onUrlChange = this.onUrlChange.bind(this)
    this.onSave = this.onSave.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.handleWhitelistedDomain = this.handleWhitelistedDomain.bind(this)
    this.handleWebviewHeight = this.handleWebviewHeight.bind(this)
    this.openWhitelistModal = this.openWhitelistModal.bind(this)
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
    this.setState({
      url: e.target.value,
      invalidUrl: false,
      helpMessage: '',
      webview: {
        ...this.state.webview,
        invalidUrl: false,
        helpMessage: ''
      },
      manageWhitelistedDomains: false
    })
  }

  onSave () {
    if (!this.state.title) {
      this.props.alertMsg.error('Title cannot empty')
    } else if (!isWebURL(this.state.url)) {
      this.props.alertMsg.error('Please provide a valid url')
    } else if (this.state.webview.openWebview && !isWebViewUrl(this.state.url)) {
      this.setState({
        webview: {
          ...this.state.webview,
          invalidUrl: true,
          helpMessage: 'Webview url must include a protocol identifier e.g.(https://)'
        }
      })
    } else {
      if (this.state.webview.openWebview) {
        this.props.checkWhitelistedDomains({pageId: this.props.chatbot.pageFbId, domain: this.state.url}, this.handleWhitelistedDomain)
      } else {
        this.props.onSave({title: this.state.title, url: this.state.url})
      }
    }
  }

  handleCheckbox (e) {
    this.setState({
      webview: {
        ...this.state.webview,
        openWebview: e.target.checked
      },
    })
  }

  handleWhitelistedDomain (res) {
    console.log('handleWhitelistedDomain', res)
    if (res.status === 'success' && res.payload) {
      this.props.onSave({
        title: this.state.title,
        url: this.state.url,
        webview_height_ratio: this.state.webview.height,
        messenger_extensions: true
      })
    } else {
      this.setState({
        webview: {
          ...this.state.webview,
          invalidUrl: true,
          helpMessage: 'The given domain is not whitelisted. Domain needs to be whitelisted to open it inside webview.'
        },
        manageWhitelistedDomains: true
      })
    }
  }

  handleWebviewHeight (e) {
    this.setState({
      webview: {
        ...this.state.webview,
        height: e.target.value
      }
    })
  }

  openWhitelistModal () {
    this.props.toggleWhitelistModal()
    this.refs.whitelistDomains.click()
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
          <div className="form-group m-form__group">
            <label style={{fontWeight: 'normal'}} className="m-checkbox m-checkbox--brand">
  						<input
                type="checkbox"
                onChange={this.handleCheckbox}
                checked={this.state.webview.openWebview}
              />
  						Open in webview
  						<span />
  					</label>
            {
              this.state.webview.openWebview &&
              <div class="form-group m-form__group">
  							<span>
  								Webview Height:
  							</span>
                <select className="form-control m-input" value={this.state.webview.height} onChange={this.handleWebviewHeight}>
  								<option value='full'>
  									FULL
  								</option>
  								<option value='tall'>
  									TALL
  								</option>
  								<option value='compact'>
  									COMPACT
  								</option>
  							</select>
  						</div>
            }
            {
              this.state.webview.openWebview && this.state.webview.invalidUrl &&
              <span className='m-form__help m--font-danger'>
                {this.state.webview.helpMessage}
              </span>
            }
            {
              this.state.manageWhitelistedDomains &&
              <div>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    margin: '10px 0px',
                    paddingLeft: '0px',
                    cursor: 'pointer'
                  }}
                  className="m-link m-btn m-btn--icon"
                  onClick={this.openWhitelistModal}
                >
                  <span>
                    <i className='la la-gear'/>
                    <span>Whitelist Domain?</span>
                  </span>
                </button>
              </div>
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
          <button
            ref='whitelistDomains'
            style={{display: 'none'}}
            data-toggle='modal'
            data-target='#_cb_whitelist_domains'
          />
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
  'showRemove': PropTypes.bool.isRequired,
  'chatbot': PropTypes.object.isRequired,
  'checkWhitelistedDomains': PropTypes.func.isRequired,
  'toggleWhitelistModal': PropTypes.func.isRequired
}

export default ButtonAction
