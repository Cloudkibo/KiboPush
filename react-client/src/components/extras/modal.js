import React from 'react'
import PropTypes from 'prop-types'

class Modal extends React.Component {
  render () {
    return (
      <div style={{ background: 'rgba(33, 37, 41, 0.6)', zIndex: this.props.zIndex }} className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
          <div className="modal-content">
            <div style={{ display: 'block' }} className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {this.props.title}
              </h5>
              <button onClick={this.props.onClose} style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div style={{ color: 'black' }} className="modal-body">
              {this.props.content}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Modal.defaultPropTypes = {
  'zIndex': 1050
}

Modal.propTypes = {
  'zIndex': PropTypes.number.isRequired,
  'id': PropTypes.string.isRequired,
  'title': PropTypes.string.isRequired,
  'content': PropTypes.element.isRequired,
  'onClose': PropTypes.func
}

export default Modal
