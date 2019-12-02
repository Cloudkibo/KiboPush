import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {fetchColumns} from '../../../redux/actions/hubSpot.actions'
import { RingLoader } from 'halogenium'
class submitForm extends React.Component {
    constructor (props, context) {
        super(props, context)
        this.state = {
            hubspotFormValue: props.hubSpotForm !== '' ? props.hubSpotForm : '',
            mappingData: props.mapping !== '' ? props.mapping : '',
            mappingDataValues: '',
            loadingColumns: false
          }
          this.onhubspotFormChange = this.onhubspotFormChange.bind(this)
          this.updateMappingData = this.updateMappingData.bind(this)
          this.showMappingData = this.showMappingData.bind(this)
          this.save = this.save.bind(this)
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

    save () {
      console.log('hubspotFormValue in this.save', this.state.hubspotFormValue)
      console.log('mappingData in this.save', this.state.mappingData)
      if (this.state.hubspotFormValue === '' ) {
        this.msg.error('Please fill all the required fields')
      } else {
        this.props.save(this.state.hubspotFormValue, this.state.mappingData)
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
    onhubspotFormChange (event) {
        this.setState({hubspotFormValue: event.target.value})
        this.props.fetchColumns({hubspotFormId: event.target.value , loadingColumns: true})
        // this.props.fetchWorksheets({spreadsheetId: event.target.value})
        // if (event.target.value !== '' && this.state.workSheetValue !== '') {
        //   this.setState({buttonDisabled: false})
        // }
      }
      UNSAFE_componentWillReceiveProps (nextProps) {
        console.log('in UNSAFE_componentWillReceiveProps of submit form', nextProps)
        if (nextProps.columns && nextProps.columns.hubSpotFormColumns && nextProps.columns.hubSpotFormColumns.length > 0) {
          this.setState({loadingColumns: false})
          let mappingData = []
          let mappingDataValues = []
          for (let i = 0; i < nextProps.columns.hubSpotFormColumns.length; i++) {
            mappingData.push({hubSpotFormColumn: nextProps.columns.hubSpotFormColumns[i]})
            mappingDataValues.push('')
          }
          console.log('mappingData in UNSAFE_componentWillReceiveProps', mappingData)
          if (this.state.mappingData === '') {
            this.setState({mappingDataValues: mappingDataValues, mappingData: mappingData})
          }
        }
      }
    
      showMappingData (hubSpotFormColumns, kiboPushColumns, customFieldColumns) {
        console.log('mappingDataValues', this.state.mappingDataValues)
        let content = []
        content.push(
          <div className='row'>
            <div className='col-6'>
              <label style={{fontWeight: 'normal'}}>KiboPush Data:</label>
            </div>
            <div className='col-1'>
            </div>
            <div className='col-5'>
              <label style={{fontWeight: 'normal'}}>HubSpot Form Fields:</label>
            </div>
          </div>
        )
        for (let i = 0; i < hubSpotFormColumns.length; i++) {
          content.push(
            <div>
            <div className='row'>
              <div className='col-6'>
                <select value={this.state.mappingDataValues[i]} className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1'}} onChange={(e) => this.updateMappingData(e, i)}>
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
                <i className='fa fa-long-arrow-right' style={{paddingTop: '5px', fontSize: 'x-large'}} />
                </center>
              </div>
              <div className='col-5'>
                <input style={{height: '40px'}} type='text' className='form-control' value={hubSpotFormColumns[i]} disabled />
              </div>
            </div>
            <br />
            </div>
          )
        }
        return content
      }
    render () {
        console.log('hubspotFormValue', this.state.hubspotFormValue)
        return ( 
        <div>
            <div style={{ textAlign: 'left' }} className="modal-body">
                <h6>HubSpot: Submit data to a form</h6>
                <span style={{color: '#575962'}}>Send Custom Field data to HubSpot form. Form submissions can be made to any registered HubSpot form.</span>
             <br /> <br />
             <label style={{fontWeight: 'normal'}}>HubSpot Form:</label>
          {this.props.hubSpotForms && this.props.hubSpotForms.length > 0 &&
            <select className='form-control m-input m-input--square' value={this.state.hubspotFormValue} onChange={this.onhubspotFormChange}>
              <option key='' value='' disabled>Select a HubSpot Form...</option>
              {
                this.props.hubSpotForms.map((hubSpotForm, i) => (
                  <option key={i} value={hubSpotForm.id}>{hubSpotForm.name}</option>
                ))
              }
            </select>
          }
          <br />
          {this.state.loadingColumns
          ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
          : (this.props.columns && this.props.columns.hubSpotFormColumns.length > 0 &&
            this.showMappingData(this.props.columns.hubSpotFormColumns, this.props.columns.kiboPushColumns, this.props.columns.customFieldColumns)
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
      hubSpotForms: (state.hubSpotInfo.hubSpotForms),
      columns: (state.hubSpotInfo.columns),
    }
  }
  function mapDispatchToProps (dispatch) {
    return bindActionCreators({
      fetchColumns
    }, dispatch)
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(submitForm)