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
        loading: false,
        errorMsg: ''
    }
    this.updateCard = this.updateCard.bind(this)
    this.validateURL = this.validateURL.bind(this)
    this.getErrorMsg = this.getErrorMsg.bind(this)
  }

  componentDidMount () {
    this.setState({errorMsg: this.getErrorMsg(this.props.card)})
  }

  getErrorMsg (card) {
    let errorMsg = ''
    if (card.link) {
        if (this.validateURL(card.link)) {
            if (!card.title) {
                errorMsg = 'Invalid or private website link'
            }
         } else {
            errorMsg = 'Please enter a valid website link'
         }
    } else {
        errorMsg = 'Please enter a valid website link'
    }
    return errorMsg
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
      if ((!this.state.link || this.props.index !== nextProps.index) && nextProps.card.link) {
        let errorMsg = this.getErrorMsg(nextProps.card)
        this.setState({link: nextProps.card.link, errorMsg})
      } else if (this.state.link && this.props.index !== nextProps.index && !nextProps.card.link) {
        this.setState({link: '', errorMsg: 'Please enter a valid website link'})
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
        this.setState({ errorMsg, loading: false }, () => {
            this.props.updateLoading(false)
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
        this.setState({ loading: false, errorMsg: '' }, () => {
            this.props.updateLoading(false)
            this.updateCard(card)
        })
    }
  }

  handleLinkChange(e) {
    console.log('changing link', e.target.value)
    const link = e.target.value
    let loading = false
    let errorMsg = ''
    if (this.validateURL(link)) {
        loading = true
        this.props.updateLoading(true)
    } else {
        errorMsg = 'Please enter a valid website link'
    }
    this.setState({ link, loading, errorMsg}, () => {
        if (!this.state.errorMsg) {
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
                link
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
                    <input value={this.state.link} style={{ maxWidth: '100%', borderColor: this.state.errorMsg && !this.state.loading ? 'red' : (this.state.loading && !this.state.errorMsg) ? 'green' : '' }} onChange={(e) => this.handleLinkChange(e)} className='form-control' />
                    <div style={{ color: 'green', textAlign: 'left' }}>{!this.state.errorMsg && !this.state.loading ? this.props.validMsg ? `*${this.props.validMsg}` : '*Link is valid.' : ''}</div>
                    <div style={{ color: 'red', textAlign: 'left' }}>{this.state.errorMsg && !this.state.loading  ? `*${this.state.errorMsg}` : ''}</div>
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
              messengerComponents={this.props.messengerComponents}
            />
        </div>
      </div>
    )
  }
}

export default LinkCarouselCard
