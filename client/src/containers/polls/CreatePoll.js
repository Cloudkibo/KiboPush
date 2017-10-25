/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Joyride from 'react-joyride'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import Select from 'react-select'
import { addPoll, loadPollsList } from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { getuserdetails, pollTourCompleted } from '../../redux/actions/basicinfo.actions'

class CreatePoll extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.createPoll = this.createPoll.bind(this)
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
    return (
      <div>
        {
          !(this.props.user && this.props.user.pollTourSeen) &&
          <Joyride ref='joyride' run steps={this.state.steps} scrollToSteps debug={false} type={'continuous'} callback={this.tourFinished} showStepsProgress showSkipButton />
      }
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />

        <div className='container'>
          <br />
          <br />
          <br />
          <div className='row'>
            <div className='col-lg-8 col-md-8 col-sm-4 col-xs-12'>
              <h2 className='presentation-margin'>Ask Facebook Subscribers a
              Question</h2>
              <div className='ui-block'>
                <div className='news-feed-form'>

                  <div className='tab-content'>
                    <div className='tab-pane active' id='home-1' role='tabpanel'
                      aria-expanded='true'>
                      <div id='question' className='form-group label-floating is-empty'>
                        <label className='control-label'>Ask something...</label>
                        <textarea className='form-control'
                          value={this.state.statement}
                          onChange={(e) => this.updateStatment(e)} />
                      </div>
                      <br />
                      <div
                        className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                        <label className='control-label'> Add 3 responses</label>
                        <fieldset className='input-group-vertical'>
                          <div id='responses' className='form-group'>
                            <label className='sr-only'>Response1</label>
                            <input type='text' className='form-control'
                              value={this.state.option1}
                              onChange={(e) => this.updateOptions(e, 1)}
                              placeholder='Response 1' />
                          </div>
                          <div className='form-group'>
                            <label className='sr-only'>Response2</label>
                            <input type='text' className='form-control'
                              value={this.state.option2}
                              onChange={(e) => this.updateOptions(e, 2)}
                              placeholder='Response 2' />
                          </div>
                          <div className='form-group'>
                            <label className='sr-only'>Response3</label>
                            <input type='text' className='form-control'
                              value={this.state.option3}
                              onChange={(e) => this.updateOptions(e, 3)}
                              placeholder='Response 3' />
                          </div>

                        </fieldset>
                      </div>
                      <br />
                      { this.state.alert &&
                      <center><Alert type='danger'>
                      You have either left one or more responses empty or you
                      have not asked anything. Please ask something and fill all
                      three responses in order to create the poll.
                    </Alert></center>
                    }
                      <div className='add-options-message'>

                        <button className='btn btn-primary btn-sm'
                          onClick={this.createPoll}> Create Poll
                      </button>
                        <Link
                          to='/poll'
                          style={{float: 'right', margin: 2}}
                          className='btn btn-sm btn-border-think btn-transparent c-grey'>
                        Cancel
                      </Link>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div id='target' className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
              <h2 className='presentation-margin'>Targeting</h2>
              <p>Select the type of customer you want to send poll to</p>
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
    pollTourCompleted: pollTourCompleted
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll)
