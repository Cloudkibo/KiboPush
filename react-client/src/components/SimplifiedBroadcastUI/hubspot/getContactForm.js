import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { UncontrolledTooltip } from 'reactstrap'
import {fetchHubspotColumns} from '../../../redux/actions/hubSpot.actions'
import AlertContainer from 'react-alert'

class GetContactForm extends React.Component {
    constructor (props, context) {
        super(props, context)
        this.state = {
          identityFieldValue: props.identityFieldValue !== '' ? props.identityFieldValue : '',
          mappingData: props.mapping !== '' ? props.mapping : '',
          mappingDataValues: '',
          showColumns: props.identityFieldValue !== '' ? true : false,
          buttonDisabled:  props.identityFieldValue !== '' ? false : true
        }
        this.onidentityFieldValueChange = this.onidentityFieldValueChange.bind(this)
        this.showMappingData = this.showMappingData.bind(this)
        this.updateMappingData = this.updateMappingData.bind(this)
        this.save = this.save.bind(this)
        this.props.fetchHubspotColumns()
    }

    componentDidMount () {
      console.log('in componentDidMount of submitForm', this.props)
      if (this.props.mapping !== '') {
        let mappingDataValues = [].concat(this.props.mapping)
        for (let i = 0; i < this.props.mapping.length; i++) {
          if (this.props.mapping[i].kiboPushColumn) {
            mappingDataValues[i] = this.props.mapping[i].kiboPushColumn
          } else if (this.props.mapping[i].customFieldColumn) {
            mappingDataValues[i] = this.props.mapping[i].customFieldColumn
          } else {
            mappingDataValues[i] = ''
          }
        }
        console.log('temp mappingDataValues', mappingDataValues)
        this.setState({mappingDataValues: mappingDataValues})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('in UNSAFE_componentWillReceiveProps of submit form', nextProps)
    if (nextProps.columns && nextProps.columns.hubSpotColumns && nextProps.columns.hubSpotColumns.length > 0) {
      this.setState({loadingColumns: false})
      let mappingData = []
      let mappingDataValues = []
      for (let i = 0; i < nextProps.columns.hubSpotColumns.length; i++) {
        mappingData.push({hubspotColumn: nextProps.columns.hubSpotColumns[i]})
        mappingDataValues.push('')
      }
      console.log('mappingData in UNSAFE_componentWillReceiveProps', mappingData)
      if (this.state.mappingData === '') {
        this.setState({mappingDataValues: mappingDataValues, mappingData: mappingData})
      }
    }
  }

  save () {
    console.log('identityFieldValue in this.save', this.state.identityFieldValue)
    console.log('mappingData in this.save', this.state.mappingData)
    if (this.state.identityFieldValue === '' ) {
      this.msg.error('Please fill all the required fields')
    } else {
      this.props.save('','',this.state.mappingData, this.state.identityFieldValue)
    }
  }

    updateMappingData (e, index) {
      console.log('this.state.mappingData', this.state.mappingData)
      let data = this.state.mappingData
      let dataValues = this.state.mappingDataValues
      if (e.target.value !== '') {
        if (e.target.value.match(/^[0-9a-fA-F]{24}$/)) {
          data[index].customFieldColumn = e.target.value
        } else {
          data[index].kiboPushColumn = e.target.value
        }
        dataValues[index] = e.target.value
        this.setState({mappingData: data, mappingDataValues: dataValues})
      }
      console.log('data in updateMappingData', data)
    }

    showMappingData (hubSpotFormColumns, customFieldColumns) {
      console.log('mappingDataValues', this.state.mappingDataValues)
      let content = []
      content.push(
        <div className='row'>
          <div className='col-6'>
            <label style={{fontWeight: 'normal'}}>HubSpot Contact Properties:</label>
          </div>
          <div className='col-1'>
          </div>
          <div className='col-5'>
            <label style={{fontWeight: 'normal'}}>kibopush Custom Fields</label>
          </div>
        </div>
      )
      for (let i = 0; i < hubSpotFormColumns.length; i++) {
        content.push(
          <div>
          <div className='row'>
            <div className='col-6'>
                <input style={{height: '40px'}} type='text' className='form-control' value={hubSpotFormColumns[i]} disabled />
              </div>
            <div className='col-1'>
              <center>
              <i className='fa fa-long-arrow-right' style={{paddingTop: '5px', fontSize: 'x-large', color: this.state.mappingDataValues[i] === '' ? '#bfe6c0': '#419600'}} />
              </center>
            </div>
            <div className='col-5'>
                <select value={this.state.mappingDataValues[i]} className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1'}} onChange={(e) => this.updateMappingData(e, i)}>
                  <option key='' value='' disabled>Select a Field...</option>
                  {customFieldColumns.length > 0 &&
                    customFieldColumns.map((custom, i) => (
                        <option key={i} value={custom.customFieldId}>{custom.title}</option>
                      ))
                    
                  }
                  </select>
              </div>
          </div>
          <br />
          </div>
        )
      }
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
              <h6>HubSpot: Get Contact Properties</h6>
              <span style={{color: '#575962'}}>Return information about a single contact by its email address and process it to Subscriber’s Custom Fields.</span>
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
          {
            this.state.showColumns &&  
          (this.props.columns && this.props.columns.hubSpotColumns && this.props.columns.hubSpotColumns.length > 0 &&
            this.showMappingData(this.props.columns.hubSpotColumns, this.props.columns.customFieldColumns)
          )
        }
           </div>
          <div className="m-portlet__foot m-portlet__foot--fit">
        <button className="btn btn-primary" disabled={this.state.buttonDisabled} style={{float: 'right', margin: '10px'}} onClick={this.save}>Save</button>
      </div>
      </div>
      )
  }
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(GetContactForm)