import React from 'react'

class submitForm extends React.Component {
    constructor (props, context) {
        super(props, context)
        this.closeModal =  this.closeModal.bind(this)
    }
    closeModal () {
        this.refs.ActionModal.click()
    }
    render () {
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