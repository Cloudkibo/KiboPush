/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadImage, uploadTemplate } from '../../../redux/actions/convos.actions'
import { checkWhitelistedDomains } from '../../../redux/actions/broadcast.actions'

class Gallery extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.edit = this.edit.bind(this)
    this.getDeletePayload = this.getDeletePayload.bind(this)
    this.state = {
      cards: this.props.cards ? this.props.cards : [],
      selectedIndex: 0
    }
    console.log('Gallery constructor state', this.state)
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

  edit () {
    console.log('gallery edit')
    let cards = this.state.cards
    for (let i = 0; i < cards.length; i++) {
      cards[i].buttons = [].concat(cards[i].buttons)
    }
    if (this.props.links) {
      this.props.editComponent('link', {
        links: this.props.links,
        cards: cards,
        buttonActions: this.props.buttonActions,
        id: this.props.id
      })
    } else {
      this.props.editComponent('card', {
        cards: cards,
        buttonActions: this.props.buttonActions,
        id: this.props.id
      })
    }
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
          <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: this.getDeletePayload()}) }} style={{float: 'right', height: 20 + 'px', marginTop: '-20px'}}>
            <span style={{cursor: 'pointer'}} className='fa-stack'>
              <i className='fa fa-times fa-stack-2x' />
            </span>
          </div>
        }
        <i onClick={this.edit} style={{cursor: 'pointer', marginLeft: '-25px', float: 'left', height: '20px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        <div id="carouselExampleControls" data-interval="false" className="carousel slide ui-block" data-ride="carousel">
            <div className="carousel-inner carousel-inner-preview" style={{top: 0, right: 0}}>
            {
            this.state.cards.map((card, index) => (
                <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '125px', maxWidth: '175px', margin: 'auto', transform: index === this.state.selectedIndex-1 ? 'translate3d(62%, 0, 0)' : index === this.state.selectedIndex+1 ? 'translate3d(-20%, 0, 0' : ''}} className={"carousel-item carousel-item-preview " + (index === this.state.selectedIndex ? "active" : "") + (index === this.state.selectedIndex+1 ? "next" : "") + (index === this.state.selectedIndex-1 ? "prev" : "")}>
                    {
                        card.image_url &&
                        <img src={card.image_url} style={{maxHeight: '120px', maxWidth: '175px', padding: '10px', margin: '-10px'}} />
                    }
                    <hr style={{marginTop: card.image_url ? '' : '100px', marginBottom: '5px'}} />
                    <h6 style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{card.title}</h6>
                    <p style={{textAlign: 'left', marginLeft: '10px', marginTop: '5px', fontSize: '13px'}}>{card.subtitle}</p>
                    <p style={{textAlign: 'left', marginLeft: '10px', fontSize: '13px'}}>{card.default_action && card.default_action.url}</p>
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
                <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" style={{backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E")`}} aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
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
