import React from 'react'
import AlertContainer from 'react-alert'

class submitForm extends React.Component {
    constructor (props, context) {
        super(props, context)
        this.closeModal =  this.closeModal.bind(this)
    }
    closeModal () {
        this.refs.ActionModal.click()
    }
    render () {
        var alertOptions = {
            offset: 14,
            position: 'bottom right',
            theme: 'dark',
            time: 5000,
            transition: 'scale'
          }
        return ( 
        <div>
            <div style={{ textAlign: 'left' }} className="modal-body">
                <h6>Hubspot</h6><br />
            </div>
        </div>
    )
    }
}

export default submitForm