import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

const activeStyle = {
  pointerEvents: 'auto',
  padding: 0,
  minHeight: '85px'
}

const disabledStyle = {
  pointerEvents: 'none',
  padding: 0,
  minHeight: '85px'
}

const activeCursor = {
  cursor: 'pointer'
}

const disabledCursor = {
  cursor: 'not-allowed'
}

const descriptionStyle = {
  fontSize: '0.85em',
  marginBottom: '5px'
}

const headerStyle = {
  textAlign: 'left',
  marginBottom: 0
}

const innerColumnStyle = {
  paddingLeft: '20px', 
  paddingRight: '20px'
}

const outerColumnStyle = {
  padding: 0
}

const tooltipText = 'You can only add upto 3 components per message.'

class GenericMessageComponents extends React.Component {

  render () {
    let componentStyle = (this.props.addedComponents === 3) ? disabledStyle : activeStyle
    let cursorStyle = (this.props.addedComponents === 3) ? disabledCursor : activeCursor
    return (
      <div className='row' style={{overflowX: 'hidden'}}>
        <ReactTooltip
          place='right'
          type='info'
          multiline={true}
          disable={!(this.props.addedComponents === 3)}
        />
        <div data-tip={tooltipText} style={{...cursorStyle, ...outerColumnStyle}} className='col-6' hidden={this.props.hiddenComponents.indexOf('text') > -1 ? true : null}>
          <div style={componentStyle} className='ui-block hoverbordercomponent' id='text' onClick={() => { this.props.addComponent('text') }}>
            <div className='row'>
              <div className='col-12' style={innerColumnStyle}>
                <h5 style={headerStyle}>
                  <img src='https://cdn.cloudkibo.com/public/icons/text.png' alt='Text' style={{maxHeight: '20px', margin: '10px', marginLeft: '20px'}} />
                  Text
                </h5>
                <p style={descriptionStyle}>
                  Enter Text Message (up to 2000 characters)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div data-tip={tooltipText} style={{...cursorStyle, ...outerColumnStyle}} className='col-6' hidden={this.props.hiddenComponents.indexOf('media') > -1 ? true : null}>
          <div style={componentStyle} className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('media') }}>
            <div className='row'>
              <div className='col-12' style={innerColumnStyle}>
                <h5 style={headerStyle}>
                  <img src='https://cdn.cloudkibo.com/public/icons/media.png' alt='Media' style={{maxHeight: '20px', margin: '10px', marginLeft: '20px'}} />
                  Media
                </h5>
                {this.props.module && this.props.module === 'whatsapp' ?
                <p style={descriptionStyle}>Upload an image or video (up to 5 MB)</p>
                :
                <p style={descriptionStyle}>Upload an image or video (up to 10 MB)</p>
                }
              </div>
            </div>
          </div>
        </div>
        <div data-tip={tooltipText} style={{...cursorStyle, ...outerColumnStyle}} className='col-6' hidden={this.props.hiddenComponents.indexOf('card') > -1 ? true : null}>
          <div style={componentStyle} className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('card') }}>
            <div className='row'>
              <div className='col-12' style={innerColumnStyle}>
                <h5 style={headerStyle}>
                  <img src='https://cdn.cloudkibo.com/public/icons/card.png' alt='Card' style={{maxHeight: '20px', margin: '10px', marginLeft: '20px'}} />
                  Gallery
                </h5>
                <p style={descriptionStyle}>Create a photo carousel by uploading up to 10 images</p>
              </div>
            </div>
          </div>
        </div>
        <div data-tip={tooltipText} style={{...cursorStyle, ...outerColumnStyle}} className='col-6' hidden={this.props.hiddenComponents.indexOf('audio') > -1 ? true : null}>
          <div style={componentStyle} className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('audio') }}>
            <div className='row'>
              <div className='col-12' style={innerColumnStyle}>
                <h5 style={headerStyle}>
                  <img src='https://cdn.cloudkibo.com/public/icons/speaker.png' alt='Audio' style={{maxHeight: '20px', margin: '10px', marginLeft: '20px'}} />
                  Audio
                </h5>
                {this.props.module && this.props.module === 'whatsapp' ?
                <p style={descriptionStyle}>Upload any audio/music file (up to 5 MB)</p>
                :
                <p style={descriptionStyle}>Upload any audio/music file (up to 10 MB)</p>
                }
              </div>
            </div>
          </div>
        </div>
        <div data-tip={tooltipText} style={{...cursorStyle, ...outerColumnStyle}} className='col-6' hidden={this.props.hiddenComponents.indexOf('file') > -1 ? true : null}>
          <div style={componentStyle} className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('file') }}>
            <div className='row'>
              <div className='col-12' style={innerColumnStyle}>
                <h5 style={headerStyle}>
                  <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='File' style={{maxHeight: '20px', margin: '10px', marginLeft: '20px'}} />
                  File
                </h5>
                {this.props.module && this.props.module === 'whatsapp' ?
                  <p style={descriptionStyle}>Upload any file/document (up to 5 MB)</p>
                  :
                  <p style={descriptionStyle}>Upload any file/document (up to 10 MB)</p>
                }
              </div>
            </div>
          </div>
        </div>
        <div data-tip={tooltipText} style={{...cursorStyle, ...outerColumnStyle}} className='col-6' hidden={this.props.hiddenComponents.indexOf('video') > -1 ? true : null}>
          <div style={componentStyle} className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('video') }}>
            <div className='row'>
              <div className='col-12' style={innerColumnStyle}>
                <h5 style={headerStyle}>
                  <img src='https://cdn.cloudkibo.com/public/icons/video.png' alt='Video' style={{maxHeight: '20px', margin: '10px', marginLeft: '20px'}} />
                  YouTube Video
                </h5>
                <p style={descriptionStyle}>Enter a YouTube video link to send it as a card</p>
              </div>
            </div>
          </div>
        </div>
        <div data-tip={tooltipText} style={{...cursorStyle, ...outerColumnStyle}} className='col-6' hidden={this.props.hiddenComponents.indexOf('link') > -1 ? true : null}>
          <div style={componentStyle} className='ui-block hoverbordercomponent' onClick={() => { this.props.addComponent('link') }}>
            <div className='row'>
              <div className='col-12' style={innerColumnStyle}>
                <h5 style={headerStyle}>
                  <img src='https://cdn.cloudkibo.com/public/icons/layout.png' alt='Link' style={{maxHeight: '20px', margin: '10px', marginLeft: '20px'}} />
                  Link Carousel
                </h5>
                <p style={descriptionStyle}>Enter up to 10 links to create a photo carousel</p>
              </div>
            </div>
          </div>
        </div>

        {
          this.props.module === 'broadcast' &&
          <div data-tip={tooltipText} style={{...cursorStyle, ...outerColumnStyle}} className='col-6' hidden={this.props.hiddenComponents.indexOf('userInput') > -1 ? true : null}>
          <div style={componentStyle} className='ui-block hoverbordercomponent' id='text' onClick={() => { this.props.addComponent('userInput') }}>
            <div className='row'>
              <div className='col-12' style={innerColumnStyle}>
                <h5 style={headerStyle}>
                  <img src='https://cdn.cloudkibo.com/public/icons/text.png' alt='Text' style={{maxHeight: '20px', margin: '10px', marginLeft: '20px'}} />
                  User Input
                </h5>
                <p style={descriptionStyle}>
                  Take input from users and save the response
                </p>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    )
  }
}

GenericMessageComponents.propTypes = {
  'addComponent': PropTypes.func.isRequired,
  'hiddenComponents': PropTypes.array,
  'addedComponents': PropTypes.number.isRequired
}

GenericMessageComponents.defaultProps = {
  'hiddenComponents': []
}

export default GenericMessageComponents
