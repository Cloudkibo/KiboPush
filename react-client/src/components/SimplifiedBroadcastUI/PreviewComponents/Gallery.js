/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadImage, uploadTemplate } from '../../../redux/actions/convos.actions'
import { checkWhitelistedDomains } from '../../../redux/actions/broadcast.actions'
import CardModal from '../CardModal'

class Gallery extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.edit = this.edit.bind(this)
    this.closeEdit = this.closeEdit.bind(this)
    this.getDeletePayload = this.getDeletePayload.bind(this)
    this.state = {
      editing: false,
      cards: this.props.cards ? this.props.cards : []
    }
    console.log('Gallery constructor state', this.state)
  }

  openCardModal () {
    console.log('opening CardModal for edit', this.state)
    return (<CardModal edit
      cards={this.state.cards}
      buttonActions={this.props.buttonActions}
      id={this.props.id}
      replyWithMessage={this.props.replyWithMessage}
      pageId={this.props.pageId}
      closeModal={this.closeEdit}
      addComponent={this.props.addComponent}
      hideUserOptions={this.props.hideUserOptions} />)
  }

  closeEdit () {
    console.log('closeEdit Card')
    this.setState({editing: false})
  }

  edit () {
    this.setState({editing: true})
  }

  getDeletePayload() {
    let deletePayload = []
    for (let i = 0; i < this.state.cards.length; i++) {
      for (let j = 0; j < this.state.cards[i].buttons.length; j++) {
        let button = this.state.cards[i].buttons[j]
        if (button.payload) {
          deletePayload.push(button.payload)
        }
      }
    }
    return deletePayload
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px'}}>
        {
          this.state.editing && this.openCardModal()
        }
        {
          <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: this.getDeletePayload()}) }} style={{float: 'right', height: 20 + 'px', marginTop: '-20px'}}>
            <span style={{cursor: 'pointer'}} className='fa-stack'>
              <i className='fa fa-times fa-stack-2x' />
            </span>
          </div>
        }
        <i onClick={this.edit} style={{cursor: 'pointer', marginLeft: '-15px', float: 'left', height: '20px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        <div id="carouselExampleControls" data-interval="false" style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '200px', maxWidth: '250px', marginRight: '30px'}} className="carousel slide ui-block" data-ride="carousel">
            <div className="carousel-inner">
            {
            this.state.cards.map((card, index) => (
                <div className={'carousel-item ' + (index === 0 ? 'active' : '')}>
                    {
                        card.image_url &&
                        <img src={card.image_url} style={{maxHeight: '130px', minWidth: '250px', padding: '25px', margin: '-25px'}} />
                    }
                    <hr style={{marginTop: card.image_url ? '' : '100px', marginBottom: '5px'}} />
                    <h6 style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{card.title}</h6>
                    <p style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '13px'}}>{card.subtitle}</p>
                    {
                        card.buttons.map((button, index) => {
                            return (
                            <div>
                                <hr style={{marginTop: !card.title && !card.subtitle && index === 0 ? '50px' : ''}}/>
                                <h5 style={{color: '#0782FF'}}>{button.type === 'element_share' ? 'Share' : button.title}</h5>
                            </div>
                            )
                        })
                    }
                </div>
            ))                   
            }
            </div>
            {
            this.state.cards.length > 1 && 
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
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({uploadImage: uploadImage, uploadTemplate: uploadTemplate, checkWhitelistedDomains: checkWhitelistedDomains}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Gallery)
