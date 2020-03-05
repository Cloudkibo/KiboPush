import React from 'react'
import PropTypes from 'prop-types'

class Survey extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <div className='m-messenger__message-text'>
        <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}}>
          {this.props.survey.text}
        </div>
        <div style={{margin: '0px -14px -20px -20px'}}>
          {
            this.props.survey.attachment.payload.buttons &&
            this.props.survey.attachment.payload.buttons.length > 0 &&
            this.props.survey.attachment.payload.buttons.map((b, i) => (
              <button
                key={i}
                style={{
                  margin: '3px 3px -4px 3px',
                  borderRadius: (this.props.survey.attachment.payload.buttons.length === (i + 1)) ? '0px 0px 10px 10px' : 0,
                  borderColor: '#716aca',
                  backgroundColor: 'white'
                }}
                type='button'
                className='btn btn-secondary btn-block'
              >
                {
                  typeof b.title === 'string' &&
                  b.title
                }
              </button>
            ))
          }
        </div>
      </div>
    )
  }
}

Survey.propTypes = {
  'survey': PropTypes.object.isRequired
}

export default Survey
