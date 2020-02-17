import React from 'react'
import PropTypes from 'prop-types'

class Attachments extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.onRemove = this.onRemove.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.getItem = this.getItem.bind(this)
  }

  onRemove () {
    this.props.removeComponent(this.props.itemPayload.id)
  }

  onEdit () {
    this.props.editComponent(this.props.itemPayload)
  }

  getItem () {
    const type = this.props.itemPayload.componentName === 'media' ? this.props.itemPayload.mediaType : this.props.itemPayload.componentName
    switch (type) {
      case 'file':
        return (
          <div style={{minHeight: '55px'}} className="m-messenger__message-content">
            <span className="m-dropzone__msg-title">
              <i className="fa fa-file-text" /> {this.props.itemPayload.fileName.length > 15 ? `${this.props.itemPayload.fileName.substring(0, 15)}...` : this.props.itemPayload.fileName}
            </span>
          </div>
        )
      case 'audio':
        return (
          <audio style={{width: '175px'}} controls>
            <source src={this.props.itemPayload.fileurl.url} />
          </audio>
        )
      case 'image':
        return (<img
          style={{maxWidth: '175px', borderRadius: '10px'}}
          src={this.props.itemPayload.fileurl.url}
          alt={this.props.itemPayload.fileName}
        />)
      case 'video':
        return (
          <video style={{maxWidth: '175px', borderRadius: '10px'}} controls>
            <source src={this.props.itemPayload.fileurl.url} />
          </video>
        )
      default:
        return (
          <div style={{minHeight: '55px'}} className="m-messenger__message-content" />
        )
    }
  }

  render () {
    console.log('props in attachments preview', this.props)
    return (
      <div style={{float: 'none'}} className="m-messenger__message m-messenger__message--in">
        <div style={{verticalAlign: 'bottom', width: '50px'}} className="m-messenger__message-pic">
          {
            this.props.lastItem &&
            <img src={this.props.profilePic} alt="" class="mCS_img_loaded" />
          }
        </div>
        <div className="m-messenger__message-body">
          {
            this.props.lastItem && this.props.itemPayload.componentType === 'file' &&
            <div style={{bottom: 0}} class="m-messenger__message-arrow"></div>
          }
          {
            this.getItem()
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

Attachments.propTypes = {
  'lastItem': PropTypes.bool.isRequired,
  'itemPayload': PropTypes.object.isRequired,
  'profilePic': PropTypes.string.isRequired,
  'removeComponent': PropTypes.func.isRequired,
  'editComponent': PropTypes.func.isRequired,
  'isActive': PropTypes.bool.isRequired
}

export default Attachments
