/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Alert } from 'react-bs-notifier'
import { createpoll, loadCategoriesList, addCategory } from '../../redux/actions/templates.actions'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'

class createPoll extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadCategoriesList()
    this.state = {
      isShowingModal: false,
      categoryValue: [],
      disabled: false,
      alert: false,
      statement: '',
      option1: '',
      option2: '',
      option3: '',
      alertMessage: ''
    }
    this.createPoll = this.createPoll.bind(this)
    this.initializeCategorySelect = this.initializeCategorySelect.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.saveCategory = this.saveCategory.bind(this)
    this.exists = this.exists.bind(this)
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Create Poll Template`;
  }
  UNSAFE_componentWillReceiveProps (nextprops) {
    if (nextprops.categories) {
      let options = []
      for (var i = 0; i < nextprops.categories.length; i++) {
        options[i] = {id: nextprops.categories[i]._id, text: nextprops.categories[i].name}
      }
      this.initializeCategorySelect(options)
    }
    if (nextprops.warning) {
      this.msg.error(nextprops.warning)
    } else if (nextprops.pollCreated) {
      this.props.history.push({
        pathname: '/templates'
      })
    }
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  initializeCategorySelect (categoryOptions) {
    var self = this
    /* eslint-disable */
    $('#selectcategory').select2({
      /* eslint-enable */
      data: categoryOptions,
      placeholder: 'Select Category',
      allowClear: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectcategory').on('change', function (e) {
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
  exists (newCategory) {
    for (let i = 0; i < this.props.categories.length; i++) {
      if (this.props.categories[i].name.toLowerCase().includes(newCategory.toLowerCase())) {
        return true
      }
    }
    return false
  }
  saveCategory () {
    if (this.refs.newCategory.value) {
      if (this.exists(this.refs.newCategory.value) === false) {
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
  createPoll () {
    var options = []
    if (this.refs.title.value === '') {
      this.msg.error('Please add a title')
    } else if (this.state.categoryValue.length === 0) {
      this.msg.error('Please select a category')
    } else if (this.state.statement === '') {
      this.msg.error('Please add a statement')
    } else if (this.state.option1 === '' || this.state.option2 === '' ||
      this.state.option3 === '') {
      this.msg.error('Please add all the responses')
    } else {
      if (this.state.option1 !== '') {
        options.push(this.state.option1)
      }
      if (this.state.option2 !== '') {
        options.push(this.state.option2)
      }
      if (this.state.option3 !== '') {
        options.push(this.state.option3)
      }
      this.props.createpoll({
        title: this.refs.title.value,
        category: this.state.categoryValue,
        statement: this.state.statement,
        options: options
      })
    }
  }

  updateStatment (e) {
    this.setState({statement: e.target.value})
  }

  updateOptions (e, opt) {
    switch (opt) {
      case 1:
        this.setState({option1: e.target.value})
        break
      case 2:
        this.setState({option2: e.target.value})
        break
      case 3:
        this.setState({option3: e.target.value})
        break

      default:
        break
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
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
                    this.closeDialog()
                    this.saveCategory()
                  }} data-dismiss='modal'>Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Create Template Poll</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>

          <div className='row'>
            <div
              className='m-form m-form--label-align-right'>
              <div className='row align-items-center'>
                <div className='col-xl-8 order-2 order-xl-1' />
                <div
                  className='col-xl-4 order-1 order-xl-2 m--align-right'>
                  <div
                    className='m-separator m-separator--dashed d-xl-none' />
                </div>
              </div>
            </div>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet' style={{height: '100%'}}>
                <div className='m-portlet__body'>
                  <div className='m-form'>
                    <div className='form-group m-form__group' id='titl'>
                      <label className='control-label'>Title</label>
                      <input className='form-control'
                        placeholder='Enter form title here' ref='title' />
                    </div>
                    <div className='form-group m-form__group' id='desc'>
                      <label className='control-label'>Category</label>
                      <div className='m-form'>
                        <div className='form-group m-form__group'>
                          <select id='selectcategory' />
                          <button data-toggle="modal" data-target="#create" onClick={this.showDialog} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' style={{marginLeft: '15px'}}>
                           + Add category
                         </button>
                        </div>
                      </div>
                    </div>
                    <div id='question' className='form-group m-form__group'>
                      <label className='control-label'>Ask something...</label>
                      <textarea className='form-control'
                        placeholder='Enter Question'
                        value={this.state.statement}
                        onChange={(e) => this.updateStatment(e)} />
                    </div>
                    <div style={{top: '10px'}}>
                      <label className='control-label'> Add 3 responses</label>
                      <fieldset className='input-group-vertical'>
                        <div id='responses' className='form-group m-form__group'>
                          <label className='sr-only'>Response1</label>
                          <input type='text' className='form-control'
                            value={this.state.option1}
                            onChange={(e) => this.updateOptions(e, 1)}
                            placeholder='Response 1' maxLength='20' />
                        </div>
                        <div className='form-group m-form__group'>
                          <label className='sr-only'>Response2</label>
                          <input type='text' className='form-control'
                            value={this.state.option2}
                            onChange={(e) => this.updateOptions(e, 2)}
                            placeholder='Response 2' maxLength='20' />
                        </div>
                        <div className='form-group m-form__group'>
                          <label className='sr-only'>Response3</label>
                          <input type='text' className='form-control'
                            value={this.state.option3}
                            onChange={(e) => this.updateOptions(e, 3)}
                            placeholder='Response 3' maxLength='20' />
                        </div>
                      </fieldset>
                    </div>
                  </div>
                  <br />
                  { this.state.alertMessage !== '' &&
                    <center>
                      <Alert type='danger' style={{marginTop: '30px'}}>{this.state.alertMessage}
                        You have either left one or more responses empty or you
                        have not asked anything. Please ask something and fill all
                        three responses in order to create the poll.
                      </Alert>
                    </center>
                  }
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                  <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px'}}>
                    <button className='btn btn-primary'
                      onClick={this.createPoll}> Create Poll
                    </button>
                    <Link
                      to='/templates'
                      className='btn btn-secondary' style={{'margin-left': '10px'}}>
                      Cancel
                    </Link>
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
    categories: (state.templatesInfo.categories),
    pollCreated: (state.templatesInfo.pollCreated),
    warning: (state.templatesInfo.warning)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createpoll: createpoll,
    loadCategoriesList: loadCategoriesList,
    addCategory: addCategory
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(createPoll)
