/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  loadSurveysList,
  sendsurvey
} from '../../redux/actions/surveys.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { Alert } from 'react-bs-notifier'
import AlertContainer from 'react-alert'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'

class Survey extends React.Component {
  constructor (props, context) {
    super(props, context)
    //  this.props.loadSurveysList()
    this.state = {
      alertMessage: '',
      alertType: '',
      surveysData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
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
    document.title = 'KiboPush | Survey'
  }
  componentWillMount () {
    this.props.loadSurveysList()
  }
  displayData (n, surveys) {
    console.log(surveys)
    let offset = n * 5
    let data = []
    let limit
    let index = 0
    if ((offset + 5) > surveys.length) {
      limit = surveys.length
    } else {
      limit = offset + 5
    }
    for (var i = offset; i < limit; i++) {
      data[index] = surveys[i]
      index++
    }
    this.setState({surveysData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.surveys)
  }

  gotoView (survey) {
    // this.props.history.push({
    //   pathname: `/viewsurveydetail/${survey._id}`,
    //   state: survey,
    // })

    this.props.history.push({
      pathname: `/viewsurveydetail`,
      state: survey._id
    })

    // browserHistory.push(`/viewsurveydetail/${survey._id}`)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps called')
    if (nextProps.surveys) {
      console.log('Broadcasts Updated', nextProps.surveys)
      this.displayData(0, nextProps.surveys)
      this.setState({ totalLength: nextProps.surveys.length })
    }
    if (this.props.successTime !== nextProps.successTime) {
      console.log('SuccessMessage: ', nextProps.successMessage)
      this.setState({
        alertMessage: nextProps.successMessage,
        alertType: 'success'
      })
      this.msg.show(nextProps.successMessage, {
        time: 1500,
        type: 'success'
      })
    } else if (this.props.errorTime !== nextProps.errorMessage) {
      console.log('ErrorMessage: ', nextProps.errorMessage)
      this.setState({
        alertMessage: nextProps.errorMessage,
        alertType: 'danger'
      })
      this.msg.show(nextProps.errorMessage, {
        time: 1500,
        type: 'error'
      })
    } else {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
    }
    this.setState({
      alertMessage: '',
      alertType: ''
    })
  }

  showAlert (message, type) {
    console.log('in showAlert')
    this.msg.show(message, {
      time: 1500,
      type: type
    })
  }

  gotoResults (survey) {
    this.props.history.push({
      pathname: `/surveyResult`,
      state: survey._id
    })
  }

  render () {
    console.log('render method survey')
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'light',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        { /*<AlertContainer ref={a => { this.msg = a }} {...alertOptions} />*/ }
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Manage Surveys</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              {
                this.props.subscribers && this.props.subscribers.length === 0 &&
                <div style={{padding: '10px'}}>
                  <center>
                    <Alert type='info' headline='0 Subscribers' >
                    Your connected pages have zero subscribers. Unless you do not have any subscriber, you will not be able to broadcast message, polls and surveys.
                    To invite subscribers click <Link to='/invitesubscribers' style={{color: 'blue', cursor: 'pointer'}}> here </Link>.
                    </Alert>
                  </center>
                </div>
              }
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding surveys? <a href='#'>Click Here </a>
                </div>
              </div>
              <div className='row'>
                <div
                  className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                  <div className='m-portlet m-portlet--mobile'>

                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Surveys
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className='m-portlet__body'>
                      <div className='row align-items-center'>
                        <div className='col-md-4' />
                        <div className='col-xl-4 col-md-4' />
                        <div className='col-xl-4 order-1 col-md-4 order-xl-2 m--align-right'>
                          {
                            this.props.subscribers && this.props.subscribers.length === 0

                              ? <Link to='addsurvey' className='pull-right m-portlet__nav-link btn btn-success btn-sm m-btn--pill m-btn--air'>
                                 Create Survey
                              </Link>
                              : <Link to='addsurvey' className='pull-right m-portlet__nav-link btn btn-success btn-sm m-btn--pill m-btn--air'>
                               Create Survey
                              </Link>
                            }
                        </div>
                      </div>
                      {console.log('surveysData', this.props.surveys)}
                      { this.state.surveysData && this.state.surveysData.length > 0
                      ? <div className='table-responsive'>
                        <table className='table table-striped'>
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Created At</th>
                              <th>Sent</th>
                              <th>Seen</th>
                              <th>Responded</th>
                              <th>Actions</th>

                            </tr>
                          </thead>
                          <tbody>
                            {
                            this.state.surveysData.map((survey, i) => (
                              <tr>
                                <td>{survey.title}</td>
                                <td>{survey.description}</td>
                                <td>{handleDate(survey.datetime)}</td>
                                <td>{survey.sent}</td>
                                <td>{survey.seen}</td>
                                <td>{survey.responses}</td>
                                <td>
                                  <button className='btn btn-primary btn-sm'
                                    style={{float: 'left', margin: 2}}
                                    onClick={() => this.gotoView(survey)}>View
                                  </button>
                                  { this.props.subscribers && this.props.subscribers.length === 0
                                    ? <span>
                                      <button className='btn btn-primary btn-sm'
                                        style={{float: 'left', margin: 2}}
                                        onClick={() => this.gotoResults(survey)}>
                                    Report
                                  </button>
                                      <button className='btn btn-primary btn-sm'
                                        style={{float: 'left', margin: 2}}
                                        onClick={() => this.props.sendsurvey(
                                            survey)}> Send
                                      </button>
                                    </span>
                              : <span>
                                <button className='btn btn-primary btn-sm'
                                  style={{float: 'left', margin: 2}}
                                  onClick={() => this.gotoResults(survey)}>
                                Report
                              </button>

                                <button className='btn btn-primary btn-sm'
                                  style={{float: 'left', margin: 2}}
                                  onClick={() => this.props.sendsurvey(
                                        survey)}> Send
                              </button>
                              </span>
                              }

                                </td>
                              </tr>

                        ))
                      }
                          </tbody>
                        </table>
                        <ReactPaginate className='m-datatable__pager-nav' previousLabel={'previous'}
                          nextLabel={'next'}
                          breakLabel={<a>...</a>}
                          breakClassName={'break-me'}
                          pageCount={Math.ceil(this.state.totalLength / 5)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          onPageChange={this.handlePageClick}
                          containerClassName={'pagination'}
                          subContainerClassName={'pages pagination'}
                          activeClassName={'active'} />
                      </div>
                  : <div className='table-responsive'>
                    <p> No data to display </p>
                  </div>
                }
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
    surveys: (state.surveysInfo.surveys),
    subscribers: (state.subscribersInfo.subscribers),
    successMessage: (state.surveysInfo.successMessage),
    errorMessage: (state.surveysInfo.errorMessage),
    successTime: (state.surveysInfo.successTime),
    errorTime: (state.surveysInfo.errorTime)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadSurveysList: loadSurveysList, sendsurvey: sendsurvey, loadSubscribersList: loadSubscribersList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Survey)
