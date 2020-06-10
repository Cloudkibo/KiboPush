import React from 'react'
import PropTypes from 'prop-types'

class MessageBlockUsage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
    return (
      <div id='_cb_ma_mo' className='row'>
        <div className='col-md-12'>
          <div className="form-group m-form__group">
            <h4>Message Block Usage:</h4>
            <div style={{paddingTop: '10px'}}>
              <span>
                This message has been sent <b>{this.props.sentCount}</b> times
              </span>
            </div>
            <div style={{paddingTop: '10px'}}>
              <span>
                This attachment button has been clicked <b>{this.props.urlBtnClickedCount}</b> times
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

MessageBlockUsage.propTypes = {
  'urlBtnClickedCount': PropTypes.number.isRequired,
  'sentCount': PropTypes.number.isRequired
}

export default MessageBlockUsage
