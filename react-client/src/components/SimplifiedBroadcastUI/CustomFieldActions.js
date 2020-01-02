import React from 'react'
import AssignCustomFields from './AssignCustomFields'


class CustomFieldActions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
        mappingData: this.props.mapping ? this.props.mapping : ''
    }
    this.openModal = this.openModal.bind(this)
  }

  openModal () {
    console.log('in openModal', this.state.mapping)
    return (<AssignCustomFields 
        questions={this.props.questions}
        mapping={this.props.mapping}
        index={this.props.index}
        saveCustomFieldsAction={this.props.saveCustomFieldsAction}
        closeGSModal={this.props.closeGSModal}
    />)
  }


  render () {
    return (
      <div>
          <div className='ui-block'
            onClick={() => this.props.toggleGSModal(true, this.openModal())}
            style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,.07)'}}
            data-toggle='modal' data-target={`#${this.props.GSModalTarget}`} >
            <h6>Assign User Responses to Custom Fields</h6>
            <span style={{color: '#676c7b'}}>Assign a response for each question to a custom field</span>
          </div>
        </div>
    )
  }
}


export default CustomFieldActions
