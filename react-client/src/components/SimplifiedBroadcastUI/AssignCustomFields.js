import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { loadCustomFields, deleteCustomField, updateCustomField } from '../../redux/actions/customFields.actions'
import Mapping from './Mapping'
import AlertContainer from 'react-alert'


class AssignCustomFields extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
        mappingData: this.props.mapping ? this.props.mapping : ''
    }

    props.loadCustomFields()

    this.save = this.save.bind(this)
    this.getMappingData = this.getMappingData.bind(this)
    this.updateMappingData = this.updateMappingData.bind(this)
    this.getCustomFieldType = this.getCustomFieldType.bind(this)
  }

  getMappingData () {
    if (this.props.questions) {
      return this.state.mappingData.map(data => {
        console.log('getMappingData', data)
        return {'leftColumn': data.question, 'rightColumn': data.customFieldId}
      })
    }
  }

  getCustomFieldType (customFieldId) {
    if (this.props.customFields) {
      return this.props.customFields.find(cf => cf._id === customFieldId).type
    }
  }

  updateMappingData (e, index) {
    console.log('this.state.mappingData', this.state.mappingData)
    let data = this.state.mappingData
    if (e.target.value !== '') {
      let customFieldType = this.getCustomFieldType(e.target.value)
      console.log('customFieldType', customFieldType)
      if ((data[index].type === 'number' && customFieldType === data[index].type) || customFieldType=== 'text') {
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

function mapStateToProps (state) {
  return {
    customFields: (state.customFieldInfo.customFields)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadCustomFields: loadCustomFields,
    deleteCustomField: deleteCustomField,
    updateCustomField: updateCustomField
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AssignCustomFields)
