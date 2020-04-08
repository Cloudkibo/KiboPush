import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './header'
import TEXTAREA from './textArea'

class MessageArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{border: '1px solid #ccc', backgroundColor: 'white', padding: '0px'}} className='col-md-9'>
        <div style={{margin: '0px'}} className='m-portlet m-portlet-mobile'>
          <div style={{height: '80vh'}} className='m-portlet__body'>
            <HEADER
              title={this.props.block.title}
              showDelete={true}
              onDelete={() => {}}
              onTest={() => {}}
              canTest={false}
              canPublish={false}
              onPublish={() => {}}
              onDisable={() => {}}
              isPublished={false}
              alertMsg={this.props.alertMsg}
            />
            <div className='m--space-30' />
            <TEXTAREA
              data={{}}
            />
          </div>
        </div>
      </div>
    )
  }
}

MessageArea.propTypes = {
  'block': PropTypes.object.isRequired,
  'chatbot': PropTypes.object.isRequired,
  'alertMsg': PropTypes.element.isRequired
}

export default MessageArea
