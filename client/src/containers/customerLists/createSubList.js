/* eslint-disable no-useless-constructor */
import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {
  loadCustomerLists, createSubList
} from '../../redux/actions/customerLists.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import AlertContainer from 'react-alert'

class CreateSubList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedRadio: '',
      listsSelected: [],
      conditions: [{condition: '', criteria: '', text: ''}],
      newListName: '',
      errorMessages: [],
      isSaveEnabled: true
    }
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.initializeListSelect = this.initializeListSelect.bind(this)
    this.handleNameText = this.handleNameText.bind(this)
    this.addCondition = this.addCondition.bind(this)
    this.changeCondition = this.changeCondition.bind(this)
    this.changeCriteria = this.changeCriteria.bind(this)
    this.changeText = this.changeText.bind(this)
    this.removeCondition = this.removeCondition.bind(this)
    this.onSave = this.onSave.bind(this)
    this.validateNewList = this.validateNewList.bind(this)
    this.handleCreateSubList = this.handleCreateSubList.bind(this)
    this.resetPage = this.resetPage.bind(this)
    props.loadMyPagesList()
    props.loadCustomerLists()
  }
  componentDidMount () {
    if (this.props.customerLists) {
      let options = []
      for (var i = 0; i < this.props.customerLists.length; i++) {
        options[i] = {id: this.props.customerLists[i]._id, text: this.props.customerLists[i].listName}
      }
      this.initializeListSelect(options)
    }
  }

  onSave () {
    var isValid = this.validateNewList()
    if (isValid) {
      this.setState({errorMessages: []})
      var listName = this.state.newListName
      var conditions = this.state.conditions
      var listPayload = {'listId': this.state.listsSelected, 'listName': listName, 'conditions': conditions}
      this.setState({isSaveEnabled: false})
      this.props.createSubList(listPayload, this.msg, this.handleCreateSubList)
    }
  }

  handleCreateSubList () {
    this.resetPage()
    if (this.props.customerLists) {
      let options = []
      for (var i = 0; i < this.props.customerLists.length; i++) {
        options[i] = {id: this.props.customerLists[i]._id, text: this.props.customerLists[i].listName}
      }
      this.initializeListSelect(options)
    }
  }

  resetPage () {
    this.setState({
      selectedRadio: '',
      listsSelected: [],
      conditions: [{condition: '', criteria: '', text: ''}],
      newListName: '',
      errorMessages: [],
      isSaveEnabled: true
    })
  }
  validateNewList () {
    var errors = false
    var errorMessages = []
    var errorMessage
    if (this.state.selectedRadio === '') {
      errors = true
      errorMessage = {error: 'radio', message: 'Please select an option'}
      errorMessages.push(errorMessage)
      this.setState({errorMessages: errorMessages})
    }
    if (this.state.selectedRadio === 'segmentList') {
      if (this.state.listsSelected.length < 1) {
        errors = true
        errorMessage = {error: 'selection', message: 'Please select an existing list'}
        errorMessages.push(errorMessage)
        this.setState({errorMessages: errorMessages})
      }
    }
    if (this.state.newListName === '') {
      errors = true
      errorMessage = {error: 'listName', message: 'Please enter name for the new list'}
      errorMessages.push(errorMessage)
      this.setState({errorMessages: errorMessages})
    }
    var conditionErrors = []
    var conditionError = {}
    var isErrorInCondition = false
    for (var i = 0; i < this.state.conditions.length; i++) {
      if (this.state.conditions[i].condition === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'condition', index: i, message: 'Please choose a valid condition'}
        conditionErrors.push(conditionError)
      }
      if (this.state.conditions[i].criteria === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'criteria', index: i, message: 'Please choose a valid criteria'}
        conditionErrors.push(conditionError)
      }
      if (this.state.conditions[i].text === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'text', index: i, message: 'Please choose a valid text'}
        conditionErrors.push(conditionError)
      }
    }
    if (isErrorInCondition) {
      errorMessages.push({error: 'conditions', message: conditionErrors})
      this.setState({errorMessages: errorMessages})
    }
    return !errors
  }
  removeCondition (e, index) {
    var tempConditions = this.state.conditions
    for (var i = 0; i < tempConditions.length; i++) {
      if (i === index) {
        tempConditions.splice(i, 1)
      }
    }
    this.setState({
      conditions: tempConditions
    })
  }

  changeCondition (e, index) {
    console.log('Change Condition')
    var conditions = this.state.conditions
    for (var i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].condition = e.target.value
      }
    }
    this.setState({conditions: conditions})
  }
  changeCriteria (e, index) {
    console.log('Change Criteria')
    var conditions = this.state.conditions
    for (var i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].criteria = e.target.value
      }
    }
    this.setState({conditions: conditions})
  }
  changeText (e, index) {
    console.log('Change Text')
    var conditions = this.state.conditions
    for (var i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].text = e.target.value
      }
    }
    this.setState({conditions: conditions})
  }
  addCondition () {
    this.setState({errorMessages: []})
    var conditions = this.state.conditions
    conditions.push({condition: '', criteria: '', text: ''})
    this.setState({
      conditions: conditions
    })
  }
  handleRadioChange (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value === 'segmentList') {
      this.setState({listsSelected: []})
    }
  }

  handleNameText (e) {
    this.setState({
      newListName: e.target.value
    })
  }

  initializeListSelect (lists) {
    console.log('Initialize Lists', lists)
    var self = this
    $('#selectLists').select2({
      data: lists,
      placeholder: 'Select Lists',
      allowClear: true,
      multiple: true,
      tags: true
    })

    $('#selectLists').on('change', function (e) {
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        console.log('selected options', e.target.selectedOptions)
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].label
          selected.push(selectedOption)
        }
        self.setState({ listsSelected: selected })
      }
      console.log('change List Selection', selected)
    })
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
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div className='m-portlet m-portlet-mobile '>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Create SubList of Customers
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='row align-items-center'>
                        <div>
                          <div className='radio-buttons' style={{marginLeft: '37px'}}>
                            <div className='radio'>
                              <input id='segmentAll'
                                type='radio'
                                value='segmentAll'
                                name='segmentationType'
                                onChange={this.handleRadioChange}
                                checked={this.state.selectedRadio === 'segmentAll'} />
                              <label>Segment all subscribers</label>
                            </div>
                            <div className='radio'>
                              <input id='segmentList'
                                type='radio'
                                value='segmentList'
                                name='segmentationType'
                                onChange={this.handleRadioChange}
                                checked={this.state.selectedRadio === 'segmentList'} />
                              <label>Segment an existing List</label>
                            </div>
                          </div>
                          <span className='m-form__help'>
                            {
                              this.state.errorMessages.map((m, i) => (
                                m.error === 'radio' &&
                                  <span style={{color: 'red'}}>{m.message}</span>
                              ))
                            }
                          </span>
                        </div>
                        <div className='form-group m-form__group col-12'>
                          <label className='col-lg-2 col-form-label'>
                            Choose Lists
                          </label>
                          { this.state.selectedRadio === 'segmentList'
                            ? <div className='col-lg-6'>
                              <select id='selectLists' />
                            </div>
                            : <div className='col-lg-6'>
                              <select id='selectLists' disabled />
                            </div>
                          }
                          <span className='m-form__help'>
                            {
                              this.state.errorMessages.map((m, i) => (
                                m.error === 'selection' &&
                                  <span style={{color: 'red'}}>{m.message}</span>
                              ))
                            }
                          </span>
                        </div>
                        <div className='form-group m-form__group col-12'>
                          <label className='col-lg-2 col-form-label'>
                            List Name
                          </label>
                          <div className='col-lg-6'>
                            <input id='listName'
                              type='text'
                              value={this.state.newListName}
                              onChange={this.handleNameText}
                            />
                          </div>
                          <span className='m-form__help'>
                            {
                              this.state.errorMessages.map((m, i) => (
                                m.error === 'listName' &&
                                  <span style={{color: 'red'}}>{m.message}</span>
                              ))
                            }
                          </span>
                        </div>
                        <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                          <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                            <table className='m-datatable__table'
                              id='m-datatable--27866229129' style={{
                                display: 'block',
                                height: 'auto',
                                overflowX: 'auto'
                              }}>
                              <thead className='m-datatable__head'>
                                <tr className='m-datatable__row'
                                  style={{height: '53px'}}>
                                  <th data-field='title'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{width: '25%'}}>
                                    <span>Condition</span>
                                  </th>
                                  <th data-field='title'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{width: '25%'}}>
                                    <span>Criteria</span>
                                  </th>
                                  <th data-field='text'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{width: '25%'}}>
                                    <span>Text</span>
                                  </th>
                                  <th data-field='remove'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{width: '25%'}}>
                                    <span />
                                  </th>
                                </tr>
                              </thead>
                              <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                                {
                                 this.state.conditions.map((condition, i) => (
                                   <tr data-row={i}
                                     className='m-datatable__row m-datatable__row--even'
                                     style={{height: '55px'}} key={i}>
                                     <td data-field='title'
                                       className='m-datatable__cell' style={{width: '25%'}}>
                                       <select className='form-control m-input' onChange={(e) => this.changeCondition(e, i)}
                                         value={condition.condition} >
                                         <option value=''>Select Condition</option>
                                         <option value='name'>Name</option>
                                         <option value='gender'>Gender</option>
                                         <option value='locale'>Locale</option>
                                       </select>
                                       <span className='m-form__help'>
                                         {
                                           this.state.errorMessages.map((m) => (
                                             m.error === 'conditions' && m.message.map((msg) => {
                                               return (msg.field === 'condition' && msg.index === i &&
                                               <span style={{color: 'red'}}>{msg.message}</span>
                                               )
                                             })
                                           ))
                                         }
                                       </span>
                                     </td>
                                     <td data-field='title'
                                       className='m-datatable__cell' style={{width: '25%'}}>
                                       <select className='form-control m-input' onChange={(e) => this.changeCriteria(e, i)}
                                         value={condition.criteria}>
                                         <option value=''>Select Criteria</option>
                                         <option value='is'>is</option>
                                         <option value='contains'>Contains</option>
                                         <option value='begins'>Begins with</option>
                                       </select>
                                       <span className='m-form__help'>
                                         {
                                           this.state.errorMessages.map((m) => (
                                             m.error === 'conditions' && m.message.map((msg) => {
                                               return (msg.field === 'criteria' && msg.index === i &&
                                               <span style={{color: 'red'}}>{msg.message}</span>
                                               )
                                             })
                                           ))
                                         }
                                       </span>
                                     </td>
                                     <td data-field='title'
                                       className='m-datatable__cell' style={{width: '25%'}}>
                                       <input className='form-control m-input'
                                         onChange={(e) => this.changeText(e, i)}
                                         value={condition.text}
                                         id='text'
                                         placeholder='Text' />
                                       <span className='m-form__help'>
                                         {
                                           this.state.errorMessages.map((m) => (
                                             m.error === 'conditions' && m.message.map((msg) => {
                                               return (msg.field === 'text' && msg.index === i &&
                                               <span style={{color: 'red'}}>{msg.message}</span>
                                               )
                                             })
                                           ))
                                         }
                                       </span>
                                     </td>
                                     <td data-field='title'
                                       className='m-datatable__cell' style={{width: '25%'}}>
                                       { (this.state.conditions.length > 1)
                                         ? <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={(e) => this.removeCondition(e, i)} >
                                          Remove
                                        </button>
                                        : <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' disabled >
                                         Remove
                                       </button>
                                      }
                                     </td>
                                   </tr>
                                 ))
                               }
                              </tbody>
                            </table>
                            <button style={{margin: '15px'}} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={this.addCondition}>
                             + Add Condition
                           </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body' />
                    <div className='m-portlet__foot m-portlet__foot--fit'>
                      <div className='m-form__actions m-form__actions' style={{padding: '30px'}}>
                        { this.state.isSaveEnabled
                          ? <div>
                            <Link style={{marginRight: '10px'}} to='/customerLists' className='btn btn-primary'>
                             Back
                            </Link>
                            <button className='btn btn-primary' onClick={this.onSave}>
                             Save
                            </button>
                          </div>
                          : <div>
                            <Link style={{marginRight: '10px'}} disabled className='btn btn-primary'>
                             Back
                            </Link>
                            <button className='btn btn-primary' disabled>
                             Save
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    customerLists: (state.listsInfo.customerLists)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    loadCustomerLists: loadCustomerLists,
    createSubList: createSubList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSubList)
