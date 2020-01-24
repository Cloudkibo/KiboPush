import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {fetchColumns} from '../../../redux/actions/hubSpot.actions'
import { RingLoader } from 'halogenium'
import AlertContainer from 'react-alert'
import Mapping from '../Mapping'

class submitForm extends React.Component {
    constructor (props, context) {
      super(props, context)
      this.state = {
          hubspotFormValue: props.hubSpotForm !== '' ? props.hubSpotForm : '',
          portalId: props.portalId !== '' ? props.portalId : '',
          mappingData: props.mapping !== '' ? props.mapping : '',
          mappingDataValues: '',
          loadingColumns: false,
          show_scroll: props.hubSpotForm === '' ? false : true,
          buttonDisabled:  props.hubSpotForm !== '' ? false : true
        }
        this.onhubspotFormChange = this.onhubspotFormChange.bind(this)
        this.updateMappingData = this.updateMappingData.bind(this)
        this.showMappingData = this.showMappingData.bind(this)
        this.save = this.save.bind(this)
        this.updateMappingDataUserInput = this.updateMappingDataUserInput.bind(this)
        this.getMappingData = this.getMappingData.bind(this)
    }

  getMappingData () {
    if (this.props.questions) {
      return this.state.mappingData.map(data => {
        return {'leftColumn': data.question, 'rightColumn': data.hubspotColumn}
      })
    } else {
      return this.state.mappingData.map(data => {
        return {'leftColumn': data.customFieldColumn ? data.customFieldColumn : data.kiboPushColumn, 'rightColumn': data.hubspotColumn}
      })
    }
  }

