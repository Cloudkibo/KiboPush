/* eslint-disable no-return-assign */
/**
 * Created by imran on 26/12/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

class ConfirmationModal extends React.Component {
  render () {
    return (
      <div style={{ background: 'rgba(33, 37, 41, 0.6)', zIndex: this.props.zIndex}} className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
          <div className="modal-content">
            <div style={{ display: 'block' }} className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {this.props.title}
              </h5>
              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div style={{ color: 'black', whiteSpace: 'pre-line' }} className="modal-body">
              <p>{this.props.description}</p>
              <div style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '5px' }}>
                  <button className='btn btn-primary' onClick={this.props.onConfirm} data-dismiss='modal'>
                    Yes
                  </button>
                </div>
                <div style={{ display: 'inline-block', padding: '5px' }}>
                  <button className='btn btn-primary' data-dismiss='modal'>
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ConfirmationModal.defaultProps = {
  'zIndex': 1050,
}

ConfirmationModal.propTypes = {
  'id': PropTypes.string.isRequired,
  'title': PropTypes.string.isRequired,
  'description': PropTypes.string.isRequired,
  'onConfirm': PropTypes.func.isRequired,
  'zIndex': PropTypes.number,
}

export default ConfirmationModal
