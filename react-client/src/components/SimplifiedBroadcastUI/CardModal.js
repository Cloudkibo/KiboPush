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
        cards.push({component: props.cards[i], visible: true, disabled: false, id: i + 1})
      } else {
        cards.push({
          visible: i === 0,
          disabled: true,
          id: i + 1,
          component: {
            title: '',
            subtitle: '',
            buttons: []
          }})
      }
    }
    this.cardComponents = new Array(10)
    this.state = {
      cards,
      selectedIndex: 0,
      disabled: props.edit ? false : true,
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview'], 
      buttonDisabled: false,
      actionDisabled: false,
      numOfElements: cards.filter(card => card.visible).length
    }
    console.log('CardModal state in constructor', this.state)
    console.log('CardModal props in constructor', this.props)
    this.finalCards = []
    this.handleDone = this.handleDone.bind(this)
    this.addElement = this.addElement.bind(this)
    this.updateCardStatus = this.updateCardStatus.bind(this)
    this.closeCard = this.closeCard.bind(this)
    this.addCard = this.addCard.bind(this)
    this.closeModal = this.closeModal.bind(this)
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

  addElement () {
    console.log('addElement')
      if (this.state.numOfElements < this.elementLimit) {
        let cards = this.state.cards
        for (let i = 0; i < cards.length; i++) {
          if (!cards[i].visible) {
            cards[i].visible = true
            break
          }
        }
        this.setState({cards, numOfElements: ++this.state.numOfElements, disabled: true, edited: true})
      }
  }

  handleDone () {
    this.setState({disabled: true})
    for (let i = 0; i < this.cardComponents.length; i++) {
      if (this.cardComponents[i]) {
        this.cardComponents[i].handleDone()
      }
    }
  }

  addComponent () {
    console.log('addComponent CardModal', this.state.cards)
    console.log('addComponent CardModal finalCards', this.finalCards)
    let visibleCards = this.state.cards.filter(card => card.visible)
    console.log('addComponent visibleCards', visibleCards)
    if (visibleCards.length === 1) {
      let card = visibleCards[0].component
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
        buttons: this.finalCards[0] ? this.finalCards[0].buttons : card.buttons})
    } else if (visibleCards.length > 1) {
      let cards = visibleCards.map((card,index) => {
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
        })
    }
  }

  updateCardStatus (status, id) {
    console.log('CardModal updateCardStatus', status)
    console.log('CardModal updateCardStatus state', this.state)
    let cards = this.state.cards
    if (typeof status.disabled === 'boolean') {
      cards[id-1].disabled = status.disabled
      let visibleDisabledCards = this.state.cards.filter(card => card.visible && card.disabled)
      this.setState({disabled: visibleDisabledCards.length > 0})
      delete status.disabled
    }
    if (typeof status.buttonDisabled === 'boolean') {
      this.setState({buttonDisabled: status.buttonDisabled})
      delete status.buttonDisabled
    }
    if (typeof status.actionDisabled === 'boolean') {
      this.setState({actionDisabled: status.actionDisabled})
      delete status.actionDisabled
    }
    if (cards[id-1]) {
      cards[id - 1].component = Object.assign(cards[id - 1].component, status)
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

  closeCard (id) {
    console.log('closing card', id)
    let cards = this.state.cards
    if (this.state.numOfElements <= 1) {
      console.log('At least one card is required')
      cards[id-1].invalid = true
      this.setState({cards})
      return
    }
    cards[id - 1].component = {
      title: '',
      subtitle: '',
      buttons: []
    }
    cards[id - 1].visible = false
    this.cardComponents[id - 1] = null
    let selectedIndex = this.state.selectedIndex
    if (selectedIndex === (id-1)) {
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].visible) {
          selectedIndex = i
          break
        }
      }
    }
    this.setState({cards, numOfElements: --this.state.numOfElements, selectedIndex, edited: true})
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

  render () {
    let visibleCards = this.state.cards.filter(card => card.visible)
    return (
      <ModalContainer style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
          onClose={this.props.closeModal}>
          <h3>Add {visibleCards.length > 1 ? 'Gallery' : 'Card'} Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6' style={{maxHeight: '65vh', overflowY: 'scroll'}}>
            <h4>Cards:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '300px', padding: '20px', paddingTop: '40px', marginBottom: '30px'}}>
                {
                    this.state.cards.map((card, index) => {
                      if (card.visible) {
                        return (<AddCard
                          edit={this.props.edit}
                          buttonActions={this.state.buttonActions}
                          buttonLimit={this.buttonLimit}
                          index={index}
                          onlyCard={visibleCards.length}
                          cardComponent
                          errorMsg={'*At least one card is required'}
                          replyWithMessage={this.props.replyWithMessage}
                          card={this.state.cards[index]}
                          addCard={this.addCard}
                          ref={(ref) => { this.cardComponents[index] = ref }}
                          closeCard={() => { this.closeCard(card.id) }}
                          id={card.id}
                          updateStatus={(status) => { this.updateCardStatus(status, card.id) }} />)
                      }
                    })
                }
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

                <div id="carouselExampleControls" data-interval="false" style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '200px', maxWidth: '250px', margin: 'auto', marginTop: '100px'}} className="carousel slide ui-block" data-ride="carousel">
                  <div className="carousel-inner">
                  {
                    this.state.cards.map((card, index) => {
                      if (card.visible) {
                        return (
                          <div className={"carousel-item " + (index === this.state.selectedIndex ? "active" : "")}>
                              {
                                  card.component.image_url &&
                                  <img src={card.component.image_url} style={{maxHeight: '130px', minWidth: '250px', padding: '25px', margin: '-25px'}} />
                              }
                              <hr style={{marginTop: card.component.image_url ? '' : '100px', marginBottom: '5px'}} />
                              <h6 style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{card.component.title}</h6>
                              <p style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '13px'}}>{card.component.subtitle ? card.component.subtitle : card.component.description}</p>
                              {
                                  card.component.buttons.map((button, index) => {
                                    if (button.visible || button.type) {
                                      return (
                                        <div>
                                          <hr style={{marginTop: !card.component.title && !card.component.subtitle && index === 0 ? '50px' : ''}}/>
                                          <h5 style={{color: '#0782FF'}}>{button.type === 'element_share' ? 'Share' : button.title}</h5>
                                        </div>
                                      )
                                    }
                                  })
                              }
                          </div>
                        )
                      }
                    })                   
                  }
                  </div>
                  {
                    visibleCards.length > 1 && 
                      <div>
                        <a className="carousel-control-prev" style={{left:'-40px', top: '50%', bottom: '50%'}} href="#carouselExampleControls" role="button" data-slide="prev">
                          <span className="carousel-control-prev-icon" style={{backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E")`}} aria-hidden="true"></span>
                          <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" style={{right: '-40px', top: '50%', bottom: '50%'}} href="#carouselExampleControls" role="button" data-slide="next">
                          <span className="carousel-control-next-icon" style={{backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E")`}} aria-hidden="true"></span>
                          <span className="sr-only">Next</span>
                        </a>
                      </div>
                  }
                </div>

                <h6 style={{marginTop: '50px'}}>
                  Card #{this.state.selectedIndex+1}
                </h6>

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
