import React from 'react'
import PropTypes from 'prop-types'

class MessageArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{border: '1px solid #ccc', backgroundColor: 'white', padding: '0px'}} className='col-md-9'>
        <div className='m-portlet m-portlet-mobile'>
          <div style={{height: '75vh'}} className='m-portlet__body'></div>
        </div>
      </div>
    )
  }
}

MessageArea.propTypes = {
  'data': PropTypes.array.isRequired
}

export default MessageArea
