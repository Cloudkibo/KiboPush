import React from 'react'
import Mapping from './Mapping'
import AlertContainer from 'react-alert'


class AssignCustomFields extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
        mappingData: this.props.mapping ? this.props.mapping : ''
    }

    this.save = this.save.bind(this)
    this.getMappingData = this.getMappingData.bind(this)
    this.updateMappingData = this.updateMappingData.bind(this)
    this.getCustomFieldType = this.getCustomFieldType.bind(this)
  }

  getMappingData () {
    // debugger;
    // if (this.props.questions) {
    //   let mappingDataGeneric = []
    //   let mappingData = this.state.mappingData
    //   let mappingDataChanged = false
    //   for (let i = 0; i < mappingData.length; i++) {
    //     if (this.validateCustomFieldType(mappingData[i], mappingData[i].customFieldId)) {
    //       mappingDataGeneric.push({'leftColumn': mappingData[i].question, 'rightColumn': mappingData[i].customFieldId})
    //     } else {
    //       mappingDataChanged = true
    //       mappingDataGeneric.push({'leftColumn': mappingData[i].question, 'rightColumn': ''})
    //     }
    //   }
    //   if (mappingDataChanged) {
    //     this.props.saveCustomFieldsAction({
    //       mapping: mappingData
    //     }, this.props.index)
    //   }
    //   return mappingDataGeneric
    return this.state.mappingData.map((data) => {
      return {'leftColumn': data.question, 'rightColumn': data.customFieldId}
    })
  }

  validateCustomFieldType (question, customFieldId) {
    if (customFieldId) {
      let customFieldType = this.getCustomFieldType(customFieldId)
      return (question.type === 'number' && customFieldType === question.type) || (customFieldType === 'text' && question.type !== 'number')
    }
  }

  getCustomFieldType (customFieldId) {
    console.log('getCustomFieldType', customFieldId)
    if (customFieldId && this.props.customFields) {
      return this.props.customFields.find(cf => cf._id === customFieldId).type
    }
  }

  updateMappingData (e, index) {
    //debugger;
    console.log('this.state.mappingData', this.state.mappingData)
    let data = this.state.mappingData
    if (e.target.value !== '') {
      if (this.validateCustomFieldType(data[index], e.target.value)) {
        data[index].customFieldId = e.target.value
        this.setState({mappingData: data})
      } else {
        this.msg.error("Type of custom field doesn't match reply type of question")
      }
    }
    console.log('data in updateMappingData', data)
  }

  save () {
    console.log('mappingData in save', this.state.mappingData)
    this.props.closeGSModal()
    this.props.saveCustomFieldsAction({
    	mapping: this.state.mappingData
    }, this.props.index)
  }


  render () {
    let alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <div className="modal-content" style={{ width: '687px', top: '100' }}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <div style={{ display: 'block' }} className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Edit Custom Field Actions
              </h5>
            <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" onClick={this.props.closeGSModal} className="close" aria-label="Close">
              <span aria-hidden="true">
                &times;
                  </span>
            </button>
          </div>
          <div style={{ textAlign: 'left' }} className="modal-body">
            <h6>Save to Custom Field</h6>
            <span style={{color: '#575962'}}>Save user's responses to a custom field</span>
            <br />
            <br />
            <button style={{ marginBottom: '30px', borderRadius: '5px' }} type='button' className='btn btn-primary btn-sm'
                data-toggle='modal' data-target='#create_modal'>
                  Create Custom Field
              </button>
            {(this.props.customFields && this.props.customFields.length > 0 &&
              <Mapping 
                leftColumns = {
                  {
                    groups: false,
                    data: this.props.questions.map(question => { return {value: question, title: question} })
                  } 
                }
                rightColumns = {{
                  groups: false,
                  data: this.props.customFields.map(customField => { return {value: customField._id, title: customField.name} })
                }}
                defaultLeftOption = {'Select a Field...'}
                defaultRightOption = {'Select a Custom Field...'}
                leftLabel = {'Questions'}
                rightLabel = {'Custom Fields'}
                mappingData = {this.getMappingData()}
                updateRightColumn = {this.props.questions ? this.updateMappingData : null}
                updateLeftColumn = {null}
              />
            )
            }
        </div>
        <div className="m-portlet__foot m-portlet__foot--fit">
          <button className="btn btn-primary" disabled={this.state.buttonDisabled} style={{float: 'right', margin: '10px'}} onClick={this.save}>Save</button>
        </div>
      </div>

    </div>
    )
  }
}

export default (AssignCustomFields)
