import React from 'react'

import CarouselButton from './carouselButton'
import { isWebURL } from '../../utility/utils'

class LinkCarouselCard extends React.Component {
  constructor (props) {
    super(props)
    this.typingTimer = null
    this.doneTypingInterval = 500
    this.state = {
        link: this.props.card.link,
        linkValid: false,
        loading: false,
        errorMsg: this.props.card.link ? '' : 'Required'
    }
    this.updateCard = this.updateCard.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
      if (nextProps.card.link) {
          this.setState({link: nextProps.card.link, errorMsg: '', linkValid: true})
      } else {
        this.setState({link: '', errorMsg: 'Required', linkValid: false})
      }
  }

  updateCard (data, callback) {
    this.props.updateCard(this.props.index, {...this.props.card, ...data}, callback)
  }

  handleUrlMetaData(data) {
    console.log('url meta data retrieved', data)
    if (!data || !data.ogTitle) {
        let errorMsg = ''
        if (!data) {
            errorMsg = 'Invalid or private website link'
        } else if (!data.ogTitle) {
            errorMsg = 'Not enough metadata present in link'
        }
        const card = {
            title: '',
            subtitle: '',
            image_url: '',
            default_action: undefined,
            link: ''
        }
        this.setState({ linkValid: false, errorMsg, loading: false }, () => {
            this.updateCard(card)
        })
    } else {
        let title = data.ogTitle.length > 80 ? data.ogTitle.substring(0, 80) + '...' : data.ogTitle
        let subtitle = ''
        let image_url = data.ogImage && data.ogImage.url ? data.ogImage.url : ''
        if (data.ogDescription) {
            subtitle = data.ogDescription.length > 80 ? data.ogDescription.substring(0, 80) + '...' : data.ogDescription
        }
        if (image_url && image_url.startsWith('/')) {
            image_url = this.state.link + image_url
        }
        const card = {
            title,
            subtitle,
            image_url,
            default_action: {
                type: 'web_url',
                url: this.state.link
            },
            link: this.state.link
        }
        this.setState({ linkValid: true, loading: false, errorMsg: '' }, () => {
            this.updateCard(card)
        })
    }
  }

  handleLinkChange(e) {
    console.log('changing link', e.target.value)
    const link = e.target.value
    let linkValid = false
    let loading = false
    let errorMsg = ''
    if (this.validateURL(link)) {
        loading = true
        linkValid = true
    } else {
        loading = false
        linkValid = false
        errorMsg = 'Please enter a valid website link'
    }
    this.setState({ link, loading, linkValid, errorMsg}, () => {
        if (this.state.linkValid) {
            clearTimeout(this.typingTimer)
            this.typingTimer = setTimeout(
                () => this.props.urlMetaData(link, 
                    (data) => this.handleUrlMetaData(data), 
                    (err) => this.handleUrlMetaData(null)), 
                this.doneTypingInterval
            )
        } else {
            const card = {
                title: '',
                subtitle: '',
                image_url: '',
                default_action: undefined,
                link: ''
            }
            this.updateCard(card)
        }
    })
}

validateURL(textval) {
    if (this.props.validateUrl) {
        return this.props.validateUrl(textval)
    } else {
        return isWebURL(textval)
    }
}

  render () {
    return (
      <div>
        <div className='ui-block' style={{padding: '5px'}}>
             <div className='row'>
                <div className='col-2'>
                    <div style={{marginTop: '5px', position: 'relative', textAlign: 'left'}}>
                    Link:
                    </div>
                </div>
                <div className='col-10'>
                    <input value={this.state.link} style={{ maxWidth: '100%', borderColor: !this.state.linkValid && !this.state.loading ? 'red' : (this.state.loading || this.state.linkValid) ? 'green' : '' }} onChange={(e) => this.handleLinkChange(e)} className='form-control' />
                    <div style={{ color: 'green', textAlign: 'left' }}>{this.state.linkValid && !this.state.loading ? this.props.validMsg ? `*${this.props.validMsg}` : '*Link is valid.' : ''}</div>
                    <div style={{ color: 'red', textAlign: 'left' }}>{!this.state.linkValid && !this.state.loading  ? `*${this.state.errorMsg}` : ''}</div>
                    <div style={{ color: 'green', textAlign: 'left' }}>{this.state.loading ? '*Retrieving webpage meta data.' : ''}</div>
                </div>   
            </div>
            <CarouselButton
              id={this.props.id}
              button={this.props.card.buttons[0]}
              alertMsg={this.props.alertMsg}
              blocks={this.props.blocks}
              cardIndex={this.props.index}
              updateButtonOption={this.props.updateButtonOption}
              buttonOption={this.props.card.buttonOption}
            />
        </div>
      </div>
    )
  }
}

export default LinkCarouselCard
