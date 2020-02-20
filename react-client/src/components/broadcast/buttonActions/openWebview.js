import React from 'react'
import PropTypes from 'prop-types'
import {isWebURL} from '../../../utility/utils'
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
      size: 'FULL'
    }
    this.handleUrlChange = this.handleUrlChange.bind(this)
  }

  handleUrlChange (url, index, callback) {
    if (isWebURL(url)) {
      this.setState({link: {url, errorMsg: 'Link is valid', valid: true, loading: false}})
      const addData = {
        type: 'web_url',
        url,
        title: this.props.button.title,
        messenger_extensions: true,
        webview_height_ratio: this.state.size,
        pageId: this.props.pageId
      }
      const editData = {
        id: this.props.button.id,
        type: 'web_url',
        url,
        title: this.props.button.title,
        messenger_extensions: true,
        webview_height_ratio: this.state.size,
        pageId: this.props.pageId
      }
      this.props.handleButton(addData, editData)
    } else {
      const link = {
        url,
        errorMsg: 'Please enter a valid website link',
        valid: false,
        loading: false
      }
      callback(link)
      this.setState({link})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of open webview side panel called ', nextProps)
    if (nextProps.button) {
      let link = this.state.link
      link.url = nextProps.button.url
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
          <span style={{cursor: 'pointer'}} class="pull-right">
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
            <select className='form-control m-input' value={this.state.size}>
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
  'button': PropTypes.object.isRequired
}

export default OpenWebview
