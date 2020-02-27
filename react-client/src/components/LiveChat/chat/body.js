import React from 'react'
// import PropTypes from 'prop-types'

class Body extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  render() {
    return (
      <div style={{padding: '2.2rem 0rem 2.2rem 2.2rem'}} className='m-portlet__body'>
        <div className='tab-content'>
          <div className='tab-pane active m-scrollable' role='tabpanel'>
            <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
              <div style={{position: 'relative', overflow: 'hidden', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                <div id='chat-container' style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                  <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Body.propTypes = {

}

export default Body
