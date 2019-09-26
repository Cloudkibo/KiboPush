import React from 'react'
import PropTypes from 'prop-types'

class GenericMessageComponents extends React.Component {
  render () {
    return (
      <div className='row' style={{maxHeight: '400px', overflowY: 'scroll'}}>
        <div className='col-12' hidden={this.props.hiddenComponents.indexOf('text') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' id='text' onClick={() => { this.props.addComponent('text') }}>
            <div className='row'>
              <div className='col-2'>
                <img src='https://cdn.cloudkibo.com/public/icons/text.png' alt='Text' style={{maxHeight: '40px', margin: '10px', marginLeft: '20px'}} />
              </div>
              <div className='col-8'>
                <h5>Text</h5>
                <p>
                  Enter Text Message (up to 2000 characters)
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className='col-12' hidden={this.props.hiddenComponents.indexOf('image') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('image') }}>
            <div className='row'>
              <div className='col-2'>
                <img src='https://cdn.cloudkibo.com/public/icons/picture.png' alt='Image' style={{maxHeight: '40px', margin: '10px', marginLeft: '20px'}} />
              </div>
              <div className='col-8'>
                <h5>Image</h5>
                <p>Upload an image (up to 10 MB)</p>
              </div>
            </div>
          </div>
        </div> */}
        <div className='col-12' hidden={this.props.hiddenComponents.indexOf('media') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('media') }}>
            <div className='row'>
              <div className='col-2'>
                <img src='https://cdn.cloudkibo.com/public/icons/media.png' alt='Media' style={{maxHeight: '40px', margin: '10px', marginLeft: '20px'}} />
              </div>
              <div className='col-8'>
                <h5>Media</h5>
                <p>Upload an image or video (up to 10 MB)</p>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12' hidden={this.props.hiddenComponents.indexOf('card') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('card') }}>
            <div className='row'>
              <div className='col-2'>
                <img src='https://cdn.cloudkibo.com/public/icons/card.png' alt='Card' style={{maxHeight: '40px', margin: '10px', marginLeft: '20px'}} />
              </div>
              <div className='col-8'>
                <h5>Gallery</h5>
                <p>Create a photo carousel by uploading up to 10 images</p>
              </div>
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
        <div className='col-12' hidden={this.props.hiddenComponents.indexOf('audio') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('audio') }}>
            <div className='row'>
              <div className='col-2'>
                <img src='https://cdn.cloudkibo.com/public/icons/speaker.png' alt='Audio' style={{maxHeight: '40px', margin: '10px', marginLeft: '20px'}} />
              </div>
              <div className='col-8'>
                <h5>Audio</h5>
                <p>Upload an audio file (up to 10 MB)</p>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12' hidden={this.props.hiddenComponents.indexOf('file') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('file') }}>
            <div className='row'>
              <div className='col-2'>
                <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='File' style={{maxHeight: '40px', margin: '10px', marginLeft: '20px'}} />
              </div>
              <div className='col-8'>
                <h5>File</h5>
                <p>Upload a file (up to 10 MB)</p>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12' hidden={this.props.hiddenComponents.indexOf('video') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('video') }}>
            <div className='row'>
              <div className='col-2'>
                <img src='https://cdn.cloudkibo.com/public/icons/video.png' alt='Video' style={{maxHeight: '40px', margin: '10px', marginLeft: '20px'}} />  
              </div>
              <div className='col-8'>
                <h5>YouTube Video</h5>
                <p>Enter a YouTube video link to send it as a playable video</p>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12' hidden={this.props.hiddenComponents.indexOf('link') > -1 ? true : null}>
          <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('link') }}>
            <div className='row'>
              <div className='col-2'>
                <img src='https://cdn.cloudkibo.com/public/icons/layout.png' alt='Link' style={{maxHeight: '40px', margin: '10px', marginLeft: '20px'}} />  
              </div>
              <div className='col-8'>
                <h5>Link Carousel</h5>
                <p>Enter up to 10 links to create a photo carousel</p>
              </div>
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
