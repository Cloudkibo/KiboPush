import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { UncontrolledTooltip } from 'reactstrap'
import {fetchHubspotColumns} from '../../../redux/actions/hubSpot.actions'
import AlertContainer from 'react-alert'

class CreateContact extends React.Component {
    constructor (props, context) {
        super(props, context)
        this.state = {
            identityFieldValue: props.identityFieldValue !== '' ? props.identityFieldValue : '',
            mappingData: props.mapping !== '' ? props.mapping : [{hubSpotColumn: '', kiboPushColumn: '', customFieldColumn: ''}],
            mappingDataValues: '',
            showColumns: props.identityFieldValue !== '' ? true : false,
            buttonDisabled:  props.identityFieldValue !== '' ? false : true
          }
          this.onidentityFieldValueChange = this.onidentityFieldValueChange.bind(this)
          this.addCondition = this.addCondition.bind(this)
          this.removeCondition = this.removeCondition.bind(this)
          this.save = this.save.bind(this)
          this.updateKiboPushData = this.updateKiboPushData.bind(this)
          this.updatehubSpotData = this.updatehubSpotData.bind(this)
          this.props.fetchHubspotColumns()

    }

    save () {
      var mappingData = []
      for (var i = 0; i < this.state.mappingData.length; i++) {
        if ((this.state.mappingData[i].kiboPushColumn !== '' && this.state.mappingData[i].hubSpotColumn !== '') || (this.state.mappingData[i].customFieldColumn !== '' && this.state.mappingData[i].hubSpotColumn !== '')) {
          mappingData.push(this.state.mappingData[i])
        }
      }
      if (mappingData.length === 0) {
        mappingData=''
      }
      this.props.save('','', mappingData, this.state.identityFieldValue)
    }


    updateKiboPushData(e, index) {
      console.log('updateKiboPushData called', e.target.value)
      console.log('updateKiboPushData index', index)
      var mappingData = this.state.mappingData
      for (var i = 0; i < this.state.mappingData.length; i++) {
        if (index === i) {
          if (e.target.value.match(/^[0-9a-fA-F]{24}$/)) {
            mappingData[i].kiboPushColumn= ''
            mappingData[i].customFieldColumn = e.target.value
          } else {
            mappingData[i].kiboPushColumn = e.target.value
            mappingData[i].customFieldColumn= ''

          }
        }
      }
      this.setState({mappingData: mappingData})
    }

    updatehubSpotData (e, index) {

      var mappingData = this.state.mappingData
      for (var i = 0; i < this.state.mappingData.length; i++) {
        if (index === i) {
            mappingData[i].hubSpotColumn = e.target.value
          } 
        }
      this.setState({mappingData: mappingData})

    }
  

    addCondition () {
      var mappingData = this.state.mappingData
      mappingData.push({hubSpotColumn: '', kiboPushColumn: '', customFieldColumn: ''})
      this.setState({
        mappingData: mappingData
      })
    }

    removeCondition (e, index) {
      var mappingData = this.state.mappingData
      for (var i = 0; i < mappingData.length; i++) {
        if (i === index) {
          mappingData.splice(i, 1)
        }
      }
      this.setState({
        mappingData: mappingData
      })
    }

