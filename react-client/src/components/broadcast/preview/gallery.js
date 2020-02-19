import React from 'react'
import PropTypes from 'prop-types'
import CARD from './card'
import BUTTONITEM from './buttonItem'

class Gallery extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedCard: 0
    }
    this.onRemove = this.onRemove.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrev = this.onPrev.bind(this)
  }

  onRemove () {
    this.props.removeComponent(this.props.itemPayload.id)
  }

  onEdit () {
    this.props.editComponent(this.props.itemPayload)
  }

  onNext () {
    let data = this.props.itemPayload
    data.activeCard = data.activeCard + 1
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
  }

  onPrev () {
    let data = this.props.itemPayload
    data.activeCard = data.activeCard - 1
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps called in gallery preview')
    if (nextProps.itemPayload) {
      this.setState({selectedCard: nextProps.itemPayload.activeCard})
    }
  }

  render () {
    console.log('props in gallery preview', this.props)
    return (
      <div key={this.props.itemPayload.id} style={{float: 'none'}} className="m-messenger__message m-messenger__message--in">
        <div style={{verticalAlign: 'bottom', width: '50px'}} className="m-messenger__message-pic">
          {
            this.props.lastItem &&
            <img src={this.props.profilePic} alt="" className="mCS_img_loaded" />
          }
        </div>
        <div className="m-messenger__message-body">
          <div id="flow_builder_gallery_preview" data-interval="false" className="carousel slide ui-block" data-ride="carousel">
            <div className="carousel-inner carousel-inner-preview" style={{top: 0, right: 0}}>
            {
              this.props.itemPayload.cards.map((card, index) => (
                <CARD
                  card={card}
                  selectedIndex={this.props.itemPayload.activeCard}
                  currentIndex={index}
                />
              ))
            }
            {
              this.props.itemPayload.cards[this.props.itemPayload.activeCard].buttons.map(button => (
                <div style={{marginLeft: '15px', border: 'none', maxWidth: '150px'}} className='card'>
                  <BUTTONITEM
                    title={button.title}
                  />
                </div>
              ))
            }
            </div>
            {
              this.props.itemPayload.cards.length > 1 &&
              <div>
                {
                  this.props.itemPayload.activeCard > 0 &&
                  <span onClick={this.onPrev} className="carousel-control-prev" role="button" >
                    <span
                      className="carousel-control-prev-icon"
                      style={{
                        cursor: 'pointer',
                        backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E")`
                      }}
                      aria-hidden="true"
                    />
                    <span className="sr-only">Previous</span>
                  </span>
                }
                {
                  this.props.itemPayload.activeCard < (this.props.itemPayload.cards.length - 1) &&
                  <span onClick={this.onNext} className="carousel-control-next" role="button" data-slide="next">
                    <span
                      className="carousel-control-next-icon"
                      style={{
                        cursor: 'pointer',
                        backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E")`
                      }}
                      aria-hidden="true"
                    />
                    <span className="sr-only">Next</span>
                  </span>
                }
              </div>
            }
          </div>
        </div>
        {
          !this.props.isActive &&
          <span onClick={this.onRemove} style={{cursor: 'pointer', right: '-10px', top: '-10px'}} className='fa-stack'>
            <i className='la la-close' />
          </span>
        }
        {
          !this.props.isActive &&
          <span onClick={this.onEdit} style={{cursor: 'pointer', display: 'block', right: '-10px', bottom: '0px'}} className='fa-stack'>
            <i className='la la-pencil-square' />
          </span>
        }
      </div>
    )
  }
}

Gallery.propTypes = {
  'lastItem': PropTypes.bool.isRequired,
  'itemPayload': PropTypes.object.isRequired,
  'profilePic': PropTypes.string.isRequired,
  'removeComponent': PropTypes.func.isRequired,
  'editComponent': PropTypes.func.isRequired,
  'isActive': PropTypes.bool.isRequired,
  'updateBroadcastData': PropTypes.func.isRequired,
  'blockId': PropTypes.number.isRequired
}

export default Gallery
