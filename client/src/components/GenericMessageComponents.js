/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class GenericMessageComponents extends React.Component {
  render () {
    return (
      <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
        <div className='row' >
          <div className='col-3'>
            <div className='ui-block hoverbordercomponent' id='text' onClick={() => { this.props.addComponent('Text') }}>
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/text.png' alt='Text' style={{maxHeight: 25}} />
                <h6>Text</h6>
              </div>
            </div>
          </div>
          <div className='col-3'>
            <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('Image') }}>
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/picture.png' alt='Image' style={{maxHeight: 25}} />
                <h6>Image</h6>
              </div>
            </div>
          </div>
          <div className='col-3'>
            <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('Card') }}>
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/card.png' alt='Card' style={{maxHeight: 25}} />
                <h6>Card</h6>
              </div>
            </div>
          </div>
          <div className='col-3'>
            <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('Gallery') }}>
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
                <h6>Gallery</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-3'>
            <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('Audio') }}>
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
                <h6>Audio</h6>
              </div>
            </div>
          </div>
          <div className='col-3'>
            <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('Video') }}>
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/video.png' alt='Video' style={{maxHeight: 25}} />
                <h6>Video</h6>
              </div>
            </div>
          </div>
          <div className='col-3'>
            <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('File') }}>
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='File' style={{maxHeight: 25}} />
                <h6>File</h6>
              </div>
            </div>
          </div>
          <div className='col-3'>
            <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('List') }}>
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/list.png' alt='List' style={{maxHeight: 25}} />
                <h6>List</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-3'>
            <div className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('Media') }}>
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/media.png' alt='Media' style={{maxHeight: 25}} />
                <h6>Media</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GenericMessageComponents