    componentDidMount () {
      console.log('in componentDidMount of submitForm', this.props)
      if (this.props.mapping !== '' && !this.props.questions) {
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

    if (this.props.columns && this.props.columns.hubspotColumns && this.props.columns.hubspotColumns.length > 0) {
      let mappingDataValues = []
      for (let i = 0; i < this.props.columns.hubspotColumns.length; i++) {
        mappingDataValues.push('')
      }
      if (this.state.mappingData === '') {
        this.setState({mappingDataValues: mappingDataValues})
      }
    }
  }
    save () {
      console.log('hubspotFormValue in this.save', this.state.hubspotFormValue)
      console.log('mappingData in this.save', this.state.mappingData)
      if (this.state.hubspotFormValue) {
        this.props.save(this.state.hubspotFormValue, this.state.portalId, this.state.mappingData, '')
      } else {
        this.msg.error('Please fill all the required fields')
      }
    }

    updateMappingDataUserInput (e, index) {
      console.log('this.state.mappingData', this.state.mappingData)
      let data = this.state.mappingData
      if (e.target.value !== '') {
        data[index].hubspotColumn = e.target.value
        this.setState({mappingData: data})
      }
      console.log('data in updateMappingData', data)
    }

    updateMappingData (e, index) {
      console.log('this.state.mappingData', this.state.mappingData)
      if (this.props.questions) {
        this.updateMappingDataUserInput(e, index)
      } else {
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
    }
    onhubspotFormChange (event) {
      let portalId = this.props.hubSpotForms.filter(hubSpotForm => hubSpotForm.guid === event.target.value)[0].portalId
        this.setState({hubspotFormValue: event.target.value, portalId: portalId, buttonDisabled: false, loadingColumns: true, show_scroll: true})
        this.props.fetchColumns({formId: event.target.value})
      }
      UNSAFE_componentWillReceiveProps (nextProps) {
        console.log('in UNSAFE_componentWillReceiveProps of submit form', nextProps)
        if (nextProps.columns && nextProps.columns.hubspotColumns && nextProps.columns.hubspotColumns.length > 0) {
          this.setState({loadingColumns: false})
          let mappingData = []
          let mappingDataValues = []
          for (let i = 0; i < nextProps.columns.hubspotColumns.length; i++) {
            mappingData.push({hubspotColumn: nextProps.columns.hubspotColumns[i].name})
            mappingDataValues.push('')
          }
          console.log('mappingData in UNSAFE_componentWillReceiveProps', mappingData)
          if (this.state.mappingData === '') {
            this.setState({mappingDataValues: mappingDataValues, mappingData: mappingData})
          }
        }
      }
    
      showMappingData (hubspotColumns, kiboPushColumns, customFieldColumns) {
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
        for (let i = 0; i < hubspotColumns.length; i++) {
          content.push(
            <div>
            <div className='row'>
              <div className='col-6' style={{display: 'inherit', paddingRight: i === 0 ? 'none' : '22px'}}>
                <select value={this.state.mappingDataValues[i]} className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1', display: 'inline-block'}} onChange={(e) => this.updateMappingData(e, i)}>
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
                  { i === 0 &&
                  <span style={{ color: 'red' }}> * </span>
                  }
              </div>
              <div className='col-1'>
                <center>
                <i className='fa fa-long-arrow-right' style={{paddingTop: '5px', fontSize: 'x-large', color: this.state.mappingDataValues[i] === '' ?  '#bfe6c0': '#419600'}} />
                </center>
              </div>
              <div className='col-5'>
                <input style={{height: '40px'}} type='text' className='form-control' value={hubspotColumns[i].name} disabled />
              </div>
            </div>
            <br />
            </div>
          )
        }
        return content
      }
    render () {
      var alertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
      }
        console.log('hubspotFormValue', this.state.hubspotFormValue)
        return ( 
          <div className="modal-content" style={{ width: '687px', top: '100', height: this.state.show_scroll ? '700px' :'312px', overflow:'hidden'}}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <div style={{ display: 'block' }} className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Edit HubSpot Actions
              </h5>
            <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" onClick={this.props.closeGSModal} className="close" aria-label="Close">
              <span aria-hidden="true">
                &times;
                  </span>
            </button>
          </div>
            <div style={{ textAlign: 'left', overflow:'hidden' , overflowY:'scroll' }} className="modal-body">
                <h6>HubSpot: Submit data to a form</h6>
                <span style={{color: '#575962'}}>Send Custom Field data to HubSpot form. Form submissions can be made to any registered HubSpot form.</span>
             <br /> <br />
             <label style={{fontWeight: 'normal'}}>HubSpot Form:</label>
          {this.props.hubSpotForms && this.props.hubSpotForms.length > 0 &&
            <select className='form-control m-input m-input--square' value={this.state.hubspotFormValue} onChange={this.onhubspotFormChange}>
              <option key='' value='' disabled>Select a HubSpot Form...</option>
              {
                this.props.hubSpotForms.map((hubSpotForm, i) => (
                  <option key={i} value={hubSpotForm.guid}>{hubSpotForm.name}</option>
                ))
              }
            </select>
          }
          <br />
          {this.state.loadingColumns 
          ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
          : this.state.hubspotFormValue !== '' && (this.props.columns && this.props.columns.hubspotColumns.length > 0 &&
            <Mapping 
              leftColumns = {
                this.props.questions ? 
                {
                  groups: false,
                  data: this.props.questions.map(question => { return {value: question, title: question} })
                } 
                :
                {
                  groups: true,
                  data: {
                    'System fields': this.props.columns.kiboPushColumns.map(column => { return {value: column.fieldName, title: column.title} }),
                    'Custom fields': this.props.columns.customFieldColumns.map(column => { return {value: column.customFieldId, title: column.title} })
                  }
                } 
              }
              rightColumns = {{
                groups: false,
                data: this.props.columns.hubspotColumns.map(column => { return {value: column.name, title: column.name} })
              }}
              defaultLeftOption = {this.props.questions ? 'Select a Question...' : 'Select a Field...'}
              defaultRightOption = {'Select a Hubspot Form Field...'}
              leftLabel = {this.props.questions ? 'Questions' : 'KiboPush Data'}
              rightLabel = {'Hubspot Form Fields'}
              mappingData = {this.getMappingData()}
              updateLeftColumn = {this.updateMappingData}
              updateRightColumn = {null}
              isFirstRequired = {true}
            />
            //this.showMappingData(this.props.columns.hubspotColumns, this.props.columns.kiboPushColumns, this.props.columns.customFieldColumns)
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