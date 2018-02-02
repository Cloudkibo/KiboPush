/* eslint-disable no-useless-constructor */
import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {
  loadCustomerLists
} from '../../redux/actions/customerLists.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class CreateSubList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedRadio: '',
      listsSelected: [],
      conditions: [{condition: '', criteria: '', text: ''}],
      newListName: '',
      condition: '',
      criteria: '',
      text: ''
    }
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.initializeListSelect = this.initializeListSelect.bind(this)
    this.handleNameText = this.handleNameText.bind(this)
    this.addCondition = this.addCondition.bind(this)
    this.changeCondition = this.changeCondition.bind(this)
    this.changeCriteria = this.changeCriteria.bind(this)
    this.changeText = this.changeText.bind(this)
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
  changeCondition (e) {
    console.log('Change Condition')
    this.setState({condition: e.target.value})
  }
  changeCriteria (e) {
    console.log('Change Criteria')
    this.setState({criteria: e.target.value})
  }
  changeText (e) {
    console.log('Change Text')
    this.setState({text: e.target.value})
  }
  addCondition () {
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
    return (
      <div>
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
                                       <select className='form-control m-input' onChange={this.changeCondition}
                                         value={this.state.condition} >
                                         <option value='name'>Name</option>
                                         <option value='gender'>Gender</option>
                                         <option value='locale'>Locale</option>
                                       </select>
                                     </td>
                                     <td data-field='title'
                                       className='m-datatable__cell' style={{width: '25%'}}>
                                       <select className='form-control m-input' onChange={this.changeCriteria}
                                         value={this.state.criteria}>
                                         <option value='is'>is</option>
                                         <option value='contains'>Contains</option>
                                         <option value='begins'>Begins with</option>
                                       </select>
                                     </td>
                                     <td data-field='title'
                                       className='m-datatable__cell' style={{width: '25%'}}>
                                       <input className='form-control m-input'
                                         onChange={this.changeText}
                                         value={this.state.text}
                                         id='text'
                                         placeholder='Text' />
                                     </td>
                                     <td data-field='title'
                                       className='m-datatable__cell' style={{width: '25%'}}>
                                       <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                        Remove
                                      </button>
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
                        <Link style={{marginRight: '10px'}} to='/customerLists' className='btn btn-primary'>
                          Back
                        </Link>
                        <button className='btn btn-primary'>
                          Save
                        </button>
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
    loadCustomerLists: loadCustomerLists
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSubList)
