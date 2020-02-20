import React from 'react'
import PropTypes from 'prop-types'
import {isWebURL, isWebViewUrl, getHostName} from '../../../utility/utils'
import { Link } from 'react-router-dom'
import LINK from '../sidePanel/link'

class OpenWebview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      link: {
        url: props.button.url,
        errorMsg: '',
        valid: false,
        loading: false
      },
      size: props.button.webview_height_ratio ? props.button.webview_height_ratio : 'FULL'
    }
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.onSizeChange = this.onSizeChange.bind(this)
    this.modifyButton = this.modifyButton.bind(this)
  }

  onSizeChange (e) {
    this.props.button.webview_height_ratio = e.target.value
    this.props.button.errorMsg = this.state.link.errorMsg
    this.props.updateButton(this.props.button, this.props.buttonIndex)
    this.setState({size: e.target.value})
  }

  modifyButton (useCase, options) {
    switch (useCase) {
      case 'success':
        const addData = {
          type: 'web_url',
          url: options.url,
          title: this.props.button.title,
          messenger_extensions: true,
          webview_height_ratio: this.state.size,
          pageId: this.props.page.pageId
        }
        const editData = {
          id: this.props.button.id,
          type: 'web_url',
          url: options.url,
          title: this.props.button.title,
          messenger_extensions: true,
          webview_height_ratio: this.state.size,
          pageId: this.props.page.pageId
        }
        const linkSuccess = {
          url: options.url,
          errorMsg: 'Link is valid',
          valid: true,
          loading: false
        }
        this.setState({link: linkSuccess})
        this.props.handleButton(addData, editData, options.callback)
        break
      case 'error':
        const link = {
          url: options.url,
          errorMsg: options.message,
          valid: false,
          loading: false
        }
        options.callback(link)
        this.setState({link})
        this.props.button.url = link.url
        this.props.button.errorMsg = link.errorMsg
        this.props.button.valid = link.valid
        this.props.button.loading = link.loading
        this.props.updateButton(this.props.button, this.props.buttonIndex)
        break
      default:
    }
  }

  handleUrlChange (url, index, callback) {
    if (isWebURL(url)) {
      if (isWebViewUrl(url)) {
        const whitelistedDomains = this.props.whitelistedDomains.map((url) => getHostName(url))
        if (whitelistedDomains.indexOf(getHostName(url)) > -1) {
          this.setState({link: {url, errorMsg: 'Link is valid', valid: true, loading: false}})
          this.modifyButton('success', {url, callback})
        } else {
          this.modifyButton(
            'error',
            {
              url,
              callback,
              message: 'The given domain is not whitelisted. Please add it to whitelisted domains.'
            }
          )
        }
      } else {
        this.modifyButton(
          'error',
          {
            url,
            callback,
            message: 'Webview must include a protocol identifier e.g.(https://)'
          }
        )
      }
    } else {
      this.modifyButton(
        'error',
        {
          url,
          callback,
          message: 'Please enter a valid website link'
        }
      )
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of open webview side panel called ', nextProps)
    if (nextProps.button) {
      let link = {
        url: this.state.link.url,
        errorMsg: nextProps.button.errorMsg ? nextProps.button.errorMsg : '',
        valid: nextProps.button.valid,
        loading: nextProps.button.loading
      }
      this.setState({link, size: nextProps.button.webview_height_ratio})
    }
  }

  render () {
    console.log('props in open webview side panel', this.props)
    return (
      <div className='card'>
        <div className='card-header'>
          <span>
            Open a webview
          </span>
          <span onClick={() => {this.props.removeAction(this.props.index)}} style={{cursor: 'pointer'}} class="pull-right">
            <i class="la la-close"></i>
          </span>
        </div>
        <div className='card-body'>
          <div style={{fontSize: 'small'}}>
            Need help in understanding webview? click <a href='https://kibopush.com/webview/' target='_blank' rel='noopener noreferrer'>here.</a>
          </div>
          <div>
            <Link to='/settings' state={{tab: 'whitelistDomains'}} style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}}>Whitelist url domains to open in-app browser</Link>
          </div>
          <LINK
            link={this.state.link}
            index={0}
            retrieveMsg=''
            placeholder='Enter website link...'
            showRemove={false}
            handleUrlChange={this.handleUrlChange}
            typingInterval={500}
          />
          <div className='form-group m-form__group'>
            <span>Webview Size</span>
            <select className='form-control m-input' value={this.state.size} onChange={this.onSizeChange}>
              <option value='FULL'>FULL</option>
              <option value='COMPACT'>COMPACT</option>
              <option value='TALL'>TALL</option>
            </select>
          </div>
        </div>
      </div>
    )
  }
}

OpenWebview.propTypes = {
  'handleButton': PropTypes.func.isRequired,
  'button': PropTypes.object.isRequired,
  'index': PropTypes.number.isRequired,
  'removeAction': PropTypes.func.isRequired,
  'updateButton': PropTypes.func.isRequired,
  'buttonIndex': PropTypes.number.isRequired
}

export default OpenWebview
