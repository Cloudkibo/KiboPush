import React from 'react'
import PropTypes from 'prop-types'
import LINK from '../sidePanel/link'
import {isWebURL} from '../../../utility/utils'

class OpenWebsite extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      link: {
        url: props.button.url,
        errorMsg: '',
        valid: false,
        loading: false
      }
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
        module: {
          type: 'broadcast',
          id: ''
        }
      }
      const editData = {
        id: this.props.button.id,
        type: 'web_url',
        oldUrl: this.props.button.newUrl,
        newUrl: url,
        title: this.props.button.title
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
    console.log('componentWillRecieveProps of open website side panel called ', nextProps)
    if (nextProps.button) {
      let link = this.state.link
      link.url = nextProps.button.url
      this.setState({link})
    }
  }

  render () {
    console.log('props in open website side panel', this.props)
    return (
      <div className='card'>
        <div className='card-header'>
          <span>
            Open a website
          </span>
          <span style={{cursor: 'pointer'}} class="pull-right">
            <i class="la la-close"></i>
          </span>
        </div>
        <div className='card-body'>
        <LINK
          link={this.state.link}
          index={0}
          retrieveMsg=''
          placeholder='Enter website link...'
          showRemove={false}
          handleUrlChange={this.handleUrlChange}
          typingInterval={500}
        />
        </div>
      </div>
    )
  }
}

OpenWebsite.propTypes = {
  'handleButton': PropTypes.func.isRequired,
  'button': PropTypes.object.isRequired
}

export default OpenWebsite
