import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import Select from 'react-select'
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
        options: [{label: 'Male', value: 'male'},
                  {label: 'Female', value: 'female'},
                  {label: 'Other', value: 'other'}
        ]
      },
      Locale: {
        options: [{label: 'en_US', value: 'en_US'},
                  {label: 'af_ZA', value: 'af_ZA'},
                  {label: 'ar_AR', value: 'ar_AR'},
                  {label: 'az_AZ', value: 'az_AZ'},
                  {label: 'pa_IN', value: 'pa_IN'}
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
    for (var i = 0; i < this.props.pages.length; i++) {
      options[i] = {label: this.props.pages[i].pageName, value: this.props.pages[i].pageId}
    }
    this.setState({page: {options: options}})
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
                  <h3 className='m-subheader__title'>Channel Settings</h3>
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
                          <select className='form-control m-select2 select2-hidden-accessible' id='m_select2_1' name='param' tabIndex='-1' aria-hidden='true'
                            onChange={this.handleSelectChange} value={this.state.isActive}>
                            <option value='message_is'>Active</option>
                            <option value='message_contains'>Disabled</option>
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
                          <Select
                            closeOnSelect={!stayOpen}
                            disabled={disabled}
                            multi
                            onChange={this.handlePageChange}
                            options={this.state.page.options}
                            placeholder='Select page(s)'
                            simpleValue
                            value={this.state.pageValue}
                          />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Gender
                        </label>
                        <div className='col-lg-6'>
                          <Select
                            closeOnSelect={!stayOpen}
                            disabled={disabled}
                            multi
                            onChange={this.handleGenderChange}
                            options={this.state.Gender.options}
                            placeholder='Select Gender'
                            simpleValue
                            value={this.state.genderValue}
                          />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Locale
                        </label>
                        <div className='col-lg-6'>
                          <Select
                            closeOnSelect={!stayOpen}
                            disabled={disabled}
                            multi
                            onChange={this.handleLocaleChange}
                            options={this.state.Locale.options}
                            placeholder='Select Locale'
                            simpleValue
                            value={this.state.localeValue}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='m-portlet__foot m-portlet__foot--fit'>
                    <div className='m-form__actions m-form__actions'>
                      <div className='row'>
                        <div className='col-lg-2' />
                        <div className='col-lg-6'>
                          <button className='btn btn-primary' onClick={this.editAutoposting} >
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
