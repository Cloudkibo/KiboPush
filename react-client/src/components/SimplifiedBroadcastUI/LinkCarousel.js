/* eslint-disable no-undef */
import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { urlMetaData } from '../../redux/actions/convos.actions'
import {isWebURL} from '../../utility/utils'

class LinkCarouselModal extends React.Component {
    constructor(props) {
        super(props)
        this.elementLimit = props.elementLimit ? props.elementLimit : 10
        this.defaultErrorMsg = props.defaultErrorMsg ? props.defaultErrorMsg : 'Please enter a valid website link'
        this.buttonLimit = 3
        this.defaultImage = 'https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg'
        let cards = []
        for (let i = 0; i < this.elementLimit; i++) {
            if (props.cards && props.cards[i]) {
                cards.push({ component: props.cards[i], disabled: false, id: i + 1 })
            } else {
                if (i === 0) {
                    cards.push({
                        disabled: true,
                        id: i + 1,
                        component: {
                            title: '',
                            subtitle: '',
                            buttons: [],
                            default_action: ''
                        }
                    })
                }
            }
        }
        this.cardComponents = new Array(10)
        this.state = {
            cards,
            seeMoreLink: {
                link: this.props.seeMoreLink ? this.props.seeMoreLink : "kibopush.com",
                valid: true,
                validating: false
            },
            links: props.links && props.links.length > 0 ? props.links : [{ valid: false, url: '', loading: false, errorMsg: this.defaultErrorMsg }],
            selectedIndex: 0,
            currentCollapsed: false,
            disabled: props.edit ? false : true,
            buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview'],
            buttonDisabled: false,
            actionDisabled: false,
            numOfElements: cards.length
        }

        this.carouselIndicatorStyle = {
            textIndent: '0',
            margin: '0 2px',
            width: '20px',
            height: '20px',
            border: 'none',
            borderRadius: '100%',
            lineHeight: '20px',
            color: '#fff',
            backgroundColor: '#999',
            transition: 'all 0.25s ease'
        }
        this.carouselIndicatorActiveStyle = {
            width: '25px',
            height: '25px',
            lineHeight: '25px',
            backgroundColor: '#337ab7'
        }
        console.log('LinkCarousel state in constructor', this.state)
        console.log('LinkCarousel props in constructor', this.props)
        this.closeModal = this.closeModal.bind(this)
        this.toggleHover = this.toggleHover.bind(this)
        this.updateSelectedIndex = this.updateSelectedIndex.bind(this)
        this.scrollToTop = this.scrollToTop.bind(this)
        this.handleLinkChange = this.handleLinkChange.bind(this)
        this.handleUrlMetaData = this.handleUrlMetaData.bind(this)
        this.addLink = this.addLink.bind(this)
        this.removeLink = this.removeLink.bind(this)
        this.valid = this.valid.bind(this)
        this.handleSeeMoreLinkChange = this.handleSeeMoreLinkChange.bind(this)
        this.getHostName = this.getHostName.bind(this)
        this.typingTimer = null
        this.doneTypingInterval = 500
    }

