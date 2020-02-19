import React from 'react'
import PropTypes from 'prop-types'
import BUTTONITEM from './buttonItem'

class Text extends React.Component {
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
    console.log('props in text preview', this.props)
    return (
      <div key={this.props.itemPayload.id} style={{float: 'none'}} className="m-messenger__message m-messenger__message--in">
        <div style={{verticalAlign: 'bottom', width: '50px'}} className="m-messenger__message-pic">
          {
            this.props.lastItem &&
            <img src={this.props.profilePic} alt="" class="mCS_img_loaded" />
          }
        </div>
        <div className="m-messenger__message-body">
          {
            this.props.lastItem &&
            this.props.itemPayload.text !== '' &&
            this.props.itemPayload.buttons.length === 0 &&
            <div style={{bottom: 0}} class="m-messenger__message-arrow"></div>
          }
          <div style={{minHeight: '55px', borderRadius: this.props.itemPayload.buttons.length > 0 && '10px 10px 0px 0px'}} className="m-messenger__message-content">
            <div className="m-messenger__message-text">
              {this.props.itemPayload.text}
            </div>
          </div>
          {
            this.props.itemPayload.buttons.map((button, index) => (
              <div key={`button-preview-${this.props.itemPayload.id}-${index}`} style={{marginLeft: '10px', border: 'none'}} className='card'>
                <BUTTONITEM
                  title={button.title}
                />
              </div>
            ))
          }
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

Text.propTypes = {
  'lastItem': PropTypes.bool.isRequired,
  'itemPayload': PropTypes.object.isRequired,
  'profilePic': PropTypes.string.isRequired,
  'removeComponent': PropTypes.func.isRequired,
  'editComponent': PropTypes.func.isRequired,
  'isActive': PropTypes.bool.isRequired
}

export default Text
