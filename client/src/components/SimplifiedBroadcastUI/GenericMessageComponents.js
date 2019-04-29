import React from 'react'
import PropTypes from 'prop-types'

class GenericMessageComponents extends React.Component {
  render () {
    return (
      <div className='row' >
        <div className='col-3' hidden={this.props.hiddenComponents.indexOf('text') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' id='text' onClick={() => { this.props.addComponent('text') }}>
            <div className='align-center'>
              <img src='https://cdn.cloudkibo.com/public/icons/text.png' alt='Text' style={{maxHeight: 25}} />
              <h6>Text</h6>
            </div>
          </div>
        </div>
        <div className='col-3' hidden={this.props.hiddenComponents.indexOf('image') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('image') }}>
            <div className='align-center'>
              <img src='https://cdn.cloudkibo.com/public/icons/picture.png' alt='Image' style={{maxHeight: 25}} />
              <h6>Image</h6>
            </div>
          </div>
        </div>
        <div className='col-3' hidden={this.props.hiddenComponents.indexOf('card') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('card') }}>
            <div className='align-center'>
              <img src='https://cdn.cloudkibo.com/public/icons/card.png' alt='Card' style={{maxHeight: 25}} />
              <h6>Card</h6>
            </div>
          </div>
        </div>
        {/* <div className='col-3' hidden={this.props.hiddenComponents.indexOf('gallery') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('gallery') }}>
            <div className='align-center'>
              <img src='https://cdn.cloudkibo.com/public/icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
              <h6>Gallery</h6>
            </div>
          </div>
        </div> */}
        <div className='col-3' hidden={this.props.hiddenComponents.indexOf('audio') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('audio') }}>
            <div className='align-center'>
              <img src='https://cdn.cloudkibo.com/public/icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
              <h6>Audio</h6>
            </div>
          </div>
        </div>
        <div className='col-3' hidden={this.props.hiddenComponents.indexOf('video') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('video') }}>
            <div className='align-center'>
              <img src='https://cdn.cloudkibo.com/public/icons/video.png' alt='Video' style={{maxHeight: 25}} />
              <h6>Video</h6>
            </div>
          </div>
        </div>
        <div className='col-3' hidden={this.props.hiddenComponents.indexOf('file') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('file') }}>
            <div className='align-center'>
              <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='File' style={{maxHeight: 25}} />
              <h6>File</h6>
            </div>
          </div>
        </div>
        <div className='col-3' hidden={this.props.hiddenComponents.indexOf('list') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('list') }}>
            <div className='align-center'>
              <img src='https://cdn.cloudkibo.com/public/icons/list.png' alt='List' style={{maxHeight: 25}} />
              <h6>List</h6>
            </div>
          </div>
        </div>
        <div className='col-3' hidden={this.props.hiddenComponents.indexOf('media') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('media') }}>
            <div className='align-center'>
              <img src='https://cdn.cloudkibo.com/public/icons/media.png' alt='Media' style={{maxHeight: 25}} />
              <h6>Media</h6>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

GenericMessageComponents.propTypes = {
  'addComponent': PropTypes.func.isRequired,
  'hiddenComponents': PropTypes.array
}

GenericMessageComponents.defaultProps = {
  'hiddenComponents': []
}

export default GenericMessageComponents