    getHostName (url) {
       return url.replace('HTTP://','').replace('HTTPS://','').replace('WWW.','').split(/[/?#]/)[0];
    }

    valid() {
        let links = this.state.links
        if (!this.state.seeMoreLink.valid) {
          return false
        }
        for (let i = 0; i < links.length; i++) {
            if (!links[i].valid || links[i].loading) {
                return false
            }
        }
        return true
    }

    removeLink(index) {
        let links = this.state.links
        let cards = this.state.cards
        let selectedIndex = this.state.selectedIndex
        if (links.length > 1) {
            links.splice(index, 1)
            if (this.props.module === 'commentcapture' && links.length <= 1 && cards.length > 1) {
              cards.splice(cards.length-1)
            }
            if (cards[index]) {
                cards.splice(index, 1)
            }
            if (selectedIndex === 0 && links.length > 1) {
                selectedIndex = 1
            } else {
                selectedIndex = index - 1
            }
            this.setState({ links, cards, selectedIndex })
        }
    }


    addLink() {
        let links = this.state.links
        let cards = this.state.cards
        if (links.length < this.elementLimit) {
          links.push({ url: '', valid: false, loading: false, errorMsg: this.defaultErrorMsg })
          cards.push({
              disabled: true,
              id: links.length,
              component: {
                  title: '',
                  subtitle: '',
                  buttons: [],
                  default_action: ''
              }
          })
          if (this.props.module === 'commentcapture' && links.length > 1) {
            if (cards.length === links.length) {
              cards.push({
                disabled: false,
                id: links.length + 1,
                component: {
                    image_url: this.props.connectedPages.find(p => p._id === this.props.pages[0]).pagePic,
                    title: `See more at ${this.getHostName(this.state.seeMoreLink.link.toUpperCase())}`,
                    subtitle: '',
                    buttons: []
                }
              })
            } else {
              let lastCard = cards[cards.length - 2]
              cards.splice(cards.length - 2, 1)
              lastCard.id = links.length + 1
              cards.push(lastCard)
            }
          }
          this.setState({ links, cards })
        }
    }

    toggleHover(index, hover) {
        this.setState({ hover: hover ? index : -1 })
    }

    componentDidMount() {
        //Improve Later
        let that = this
        $('#carouselExampleControls').on('slide.bs.carousel', function (e) {
            var active = $(e.target).find('.carousel-inner > .carousel-item.active');
            var from = active.index();
            var next = $(e.relatedTarget);
            var to = next.index();
            console.log(from + ' => ' + to);
            that.setState({ selectedIndex: to })
        })
    }

    addComponent() {
        console.log('addComponent this.state.cards', this.state.cards)
        if (this.state.cards.length === 1) {
            let card = this.state.cards[0].component
            this.props.addComponent({
                id: this.props.id,
                componentName:  this.props.componentName ? this.props.componentName : 'links carousel',
                elementLimit:this.props.elementLimit,
                header:this.props.header,
                defaultErrorMsg:this.props.defaultErrorMsg,
                invalidMsg:this.props.invalidMsg,
                validMsg:this.props.validMsg,
                retrievingMsg:this.props.retrievingMsg,
                buttonTitle:this.props.buttonTitle,
                validateUrl:this.props.validateUrl,
                links: this.state.links,
                componentType: 'card',
                image_url: card.image_url ? card.image_url : '',
                title: card.title,
                description: card.subtitle,
                buttons: card.buttons,
                default_action: card.default_action
            }, this.props.edit)
        } else if (this.state.cards.length > 1) {
            let cards = this.state.cards.map((card, index) => {
                return {
                    id: card.id ? card.id : '',
                    image_url: card.component.image_url ? card.component.image_url : '',
                    title: card.component.title,
                    subtitle: card.component.subtitle ? card.component.subtitle : card.component.description,
                    buttons: card.component.buttons,
                    default_action: card.component.default_action
                }
            })
            this.props.addComponent({
                id: this.props.id,
                componentName: this.props.componentName ? this.props.componentName : 'links carousel',
                elementLimit:this.props.elementLimit,
                header:this.props.header,
                defaultErrorMsg:this.props.defaultErrorMsg,
                invalidMsg:this.props.invalidMsg,
                validMsg:this.props.validMsg,
                retrievingMsg:this.props.retrievingMsg,
                buttonTitle:this.props.buttonTitle,
                validateUrl:this.props.validateUrl,
                links: this.state.links,
                componentType: 'gallery',
                //componentName: 'links carousel',
                cards
            }, this.props.edit)
        }
    }


    closeModal () {
        if (!this.state.edited) {
            this.props.closeModal()
        } else {
            this.props.showCloseModalAlertDialog()
        }
    }

    scrollToTop(elementId) {
        document.getElementById(elementId).scrollIntoView({ behavior: 'smooth' })
    }

    updateSelectedIndex(index) {
        this.setState({ selectedIndex: index })
    }

    handleUrlMetaData(data, index) {
        console.log('url meta data retrieved', data)
        let links = this.state.links
        let cards = this.state.cards
        if (!data || !data.ogTitle) {
            let errorMsg = ''
            if (!data) {
                errorMsg = this.props.invalidMsg ? this.props.invalidMsg : 'Invalid website link'
            } else if (!data.ogTitle) {
                errorMsg = 'Not enough metadata present in link'
            }
            links[index] = Object.assign(links[index], { loading: false, valid: false, errorMsg })
            cards[index] = {
                disabled: true,
                id: index + 1,
                component: {
                    title: '',
                    subtitle: '',
                    buttons: [],
                    default_action: ''
                }
            }
            this.setState({ links, cards })
        } else {
            let description
            if (data.ogDescription) {
              description = data.ogDescription.length > 80 ? data.ogDescription.substring(0, 80) + '...' : data.ogDescription
            } else {
              description = this.props.connectedPages.filter(page => page.pageId === this.props.pageId)[0].pageName
            }
            if (data.ogImage && data.ogImage.url && data.ogImage.url.startsWith('/')) {
                data.ogImage.url = links[index].url + data.ogImage.url
            }
            cards[index] = {
                id: index + 1,
                component: {
                    title: data.ogTitle.length > 80 ? data.ogTitle.substring(0, 80) + '...' : data.ogTitle,
                    subtitle: description,
                    image_url: data.ogImage && data.ogImage.url ? data.ogImage.url : this.defaultImage,
                    buttons: this.props.hideWebUrl ? [] :[
                        {
                            title: this.props.buttonTitle ? this.props.buttonTitle : 'Open on web',
                            type: 'web_url',
                            url: links[index].url
                        }
                    ],
                    default_action: {
                        type: 'web_url',
                        url: links[index].url
                    }
                }
            }
            links[index] = Object.assign(links[index], { loading: false, valid: true, errorMsg: '' })
            this.setState({ links, cards, selectedIndex: index })
        }
    }
    
    handleSeeMoreLinkChange (e) {
      let cards = this.state.cards
      cards[cards.length - 1].component.title = `See more at ${this.getHostName(e.target.value.toUpperCase())}`
      this.setState({
          cards,
          seeMoreLink: {
              validating: this.validateURL(e.target.value), 
              valid: false,
              link: e.target.value
          }
      }, () => {
        if (this.state.seeMoreLink.validating) {
          clearTimeout(this.typingTimer)
          this.typingTimer = setTimeout(() => this.props.urlMetaData(this.state.seeMoreLink.link, (data) => {
            let seeMoreLink = this.state.seeMoreLink
            seeMoreLink.validating = false
            if (!data || !data.ogTitle) {
              seeMoreLink.valid = false
            } else {
              seeMoreLink.valid = true
            }
            this.setState({seeMoreLink})
          }), this.doneTypingInterval)
        }
      })
    }

    handleLinkChange(e, index) {
        console.log('changing link', e.target.value)
        let link = e.target.value
        let links = this.state.links
        let cards = this.state.cards
        if (this.state.links.length <= this.elementLimit) {
            if (this.validateURL(link)) {
                links[index] = { url: link, valid: true, loading: true, errorMsg: '' }
            } else {
                cards[index] = {
                    disabled: true,
                    id: index + 1,
                    component: {
                        title: '',
                        subtitle: '',
                        buttons: []
                    }
                }
                links[index] = { url: link, valid: false, loading: false, errorMsg: this.defaultErrorMsg }
            }
        }
        this.setState({ links, cards, edited: true }, () => {
            if (links[index].valid) {
                clearTimeout(this.typingTimer)
                this.typingTimer = setTimeout(() => this.props.urlMetaData(link, (data) => this.handleUrlMetaData(data, index)), this.doneTypingInterval)
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
            <div className="modal-content" style={{ width: '72vw' }}>
                <div style={{ display: 'block' }} className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        {this.props.header ? this.props.header : 'Create Carousel using Links'}
                    </h5>
                    <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" onClick={this.closeModal} aria-label="Close">
                        <span aria-hidden="true">
                            &times;
                        </span>
                    </button>
                </div>
                <div style={{ color: 'black' }} className="modal-body">
                  <div className='row'>
                    <div className='col-6' style={{maxHeight: '65vh', overflowY: 'scroll'}}>
                        {
                            this.state.links.map((link, index) => (
                                    <div>
                                        <div className='row'>
                                            <div className='col-11'>
                                                <input value={link.url} style={{ maxWidth: '100%', borderColor: !link.valid && !this.state.loading ? 'red' : (this.state.loading || link.valid) ? 'green' : ''}} onChange={(e) => this.handleLinkChange(e, index)} className='form-control' />
                                            </div>

                                            {
                                                this.state.links.length > 1 &&
                                                <div className='col-1'>
                                                    <div onClick={() => this.removeLink(index)} style={{marginTop: '10px', cursor: 'pointer'}}><span role='img' aria-label='times'>❌</span></div>
                                                </div>
                                            }

                                        </div>
                                        <div style={{color: 'green'}}>{link.valid && !link.loading ? this.props.validMsg ? `*${this.props.validMsg}` : '*Link is valid.' : ''}</div>
                                        <div style={{color: 'red'}}>{!link.valid && !link.loading ? `*${link.errorMsg}` : ''}</div>
                                        <div style={{marginBottom: '30px', color: 'green'}}>{link.loading ? this.props.retrievingMsg ? `*${this.props.retrievingMsg}` : '*Retrieving webpage meta data.' : ''}</div>
                                    </div>
                                ))
                        }
                        {
                            this.state.links.length < this.elementLimit &&
                            <div className='ui-block hoverborder'
                                style={{minHeight: '30px',
                                width: '100%',
                                marginLeft: '0px',
                                borderColor: this.props.required && visibleButtons.length === 0 ? 'red' : ''}}
                                onClick={this.addLink}>
                                <div style={{paddingTop: '5px'}} className='align-center'>
                                <h6> + Add Link </h6>
                            </div>
                        </div>
                        }
                        {
                            this.props.module === 'commentcapture' && this.state.links.length > 1 &&
                            <div style={{marginTop: '50px'}}>
                                <div className='row'>
                                    <div className='col-12'>
                                        <h6>
                                          See More Link
                                          <i className='la la-question-circle' data-toggle='tooltip' title='This will be the last card visible on desktop that lets people know where they can find more information' />
                                        </h6>
                                        <input 
                                          disabled={this.props.user.currentPlan.unique_ID === 'plan_B' || this.props.user.currentPlan.unique_ID === 'plan_D'} 
                                          value={this.state.seeMoreLink.link} 
                                          style={{ maxWidth: '100%', borderColor: !this.state.seeMoreLink.valid && !this.state.seeMoreLink.validating ? 'red' : 'green'}} 
                                          onChange={this.handleSeeMoreLinkChange} className='form-control' 
                                        />
                                    </div>
                                </div>
                                {
                                  this.props.user.currentPlan.unique_ID === 'plan_B' || this.props.user.currentPlan.unique_ID === 'plan_D' ?
                                  <div style={{color: 'darkgoldenrod'}}>{'*Only available on premium'}</div> :
                                  this.state.seeMoreLink.validating ?
                                  <div style={{color: 'green'}}>{'*Validating Link...'}</div> :
                                  <div style={{color: this.state.seeMoreLink.valid ? 'green' : 'red'}}>{this.state.seeMoreLink.valid ? '*Link is valid.' : '*Link is invalid'}</div>
                                }
                            </div>
                        }
                    </div>
                    <div className='col-1'>
                    <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
                    </div>
                    <div className='col-5'>
                    <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
                    <div className='ui-block' style={{overflowY: 'auto', border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', maxHeight: '68vh', minHeight: '68vh', marginLeft: '-50px'}} >
                      <div id="carouselExampleControls" data-interval="false" className="carousel slide ui-block" data-ride="carousel">

                        {
                            this.state.cards.length > 1 &&
                            <ol className="carousel-indicators carousel-indicators-numbers" style={{bottom: '-65px'}}>
                                {
                                this.state.cards.map((card, index) => {
                                    return (<li
                                        style={(this.state.hover === index || this.state.selectedIndex === index) ? {...this.carouselIndicatorStyle, ...this.carouselIndicatorActiveStyle} : this.carouselIndicatorStyle}
                                        onMouseEnter={() => this.toggleHover(index, true)}
                                        onMouseLeave={() => this.toggleHover(index, false)}
                                        data-target="#carouselExampleControls"
                                        data-slide-to={index}
                                        onClick={() => this.updateSelectedIndex(index)}
                                        className={(index === this.state.selectedIndex ? "active" : "")}>
                                        {index+1}
                                    </li>)
                                })
                                }
                            </ol>
                        }
                        <div className="carousel-inner">
                        {
                            this.state.cards.map((card, index) => {
                            return (
                                <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '200px', maxWidth: '250px', margin: 'auto', marginTop: '60px'}} className={"carousel-item " + (index === this.state.selectedIndex ? "active" : "") + (index === this.state.selectedIndex+1 ? "next" : "") + (index === this.state.selectedIndex-1 ? "prev" : "")}>
                                    {
                                        card.component.image_url &&
                                        <img alt='' src={card.component.image_url} style={{objectFit: 'cover', minHeight: '170px', maxHeight: '170px', maxWidth: '300px', paddingBottom: '11px', paddingTop: '29px', margin: '-25px', width: '100%', height: '100%' }} />
                                    }
                                    <hr style={{marginTop: card.component.image_url ? '' : '100px', marginBottom: '5px'}} />
                                    <h6 style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{card.component.title}</h6>
                                    <p style={{textAlign: 'left', marginLeft: '10px', marginTop: '5px', fontSize: '13px'}}>{card.component.subtitle ? card.component.subtitle : card.component.description}</p>
                                    {
                                        card.component.buttons && card.component.buttons.map((button, index) => (
                                        (button.visible || button.type) && (
                                          <div>
                                              <hr style={{marginTop: !card.component.title && !card.component.subtitle && index === 0 ? '50px' : ''}}/>
                                              <h5 style={{color: '#0782FF'}}>{button.title}</h5>
                                          </div>
                                        )
                                      ))
                                    }
                                </div>
                            )
                            })
                        }
                        </div>
                        {
                            this.props.module === 'commentcapture' && this.state.cards.length > 1 &&
                            <div>
                            {
                              this.state.selectedIndex > 0 &&
                              <a href='#/' onClick={(e) => this.updateSelectedIndex(this.state.selectedIndex-1)} className="carousel-control-prev" style={{top: '125px'}} role="button">
                               <span className="carousel-control-prev-icon" style={{cursor: 'pointer', backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E")`}} aria-hidden="true"></span>
                               <span className="sr-only">Previous</span>
                              </a>
                            }
                            {
                              this.state.selectedIndex < this.state.cards.length-1 &&
                              <a href='#/' onClick={(e) => this.updateSelectedIndex(this.state.selectedIndex+1)} className="carousel-control-next" style={{top: '125px'}} role="button" >
                                <span className="carousel-control-next-icon" style={{cursor: 'pointer', backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E")`}} aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                              </a>

                            }
                            </div>
                        }
                      </div>
                    </div>
                    </div>
                    <div className='row' style={{marginTop: '-5vh'}}>
                    { this.props.module !== 'commentcapture'
                        ? <div className='pull-right'>
                            <button onClick={this.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                                Cancel
                            </button>
                            <button disabled={!this.valid()} onClick={() => this.addComponent()} className='btn btn-primary'>
                                {this.props.edit ? 'Edit' : 'Next'}
                            </button>
                        </div>
                        : <div className='pull-right'>
                            <button onClick={this.closeModal} className='btn btn-secondary' style={{marginRight: '25px', marginLeft: '280px'}}>
                                Cancel
                            </button>
                            <button disabled={!this.valid()} onClick={() => {this.props.saveLinks(this.state.links,this.state.cards, this.state.seeMoreLink.link)}} className='btn btn-primary'>
                                Save
                            </button>
                        </div>
                    }

                    </div>
                  </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
      connectedPages: (state.pagesInfo.pages),
      user: (state.basicInfo.user)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        urlMetaData
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LinkCarouselModal)
