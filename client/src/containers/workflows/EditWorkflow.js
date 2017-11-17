/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import {
  editWorkFlow,
  loadWorkFlowList
} from '../../redux/actions/workflows.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

class EditWorkflow extends React.Component {
  constructor (props) {
    super(props)
    this.gotoWorkflow = this.gotoWorkflow.bind(this)
    this.changeCondition = this.changeCondition.bind(this)
    this.changeKeywords = this.changeKeywords.bind(this)
    this.changeReply = this.changeReply.bind(this)
    this.changeActive = this.changeActive.bind(this)
    this.state = {
      condition: props.location.state.condition,
      keywords: props.location.state.keywords,
      reply: props.location.state.reply,
      isActive: props.location.state.isActive === true ? 'Yes' : 'No',
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
    this.initializeConditionSelect = this.initializeConditionSelect.bind(this)
    this.initializeActiveSelect = this.initializeActiveSelect.bind(this)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
    document.title = 'KiboPush | Edit Workflow'

    this.initializeConditionSelect(this.state.conditionSelect.options)
    this.initializeActiveSelect(this.state.activeSelect.options)
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
        self.setState({ condition: selected })
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
        self.setState({ isActive: selected })
      }
      console.log('change active', selected)
    })
  }

  gotoWorkflow () {
    console.log('Request Object', {
      condition: this.state.condition,
      keywords: this.state.keywords,
      reply: this.state.reply,
      isActive: this.state.isActive
    })
    this.props.editWorkFlow({
      condition: this.state.condition,
      keywords: this.state.keywords,
      reply: this.state.reply,
      isActive: this.state.isActive,
      _id: this.props.location.state._id
    })
    this.props.history.push({
      pathname: '/workflows'
    })
  }

  changeCondition (event) {
    this.setState({condition: event.target.value})
  }

  changeKeywords (event) {
    this.setState({keywords: event.target.value.split(',')})
  }

  changeReply (event) {
    this.setState({reply: event.target.value})
  }

  changeActive (event) {
    this.setState({isActive: event.target.value})
  }

  render () {
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
                  <h3 className='m-subheader__title'>Edit Workflow</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Form
                      </h3>
                    </div>
                  </div>
                </div>
                <form className='m-form m-form--label-align-right'>
                  <div className='m-portlet__body'>
                    <div className='m-form__section m-form__section--first'>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Rule
                        </label>
                        <div className='col-lg-6' id='rules'>
                          <select id='conditionSelect' />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Keywords (separated by comma)
                        </label>
                        <div className='col-lg-6'>
                          <input className='form-control m-input'
                            onChange={this.changeKeywords}
                            value={this.state.keywords}
                            id='keywords'
                            placeholder='hi,hello,hey' />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Reply
                        </label>
                        <div className='col-lg-6'>
                          <textarea className='form-control m-input'
                            onChange={this.changeReply}
                            value={this.state.reply} rows='5'
                            id='exampleInputReply' />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Is Active?
                        </label>
                        <div className='col-lg-6'>
                          <select id='isActiveSelect' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='m-portlet__foot m-portlet__foot--fit'>
                    <div className='m-form__actions m-form__actions'>
                      <div className='row'>
                        <div className='col-lg-2' />
                        <div className='col-lg-6'>
                          <button className='btn btn-primary' onClick={this.gotoWorkflow} >
                            Save Changes
                          </button>
                          <span>&nbsp;&nbsp;</span>
                          <Link to='workflows'>
                            <button className='btn btn-secondary'>
                              Cancel
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
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
    {loadWorkFlowList: loadWorkFlowList, editWorkFlow: editWorkFlow}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(EditWorkflow)
