import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddCard from './AddCard'
import AddButton from './AddButton'

class ListModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null,
      title: 'Card Title',
      subtitle: 'Card Subtitle',
      buttons: [],
      buttonActions: ['open website', 'open webview', 'add share'],
      buttonLimit: 1,
      disabled: false,
      buttonDisabled: false,
      actionDisabled: false,
      imgSrc: null,
      webviewurl: '',
      elementUrl: '',
      webviewsize: 'FULL',
      cards: [{component: {id: 1}, visible: true},
        {component: {id: 2}, visible: true},
        {component: {id: 3}, visible: false},
        {component: {id: 4}, visible: false}],
      numOfElements: 2,
      elementLimit: 4,
      topElementStyle: 'compact'
    }
    this.componentAdded = false
    this.listComponents = [null, null, null, null]
    this.finalCards = []
    this.finalButtons = []
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.updateImage = this.updateImage.bind(this)
    this.updateCardStatus = this.updateCardStatus.bind(this)
    this.addElement = this.addElement.bind(this)
    this.addCard = this.addCard.bind(this)
  }

  addElement () {
    let cards = this.state.cards
      // if 3rd card is not visible, show it
    if (!cards[2].visible) {
      cards[2].visible = true
    } else if (!cards[3].visible) {
      cards[3].visible = true
    }
    this.setState({cards, numOfElements: ++this.state.numOfElements})
  }

  updateImage (image, file) {
    this.setState({imgSrc: image, file})
  }

  handleTitleChange (e) {
    this.setState({title: e.target.value}, () => {
      if (this.state.title === '') {
        this.setState({disabled: true})
      } else {
        this.setState({disabled: false})
      }
    })
  }

  handleSubtitleChange (e) {
    this.setState({subtitle: e.target.value}, () => {
      if (this.state.subtitle === '') {
        this.setState({disabled: true})
      } else {
        this.setState({disabled: false})
      }
    })
  }

  updateStatus (status) {
    console.log('ListModal updateStatus', status)
    this.setState(status)
  }

  updateCardStatus (status, id) {
    console.log('ListModal updateStatus', status)
    if (typeof status.disabled === 'boolean') {
      this.setState({disabled: status.disabled})
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
    let cards = this.state.cards
    cards[id - 1].component = Object.assign(cards[id - 1].component, status)
    this.setState({cards})
  }

  closeCard (id) {
    if (this.state.numOfElements.length <= 2) {
      console.log('List needs at least two elements')
      return
    }
    let cards = this.state.cards
    cards[id - 1].component = {id: id}
    cards[id - 1].visible = false
    this.listComponents[id - 1] = null
    this.setState({cards, numOfElements: --this.state.numOfElements})
  }

  handleDone () {
    this.AddButton.handleDone()
    for (let i = 0; i < this.listComponents.length; i++) {
      if (this.listComponents[i]) {
        this.listComponents[i].handleDone()
      }
    }
  }

  addCard (card) {
    console.log('addCard card in ListModal', card)
    this.finalCards.push(card)
    let visibleButtons = this.AddButton.buttonComponents.filter(button => button !== null)
    if (!this.componentAdded && this.finalCards.length === this.state.numOfElements && visibleButtons.length === this.finalButtons.length) {
      this.finalCards.sort((a, b) => a.id - b.id)
      console.log('finalCards', this.finalCards)
      this.addComponent()
    }
  }

  addButton (button) {
    console.log('addButton button in ListModal', button)
    this.finalButtons.push(button)
    let visibleButtons = this.AddButton.buttonComponents.filter(button => button !== null)
    if (!this.componentAdded && visibleButtons.length === this.finalButtons.length && this.finalCards.length === this.state.numOfElements) {
      this.addComponent()
    }
  }

  addComponent () {
    this.componentAdded = true
    this.props.addComponent({
      componentType: 'list',
      buttons: [].concat(...this.finalButtons),
      topElementStyle: this.state.topElementStyle,
      listItems: this.finalCards
    })
  }

  render () {
    return (
      <ModalContainer style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
          onClose={this.props.closeModal}>
          <h3>Add List Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h4>Elements:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '300px', padding: '20px', marginBottom: '30px'}}>
                {
                    this.state.cards.map((card, index) => {
                      if (card.visible) {
                        return (<AddCard addCard={this.addCard} ref={(ref) => { this.listComponents[index] = ref }} closeCard={() => { this.closeCard(card.component.id) }} id={card.component.id} updateStatus={(status) => { this.updateCardStatus(status, card.component.id) }} />)
                      }
                    })
                }
                {
                    (this.state.numOfElements < this.state.elementLimit) && <div className='ui-block hoverborder' style={{minHeight: '30px', width: '100%', marginLeft: '0px', marginBottom: '30px'}} onClick={this.addButton}>
                      <div onClick={this.addElement} style={{paddingTop: '5px'}} className='align-center'>
                        <h6> + Add Element </h6>
                      </div>
                    </div>
                }
              </div>
              <AddButton pageId={this.props.pageId} buttonLimit={this.state.buttonLimit} buttonActions={this.state.buttonActions} ref={(ref) => { this.AddButton = ref }} updateButtonStatus={this.updateStatus} addComponent={(buttons) => this.addButton(buttons)} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '490px', marginLeft: '-50px'}} >
                <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '200px', maxWidth: '250px', margin: 'auto', marginTop: '100px'}} >
                  {
                      this.state.imgSrc &&
                      <img src={this.state.imgSrc} style={{maxHeight: '100px'}} />
                  }
                  <hr style={{marginTop: '100px', marginBottom: '5px'}} />
                  <h6 style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{this.state.title}</h6>
                  <p style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '13px'}}>{this.state.subtitle}</p>

                  {
                      this.state.buttons.map(button => {
                        if (button.visible) {
                          return (
                            <div>
                              <hr />
                              <h5 style={{color: '#0782FF'}}>{button.title}</h5>
                            </div>
                          )
                        }
                      })
                  }

                </div>
              </div>
            </div>

            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.props.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={this.state.disabled || this.state.buttonDisabled || this.state.actionDisabled} onClick={() => this.handleDone()} className='btn btn-primary'>
                    Add
                </button>
              </div>
            </div>
          </div>
        </ModalDialog>
      </ModalContainer>

    )
  }
}

export default ListModal
