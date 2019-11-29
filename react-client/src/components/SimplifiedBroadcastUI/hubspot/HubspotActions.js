import React from 'react'
import AlertContainer from 'react-alert'

import SubmitForm from './submitForm'
class HubspotAction extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      title: '',
      description: '',
      hubspotAction: '',
      showModal: false

    }
    this.updateHubspotAction = this.updateHubspotAction.bind(this)
    this.removeHubspotAction = this.removeHubspotAction.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal =  this.closeModal.bind(this)

  }
  closeModal () {
    this.refs.ActionModal.click()
}
  removeHubspotAction () {
    console.log('in remove removeHubspotAction')
    this.setState({
    title: '',
    description: ''
    })
    this.props.removeHubspotAction()
  }
  openModal () {
     console.log('in openModal',this.state.hubspotAction)
    let modals = {
      'Submit_data': (<SubmitForm />)
    }
    return modals[this.state.hubspotAction]
  }
  updateHubspotAction (hubspotAction, dontShow) {
    console.log('updateHubspotAction', !(dontShow))
    this.setState({hubspotAction: hubspotAction, showModal: !(dontShow)})
    let title = hubspotAction === 'Submit_data' ? 'Submit data to a form'
          : hubspotAction === 'Create/Update_Contact' ? 'Create/Update Contact Properties'
          : hubspotAction === 'Get_Contact' ? 'Get Contact Properties' : ''
    let description = hubspotAction === 'Submit_data' ? 'Send Custom Field data to HubSpot form. Form submissions can be made to any registered HubSpot form.'
          : hubspotAction === 'Create/Update_Contact' ? 'Create a contact if it doesn’t exist in HubSpot already, or update it with Subscriber’s Custom Fields if it does. An existing contact will be determined by its email address.'
          : hubspotAction === 'Get_Contact' ? 'Return information about a single contact by its email address and process it to Subscriber’s Custom Fields.' : ''
    console.log('title value', title)
    console.log('description value', description)
    this.setState({title: title, description: description})
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
        { this.state.title !== ''
        ? <div>
        <div className='google-sheet-close-icon' style = {{position: 'inherit', float:'right'}}onClick={this.removeHubspotAction}></div>
        <div className='ui-block'
          style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,.07)'}}
          onClick={() => this.updateHubspotAction(this.state.hubspotAction)} data-toggle='modal' data-target='#ActionModal' >
          <h6>{this.state.title}
          </h6>
          <span style={{color: '#676c7b'}}>{this.state.description}</span>
        </div>
      </div>
        : <div>
          <span>Select one of the Actions below:</span>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateHubspotAction('Submit_data')} data-toggle='modal' data-target='#ActionModal'>
              <h6>Submit data to a form</h6>
              <span style={{color: '#676c7b'}}>Send Custom Field data to HubSpot form. Form submissions can be made to any registered HubSpot form.</span>
            </div>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateHubspotAction('Create/Update_Contact')} data-toggle='modal' data-target='#ActionModal'>
              <h6>Create/Update Contact Properties</h6>
              <span style={{color: '#676c7b'}}>Create a contact if it doesn’t exist in HubSpot already, or update it with Subscriber’s Custom Fields if it does. An existing contact will be determined by its email address.</span>
            </div>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateHubspotAction('Get_Contact')} data-toggle='modal' data-target='#ActionModal'>
              <h6>Get Contact Properties</h6>
            <span style={{color: '#676c7b'}}>Return information about a single contact by its email address and process it to Subscriber’s Custom Fields.</span>
          </div>
        </div>
    }
    <a href='#/' style={{ display: 'none' }} ref='ActionModal' data-toggle='modal' data-target='#ActionModal'>ActionModal</a>
    <div style={{ background: 'rgba(33, 37, 41, 0.6)', width: '72vw' }} className='modal fade' id='ActionModal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
      <div style={{ transform: 'translate(0, 0)', marginLeft: '13pc' }} className='modal-dialog modal-lg' role='document'>
        <div className="modal-content" style={{ width: '687px', top: '100' }}>
            <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
            <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                    Edit HubSpot Actions
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close"  onClick={() => {
                    this.closeModal()}}  aria-label="Close">
                <span aria-hidden="true">
                    &times;
				    </span>
              </button>
            </div>
            {this.state.showModal && this.openModal()}
        </div>
      </div>
    </div>
  </div>
    )
  }
}

export default HubspotAction