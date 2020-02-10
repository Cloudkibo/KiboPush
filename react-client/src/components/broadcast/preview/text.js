import React from 'react'
import PropTypes from 'prop-types'

class Text extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    console.log('props in text preview', this.props)
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
            this.props.lastItem && this.props.itemPayload.text !== '' &&
            <div style={{bottom: 0}} class="m-messenger__message-arrow"></div>
          }
          <div style={{minHeight: '55px'}} className="m-messenger__message-content">
            <div className="m-messenger__message-text">
              {this.props.itemPayload.text}
            </div>
          </div>
        </div>
        <span style={{cursor: 'pointer', right: '-10px', top: '-10px'}} className='fa-stack'>
          <i className='la la-close' />
        </span>
        <span style={{cursor: 'pointer', display: 'block', right: '-10px', bottom: '0px'}} className='fa-stack'>
          <i className='la la-pencil-square' />
        </span>
      </div>
    )
  }
}

Text.propTypes = {
  'lastItem': PropTypes.bool.isRequired,
  'itemPayload': PropTypes.object.isRequired,
  'profilePic': PropTypes.string.isRequired
}

export default Text