    showMappingData (hubSpotFormColumns, kiboPushColumns, customFieldColumns) {
      let content = []
      content.push(
        <div className='row'>
          <div className='col-4'>
            <label style={{fontWeight: 'normal'}}>KiboPush Data:</label>
          </div>
          <div className='col-1'>
          </div>
          <div className='col-4'>
            <label style={{fontWeight: 'normal'}}>HubSpot Form Fields:</label>
          </div>
        </div>
      )
      for (let i = 0; i < this.state.mappingData.length; i++) {
        content.push(
          <div className='row' key={i} style={{marginBottom: '7px'}}>
            <div className='col-4'>
              <select value= {this.state.mappingData[i].kiboPushColumn === '' ? this.state.mappingData[i].customFieldColumn : this.state.mappingData[i].kiboPushColumn} className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1'}}  onChange={(e) => this.updateKiboPushData(e, i)} >
                <option key='' value='' disabled>Select a Field...</option>
                <optgroup label='System Fields'>
                  {kiboPushColumns.map((kibopush, i) => (
                      <option key={i} value={kibopush.fieldName}>{kibopush.title}</option>
                    ))
                  }
                </optgroup>
                {customFieldColumns.length > 0 &&
                  <optgroup label='Custom Fields'>
                  {customFieldColumns.map((custom, i) => (
                      <option key={i} value={custom.customFieldId}>{custom.title}</option>
                    ))
                  }
                </optgroup>
                }
                </select>
            </div>
            <div className='col-1'>
                <center>
                <i className='fa fa-long-arrow-right' style={{paddingTop: '5px', fontSize: 'x-large', color: ((this.state.mappingData[i].kiboPushColumn !== '' && this.state.mappingData[i].hubSpotColumn!== '') || (this.state.mappingData[i].customFieldColumn !== '' && this.state.mappingData[i].hubSpotColumn !== '')) ? '#419600' : '#bfe6c0'}} />
                </center>
              </div>
              <div className='col-4'>
                <select value={this.state.mappingData[i].hubSpotColumn} className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1'}} onChange={(e) => this.updatehubSpotData(e, i)}>
                  <option key='' value='' disabled>Select a Field...</option>
                  { hubSpotFormColumns.length > 0 &&
                    hubSpotFormColumns.map((hubSpotFormColumn, i) => (
                        <option key={i} value={hubSpotFormColumn}>{hubSpotFormColumn}</option>
                      ))
                    
                  }
                  </select>
              </div>
              <div className='col-3'>
              {(this.state.mappingData.length > 1)
                ? <button className='btn-sm btn btn-danger m-btn m-btn--icon m-btn--pill' onClick={(e) => this.removeCondition(e, i)} >
                  <span>
                    <i className="la la-trash-o"></i>
                    <span>
                      Delete
                    </span>
                  </span>
                    </button>
                : <button className='btn-sm btn btn-danger m-btn m-btn--icon m-btn--pill' disabled >
                  <span>
                    <i className="la la-trash-o"></i>
                    <span>
                      Delete
                    </span>
                  </span>
                </button>
              }
              </div>
            </div>
        )
      } 

      content.push(
        <div className='row'>
          <div className='col-6'>
          <button style={{ margin: '15px' }} className= 'btn btn btn-sm btn-brand m-btn m-btn--icon m-btn--pill m-btn--wide' onClick={this.addCondition}>
          <span>
            <i className="la la-plus"></i>
            <span>
              Add
            </span>
          </span>          
          </button>          
          </div>
          <div className='col-1'>
          </div>
        </div>
      )
      return content
    }

    onidentityFieldValueChange (event) {
        this.setState({identityFieldValue: event.target.value, showColumns: true,  buttonDisabled: false})
      }
      render () {
        var alertOptions = {
          offset: 14,
          position: 'bottom right',
          theme: 'dark',
          time: 5000,
          transition: 'scale'
        }
        console.log('this.props.columns', this.props.columns)
        return ( 
          <div className="modal-content" style={{ width: '687px', top: '100' }}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <div style={{ display: 'block' }} className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Edit Google Sheets Actions
              </h5>
            <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" onClick={this.props.closeGSModal} className="close" aria-label="Close">
              <span aria-hidden="true">
                &times;
                  </span>
            </button>
          </div>
            <div style={{ textAlign: 'left' }} className="modal-body">
                <h6>HubSpot: Create/Update Contact Properties</h6>
                <span style={{color: '#575962'}}>Create a contact if it doesn’t exist in HubSpot already, or update it with Subscriber’s Custom Fields if it does. An existing contact will be determined by its email address.</span>
             <br /> <br />
             <label style={{fontWeight: 'normal'}}>Identity Field</label>           
             <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='hubspot_getcontact'> <span>Custom Field which contains user’s email to identify HubSpot Contacts. Please select such Custom Field.</span>  </UncontrolledTooltip>
            <i id = 'hubspot_getcontact' className='la la-question-circle'/>
            {this.props.columns && this.props.columns.customFieldColumns && this.props.columns.customFieldColumns.length > 0 &&
              <select className='form-control m-input m-input--square' value={this.state.identityFieldValue} onChange={this.onidentityFieldValueChange}>
                <option key='' value='' disabled>Enter Field name...</option>
                {
                  this.props.columns.customFieldColumns.map((custom, i) => (
                    <option key={i} value={custom.customFieldId}>{custom.title}</option>
                  ))
                }
              </select>
            }
            <br />
            {this.state.showColumns &&
           (this.props.columns && this.props.columns.hubSpotColumns.length > 0 &&
            this.showMappingData(this.props.columns.hubSpotColumns, this.props.columns.kiboPushColumns, this.props.columns.customFieldColumns)
          )
          }
            </div>
            <div className="m-portlet__foot m-portlet__foot--fit">
        <button className="btn btn-primary" disabled={this.state.buttonDisabled} style={{float: 'right', margin: '10px'}} onClick={this.save}>Save</button>
        </div>
      
      </div>
        )}
}

function mapStateToProps (state) {
    return {
      columns: (state.hubSpotInfo.Hubspotcolumns),
    }
  }
  function mapDispatchToProps (dispatch) {
    return bindActionCreators({
      fetchHubspotColumns
    }, dispatch)
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(CreateContact)