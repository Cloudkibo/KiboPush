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
        options: [{label: 'Male', value: 'Male'},
                  {label: 'Female', value: 'Female'}
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
      pageValue: [],
      genderValue: [],
      localeValue: [],
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
    this.setState({ pageValue: value })
  }

  handleGenderChange (value) {
    this.setState({ genderValue: value })
  }

  handleLocaleChange (value) {
    this.setState({ localeValue: value })
  }

  handleSelectChange (event) {
    console.log('isActive changed')
    this.setState({ isActive: event.target.value })
  }

  editAutoposting () {
    console.log(this.accountTitleValue.value)
    var isSegmented = false
    var segmentationGender = ''
    var segmentationLocale = ''
    var isActive = false
    if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 || this.state.localeValue.length > 0) {
      isSegmented = true
    }
    if (this.state.genderValue.length === 1) {
      segmentationGender = this.state.genderValue[0]
    }
    if (this.state.localeValue.length === 1) {
      segmentationGender = this.state.localeValue[0]
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
      segmentationGender: segmentationGender,
      segmentationLocale: segmentationLocale,
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
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <h3><i style={{color: this.props.location.state.iconColor}} className={this.props.location.state.icon} aria-hidden='true' /> {this.props.location.state.title}</h3>
                  <br />
                  <div className='table-responsive'>
                    <form>
                      <div className='form-group'>
                        <label>Account Title</label>
                        <input ref={(c) => { this.accountTitleValue = c }} type='text' className='form-control' placeholder={this.props.location.state.title} />
                      </div>
                      <div className='form-group'>
                        <label>Status</label>
                        <select onChange={this.handleSelectChange} value={this.state.isActive}>
                          <option value='Active'>Active</option>
                          <option value='Disabled'>Disabled</option>
                        </select>
                      </div>
                      <fieldset className='form-group'>
                        <legend>Set Targetting</legend>
                        <div className='form-group'>
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
                        <div className='form-group'>
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
                        <div className='form-group'>
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
                      </fieldset>
                    </form>
                    <button onClick={this.editAutoposting} style={{float: 'left', margin: 2}} className='btn btn-primary btn-sm'>Save Changes</button>
                    <Link
                      style={{float: 'left', margin: 2}}
                      to='/autoposting'
                      className='btn btn-sm btn-border-think btn-transparent c-grey'
                    >
                      Back
                    </Link>
                    <br />
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

            </main>

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
