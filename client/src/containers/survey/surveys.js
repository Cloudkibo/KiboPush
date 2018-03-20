/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import AlertContainer from 'react-alert'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  loadSurveysList,
  sendsurvey,
  deleteSurvey
} from '../../redux/actions/surveys.actions'
import { bindActionCreators } from 'redux'
import { Link, browserHistory } from 'react-router'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import YouTube from 'react-youtube'
import _ from 'underscore'

class Survey extends React.Component {
  constructor (props, context) {
    super(props, context)
    //  this.props.loadSurveysList()
    this.state = {
      alertMessage: '',
      alertType: '',
      surveysData: [],
      totalLength: 0,
      sent: false,
      isShowingModal: false,
      isShowingModalDelete: false,
      deleteid: ''
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.checkConditions = this.checkConditions.bind(this)
    this.sendSurvey = this.sendSurvey.bind(this)
  }

  componentDidMount () {
    document.title = 'KiboPush | Survey'
  }
  componentWillMount () {
    this.props.loadSubscribersList()
    this.props.loadSurveysList()
  }
  showDialog () {
    console.log('in showDialog')
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
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
    if (nextProps.successMessage || nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.successMessage,
        alertType: 'success'
      })
    } else if (nextProps.errorMessage || nextProps.errorMessage) {
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
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }
  gotoCreate () {
    browserHistory.push({
      pathname: `/addsurvey`
    })
  }
  checkConditions (pageValue, genderValue, localeValue) {
    let subscribersMatchPages = []
    let subscribersMatchLocale = []
    let subscribersMatchGender = []
    if (pageValue.length > 0) {
      for (var i = 0; i < pageValue.length; i++) {
        for (var j = 0; j < this.props.subscribers.length; j++) {
          if (this.props.subscribers[j].pageId.pageId === pageValue[i]) {
            subscribersMatchPages.push(this.props.subscribers[j])
          }
        }
      }
    }
    if (genderValue.length > 0) {
      for (var k = 0; k < this.props.subscribers.length; k++) {
        for (var l = 0; l < genderValue.length; l++) {
          if (this.props.subscribers[k].gender === genderValue[l]) {
            subscribersMatchGender.push(this.props.subscribers[k])
          }
        }
      }
    }
    if (localeValue.length > 0) {
      for (var m = 0; m < this.props.subscribers.length; m++) {
        for (var n = 0; n < localeValue.length; n++) {
          if (this.props.subscribers[m].locale === localeValue[n]) {
            subscribersMatchLocale.push(this.props.subscribers[m])
          }
        }
      }
    }
    if (pageValue.length > 0 && genderValue.length > 0 && localeValue.length > 0) {
      console.log('intersection', _.intersection(subscribersMatchPages, subscribersMatchLocale, subscribersMatchGender))
      var result = _.intersection(subscribersMatchPages, subscribersMatchLocale, subscribersMatchGender)
      if (result.length === 0) {
        console.log('inside if')
        return false
      }
    } else if (pageValue.length > 0 && genderValue.length) {
      if (_.intersection(subscribersMatchPages, subscribersMatchGender).length === 0) {
        return false
      }
    } else if (pageValue.length > 0 && localeValue.length) {
      if (_.intersection(subscribersMatchPages, subscribersMatchLocale).length === 0) {
        return false
      }
    } else if (genderValue.length > 0 && localeValue.length) {
      if (_.intersection(subscribersMatchGender, subscribersMatchLocale).length === 0) {
        return false
      }
    } else if (pageValue.length > 0 && subscribersMatchPages.length === 0) {
      return false
    } else if (genderValue.length > 0 && subscribersMatchGender.length === 0) {
      return false
    } else if (localeValue.length > 0 && subscribersMatchLocale.length === 0) {
      return false
    }
    return true
  }
  sendSurvey (survey) {
    var res = this.checkConditions(survey.segmentationPageIds, survey.segmentationGender, survey.segmentationLocale)
    if (res === false) {
      this.msg.error('No subscribers match the selected criteria')
    } else {
      this.props.sendsurvey(survey, this.msg)
    }
  }
  render () {
    console.log('render method survey')
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='xKa09wiYbrg'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
              />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
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
                <div className='alert alert-success'>
                  <h4 className='block'>0 Subscribers</h4>
                    Your connected pages have zero subscribers. Unless you do not have any subscriber, you will not be able to broadcast message, polls and surveys.
                    To invite subscribers click <Link to='/invitesubscribers' style={{color: 'blue', cursor: 'pointer'}}> here </Link>
                  </div>
              }
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding surveys? Here is the <a href='http://kibopush.com/surveys/' target='_blank'>documentation</a>.
                  Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
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
                      <div className='m-portlet__head-tools'>
                        {
                          this.props.subscribers && this.props.subscribers.length === 0
                          ? <a href='#'>
                            <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled>
                              <span>
                                <i className='la la-plus' />
                                <span>
                                  Create Survey
                                </span>
                              </span>
                            </button>
                          </a>
                          : <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog}>
                            <span>
                              <i className='la la-plus' />
                              <span>
                                Create Survey
                              </span>
                            </span>
                          </button>
                          }
                      </div>
                    </div>

                    <div className='m-portlet__body'>
                      <div className='row align-items-center'>
                        <div className='col-xl-8 order-2 order-xl-1' />
                        <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                          {
                            this.state.isShowingModal &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeDialog}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeDialog}>
                                <h3>Create Survey</h3>
                                <p>To create a new survey from scratch, click on Create New Survey. To use a template survey and modify it, click on Use Template</p>
                                <div style={{width: '100%', textAlign: 'center'}}>
                                  <div style={{display: 'inline-block', padding: '5px'}}>
                                    <button className='btn btn-primary' onClick={() => this.gotoCreate()}>
                                      Create New Survey
                                    </button>
                                  </div>
                                  <div style={{display: 'inline-block', padding: '5px'}}>
                                    <Link to='/showTemplateSurveys' className='btn btn-primary'>
                                      Use Template
                                    </Link>
                                  </div>
                                </div>
                              </ModalDialog>
                            </ModalContainer>
                          }
                          {
                            this.state.isShowingModalDelete &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeDialogDelete}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeDialogDelete}>
                                <h3>Delete Survey</h3>
                                <p>Are you sure you want to delete this survey?</p>
                                <button style={{float: 'right'}}
                                  className='btn btn-primary btn-sm'
                                  onClick={() => {
                                    this.props.deleteSurvey(this.state.deleteid, this.msg)
                                    this.closeDialogDelete()
                                  }}>Delete
                                </button>
                              </ModalDialog>
                            </ModalContainer>
                          }
                        </div>
                      </div>
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
                                            survey, this.msg)} disabled> Send
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
                                  onClick={() => {
                                    this.sendSurvey(survey)
                                  }}>
                                  Send
                              </button>
                              </span>
                            } { this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer')
                              ? <button className='btn btn-primary btn-sm'
                                style={{float: 'left', margin: 2}}
                                onClick={() => this.showDialogDelete(survey._id)}>
                              Delete
                          </button>
                          : <div>
                            {survey.sent === 0
                            ? <button className='btn btn-primary btn-sm'
                              style={{float: 'left', margin: 2}}
                              onClick={() => this.showDialogDelete(survey._id)}>
                            Delete
                        </button>
                        : <button className='btn btn-primary btn-sm' disabled
                          style={{float: 'left', margin: 2}}
                          onClick={() => this.showDialogDelete(survey._id)}>
                        Delete
                        </button>
                          }
                          </div>
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
    errorTime: (state.surveysInfo.errorTime),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadSurveysList: loadSurveysList, sendsurvey: sendsurvey, loadSubscribersList: loadSubscribersList, deleteSurvey: deleteSurvey}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Survey)
