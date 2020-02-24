import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import YouTube from 'react-youtube'

class Sessions extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <div className='col-xl-4'>

      </div>
    )
  }
}

Sessions.propTypes = {
  'sessions': PropTypes.array.isRequired,
  'sessionsCount': PropTypes.number.isRequired,
  'tabValue': PropTypes.string.isRequired
}

export default Sessions
