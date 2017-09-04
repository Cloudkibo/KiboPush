/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import { addPoll, loadPollsList } from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
class CreatePoll extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.createPoll = this.createPoll.bind(this)
    this.state = {
      alert: false,
      statement: '',
      option1: '',
      option2: '',
      option3: '',
      targeting: [],
      criteria: {
        Gender: {
          options: ['Male', 'Female'],
          isPicked: false
        },
        Locale: {
          options: ['en_US', 'af_ZA', 'ar_AR', 'az_AZ', 'pa_IN'],
          isPicked: false
        }
      },
      page: {
        options: []
      },
      target: [],
      segmentValue: '',
      buttonLabel: 'Add Segment'
    }
    this.updateStatment = this.updateStatment.bind(this)
    this.updateOptions = this.updateOptions.bind(this)

    this.addNewTarget = this.addNewTarget.bind(this)
    this.updateSegmentValue = this.updateSegmentValue.bind(this)
  }

  componentWillMount () {
    // this.props.loadMyPagesList();
    var temp = []
    Object.keys(this.state.criteria).map((obj) => {
      temp.push(<option value={obj}>{obj}</option>)
    })

    this.setState({target: temp, segmentValue: Object.keys(this.state.criteria)[0]})
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
      this.props.addPoll('', {
        platform: 'Facebook',
        datetime: Date.now(),
        statement: this.state.statement,
        sent: 0,
        options: options
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

  updateSegmentValue (event) {
    console.log('updateSegmentValue called', event.target.value)
    var label = 'Add Segment'
    if (this.state.criteria[event.target.value].isPicked === true) {
      label = 'Remove Segment'
    }
    this.setState({segmentValue: event.target.value, buttonLabel: label})
  }

  addNewTarget () {
    console.log('Add new target called', this.state.segmentValue)
    var temp = this.state.criteria
    temp[this.state.segmentValue].isPicked = !temp[this.state.segmentValue].isPicked
    var label = 'Add Segment'
    if (temp[this.state.segmentValue].isPicked === true) {
      label = 'Remove Segment'
    }
    this.setState({criteria: temp, buttonLabel: label})
  }

  render () {
    return (
      <div>
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
                      <div className='form-group label-floating is-empty'>
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
                          <div className='form-group'>
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
            <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
              <h2 className='presentation-margin'>Targeting</h2>
              <div className='ui-block' style={{padding: 15}}>
                <div className='news-feed-form'>
                  <p>Select the type of customer you want to send poll
                    to</p>
                  {
                    <div className='row'>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <div style={{padding: 5}}>
                          <select style={{padding: 5}}>
                            <option selected='selected' value='en_US'>en_US</option>
                            <option value='en_UK'>en_UK</option>
                            <option value='en_IN'>en_IN</option>
                          </select>

                        </div>
                      </div>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <button className='btn btn-primary btn-sm'> Add Page
                            </button>
                      </div>
                    </div>
                  }
                  <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                      <div>
                        <select onChange={this.updateSegmentValue} value={this.state.segmentValue} style={{padding: 10}}>
                          {this.state.target}
                        </select>
                      </div>
                    </div>

                    <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                      <button className='btn btn-primary btn-sm'
                        onClick={this.addNewTarget}> {this.state.buttonLabel}
                      </button>
                    </div>

                  </div>

                  <div>
                    {this.state.targeting}

                    {
                    this.state.criteria.Gender.isPicked && <div className='row'>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <div style={{padding: 5}}>
                          <p>Gender is: </p>
                        </div>
                      </div>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <select style={{padding: 5}}>
                          <option selected='selected' value='Male'>Male</option>
                          <option value='Female'>Female</option>
                        </select>
                      </div>
                    </div>
                  }

                    {
                    this.state.criteria.Locale.isPicked && <div className='row'>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <div style={{padding: 5}}>
                          <p>Locale is: </p>
                        </div>
                      </div>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <select style={{padding: 5}}>
                          <option selected='selected' value='en_US'>en_US</option>
                          <option value='en_UK'>en_UK</option>
                          <option value='en_IN'>en_IN</option>
                        </select>
                      </div>
                    </div>
                  }

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
    polls: (state.pollsInfo.polls)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadPollsList: loadPollsList, addPoll: addPoll},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll)
