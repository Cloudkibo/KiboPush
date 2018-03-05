/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import {
  addWorkFlow,
  disableworkflow,
  enableworkflow,
  loadWorkFlowList
} from '../../redux/actions/workflows.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { registerAction } from '../../utility/socketio'

class Workflows extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadWorkFlowList()
    this.state = {
      workflowsData: [],
      workflowsDataAll: [],
      totalLength: 0,
      filterByCondition: '',
      filterByStatus: '',
      conditionSelect: {
        options: [
          {id: 'message_is', text: 'Message is'},
          {id: 'message_contains', text: 'Message Contains'},
          {id: 'message_begins', text: 'Message Begins with'}
        ]
      },
      activeSelect: {
        options: [
          {id: 'yes', text: 'Yes'},
          {id: 'no', text: 'No'}
        ]
      }
    }
    this.disableWorkflow = this.disableWorkflow.bind(this)
    this.enableWorkflow = this.enableWorkflow.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleFilterByCondition = this.handleFilterByCondition.bind(this)
    this.handleFilterByStatus = this.handleFilterByStatus.bind(this)
    this.initializeConditionSelect = this.initializeConditionSelect.bind(this)
    this.initializeActiveSelect = this.initializeActiveSelect.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps in workflows is called')
    if (nextProps.workflows) {
      this.displayData(0, nextProps.workflows)
      this.setState({ totalLength: nextProps.workflows.length })
    }
  }

  displayData (n, workflows) {
    console.log(workflows)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > workflows.length) {
      limit = workflows.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = workflows[i]
      index++
    }
    this.setState({workflowsData: data, workflowsDataAll: workflows})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.state.workflowsDataAll)
  }

  disableWorkflow (workflow) {
    this.props.disableworkflow(workflow)
  }
  enableWorkflow (workflow) {
    this.props.enableworkflow(workflow)
  }
  gotoEdit (workflow) {
    this.props.history.push({
      pathname: `/editworkflow`,
      state: workflow
    })
  }
  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)

    var compProp = this.props
    registerAction({
      event: 'workflow_created',
      action: function (data) {
        compProp.loadWorkFlowList()
      }
    })
    document.title = 'KiboPush | Workflows'

    // this.initializeConditionSelect(this.state.conditionSelect.options)
    // this.initializeActiveSelect(this.state.activeSelect.options)
  }

  initializeConditionSelect (conditionOptions) {
    var self = this
    $('#conditionSelect').select2({
      data: conditionOptions,
      placeholder: 'Select Condition',
      allowClear: true,
      multiple: true
    })
    $('#conditionSelect').on('change', function (e) {
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ filterByCondition: selected })
      }
      console.log('change condition', selected)
    })
  }

  initializeActiveSelect (activeOptions) {
    var self = this
    $('#isActiveSelect').select2({
      data: activeOptions,
      placeholder: 'Select Status',
      allowClear: true,
      multiple: true
    })
    $('#isActiveSelect').on('change', function (e) {
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ filterByStatus: selected })
      }
      console.log('change active', selected)
    })
  }

  handleFilterByCondition (e) {
    var filtered = []
    var active = this.state.filterByStatus === 'yes'
    this.setState({filterByCondition: e.target.value})
    if (this.state.filterByStatus !== '') {
      if (e.target.value === '') {
        for (var k = 0; k < this.props.workflows.length; k++) {
          if (this.props.workflows[k].isActive === active) {
            filtered.push(this.props.workflows[k])
          }
        }
      } else {
        for (var i = 0; i < this.props.workflows.length; i++) {
          if (this.props.workflows[i].isActive === active && this.props.workflows[i].condition === e.target.value) {
            filtered.push(this.props.workflows[i])
          }
        }
      }
    } else {
      if (e.target.value === '') {
        filtered = this.props.workflows
      } else {
        for (var j = 0; j < this.props.workflows.length; j++) {
          if (this.props.workflows[j].condition === e.target.value) {
            filtered.push(this.props.workflows[j])
          }
        }
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  handleFilterByStatus (e) {
    var filtered = []
    var active = e.target.value === 'yes'
    this.setState({filterByStatus: e.target.value})
    if (this.state.filterByCondition !== '') {
      if (e.target.value === '') {
        for (var k = 0; k < this.props.workflows.length; k++) {
          if (this.props.workflows[k].condition === this.state.filterByCondition) {
            filtered.push(this.props.workflows[k])
          }
        }
      } else {
        for (var i = 0; i < this.props.workflows.length; i++) {
          if (this.props.workflows[i].isActive === active && this.props.workflows[i].condition === this.state.filterByCondition) {
            filtered.push(this.props.workflows[i])
          }
        }
      }
    } else {
      if (e.target.value === '') {
        filtered = this.props.workflows
      } else {
        for (var j = 0; j < this.props.workflows.length; j++) {
          if (this.props.workflows[j].isActive === active) {
            filtered.push(this.props.workflows[j])
          }
        }
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  render () {
    console.log('Workflows', this.props.workflows)
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Workflows</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div
                className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
                role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-exclamation m--font-brand' />
                </div>
                <div className='m-alert__text'>
                  Workflows are automated messages which are sent to subscriber when subscriber sends a message which matches the set criteria.
                </div>
              </div>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Entries
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <Link to='createworkflow'>
                      <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Create Workflow
                          </span>
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                    <div className='row align-items-center'>
                      <div className='col-xl-12 order-2 order-xl-1'>
                        {
                          this.props.workflows &&
                          this.props.workflows.length > 0 &&
                            <div
                              className='form-group m-form__group row align-items-center'>
                              <div className='col-md-5'>
                                <div
                                  className='m-form__group m-form__group--inline'>
                                  <div className='m-form__label'>
                                    <label>
                                        Condition:
                                  </label>
                                  </div>
                                  <div className='m-form__control'>
                                    <select className='custom-select' id='conditionSelect' value={this.state.filterByCondition} onChange={this.handleFilterByCondition} >
                                      <option value='' disabled>Filter by Condition...</option>
                                      <option value='message_is'>message_is</option>
                                      <option value='message_contains'>message_contains</option>
                                      <option value='message_begins'>message_begins</option>
                                      <option value=''>all</option>
                                    </select>
                                  </div>
                                </div>
                                <div
                                  className='d-md-none m--margin-bottom-10' />
                              </div>
                              <div className='col-md-3'>
                                <div
                                  className='m-form__group m-form__group--inline'>
                                  <div className='m-form__label'>
                                    <label>
                                        Active:
                                      </label>
                                  </div>
                                  <div className='m-form__control'>
                                    <select className='custom-select' id='isActiveSelect' value={this.state.filterByStatus} onChange={this.handleFilterByStatus}>
                                      <option value='' disabled>Filter by Status...</option>
                                      <option value='yes'>yes</option>
                                      <option value='no'>no</option>
                                      <option value=''>all</option>
                                    </select>
                                  </div>
                                </div>
                                <div
                                  className='d-md-none m--margin-bottom-10' />
                              </div>
                            </div>
                          }
                      </div>
                    </div>
                  </div>
                  {
                    this.props.workflows && this.props.workflows.length > 0
                      ? <div>
                        {
                      this.state.workflowsData &&
                      this.state.workflowsData.length > 0
                        ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                          <table className='m-datatable__table'
                            id='m-datatable--27866229129' style={{
                              display: 'block',
                              height: 'auto',
                              overflowX: 'auto'
                            }}>
                            <thead className='m-datatable__head'>
                              <tr className='m-datatable__row'
                                style={{height: '53px'}}>
                                <th data-field='Condition'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>Condition</span>
                                </th>
                                <th data-field='KeyWords'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>Key Words</span>
                                </th>
                                <th data-field='Message'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>Message</span>
                                </th>
                                <th data-field='Active'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>Active</span>
                                </th>
                                <th data-field='Action'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>Actions</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                              {
                                this.state.workflowsData.map((workflow, i) => (
                                  <tr data-row={i}
                                    className='m-datatable__row m-datatable__row--even'
                                    style={{height: '55px'}} key={i}>
                                    <td data-field='Condition'
                                      className='m-datatable__cell'>
                                      <span
                                        style={{width: '150px'}}>{workflow.condition}</span>
                                    </td>
                                    <td data-field='KeyWords'
                                      className='m-datatable__cell'>
                                      <span
                                        style={{width: '150px'}}>{workflow.keywords.join(
                                    ',')}</span>
                                    </td>
                                    <td data-field='Message'
                                      className='m-datatable__cell'>
                                      <span
                                        style={{width: '150px'}}>{workflow.reply}</span>
                                    </td>
                                    <td data-field='Active'
                                      className='m-datatable__cell'>
                                      <span
                                        style={{width: '150px'}}>{workflow.isActive
                                    ? 'Yes'
                                    : 'No'}</span>
                                    </td>
                                    <td data-field='Action'
                                      className='m-datatable__cell'>
                                      <span style={{width: '150px'}}>
                                        <button className='btn btn-primary'
                                          style={{float: 'left', margin: 2}}
                                          onClick={() => this.gotoEdit(
                                            workflow)}>Edit
                                  </button>
                                        {
                                    workflow.isActive === true
                                      ? <button className='btn btn-primary'
                                        style={{
                                          float: 'left',
                                          margin: 2
                                        }}
                                        onClick={() => this.disableWorkflow(
                                                  workflow)}>Disable
                                    </button>
                                      : <button className='btn btn-primary'
                                        style={{
                                          float: 'left',
                                          margin: 2
                                        }}
                                        onClick={() => this.enableWorkflow(
                                                  workflow)}>Enable
                                    </button>
                                  }
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                          <ReactPaginate previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={<a>...</a>}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalLength / 4)}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'} />
                        </div>
                          : <p> No search results found. </p>
                        }
                      </div>
                    : <p> No data to display </p>
                  }
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
  console.log(state)
  return {
    workflows: (state.workflowsInfo.workflows)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadWorkFlowList: loadWorkFlowList, addWorkFlow: addWorkFlow, enableworkflow, disableworkflow}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Workflows)
