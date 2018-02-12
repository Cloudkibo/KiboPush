/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { addPoll, loadPollsList } from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { getuserdetails, pollTourCompleted } from '../../redux/actions/basicinfo.actions'
import AlertContainer from 'react-alert'

class CreatePoll extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.createPoll = this.createPoll.bind(this)
    props.getuserdetails()
    this.state = {
      page: {
        options: []
      },
      Gender: {
        options: [{id: 'male', text: 'male'},
                  {id: 'female', text: 'female'},
                  {id: 'other', text: 'other'}
        ]
      },
      Locale: {
        options: [{id: 'en_US', text: 'en_US'},
                  {id: 'af_ZA', text: 'af_ZA'},
                  {id: 'ar_AR', text: 'ar_AR'},
                  {id: 'az_AZ', text: 'az_AZ'},
                  {id: 'pa_IN', text: 'pa_IN'}
        ]
      },
      stayOpen: false,
      disabled: false,
      pageValue: [],
      genderValue: [],
      localeValue: [],
      alert: false,
      statement: '',
      option1: '',
      option2: '',
      option3: '',
      steps: []
    }
    this.updateStatment = this.updateStatment.bind(this)
    this.updateOptions = this.updateOptions.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleGenderChange = this.handleGenderChange.bind(this)
    this.handleLocaleChange = this.handleLocaleChange.bind(this)
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
    this.tourFinished = this.tourFinished.bind(this)
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.initializeGenderSelect = this.initializeGenderSelect.bind(this)
    this.initializeLocaleSelect = this.initializeLocaleSelect.bind(this)
  }

  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://unpkg.com/react-select/dist/react-select.js')
    // document.body.appendChild(addScript)
    document.title = 'KiboPush | Create Poll'
    let options = []
    for (var i = 0; i < this.props.pages.length; i++) {
      options[i] = {id: this.props.pages[i].pageId, text: this.props.pages[i].pageName}
    }
    this.setState({page: {options: options}})
    this.initializeGenderSelect(this.state.Gender.options)
    this.initializeLocaleSelect(this.state.Locale.options)
    this.initializePageSelect(options)

    this.addSteps([{
      title: 'Question',
      text: 'You can write a question here that you need to get feedback on',
      selector: 'div#question',
      position: 'top-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Response',
      text: 'Give your subscribers list of possible responses to choose from',
      selector: 'div#responses',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Targetting',
      text: 'You can target a specific demographic amongst your subscribers, by choosing these options',
      selector: 'div#target',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true}
    ])
  }
  initializePageSelect (pageOptions) {
    console.log('Page Options in select', pageOptions)
    var self = this
    $('#selectPage').select2({
      data: pageOptions,
      placeholder: 'Select Pages',
      allowClear: true,
      multiple: true
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

  initializeGenderSelect (genderOptions) {
    var self = this
    $('#selectGender').select2({
      data: genderOptions,
      placeholder: 'Select Gender',
      allowClear: true,
      multiple: true
    })
    $('#selectGender').on('change', function (e) {
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
      console.log('change Gender', selected)
    })
  }

  initializeLocaleSelect (localeOptions) {
    var self = this
    $('#selectLocale').select2({
      data: localeOptions,
      placeholder: 'Select Locale',
      allowClear: true,
      multiple: true
    })
    $('#selectLocale').on('change', function (e) {
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
      console.log('change Locale', selected)
    })
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
  createPoll () {
    var options = []
    if (this.state.option1 === '' || this.state.option2 === '' ||
      this.state.option3 === '' || this.state.statement === '') {
      this.setState({alert: true})
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
      var isSegmentedValue = false
      if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 ||
                    this.state.localeValue.length > 0) {
        isSegmentedValue = true
      }
      this.props.addPoll('', {
        platform: 'Facebook',
        datetime: Date.now(),
        statement: this.state.statement,
        sent: 0,
        options: options,
        isSegmented: isSegmentedValue,
        segmentationPageIds: this.state.pageValue,
        segmentationGender: this.state.genderValue,
        segmentationLocale: this.state.localeValue
      })
      console.log('Poll added')
      this.props.history.push({
        pathname: '/poll'
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

  tourFinished (data) {
    console.log('Next Tour Step')
    if (data.type === 'finished') {
      console.log('this: ', this)
      console.log('Tour Finished')
      console.log(this.props)
      this.props.pollTourCompleted({
        'pollTourSeen': true
      })
    }
  }

  addSteps (steps) {
    // let joyride = this.refs.joyride

    if (!Array.isArray(steps)) {
      steps = [steps]
    }

    if (!steps.length) {
      return false
    }
    var temp = this.state.steps
    this.setState({
      steps: temp.concat(steps)
    })
  }

  addTooltip (data) {
    this.refs.joyride.addTooltip(data)
  }

  render () {
    const { disabled, stayOpen } = this.state
    var alertOptions = {
      offset: 14,
      position: 'top right',
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
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Create Poll</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='row'>
                <div className='col-lg-8 col-md-8 col-sm-4 col-xs-12'>
                  <div className='m-portlet' style={{height: '100%'}}>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                          Ask Facebook Subscribers a Question
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='m-form'>
                        <div id='question' className='form-group m-form__group'>
                          <label className='control-label'>Ask something...</label>
                          <textarea className='form-control'
                            value={this.state.statement}
                            placeholder='Enter Question'
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
                                placeholder='Response 1' />
                            </div>
                            <div className='form-group m-form__group'>
                              <label className='sr-only'>Response2</label>
                              <input type='text' className='form-control'
                                value={this.state.option2}
                                onChange={(e) => this.updateOptions(e, 2)}
                                placeholder='Response 2' />
                            </div>
                            <div className='form-group m-form__group'>
                              <label className='sr-only'>Response3</label>
                              <input type='text' className='form-control'
                                value={this.state.option3}
                                onChange={(e) => this.updateOptions(e, 3)}
                                placeholder='Response 3' />
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      { this.state.alert &&
                        <center>
                          <Alert type='danger' style={{marginTop: '30px'}}>
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
                          to='/poll'
                          className='btn btn-secondary' style={{'margin-left': '10px'}}>
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div id='target' className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='m-portlet' style={{height: '100%'}}>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                          Targeting
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='alert m-alert m-alert--default' role='alert'>
                        <p>Select the type of customer you want to send poll to</p>
                      </div>
                      <div className='m-form'>
                        <div className='form-group m-form__group'>
                          <select id='selectPage' />
                        </div>
                        <div className='form-group m-form__group'>
                          <select id='selectGender' />
                        </div>
                        <div className='form-group m-form__group'>
                          <select id='selectLocale' />
                        </div>
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
  console.log(state)
  return {
    polls: (state.pollsInfo.polls),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user)

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPollsList: loadPollsList,
    addPoll: addPoll,
    pollTourCompleted: pollTourCompleted,
    getuserdetails: getuserdetails
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll)
