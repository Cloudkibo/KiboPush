import React from 'react'
import PropTypes from 'prop-types'
import {isWebURL} from '../../../utility/utils'
import LINK from './link'

const defaultImage = 'https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg'

class LinksCarousel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeLink: 1
    }
    this.addLink = this.addLink.bind(this)
    this.removeLink = this.removeLink.bind(this)
    this.updateLink = this.updateLink.bind(this)
    this.updateActiveLink = this.updateActiveLink.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.handleUrlMetaData = this.handleUrlMetaData.bind(this)
  }

  updateActiveLink (index) {
    let data = this.props.componentData
    data.activeCard = index
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
  }

  updateLink (index, value) {
    let data = this.props.componentData
    data.links[index].url = value
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
  }

  addLink () {
    this.props.componentData.cards.push({
        buttons: [],
        fileName: '',
        image_url: '',
        title: '',
        subtitle: ''
    })
    this.props.componentData.links.push({
      errorMsg: '',
      loading: false,
      url: '',
      valid: false
    })
    const data = this.props.componentData
    data.activeCard = this.props.componentData.links.length - 1
    this.setState({activeLink: data.cards.length})
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
  }

  removeLink (index) {
    const data = this.props.componentData
    if (data.activeCard >= index) {
      data.activeCard = data.activeCard === 0 ? data.activeCard : data.activeCard - 1
    }
    data.cards.splice(index, 1)
    data.links.splice(index, 1)
    this.setState({activeCard: data.cards.length})
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
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
        data.cards[index] ={
          title: metaData.ogTitle,
          subtitle: metaData.ogDescription,
          image_url: metaData.ogImage && metaData.ogImage.url ? metaData.ogImage.url : defaultImage,
          buttons: [{
            title: 'Open on Web',
            type: 'web_url',
            url: data.links[index].url
          }]
        }
      }
    } else {
      link = {
        errorMsg: 'Invalid website link',
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
    if (isWebURL(url)) {
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
        errorMsg: 'Please enter a valid website link'
      }
      data.cards[index] = {
        buttons: [],
        fileName: '',
        image_url: '',
        title: '',
        subtitle: ''
      }
      callback(data.links[index])
      this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of links carousel side panel called ', nextProps)
    // if (nextProps.componentData) {
    //   this.setState({text: nextProps.componentData.text})
    // }
  }

  render () {
    console.log('props in links carousel side panel', this.props)
    return (
      <div id='side_panel_link_carousel_component'>
        <div id='dynamic_height_sidepanel' style={{maxHeight: '500px', overflow: 'scroll'}}>
          {
            this.props.componentData.links.map((link, index) => (
              <LINK
                link={link}
                index={index}
                removeLink={this.removeLink}
                showRemove={this.props.componentData.links.length > 1 ? true : false}
                handleUrlChange={this.handleUrlChange}
                updateActiveLink={this.updateActiveLink}
              />
            ))
          }
        </div>
        {
          this.props.componentData.links.length < 10 &&
          <div style={{marginRight: '15px', marginBottom: '10px'}} className='card'>
            <button onClick={this.addLink} type="button" className="btn btn-secondary">
              + Add New Link
    				</button>
          </div>
        }
        <span>Note: The links will be converted and sent as a gallery</span>
      </div>
    )
  }
}

LinksCarousel.propTypes = {
  'updateBroadcastData': PropTypes.func.isRequired,
  'blockId': PropTypes.string.isRequired,
  'componentData': PropTypes.object.isRequired,
  'urlMetaData': PropTypes.func.isRequired
}

export default LinksCarousel
