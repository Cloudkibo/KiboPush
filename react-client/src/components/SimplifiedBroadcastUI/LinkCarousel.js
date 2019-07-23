/* eslint-disable no-undef */
import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { urlMetaData } from '../../redux/actions/convos.actions'

class LinkCarouselModal extends React.Component {
    constructor (props) {
        super(props)
        this.elementLimit = 10
        this.buttonLimit = 3
        let cards = []
        for (let i = 0; i < this.elementLimit; i++) {
          if (props.cards && props.cards[i]) {
            cards.push({component: props.cards[i], disabled: false, id: i + 1})
          } else {
            if (i === 0) {
              cards.push({
                disabled: true,
                id: i + 1,
                component: {
                  title: '',
                  subtitle: '',
                  buttons: []
                }})
            }
          }
        }
        this.cardComponents = new Array(10)
        this.state = {
          cards,
          links: [{valid: false, url: '', loading: false}],
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
    }

    valid () {
        let links = this.state.links
        for (let i = 0; i < links.length; i++) {
            if (!links[i].valid) {
                return false
            }
        }
        return true
    }

    removeLink (index) {
        let links = this.state.links
        let cards = this.state.cards
        if (links.length > 1) {
            links.splice(index, 1)
            if (cards[index]) {
                cards.splice(index, 1)
            }
            this.setState({links, cards})
        }
    }


    addLink () {
        let links = this.state.links
        if (links.length < 10) {
            links.push({url: '', valid: false, loading: false})
            this.setState({links})
        } 
    }
    
    toggleHover (index, hover) {
        this.setState({hover: hover ? index : -1})
    }
    
    componentDidMount () {
        //Improve Later
        let that = this
        $('#carouselExampleControls').on('slide.bs.carousel', function (e) {
          var active = $(e.target).find('.carousel-inner > .carousel-item.active');
          var from = active.index();
          var next = $(e.relatedTarget);
          var to = next.index();
          console.log(from + ' => ' + to);
          that.setState({selectedIndex: to})
        })
    }

    addComponent () {
        console.log('addComponent this.state.cards', this.state.cards)
        if (this.state.cards.length === 1) {
          let card = this.state.cards[0].component
          this.props.addComponent({
            id: this.props.id,
            componentType: 'card',
            image_url: card.image_url ? card.image_url : '',
            title: card.title,
            description: card.subtitle,
            buttons: card.buttons}, this.props.edit)
        } else if (this.state.cards.length > 1) {
          let cards = this.state.cards.map((card,index) => {
            return { 
              id: card.id ? card.id : '',
              image_url: card.component.image_url ? card.component.image_url : '',
              title: card.component.title,
              subtitle: card.component.subtitle ? card.component.subtitle : card.component.description,
              buttons: card.component.buttons
            }
          })
          this.props.addComponent({
            id: this.props.id,
            componentType: 'gallery',
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
    
    updateSelectedIndex (index) {
        this.setState({selectedIndex: index}, () => {
          this.scrollToTop(`panel-heading${index+1}`)
        })
    }

    handleUrlMetaData (data, index) {
        console.log('url meta data retrieved', data)
        let links = this.state.links
        let cards = this.state.cards
        cards[index] = {
            id: index+1,
            component: {
                title: data.title,
                subtitle: data.description,
                image_url: data.image,
                buttons: [
                    {
                        title: 'Go to Article',
                        type: 'web_url',
                        url: links[index].url
                    }
                ]
            }
        }
        links[index] = Object.assign(links[index], {loading: false})
        this.setState({links, cards})
    }

    handleLinkChange (e, index) {
        console.log('changing link', e.target.value)
        let link = e.target.value
        let links = this.state.links
        if (this.state.links.length < 10) {
            if (this.validateURL(link)) {
                links[index] = {url: link, valid: true, loading: true}
            } else {
                links[index] = {url: link, valid: false, loading: false}
            }
        }
        this.setState({links}, () => {
          if (links[index].valid) {
            this.props.urlMetaData(link, (data) => this.handleUrlMetaData(data, index))
          }
        })
    }

    validateURL(textval) {
        var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        return urlregex.test(textval);
    }

    render () {
        console.log('links', this.state.links)
        return (
        <ModalContainer style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
            onClose={this.closeModal}>
            <ModalDialog style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
            onClose={this.closeModal}>
            <h3>Create Carousel using Links </h3>
            <hr />
            <div className='row'>
                <div className='col-6' style={{maxHeight: '65vh', overflowY: 'scroll'}}>
                    {
                        this.state.links.map((link, index) => {
                            return (
                                <div>
                                    <div className='row'>
                                        <div className='col-11'>
                                            <input value={this.state.link} style={{ maxWidth: '100%', borderColor: !link.valid && !this.state.loading ? 'red' : (this.state.loading || link.valid) ? 'green' : ''}} onChange={(e) => this.handleLinkChange(e, index)} className='form-control' />
                                        </div>

                                        <div className='col-1'>
                                            <div onClick={() => this.removeLink(index)} style={{marginTop: '10px', cursor: 'pointer'}}>❌</div>
                                        </div>
                                        
                                    </div>
                                    <div style={{color: 'green'}}>{link.valid && !link.loading ? '*Link is valid.' : ''}</div>
                                    <div style={{color: 'red'}}>{!link.valid && !link.loading ? '*Please enter a valid article link.' : ''}</div>
                                    <div style={{marginBottom: '30px', color: 'green'}}>{link.loading ? '*Retrieving article meta data.' : ''}</div>
                                </div>
                            )
                        })
                    }
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
                                    <img src={card.component.image_url} style={{maxHeight: '140px', minWidth: '250px', padding: '20px', paddingTop: '30px', margin: '-25px'}} />
                                }
                                <hr style={{marginTop: card.component.image_url ? '' : '100px', marginBottom: '5px'}} />
                                <h6 style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{card.component.title}</h6>
                                <p style={{textAlign: 'left', marginLeft: '10px', marginTop: '5px', fontSize: '13px'}}>{card.component.subtitle ? card.component.subtitle : card.component.description}</p>
                                <p style={{textAlign: 'left', marginLeft: '10px', fontSize: '13px'}}>{card.component.default_action && card.component.default_action.url}</p>
                                {
                                    card.component.buttons.map((button, index) => {
                                    if (button.visible || button.type) {
                                        return (
                                        <div>
                                            <hr style={{marginTop: !card.component.title && !card.component.subtitle && index === 0 ? '50px' : ''}}/>
                                            <h5 style={{color: '#0782FF'}}>{button.type === 'element_share' || button.shareButton ? 'Share' : button.title}</h5>
                                        </div>
                                        )
                                    }
                                    })
                                }
                            </div>
                        )
                        })                   
                    }
                    </div>
                    {
                        this.state.cards.length > 1 && 
                        <div>
                            <a className="carousel-control-prev" style={{top: '125px'}} href="#carouselExampleControls" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" style={{backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E")`}} aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" style={{top: '125px'}} href="#carouselExampleControls" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" style={{backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E")`}} aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                            </a>
                        </div>
                    }
                    </div>
                    </div>
                </div>
                <div className='row' style={{marginTop: '-5vh'}}>
                <div className='pull-right'>
                    <button onClick={this.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                        Cancel
                    </button>
                    <button disabled={!this.valid()} onClick={() => this.addComponent()} className='btn btn-primary'>
                        {this.props.edit ? 'Edit' : 'Next'}
                    </button>
                </div>
                </div>
            </div>
            </ModalDialog>
        </ModalContainer>

        )
    }
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
      urlMetaData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LinkCarouselModal)
