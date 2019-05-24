import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddCard from './AddCard'
import AddButton from './AddButton'

class ListModal extends React.Component {
  constructor (props) {
    super(props)
    this.elementLimit = 4
    let cards = []
    for (let i = 0; i < this.elementLimit; i++) {
      if (props.cards && props.cards[i]) {
        cards.push({component: props.cards[i], visible: true, disabled: false})
      } else {
        cards.push({
          visible: !!(i === 0 || i === 1),
          disabled: true,
          component: {
            id: i + 1,
            title: '',
            subtitle: '',
            buttons: []
          }})
      }
    }
    this.state = {
      buttons: props.buttons.map(button => button.type === 'element_share' ? {visible: true, title: 'Share'} : {visible: true, title: button.title}),
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview', 'add share'],
      buttonLimit: 1,
      disabled: props.edit ? false : true,
      buttonDisabled: false,
      actionDisabled: false,
      cards,
      numOfElements: 2,
      topElementStyle: this.props.topElementStyle ? this.props.topElementStyle : 'compact'
    }
    this.elementLimit = 4
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
    this.addButton = this.addButton.bind(this)
    this.changeTopElementStyle = this.changeTopElementStyle.bind(this)
  }

  changeTopElementStyle (e) {
    this.setState({topElementStyle: e.target.value})
  }

  addElement () {
    console.log('addElement')
      if (this.state.numOfElements < this.elementLimit) {
        let cards = this.state.cards
        // if 3rd card is not visible, show it
        if (!cards[2].visible) {
          cards[2].visible = true
        } else if (!cards[3].visible) {
          cards[3].visible = true
        }
        this.setState({cards, numOfElements: ++this.state.numOfElements})
      }
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
    cards[id - 1].component = Object.assign(cards[id - 1].component, status)
    for (let i = 0; i < cards.length; i++) {
      delete cards[i].invalid
    }
    this.setState({cards})
  }

  closeCard (id) {
    console.log('closing card')
    let cards = this.state.cards
    if (this.state.numOfElements <= 2) {
      console.log('List needs at least two elements')
      cards[id-1].invalid = true
      this.setState({cards})
      return
    }
    cards[id - 1].component = {
      id: id,
      title: `Element #${id} Title`,
      subtitle: `Element #${id} Subtitle`,
      buttons: []
    }
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
    let finalButtons = [].concat(...this.finalButtons)
    if (this.finalCards.length === this.state.numOfElements && visibleButtons.length === finalButtons.length) {
      this.finalCards.sort((a, b) => a.id - b.id)
      console.log('finalCards', this.finalCards)
      this.addComponent()
    }
  }

  addButton (button) {
    console.log('addButton button in ListModal', button)
    this.finalButtons.push(button)
    let finalButtons = [].concat(...this.finalButtons)
    let visibleButtons = this.AddButton.buttonComponents.filter(button => button !== null)
    if (visibleButtons.length === finalButtons.length && this.finalCards.length === this.state.numOfElements) {
      this.addComponent()
    }
  }

  addComponent () {
    this.props.addComponent({
      id: this.props.id,
      componentType: 'list',
      buttons: [].concat(...this.finalButtons),
      topElementStyle: this.state.topElementStyle,
      listItems: this.finalCards
    })
  }

