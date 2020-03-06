import React from 'react'
import PropTypes from 'prop-types'

class Poll extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <div className='m-messenger__message-text'>
        <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}}>
          {this.props.poll.text}
        </div>
        <div>
          {
            this.props.poll.quick_replies &&
            this.props.poll.quick_replies.length > 0 &&
            this.props.poll.quick_replies.map((b, x) => (
              <button key={x} style={{margin: '3px', backgroundColor: 'white'}} type='button' className='btn m-btn--pill btn-secondary m-btn m-btn--bolder btn-sm'>
                {b.title}
              </button>
            ))
          }
        </div>
      </div>
    )
  }
}

Poll.propTypes = {
  'poll': PropTypes.object.isRequired
}

export default Poll
