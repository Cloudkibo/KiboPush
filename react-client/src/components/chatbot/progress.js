import React from 'react'
import PropTypes from 'prop-types'

class Progress extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div
        id='_cb_progress'
        style={{
          bottom: 0,
          position: 'fixed',
          width: '100%',
          margin: '15px'
        }}
        className='row'
      >
        <div className='col-md-11'>
          <div style={{margin: '0px'}} className="progress">
            <div
              id='_cb_progressbar'
              className="progress-bar progress-bar-striped progress-bar-animated bg-success"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{width: this.props.progress}}
            />
          </div>
        </div>
        <div id='_cb_progress_count' className='col-md-1'>
          <h3 className='m--font-success'>{this.props.progress}</h3>
        </div>
      </div>
    )
  }
}

Progress.propTypes = {
  'progress': PropTypes.string.isRequired
}

export default Progress
