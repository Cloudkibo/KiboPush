/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { createBroadcast, editBroadcast, loadCategoriesList, addCategory, deleteCategory } from '../../redux/actions/templates.actions'
import { bindActionCreators } from 'redux'
import { validateFields } from '../convo/utility'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'

class CreateBroadcastTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadCategoriesList()
    this.state = {
      buttonActions: ['open website', 'google sheets'],
      broadcast: this.props.template ? this.props.template.payload : [],
      isShowingModal: false,
      convoTitle: props.template ? props.template.title : 'Broadcast Title',
      showAddCategoryDialog: false,
      categoryValue: []
    }
    this.initializeCategorySelect = this.initializeCategorySelect.bind(this)
    this.showAddCategoryDialog = this.showAddCategoryDialog.bind(this)
    this.closeAddCategoryDialog = this.closeAddCategoryDialog.bind(this)
    this.saveCategory = this.saveCategory.bind(this)
    this.createBroadcastTemplate = this.createBroadcastTemplate.bind(this)
    this.editBroadcastTemplate = this.editBroadcastTemplate.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Create Broadcast Template`
    console.log('this.props.template', this.props.template)
    if (this.props.template) {
      var options = this.state.categoryValue
      for (var j = 0; j < this.props.template.category.length; j++) {
        options.push({id: j, text: this.props.template.category[j], selected: true})
      }
      this.setState({categoryValue: this.props.template.category})
      this.initializeCategorySelect(options)
    }
  }

  handleChange (broadcast) {
    this.setState(broadcast)
  }

  UNSAFE_componentWillReceiveProps (nextprops) {
    if (nextprops.categories) {
      let options = []
      for (var i = 0; i < nextprops.categories.length; i++) {
        options[i] = {id: nextprops.categories[i]._id, text: nextprops.categories[i].name}
      }
      this.initializeCategorySelect(options)
    }
  }

  initializeCategorySelect (categoryOptions) {
    var self = this
    /* eslint-disable */
    $('#selectCategory').select2({
      /* eslint-enable */
      data: categoryOptions,
      placeholder: 'Select Category',
      allowClear: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectCategory').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].label
          selected.push(selectedOption)
        }
        self.setState({ categoryValue: selected })
      }
    })
  }

  showAddCategoryDialog () {
    this.setState({showAddCategoryDialog: true})
  }

  closeAddCategoryDialog () {
    this.setState({showAddCategoryDialog: false})
  }
  saveCategory () {
    if (this.refs.newCategory.value) {
      if (!this.exists(this.refs.newCategory.value)) {
        let payload = {name: this.refs.newCategory.value}
        this.props.addCategory(payload, this.msg)
        this.props.loadCategoriesList()
      } else {
        this.msg.error('Category already exists')
      }
    } else {
      this.msg.error('Please enter a category')
    }
  }

  exists (newCategory) {
    for (let i = 0; i < this.props.categories.length; i++) {
      if (this.props.categories[i].name.toLowerCase().includes(newCategory.toLowerCase())) {
        return true
      }
    }
    return false
  }

  createBroadcastTemplate () {

    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    if (this.state.categoryValue.length > 0) {
      var broadcastTemplate = {
        title: this.state.convoTitle,
        category: this.state.categoryValue,
        payload: this.state.broadcast
      }
      this.props.createBroadcast(broadcastTemplate, this.msg)
      this.reset(false)
    } else {
      this.msg.error('Please select a category')
    }
  }

  editBroadcastTemplate () {
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    if (this.state.categoryValue.length > 0) {
      var broadcastTemplate = {
        _id: this.props.template._id,
        title: this.state.convoTitle,
        category: this.state.categoryValue,
        payload: this.state.broadcast
      }
      this.props.editBroadcast(broadcastTemplate, this.msg)
    } else {
      this.msg.error('Please select a category')
    }
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="addCategory" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            {this.state.showAddCategoryDialog && <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Category
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <input className='form-control'
                  placeholder='Enter category' ref='newCategory' />
                <br />
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.closeAddCategoryDialog()
                    this.saveCategory()
                  }} data-dismiss='modal'>Save
                </button>
              </div>
            </div>
            }
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-exclamation m--font-brand' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding how to create template broadcasts? Here is the <a href='https://kibopush.com/broadcasts/' target='_blank' rel='noopener noreferrer'>documentation</a>.
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {this.props.template
                        ? 'Edit Broadcast Template'
                        : 'Create Broadcast Template'
                        }
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-12'>
                      <label>Category</label>
                    </div>
                    <div className='col-6'>
                      <select id='selectCategory' />
                    </div>
                    <div className='col-1'>
                      <a href='#/' onClick={() => {
                        this.setState({
                          showAddCategoryDialog: true
                        }) }} data-toggle="modal" data-target="#addCategory" className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' style={{marginLeft: '-90px'}}>
                        Add Category
                      </a>
                    </div>
                    <div className='col-5'>
                      <button onClick={this.reset} style={{marginRight: '20px', marginLeft: '95px'}} className='btn btn-primary'>Reset</button>
                      {
                        this.props.template
                        ? <button style={{marginRight: '20px'}} id='send' onClick={this.editBroadcastTemplate} className='btn btn-primary' disabled={(this.state.broadcast.length === 0)}> Update </button>
                        : <button style={{marginRight: '20px'}} id='send' onClick={this.createBroadcastTemplate} className='btn btn-primary' disabled={(this.state.broadcast.length === 0)}> Create </button>
                      }
                      <Link to='/templates' className='btn btn-secondary'>Back</Link>
                    </div>
                  </div>
                </div>
                <GenericMessage
                  broadcast={this.state.broadcast}
                  handleChange={this.handleChange}
                  setReset={reset => { this.reset = reset }}
                  convoTitle={this.state.convoTitle}
                  titleEditable
                  buttonActions={this.state.buttonActions} />
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
    categories: (state.templatesInfo.categories)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      createBroadcast: createBroadcast,
      loadCategoriesList: loadCategoriesList,
      addCategory: addCategory,
      deleteCategory: deleteCategory,
      editBroadcast: editBroadcast
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBroadcastTemplate)
