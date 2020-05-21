import React from 'react'
const SizeValidation = (props) => {
   return (
    <div className="modal-content" style={{marginLeft:'170px', width:'365px'}}>
    <div style={{ display: 'block' }} className="modal-header">
      <h5 className="modal-title" id="exampleModalLabel">
        <i className='fa fa-exclamation-triangle' aria-hidden='true' /> Error
      </h5>
      <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" onClick={props.closeGSModal} data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">
          &times;
        </span>
      </button>
    </div>
    <div style={{ color: 'black' }} className="modal-body">
      <h6>{props.errorMessage}</h6>
    </div>
  </div>
    )
  }

  export default SizeValidation
