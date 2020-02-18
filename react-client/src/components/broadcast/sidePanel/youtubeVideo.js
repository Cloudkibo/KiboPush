import React from 'react'
import PropTypes from 'prop-types'
import {validateYoutubeURL} from '../../../utility/utils'
import LINK from './link'

const defaultImage = 'https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg'

class YouTubeVideo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeLink: 1
    }
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.handleUrlMetaData = this.handleUrlMetaData.bind(this)
  }

  handleUrlMetaData (metaData, index, callback) {
    console.log('metadata found', metaData)
    const data = this.props.componentData
    let link = {}
    if (metaData) {
      if (!(metaData.ogTitle && metaData.ogDescription)) {
        link = {
          errorMsg: 'Not enough meta data present in the link',
          loading: false,
          valid: false
        }
      } else {
        if (metaData.ogImage && metaData.ogImage.url && metaData.ogImage.url.startsWith('/')) {
          metaData.ogImage.url = data.links[index].url + metaData.ogImage.url
        }
        link = {
          errorMsg: 'Link is valid',
          loading: false,
          valid: true
        }
        data.title = metaData.ogTitle
        data.description = metaData.ogDescription
        data.image_url = metaData.ogImage && metaData.ogImage.url ? metaData.ogImage.url : defaultImage
        data.buttons = [{
          title: 'Watch on YouTube',
          type: 'web_url',
          url: data.links[index].url
        }]
      }
    } else {
      link = {
        errorMsg: 'Invalid YouTubeVideo link',
        loading: false,
        valid: false
      }
    }
    link.url = data.links[index].url
    data.links[index] = link
    callback(data.links[index])
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
  }

  handleUrlChange (url, index, callback) {
    const data = this.props.componentData
    if (validateYoutubeURL(url)) {
      data.links[index] = {
        url,
        valid: true,
        loading: true,
        errorMsg: ''
      }
      this.props.urlMetaData(url, (metaData) => this.handleUrlMetaData(metaData, index, callback))
    } else {
      data.links[index] = {
        url,
        valid: false,
        loading: false,
        errorMsg: url ? 'Please enter a valid YouTube video link' : ''
      }
      data.buttons = []
      data.fileName = ''
      data.image_url = ''
      data.title = ''
      data.description = ''
      callback(data.links[index])
      this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of YouTube video side panel called ', nextProps)
    // if (nextProps.componentData) {
    //   this.setState({text: nextProps.componentData.text})
    // }
  }

  render () {
    console.log('props in YouTube video side panel', this.props)
    return (
      <div id='side_panel_link_carousel_component'>
        <LINK
          link={this.props.componentData.links[0]}
          index={0}
          retrieveMsg='Retrieving YouTube video meta data'
          placeholder='Enter YouTube video link...'
          showRemove={this.props.componentData.links.length > 1 ? true : false}
          handleUrlChange={this.handleUrlChange}
          updateActiveLink={this.updateActiveLink}
        />
        <span>Note: The link will be converted and sent as a card</span>
      </div>
    )
  }
}

YouTubeVideo.propTypes = {
  'updateBroadcastData': PropTypes.func.isRequired,
  'blockId': PropTypes.number.isRequired,
  'componentData': PropTypes.object.isRequired,
  'urlMetaData': PropTypes.func.isRequired
}

export default YouTubeVideo
