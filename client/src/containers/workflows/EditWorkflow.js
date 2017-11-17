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
      isActive: props.location.state.isActive === true ? 'Yes' : 'No'
    }
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
                          <select className='form-control m-select2 select2-hidden-accessible' id='m_select2_1' name='param' tabIndex='-1' aria-hidden='true' onChange={this.changeCondition}
                            value={this.state.condition}>
                            <option value='message_is'>Message is</option>
                            <option value='message_contains'>Message Contains</option>
                            <option value='message_begins'>Message Begins with</option>
                          </select>
                          <span className='select2 select2-container select2-container--default select2-container--below select2-container--focus' dir='ltr' style={{width: '281.328px'}}>
                            <span className='selection'>
                              <span className='select2-selection select2-selection--single' role='combobox' aria-haspopup='true' aria-expanded='false' tabIndex='0' aria-labelledby='select2-m_select2_1-container'>
                                <span className='select2-selection__rendered' id='select2-m_select2_1-container' title={this.state.condition}>
                                  {this.state.condition}
                                </span>
                                <span className='select2-selection__arrow' role='presentation'>
                                  <b role='presentation' />
                                </span>
                              </span>
                            </span>
                            <span className='dropdown-wrapper' aria-hidden='true' />
                          </span>
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
                          <select className='form-control m-select2 select2-hidden-accessible' id='isActive' name='param' tabIndex='-1' aria-hidden='true' onChange={this.changeActive}
                            value={this.state.isActive}>
                            <option value='message_is'>Yes</option>
                            <option value='message_contains'>No</option>
                          </select>
                          <span className='select2 select2-container select2-container--default select2-container--below select2-container--focus' dir='ltr' style={{width: '281.328px'}}>
                            <span className='selection'>
                              <span className='select2-selection select2-selection--single' role='combobox' aria-haspopup='true' aria-expanded='false' tabIndex='0' aria-labelledby='select2-m_select2_1-container'>
                                <span className='select2-selection__rendered' id='select2-m_select2_1-container' title={this.state.isActive}>
                                  {this.state.isActive}
                                </span>
                                <span className='select2-selection__arrow' role='presentation'>
                                  <b role='presentation' />
                                </span>
                              </span>
                            </span>
                            <span className='dropdown-wrapper' aria-hidden='true' />
                          </span>
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
