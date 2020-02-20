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
        errorMsg: (props.button.url && props.button.errorMsg) ? props.button.errorMsg : '',
        valid: props.button.valid,
        loading: props.button.loading
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
      this.props.handleButton(addData, editData, callback)
    } else {
      const link = {
        url,
        errorMsg: 'Please enter a valid website link',
        valid: false,
        loading: false
      }
      callback(link)
      this.setState({link})
      this.props.button.url = url
      this.props.button.errorMsg = link.errorMsg
      this.props.button.valid = link.valid
      this.props.button.loading = link.loading
      this.props.updateButton(this.props.button, this.props.buttonIndex)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of open website side panel called ', nextProps)
    if (nextProps.button) {
      let link = {
        url: this.state.link.url,
        errorMsg: (this.state.link.url && nextProps.button.errorMsg) ? nextProps.button.errorMsg : '',
        valid: nextProps.button.valid,
        loading: nextProps.button.loading
      }
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
          <span onClick={() => {this.props.removeAction(this.props.index)}} style={{cursor: 'pointer'}} class="pull-right">
            <i className="la la-close"></i>
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
  'button': PropTypes.object.isRequired,
  'index': PropTypes.number.isRequired,
  'removeAction': PropTypes.func.isRequired,
  'updateButton': PropTypes.func.isRequired,
  'buttonIndex': PropTypes.number.isRequired
}

export default OpenWebsite
