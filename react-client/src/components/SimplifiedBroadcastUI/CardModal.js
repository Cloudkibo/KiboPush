/* eslint-disable no-undef */
import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddCard from './AddCard'

class CardModal extends React.Component {
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
      selectedIndex: 0,
      currentCollapsed: false,
      disabled: props.edit ? false : true,
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview'], 
      buttonDisabled: false,
      actionDisabled: false,
      numOfElements: cards.length,
      closeAdditonalCardsModal: true
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
    console.log('CardModal state in constructor', this.state)
    console.log('CardModal props in constructor', this.props)
    this.finalCards = []
    this.showingAdditionalCardsModal = false
    this.handleDone = this.handleDone.bind(this)
    this.addElement = this.addElement.bind(this)
    this.updateCardStatus = this.updateCardStatus.bind(this)
    this.closeCard = this.closeCard.bind(this)
    this.addCard = this.addCard.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.toggleHover = this.toggleHover.bind(this)
    this.updateSelectedIndex = this.updateSelectedIndex.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.getRequirements = this.getRequirements.bind(this)
    this.showAdditionalCardsModal = this.showAdditionalCardsModal.bind(this)
    this.closeAdditonalCardsModal = this.closeAdditonalCardsModal.bind(this)
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
    this.setState({closeAdditonalCardsModal: false})
  }

  addElement () {
    console.log('addElement')
      if (this.state.numOfElements < this.elementLimit) {
        let cards = this.state.cards
        cards.push({
          disabled: true,
          id: this.state.cards.length+1,
          component: {
            title: '',
            subtitle: '',
            buttons: []
          }})
        this.setState({selectedIndex: (cards.length-1), cards, numOfElements: ++this.state.numOfElements, disabled: true, edited: true, closeAdditonalCardsModal: false}, () => {
          this.scrollToTop(`panel-heading${this.state.cards.length}`)
        })
      }
  }

  handleDone () {
    this.setState({disabled: true})
    console.log('handleDone', this.cardComponents)
    for (let i = 0; i < this.cardComponents.length; i++) {
      if (this.cardComponents[i]) {
        this.cardComponents[i].handleDone()
      }
    }
  }

  addComponent () {
    console.log('addComponent CardModal', this.state.cards)
    console.log('addComponent CardModal finalCards', this.finalCards)
    console.log('addComponent this.state.cards', this.state.cards)
    if (this.state.cards.length === 1) {
      let card = this.state.cards[0].component
      this.props.addComponent({
        id: this.props.id,
        componentType: 'card',
        fileurl: card.fileurl ? card.fileurl : '',
        image_url: card.image_url ? card.image_url : '',
        fileName: card.fileName ? card.fileName : '',
        type: card.type ? card.type : '',
        size: card.size ? card.size : '',
        title: card.title,
        description: card.subtitle,
        webviewurl: card.webviewurl,
        elementUrl: card.elementUrl,
        webviewsize: card.webviewsize,
        default_action: card.default_action,
        buttons: this.finalCards[0] ? this.finalCards[0].buttons : card.buttons}, this.props.edit)
    } else if (this.state.cards.length > 1) {
      let cards = this.state.cards.map((card,index) => {
        let finalCard = this.finalCards.find(x => card.id === x.id)
        console.log(`finalCard found for card ${card.id}`, finalCard)
        return { 
          id: card.id ? card.id : '',
          fileurl: card.component.fileurl ? card.component.fileurl : '',
          image_url: card.component.image_url ? card.component.image_url : '',
          fileName: card.component.fileName ? card.component.fileName : '',
          type: card.component.type ? card.component.type : '',
          size: card.component.size ? card.component.size : '',
          title: card.component.title,
          subtitle: card.component.subtitle ? card.component.subtitle : card.component.description,
          webviewurl: card.component.webviewurl,
          elementUrl: card.component.elementUrl,
          webviewsize: card.component.webviewsize,
          default_action: card.component.default_action,
          buttons: finalCard ? finalCard.buttons : card.component.buttons
        }
      })
      this.props.addComponent({
        id: this.props.id,
        componentType: 'gallery',
        cards
        }, this.props.edit)
    }
  }

  updateCardStatus (status, id) {
    console.log('CardModal updateCardStatus', status)
    console.log('CardModal updateCardStatus state', this.state)
    let cards = this.state.cards
    if (typeof status.disabled === 'boolean') {
      cards[id-1].disabled = status.disabled
      let visibleDisabledCards = this.state.cards.filter(card => card.disabled)
      this.setState({disabled: visibleDisabledCards.length > 0})
      delete status.disabled
    }
    if (typeof status.buttonDisabled === 'boolean') {
      this.setState({buttonDisabled: status.buttonDisabled})
      cards[id-1].buttonDisabled = status.buttonDisabled
      delete status.buttonDisabled
    }
    if (typeof status.actionDisabled === 'boolean') {
      this.setState({actionDisabled: status.actionDisabled})
      cards[id-1].actionDisabled = status.actionDisabled
      delete status.actionDisabled
    }
    if (cards[id-1]) {
      cards[id - 1].component = Object.assign(cards[id - 1].component, status)
      if (status.buttonData) {
        cards[id-1].component.buttons[status.buttonData.index] = status.buttonData
      }
    }
    for (let i = 0; i < cards.length; i++) {
      delete cards[i].invalid
    }
    if (status.hasOwnProperty('edited')) {
      this.setState({cards, selectedIndex: id-1, edited: status.edited})
      delete status.edited
    } else {
      this.setState({cards, selectedIndex: id-1, edited: true})
    }
  }

  getRequirements () {
    return this.cardComponents.map((card, index) => {
      console.log(`cardComponent ${index}`, card)
      
      if (card && card.props) {
        let requirements = []
        if (card.props.card.disabled || card.props.card.buttonDisabled) {
          let cardData = card.props.card.component
          let msg = `Card ${card.props.card.id} requires:`
          if (!cardData.title) {
            requirements.push('a title')
          }
          if (!cardData.subtitle) {
            requirements.push('a subtitle')
          }
          if (!card.state.file) {
            requirements.push('an image')
          }
          if (card.props.card.buttonDisabled) {
            let visibleButtons = cardData.buttons.filter(button => button.visible)
            console.log('visibleButtons', visibleButtons)
            if (visibleButtons.length === 0) {
              requirements.push('at least one valid button')
            } else {
              requirements.push('valid button(s)')
            }
          }
          console.log('requirements', requirements)
          if (requirements.length > 0) {
            return (
              <li style={{textAlign: 'left', marginLeft: '75px', color: 'red'}}>{msg}
                <ul>
                  {requirements.map(req => <li>{req}</li>)}
                </ul>
              </li>
            )
          }
        }
        if (requirements.length === 0) {
          this.showAdditionalCardsModal()
        }
      }
    })
  }

  showAdditionalCardsModal () {
    this.showingAdditionalCardsModal = true
  }

  closeAdditonalCardsModal () {
    this.setState({closeAdditonalCardsModal: true})
  }

  closeCard (id) {
    console.log('closing card', id)
    let cards = this.state.cards
    if (this.state.numOfElements <= 1) {
      console.log('At least one card is required')
      cards[id-1].invalid = true
      this.setState({cards})
      return
    }
    cards.splice(id-1, 1)
    this.cardComponents.splice(id-1, 1)
    let disabled = false
    let buttonDisabled = false
    let actionDisabled = false
    for (let i = 0; i < cards.length; i++) {
      cards[i].id = i+1
      if (cards[i].disabled) {
        disabled = true
      }
      if (cards[i].buttonDisabled) {
        buttonDisabled = true
      }
      if (cards[i].actionDisabled) {
        actionDisabled = true
      }
    }
    console.log('remaining cards after closing card', cards)
    let selectedIndex = cards.length-1
    this.setState({cards, numOfElements: --this.state.numOfElements, selectedIndex, edited: true, disabled, buttonDisabled, actionDisabled})
  }

  addCard (card) {
    console.log('addCard card in CardModal', card)
    this.finalCards.push(card)
    if (this.finalCards.length === this.state.numOfElements) {
      this.finalCards.sort((a, b) => a.id - b.id)
      console.log('finalCards', this.finalCards)
      this.addComponent()
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

  componentWillUnmount() {
    this.props.closeModal()
  }
  
  render () {
    let requirements = this.getRequirements().filter(req => !!req)
    console.log('requirements', requirements)
    let settings = {
      slidesToShow: 1
    }
    return (
      <ModalContainer style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
        onClose={this.closeModal}>
        <ModalDialog style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
          onClose={this.closeModal}>

          {
            (requirements && requirements.length === 0 && !this.state.closeAdditonalCardsModal) &&
            <ModalContainer style={{width: '500px'}}
              onClose={this.closeAdditonalCardsModal}>
              <ModalDialog style={{width: '500px'}}
                onClose={this.closeAdditonalCardsModal}>
                <p>You just completed all requirements for a card. Do you want to add an additional card?</p>
                <button style={{float: 'right', marginLeft: '10px'}}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.closeAdditonalCardsModal()
                    this.addElement()
                  }}>Yes
                </button>
                <button style={{float: 'right'}}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.closeAdditonalCardsModal()
                  }}>Cancel
                </button>
              </ModalDialog>
            </ModalContainer>
          }
          <h3>Add {this.state.cards.length > 1 ? 'Gallery' : 'Card'} Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6' style={{maxHeight: '65vh', overflowY: 'scroll'}}>
            <h4>Cards:</h4>
              <div className='ui-block' style={{position: 'relative', border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '300px', padding: '20px', paddingTop: '40px', marginBottom: '30px'}}>
                {
                    this.state.cards.map((card, index) => {
                        console.log(`AddCard ${index+1}`, card)
                        return (
                          <div className="panel-group" id="accordion">
                            <div className="panel panel-default">
                              <div id={`panel-heading${index+1}`} className="panel-heading">
                                <h4 className="panel-title" style={{fontSize: '22px'}}>
                                  <a onClick={() => this.updateSelectedIndex(index)} data-toggle="collapse" data-parent="#accordion" href={`#collapse${index+1}`}>Card #{index+1}</a>
                                </h4>
                              </div>
                              <div id={`collapse${index+1}`} className={"panel-collapse " + (this.state.selectedIndex === index ? "show" : "collapse")}>
                                <div className="panel-body">
                                  <AddCard
                                    edit={this.props.edit}
                                    buttonActions={this.state.buttonActions}
                                    buttonLimit={this.buttonLimit}
                                    index={card.id-1}
                                    onlyCard={this.state.cards.length}
                                    cardComponent
                                    errorMsg={'*At least one card is required'}
                                    replyWithMessage={this.props.replyWithMessage}
                                    card={card}
                                    addCard={this.addCard}
                                    ref={(ref) => { this.cardComponents[card.id-1] = ref }}
                                    closeCard={() => { this.closeCard(card.id) }}
                                    id={card.id}
                                    updateStatus={(status) => { this.updateCardStatus(status, card.id) }}
                                    disabled={this.state.disabled || this.state.actionDisabled}
                                    />                 
                                </div>
                              </div>
                            </div>
                          </div>  
                        )
                    })
                }

                {/* {
                    this.state.cards.map((card, index) => {
                        console.log(`AddCard ${index+1}`, card)
                        return (<AddCard
                          edit={this.props.edit}
                          buttonActions={this.state.buttonActions}
                          buttonLimit={this.buttonLimit}
                          index={card.id-1}
                          onlyCard={this.state.cards.length}
                          cardComponent
                          errorMsg={'*At least one card is required'}
                          replyWithMessage={this.props.replyWithMessage}
                          card={card}
                          addCard={this.addCard}
                          ref={(ref) => { this.cardComponents[card.id-1] = ref }}
                          closeCard={() => { this.closeCard(card.id) }}
                          id={card.id}
                          updateStatus={(status) => { this.updateCardStatus(status, card.id) }} />)
                    })
                } */}
                {
                    (this.state.numOfElements < this.elementLimit) && <div className='ui-block hoverborder' style={{minHeight: '30px', width: '100%', marginLeft: '0px', marginBottom: '30px'}} >
                      <div onClick={this.addElement} style={{paddingTop: '5px'}} className='align-center'>
                        <h6> + Add Card </h6>
                      </div>
                    </div>
                }
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
                            <h6 style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{card.component.title}</h6>
                            <p style={{textAlign: 'justify', marginLeft: '10px', marginTop: '5px', fontSize: '13px'}}>{card.component.subtitle ? card.component.subtitle : card.component.description}</p>
                            <p style={{textAlign: 'justify', marginLeft: '10px', fontSize: '13px'}}>{card.component.default_action && card.component.default_action.url}</p>
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


                <ul style={{marginTop: '65px'}}>
                  {
                    requirements && requirements.length > 0 ? requirements :             
                    (
                    <li style={{textAlign: 'left', color: 'green', marginLeft: '30px'}}>{'All requirments fulfilled'}
                      <ul>
                        <li>Scroll down to add additional cards</li>
                        <li>Click the Next button to finish</li>
                      </ul>
                    </li>
                    )
                  }
                </ul>

                </div>
              </div>
            </div>

            <div className='row' style={{marginTop: '-5vh'}}>
              <div className='pull-right'>
                <button onClick={this.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={this.state.disabled || this.state.buttonDisabled || this.state.actionDisabled} onClick={() => this.handleDone()} className='btn btn-primary'>
                  {this.props.edit ? 'Edit' : 'Next'}
                </button>
              </div>
            </div>
        </ModalDialog>
      </ModalContainer>

    )
  }
}

export default CardModal
