import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CreateContact from './createContact'
import SubmitForm from './submitForm'
import GetContactForm from './getContactForm'
import {fetchhubSpotForms, emptyFields} from '../../../redux/actions/hubSpot.actions'

class HubspotAction extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      title: '',
      description: '',
      hubspotAction: '',
      hubSpotForm: '' ,
      portalId: '',
      mapping: props.mapping ? props.mapping : '',
      showModal: false,
      identityFieldValue: ''

    }
    props.fetchhubSpotForms()
    this.updateHubspotAction = this.updateHubspotAction.bind(this)
    this.removeHubspotAction = this.removeHubspotAction.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal =  this.closeModal.bind(this)
    this.save = this.save.bind(this)
  }

  save (hubSpotForm, portalId, mappingData, identityFieldValue) {
    console.log('mappingData in save', mappingData)
    console.log('hubSpotForm in save', hubSpotForm)
    this.setState({
    hubSpotForm: hubSpotForm,
    mapping: mappingData,
    portalId: portalId,
    identityFieldValue: identityFieldValue,
    showModal: false
  })
    this.props.savehubSpotForm({
      hubspotAction: this.state.hubspotAction,
      hubSpotForm: hubSpotForm,
      mapping: mappingData,
      portalId: portalId,
      identityFieldValue: identityFieldValue
    })
    this.closeModal()
  }
  
  closeModal () {
    this.props.closeGSModal()
}

componentDidMount () {
  console.log('in componentDidMount of Hubspot Action', this.props)
  if (this.props.hubspotAction!== '' && this.props.hubSpotForm !== '' && this.props.mapping !== '' && this.props.portalId !=='') {
    this.setState({mapping: this.props.mapping, hubSpotForm: this.props.hubSpotForm, portalId: this.props.portalId})
    this.updateHubspotAction(this.props.hubspotAction, true)
  }

  if (this.props.hubspotAction!== '' && this.props.identityFieldValue !== '' && this.props.mapping !== '') {
    this.setState({mapping: this.props.mapping, identityFieldValue: this.props.identityFieldValue})
    this.updateHubspotAction(this.props.hubspotAction, true)
  }
}
  removeHubspotAction () {
    console.log('in remove removeHubspotAction')
    this.setState({
    title: '',
    description: '',
    hubspotAction: '',
    hubSpotForm: '' ,
    mapping: '',
    identityFieldValue: '',
    showModal: false
    })
    //this.props.emptyFields()
    this.props.removeHubspotAction()
  }
  openModal () {

     console.log('in openModal',this.state.hubspotAction)
    let modals = {
      'submit_form': (<SubmitForm 
        questions={this.props.questions}
        hubSpotForm= {this.state.hubSpotForm} 
        mapping={this.state.mapping} 
        save={this.save} 
        closeGSModal={this.props.closeGSModal} 
        portalId= {this.state.portalId}
      />),
      'get_contact': (<GetContactForm 
        identityFieldValue= {this.state.identityFieldValue} 
        mapping={this.state.mapping} 
        save={this.save} 
        closeGSModal={this.props.closeGSModal}
      />),
      'insert_update_contact': (<CreateContact 
        questions={this.props.questions}
        identityFieldValue= {this.state.identityFieldValue} 
        mapping={this.state.mapping} 
        save={this.save} 
        closeGSModal={this.props.closeGSModal}
      />)
    }
    return modals[this.state.hubspotAction]
  }

  
  updateHubspotAction (hubspotAction, dontShow) {
    console.log('updateHubspotAction', !(dontShow))
    this.setState({hubspotAction: hubspotAction, showModal: !(dontShow)},() => {
      if (this.state.showModal) {
        this.props.toggleGSModal(this.state.showModal, this.openModal())
      } else {
        this.props.toggleGSModal(this.state.showModal, null)
      }
    })
    let title = hubspotAction === 'submit_form' ? 'Submit data to a form'
          : hubspotAction === 'insert_update_contact' ? 'Create/Update Contact Properties'
          : hubspotAction === 'get_contact' ? 'Get Contact Properties' : ''
    let description = hubspotAction === 'submit_form' ? 'Send Custom Field data to HubSpot form. Form submissions can be made to any registered HubSpot form.'
          : hubspotAction === 'insert_update_contact' ? 'Create a contact if it doesn’t exist in HubSpot already, or update it with Subscriber’s Custom Fields if it does. An existing contact will be determined by its email address.'
          : hubspotAction === 'get_contact' ? 'Return information about a single contact by its email address and process it to Subscriber’s Custom Fields.' : ''
    console.log('title value', title)
    console.log('description value', description)
    this.setState({title: title, description: description})
  }
  render () {
    return (
      <div>
        { this.state.title !== ''
        ? <div>
        <div className='google-sheet-close-icon' style = {{position: 'inherit', float:'right'}} onClick={this.removeHubspotAction}></div>
        <div className='ui-block'
          style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,.07)'}}
          onClick={() => this.updateHubspotAction(this.state.hubspotAction)} data-toggle='modal' data-target={`#${this.props.GSModalTarget}`}>
          <h6>{this.state.title}
          </h6>
          <span style={{color: '#676c7b'}}>{this.state.description}</span>
        </div>
      </div>
        : <div>
          <span>Select one of the Actions below:</span>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateHubspotAction('submit_form')} data-toggle='modal' data-target={`#${this.props.GSModalTarget}`}>
              <h6>Submit data to a form</h6>
              <span style={{color: '#676c7b'}}>Send Custom Field data to HubSpot form. Form submissions can be made to any registered HubSpot form.</span>
            </div>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateHubspotAction('insert_update_contact')} data-toggle='modal' data-target={`#${this.props.GSModalTarget}`}>
              <h6>Create/Update Contact Properties</h6>
              <span style={{color: '#676c7b'}}>Create a contact if it doesn’t exist in HubSpot already, or update it with Subscriber’s Custom Fields if it does. An existing contact will be determined by its email address.</span>
            </div>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateHubspotAction('get_contact')} data-toggle='modal' data-target={`#${this.props.GSModalTarget}`}>
              <h6>Get Contact Properties</h6>
            <span style={{color: '#676c7b'}}>Return information about a single contact by its email address and process it to Subscriber’s Custom Fields.</span>
          </div>
        </div>
    }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    hubSpotForms: (state.hubSpotInfo.hubSpotForms)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchhubSpotForms,
    emptyFields
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(HubspotAction)