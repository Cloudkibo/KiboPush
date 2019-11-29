import React from 'react'
import PropTypes from 'prop-types'
import ReactFullScreenElement from 'react-fullscreen-element'

class Modal extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  render() {
    return (
      <div style={{ background: 'rgba(33, 37, 41, 0.6)', width: '72vw', zIndex: 99991 }} className='modal fade' id='ActionModal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div style={{ transform: 'translate(0, 0)', marginLeft: '13pc' }} className='modal-dialog modal-lg' role='document'>
          {this.props.showModal && this.props.openModal()}
        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  'showModal': PropTypes.bool.isRequired,
  'openModal': PropTypes.func.isRequired
}

export default Modal
