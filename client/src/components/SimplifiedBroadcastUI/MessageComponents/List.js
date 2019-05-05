/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Card from './CardList'
import ListModal from '../ListModal'

class List extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.edit = this.edit.bind(this)
    this.closeEdit = this.closeEdit.bind(this)
    this.state = {
      cards: [{element: <Card pageId={this.props.pageId} replyWithMessage={this.props.replyWithMessage} pages={this.props.pages} buttonActions={this.props.buttonActions} id={1} button_id={props.id} handleCard={this.handleCard} removeElement={this.removeElement} topElementStyle={this.topElementStyle} topStyle='compact' />, key: 1}, {element: <Card id={2} pageId={this.props.pageId} pages={this.props.pages} replyWithMessage={this.props.replyWithMessage} buttonActions={this.props.buttonActions} button_id={props.id} handleCard={this.handleCard} removeElement={this.removeElement} topStyle='compact' topElementStyle={this.topElementStyle} />, key: 2}],
      showPlus: false,
      pageNumber: 2,
      buttons: props.buttons ? props.buttons : [],
      topElementStyle: this.props.topElementStyle ? this.props.topElementStyle : 'compact',
      styling: {minHeight: 30, maxWidth: 400},
      editing: false
    }
  }

  edit () {
    this.setState({editing: true})
  }

  closeEdit () {
    this.setState({editing: false})
  }

  componentDidMount () {
    if (this.props.cards && this.props.cards.length > 0) {
      console.log('this.props.cards', this.props)
      var tmp = []
      let cardLength = this.props.cards.length
      if (cardLength < 2) {
        cardLength = 2
      }
      for (var k = 0; k < cardLength; k++) {
        if (this.props.cards[k] && this.props.cards[k].id === k + 1) {
          tmp.push({element: <Card pages={this.props.pages}
            pageId={this.props.pageId}
            replyWithMessage={this.props.replyWithMessage}
            id={k + 1}
            buttonActions={this.props.buttonActions}
            button_id={this.props.id}
            buttons={this.props.cards[k].buttons}
            cardDetails={this.props.cards[k]}
            handleCard={this.handleCard}
            topElementStyle={this.topElementStyle}
            removeElement={this.removeElement}
            webviewsize={this.props.cards[k].webviewsize}
            webviewurl={this.props.cards[k].webviewurl}
            elementUrl={this.props.cards[k].elementUrl}
            topStyle={this.props.list.topElementStyle} />,
            key: k})
        } else {
          tmp.push({element: <Card id={k + 1}
            pageId={this.props.pageId}
            replyWithMessage={this.props.replyWithMessage}
            pages={this.props.pages}
            buttonActions={this.props.buttonActions}
            button_id={this.props.id}
            handleCard={this.handleCard}
            removeElement={this.removeElement}
            topStyle='compact'
            topElementStyle={this.topElementStyle} />,
            key: k})
        }
      }
      // for (var k = 0; k < this.props.cards.length; k++) {
      //   this.props.cards[k].id = k
      //   tmp.push({element: <Card pages={this.props.pages} pageId={this.props.pageId} id={k} buttonActions={this.props.buttonActions} button_id={this.props.id} buttons={this.props.cards[k].buttons} cardDetails={this.props.cards[k]} handleCard={this.handleCard} topElementStyle={this.topElementStyle} removeElement={this.removeElement} topStyle={this.props.list.topElementStyle} />, key: k})
      // }
      console.log('list is', this.props)
      this.setState({cards: tmp, broadcast: this.props.cards})
    }
    console.log('this.props componentDidMount List', this.props)
    if (this.props.list.topElementStyle && this.props.list.buttons) {
      this.setState({topElementStyle: this.props.list.topElementStyle, buttons: this.props.list.buttons})
    }
    if (this.props.listDetails && this.props.listDetails !== '') {
      console.log('this.props.listDetails', this.props.listDetails)
      var cards = this.props.listDetails.listItems
      var card = {}
      var temp = []
      var cardMessage = []
      for (var i = 0; i < cards.length; i++) {
        //  cards[i].id = i
        card = {element: <Card pageId={this.props.pageId} pages={this.props.pages} id={i + 1} buttonActions={this.props.buttonActions} button_id={this.props.id} handleCard={this.handleCard} cardDetails={cards[i]} removeElement={this.removeElement} topElementStyle={this.topElementStyle} topStyle={this.props.listDetails.topElementStyle} />, key: i}
        cardMessage.push(cards[i])
        temp.push(card)
      }
      this.setState({cards: temp, topElementStyle: this.props.listDetails.topElementStyle})
      this.setState({showPlus: true})
      this.setState({broadcast: cardMessage})
    }
  }

  openListModal () {
    console.log('opening CardModal for edit', this.state)
    return (<ListModal edit
      id={this.props.id}
      cards={this.props.cards}
      buttons={this.state.buttons}
      title={this.state.title}
      subtitile={this.state.subtitle}
      imgSrc={this.state.imgSrc}
      replyWithMessage={this.props.replyWithMessage}
      pageId={this.props.pageId}
      closeModal={this.closeEdit}
      addComponent={this.props.addComponent}
      hideUserOptions={this.props.hideUserOptions} />)
  }

  render () {
    let buttonPayloads = this.state.buttons.map((button) => button.payload)
    return (
      <div className='broadcast-component' style={{marginBottom: '50px'}}>
        {
          this.state.editing && this.openListModal()
        }
        <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: buttonPayloads}) }} style={{float: 'right', height: 20 + 'px', zIndex: 6, right: this.props.sequence ? 0 + 'px' : '100px', marginTop: '-20px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <div onClick={this.edit} className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '175px', maxWidth: '225px', cursor: 'pointer'}} >
          {
            this.props.cards.map((card, index) => {
              let largeStyle = null
              if (index === 0 && this.state.topElementStyle === 'LARGE') {
                largeStyle = {
                  backgroundImage: card.imgSrc,
                  backgroundSize: '100%',
                  backgroundRepeat: 'no-repeat'
                }
              }
              return (
                <div style={largeStyle}>
                  <div className='row' style={{padding: '10px'}}>
                    <div className={largeStyle ? 'col-12' : 'col-6'} style={{minHeight: '75px'}}>
                      <h6 style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '15px'}}>{card.title}</h6>
                      <p style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '12px'}}>{card.description}</p>
                    </div>
                    {!largeStyle && <div className='col-6'>
                      <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '80%', minWidth: '80%', marginLeft: '20%'}} >
                        {
                            card.imgSrc &&
                            <img src={card.imgSrc} style={{maxWidth: '100%', maxHeight: '100%'}} />
                            }
                      </div>
                      </div>
                      }
                    {
                        card.buttons && card.buttons.map(button => {
                          return (
                            <div className='ui-block' style={{border: '1px solid rgb(7, 130, 255)', borderRadius: '3px', minHeight: '50%', minWidth: '25%', marginLeft: '10%'}} >
                              <h6 style={{color: '#0782FF', fontSize: '12px'}}>{button.type === 'element_share' ? 'Share' : button.title}</h6>
                            </div>
                          )
                        })
                        }
                    {
                        index !== this.props.cards.length - 1 && <hr width='96.5%' />
                        }
                  </div>
                </div>)
            })
          }
          {
            this.state.buttons.map(button => {
              return (
                <div>
                  <hr />
                  <h5 style={{color: '#0782FF'}}>{button.type === 'element_share' ? 'Share' : button.title}</h5>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(List)
