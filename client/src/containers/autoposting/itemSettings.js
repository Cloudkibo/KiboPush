import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editautoposting, clearAlertMessages } from '../../redux/actions/autoposting.actions'
import { Alert } from 'react-bs-notifier'

class ItemSettings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      page: {
        options: []
      },
      Gender: {
        options: [{id: 'male', text: 'Male', value: 'male'},
                  {id: 'female', text: 'Female', value: 'female'},
                  {id: 'other', text: 'Other', value: 'other'}
        ]
      },
      Locale: {
        options: [{id: 'en_US', text: 'en_US', value: 'en_US'},
                  {id: 'af_ZA', text: 'af_ZA', value: 'af_ZA'},
                  {id: 'ar_AR', text: 'ar_AR', value: 'ar_AR'},
                  {id: 'az_AZ', text: 'az_AZ', value: 'az_AZ'},
                  {id: 'pa_IN', text: 'pa_IN', value: 'pa_IN'}
        ]
      },
      stayOpen: false,
      disabled: false,
      pageValue: this.props.location.state.item.segmentationPageIds,
      genderValue: this.props.location.state.item.segmentationGender,
      localeValue: this.props.location.state.item.segmentationLocale,
      isActive: this.props.location.state.item.isActive ? 'Active' : 'Disabled',
      alertMessage: '',
      alertType: ''
    }
    props.clearAlertMessages()
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleGenderChange = this.handleGenderChange.bind(this)
    this.handleLocaleChange = this.handleLocaleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.editAutoposting = this.editAutoposting.bind(this)

    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.initializeGenderSelect = this.initializeGenderSelect.bind(this)
    this.initializeLocaleSelect = this.initializeLocaleSelect.bind(this)
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
    addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://unpkg.com/react-select/dist/react-select.js')
    document.body.appendChild(addScript)
    let options = []
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.location.state.item.segmentationPageIds !== '') {
        if (this.props.location.state.item.segmentationPageIds.indexOf(this.props.pages[i].pageId) !== -1) {
          options[i] = {text: this.props.pages[i].pageName, id: this.props.pages[i].pageId, selected: true}
        } else {
          options[i] = {text: this.props.pages[i].pageName, id: this.props.pages[i].pageId}
        }
      } else {
        options[i] = {text: this.props.pages[i].pageName, id: this.props.pages[i].pageId}
      }
    }
    this.setState({page: {options: options}})

    let optionsGender = []
    for (let i = 0; i < this.state.Gender.options.length; i++) {
      if (this.props.location.state.item.segmentationGender !== '') {
        if (this.props.location.state.item.segmentationGender.indexOf(this.state.Gender.options[i].value) !== -1) {
          optionsGender[i] = {text: this.state.Gender.options[i].value, id: this.state.Gender.options[i].value, selected: true}
        } else {
          optionsGender[i] = {text: this.state.Gender.options[i].value, id: this.state.Gender.options[i].value}
        }
      } else {
        optionsGender[i] = {text: this.state.Gender.options[i].value, id: this.state.Gender.options[i].value}
      }
    }
    this.setState({Gender: {options: optionsGender}})

    let optionsLocale = []
    for (let i = 0; i < this.state.Locale.options.length; i++) {
      if (this.props.location.state.item.segmentationLocale !== '') {
        console.log('HELLO')
        console.log(this.props.location.state.item.segmentationGender)
        console.log(this.state.Gender.options[i])
        console.log('HELLO')
        if (this.props.location.state.item.segmentationLocale.indexOf(this.state.Locale.options[i].value) !== -1) {
          optionsLocale[i] = {text: this.state.Locale.options[i].value, id: this.state.Locale.options[i].value, selected: true}
        } else {
          optionsLocale[i] = {text: this.state.Locale.options[i].value, id: this.state.Locale.options[i].value}
        }
      } else {
        optionsLocale[i] = {text: this.state.Locale.options[i].value, id: this.state.Locale.options[i].value}
      }
    }
    this.setState({Locale: {options: optionsLocale}})

    this.initializePageSelect(options)
    this.initializeGenderSelect(optionsGender)
    this.initializeLocaleSelect(optionsLocale)
  }

  initializePageSelect (pageOptions) {
    console.log(pageOptions)
    var self = this
    $('#selectPage').select2({
      data: pageOptions,
      placeholder: 'Select Pages',
      allowClear: true,
      multiple: true,
      tags: true
    })
    $('#selectPage').on('change', function (e) {
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ pageValue: selected })
      }
      console.log('change Page', selected)
    })
  }

  initializeGenderSelect (conditionOptions) {
    var self = this
    $('#genderSelect').select2({
      data: conditionOptions,
      placeholder: 'Select Gender',
      allowClear: true,
      multiple: true,
      tags: true
    })
    $('#genderSelect').on('change', function (e) {
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ genderValue: selected })
      }
      console.log('change condition', selected)
    })
  }

  initializeLocaleSelect (conditionOptions) {
    var self = this
    $('#localeSelect').select2({
      data: conditionOptions,
      placeholder: 'Select Locale',
      allowClear: true,
      multiple: true,
      tags: true
    })
    $('#localeSelect').on('change', function (e) {
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ localeValue: selected })
      }
      console.log('change condition', selected)
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.successMessage) {
      this.setState({
        alertMessage: nextProps.successMessage,
        alertType: 'success'
      })
    } else if (nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.errorMessage,
        alertType: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
    }
  }

  handlePageChange (value) {
    var temp = value.split(',')
    this.setState({ pageValue: temp })
  }

  handleGenderChange (value) {
    var temp = value.split(',')
    this.setState({ genderValue: temp })
  }

  handleLocaleChange (value) {
    var temp = value.split(',')
    this.setState({ localeValue: temp })
  }

  handleSelectChange (event) {
    console.log('isActive changed')
    this.setState({ isActive: event.target.value })
  }

  editAutoposting () {
    console.log(this.accountTitleValue.value)
    var isSegmented = false
    var isActive = false
    if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 || this.state.localeValue.length > 0) {
      isSegmented = true
    }
    if (this.state.isActive === 'Active') {
      isActive = true
    } else {
      isActive = false
    }
    const autopostingData = {
      _id: this.props.location.state.item._id,
      accountTitle: this.accountTitleValue.value ? this.accountTitleValue.value : this.props.location.state.title,
      isSegmented: isSegmented,
      segmentationPageIds: this.state.pageValue,
      segmentationGender: this.state.genderValue,
      segmentationLocale: this.state.localeValue,
      isActive: isActive
    }
    console.log(autopostingData)
    this.props.editautoposting(autopostingData)
  }

  render () {
    const { disabled, stayOpen } = this.state
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
                  <h3 className='m-subheader__title'>Feed Settings</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        <i style={{color: this.props.location.state.iconColor}} className={this.props.location.state.icon} aria-hidden='true' /> {this.props.location.state.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <form className='m-form m-form--label-align-right'>
                  <div className='m-portlet__body'>
                    <div className='m-form__section m-form__section--first'>
                      <div className='m-form__heading'>
                        <h3 className='m-form__heading-title'>
                          Info
                        </h3>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Account Title
                        </label>
                        <div className='col-lg-6'>
                          <input className='form-control m-input'
                            ref={(c) => { this.accountTitleValue = c }}
                            defaultValue={this.props.location.state.title} />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Status
                        </label>
                        <div className='col-lg-6' id='rules'>
                          <select className='form-control m-input' onChange={this.handleSelectChange} value={this.state.isActive}>
                            <option value='Active'>Active</option>
                            <option value='Disabled'>Disabled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='m-form__seperator m-form__seperator--dashed' />
                    <div className='m-form__section m-form__section--last'>
                      <div className='m-form__heading'>
                        <h3 className='m-form__heading-title'>
                          Set Segmentation
                        </h3>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Pages
                        </label>
                        <div className='col-lg-6'>
                          <select id='selectPage' />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Gender
                        </label>
                        <div className='col-lg-6'>
                          <select id='genderSelect' />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Locale
                        </label>
                        <div className='col-lg-6'>
                          <select id='localeSelect' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='m-portlet__foot m-portlet__foot--fit'>
                    <div className='m-form__actions m-form__actions'>
                      <div className='row'>
                        <div className='col-lg-2' />
                        <div className='col-lg-6'>
                          <button className='btn btn-primary' type='button' onClick={this.editAutoposting} >
                            Save Changes
                          </button>
                          <span>&nbsp;&nbsp;</span>
                          <Link to='/autoposting'>
                            <button className='btn btn-secondary'>
                              Back
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className='row'>
                        <span>&nbsp;&nbsp;</span>
                      </div>
                      <div className='row'>
                        <div className='col-lg-2' />
                        <div className='col-lg-6'>
                          {
                            this.state.alertMessage !== '' &&
                            <center>
                              <Alert type={this.state.alertType}>
                                {this.state.alertMessage}
                              </Alert>
                            </center>
                          }
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
    autopostingData: (state.autopostingInfo.autopostingData),
    pages: (state.pagesInfo.pages),
    successMessage: (state.autopostingInfo.successMessageEdit),
    errorMessage: (state.autopostingInfo.errorMessageEdit)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      editautoposting: editautoposting,
      clearAlertMessages: clearAlertMessages
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemSettings)