  render () {
    console.log('ListModal state', this.state)
    let visibleCards = this.state.cards.filter(card => card.visible)
    return (
      <ModalContainer style={{width: '900px', left: '25vw', top: '82px', cursor: 'default'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '900px', left: '25vw', top: '82px', cursor: 'default'}}
          onClose={this.props.closeModal}>
          <h3>Add List Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6' style={{maxHeight: '500px', overflowY: 'scroll'}}>

              <h4>Top Element Style:</h4>
              <div style={{marginTop: '10px', border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', padding: '10px', marginBottom: '30px'}}>
                <div style={{marginLeft: '10%', marginRight: '20%'}} className='custom-control custom-radio custom-control-inline'>
                  <input onChange={this.changeTopElementStyle} value={'compact'} checked={this.state.topElementStyle === 'compact'} type='radio' />
                  <label className='custom-control-label' style={{marginLeft: '10px'}}>compact</label>
                </div>

                <div className='custom-control custom-radio custom-control-inline'>
                  <input value={'LARGE'} onChange={this.changeTopElementStyle} checked={this.state.topElementStyle === 'LARGE'} type='radio' />
                  <label className='custom-control-label' style={{marginLeft: '10px'}}>LARGE</label>
                </div>
              </div>

              <h4>Elements:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '300px', padding: '20px', paddingTop: '40px', marginBottom: '30px'}}>
                {
                    this.state.cards.map((card, index) => {
                      if (card.visible) {
                        return (<AddCard
                          index={index}
                          buttonActions={this.state.buttonActions}
                          errorMsg={'*At least two list elements are required'}
                          replyWithMessage={this.props.replyWithMessage}
                          card={this.state.cards[index]}
                          addCard={this.addCard}
                          ref={(ref) => { this.listComponents[index] = ref }}
                          closeCard={() => { this.closeCard(index+1) }}
                          id={index+1}
                          updateStatus={(status) => { this.updateCardStatus(status, index+1) }} />)
                      }
                    })
                }
                {
                    (this.state.numOfElements < this.elementLimit) && <div className='ui-block hoverborder' style={{minHeight: '30px', width: '100%', marginLeft: '0px', marginBottom: '30px'}} >
                      <div onClick={this.addElement} style={{paddingTop: '5px'}} className='align-center'>
                        <h6> + Add Element </h6>
                      </div>
                    </div>
                }
              </div>
              <AddButton
                replyWithMessage={this.props.replyWithMessage}
                buttons={this.state.buttons}
                finalButtons={this.props.buttons}
                pageId={this.props.pageId}
                buttonLimit={this.state.buttonLimit}
                buttonActions={this.state.buttonActions}
                ref={(ref) => { this.AddButton = ref }}
                updateButtonStatus={this.updateStatus}
                addComponent={(buttons) => this.addButton(buttons)} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '500px', marginLeft: '-50px', paddingBottom: '100px'}} >
                <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '200px', maxWidth: '250px', margin: 'auto', marginTop: '100px'}} >
                  {
                    visibleCards.map((card, index) => {
                      let largeStyle = null
                      if (index === 0 && this.state.topElementStyle === 'LARGE') {
                        largeStyle = {
                          backgroundImage: `url(${card.component.image_url})`,
                          backgroundSize: '100%',
                          backgroundRepeat: 'no-repeat'
                        }
                      }
                      return (
                        <div style={largeStyle}>
                          <div className='row' style={{padding: '10px'}}>
                            <div className={largeStyle ? 'col-12' : 'col-6'} style={{minHeight: '75px'}}>
                              <h6 style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '15px'}}>{card.component.title}</h6>
                              <p style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '12px'}}>{card.component.subtitle}</p>
                            </div>
                            {!largeStyle && <div className='col-6'>
                              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '80%', minWidth: '80%', marginLeft: '20%'}} >
                                {
                                  card.component.image_url &&
                                  <img src={card.component.image_url} style={{maxWidth: '100%', maxHeight: '100%'}} />
                                  }
                              </div>
                            </div>
                            }
                            {
                              card.component.buttons && card.component.buttons.map(button => {
                                if (button.visible) {
                                  return (
                                    <div className='ui-block' style={{border: '1px solid rgb(7, 130, 255)', borderRadius: '3px', minHeight: '50%', minWidth: '25%', marginLeft: '10%'}} >
                                      <h6 style={{color: '#0782FF', fontSize: '12px'}}>{button.title}</h6>
                                    </div>
                                  )
                                }
                              })
                              }
                          </div>
                          {
                              index !== this.state.numOfElements - 1 && <hr />
                          }
                        </div>)
                    })
                }
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

export default ListModal
