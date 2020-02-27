import React from 'react'
// import PropTypes from 'prop-types'

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <div
        className='m-messenger'
        style={{
          position: 'absolute',
          bottom: 0,
          borderTop: '1px solid #ebedf2',
          width: '100%',
          padding: '15px'
        }}
      >
        <div className='m-messenger__form'>
          <div className='m-messenger__form-controls'>
            <input
              autoFocus
              type='text'
              placeholder='Type here...'
              onChange={() => {}}
              value={''}
              onKeyPress={() => {}}
              className='m-messenger__form-input'
            />
          </div>
          <div className='m-messenger__form-tools'>
            <button style={{border: '1px solid #36a3f7'}} className='m-messenger__form-attachment'>
              <i style={{color: '#36a3f7'}} onClick={() => {}} className='la la-thumbs-o-up' />
            </button>
          </div>
        </div>
        <div style={{color: '#575962'}}>
          <i
            style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
            data-tip='Upload Attachment'
            className='fa fa-paperclip'
          />
          <i
            style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
            data-tip='Record Audio'
            className='fa fa-microphone'
          />
          <i
            style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
            data-tip='Emoticons'
            className='fa fa-smile-o'
          />
          <i
            style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
            data-tip='Stickers'
            className='fa fa-sticky-note'
          />
          <img
            style={{cursor: 'pointer', height: '20px', margin: '-5px 5px 0px 5px'}}
            data-tip='Gifs'
            alt='Gifs'
            src='gif-icon.png'
          />
        </div>
      </div>
    )
  }
}

Footer.propTypes = {

}

export default Footer
