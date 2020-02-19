import React from 'react'
import PropTypes from 'prop-types'
import CARD from './card'
import BUTTONITEM from './buttonItem'

class YouTubeVideo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.onRemove = this.onRemove.bind(this)
    this.onEdit = this.onEdit.bind(this)
  }

  onRemove () {
    this.props.removeComponent(this.props.itemPayload.id)
  }

  onEdit () {
    this.props.editComponent(this.props.itemPayload)
  }

  render () {
    console.log('props in YouTube video preview', this.props)
    return (
      <div key={this.props.itemPayload.id} style={{float: 'none'}} className="m-messenger__message m-messenger__message--in">
        <div style={{verticalAlign: 'bottom', width: '50px'}} className="m-messenger__message-pic">
          {
            this.props.lastItem &&
            <img src={this.props.profilePic} alt="" className="mCS_img_loaded" />
          }
        </div>
        <div className="m-messenger__message-body">
          <div data-interval="false" className="carousel slide ui-block" data-ride="carousel">
            <div className="carousel-inner carousel-inner-preview" style={{top: 0, right: 0}}>
              <CARD
                card={this.props.itemPayload}
                selectedIndex={0}
                currentIndex={0}
              />
              {
                this.props.itemPayload.buttons.map(button => (
                  <div style={{marginLeft: '15px', border: 'none', maxWidth: '150px'}} className='card'>
                    <BUTTONITEM
                      title={button.title}
                    />
                  </div>
                ))
              }
            </div>
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

YouTubeVideo.propTypes = {
  'lastItem': PropTypes.bool.isRequired,
  'itemPayload': PropTypes.object.isRequired,
  'profilePic': PropTypes.string.isRequired,
  'removeComponent': PropTypes.func.isRequired,
  'editComponent': PropTypes.func.isRequired,
  'isActive': PropTypes.bool.isRequired,
  'updateBroadcastData': PropTypes.func.isRequired,
  'blockId': PropTypes.number.isRequired
}

export default YouTubeVideo
