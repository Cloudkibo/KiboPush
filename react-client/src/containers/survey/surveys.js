/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import AlertContainer from 'react-alert'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  loadSurveysListNew,
  sendsurvey,
  deleteSurvey
} from '../../redux/actions/surveys.actions'
import { saveSurveyInformation } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import YouTube from 'react-youtube'
import { checkConditions } from '../polls/utility'
import {loadTags} from '../../redux/actions/tags.actions'
import { loadMyPagesListNew } from '../../redux/actions/pages.actions'
import AlertMessageModal from '../../components/alertMessages/alertMessageModal'
import AlertMessage from '../../components/alertMessages/alertMessage'
import {
  getSubscriberCount
} from '../../redux/actions/broadcast.actions'
class Survey extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadSurveysListNew({last_id: 'none', number_of_records: 10, first_page: 'first', days: '0'})
    props.loadMyPagesListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: ''}})
    this.state = {
      alertMessage: '',
      alertType: '',
      surveysData: [],
      totalLength: 0,
      sent: false,
      isShowingZeroSubModal: this.props.subscribers && this.props.subscribers.length === 0,
      isShowingZeroPageModal: this.props.pages && this.props.pages.length === 0,
      deleteid: '',
      selectedDays: '0',
      pageNumber: 0,
      isShowingModalPro: false,
      subscriberCount: 0,
      totalSubscribersCount: 0,
      savesurvey: '',
      openVideo: false

    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.sendSurvey = this.sendSurvey.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.handleSubscriberCount = this.handleSubscriberCount.bind(this)
    this.saveSurvey = this.saveSurvey.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)

  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoSurvey.click()
  }

  handleSubscriberCount(response) {
    this.setState({
      subscriberCount: response.payload.count,
      totalSubscribersCount: response.payload.totalCount
    })
  }
  saveSurvey(survey) {
    console.log('poll in savesurvey', survey)
      this.setState({savesurvey:survey})
      let pageId = this.props.pages.find(page => page.pageId === survey.segmentationPageIds[0])
      var payload = {
        pageId:  pageId._id,
        pageAccessToken: pageId.accessToken,
        segmented: survey.isSegmented,
        segmentationGender: survey.segmentationGender,
        segmentationLocale: survey.segmentationLocale,
        segmentationTags: survey.segmentationTags,
        isList: survey.isList ? true : false,
        segmentationList: survey.segmentationList
    }
    this.props.getSubscriberCount(payload, this.handleSubscriberCount)

  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Survey`
    this.props.saveSurveyInformation(undefined)
  }
  UNSAFE_componentWillMount () {
    this.props.loadSubscribersList()
    this.props.loadTags()
  }

  goToSettings () {
    this.props.history.push({
      pathname: `/settings`,
      state: {module: 'pro'}
    })
  }

  onDaysChange (e) {
    //  var defaultVal = 0
    var value = e.target.value
    this.setState({selectedDays: value, pageNumber: 0})
    if (value && value !== '') {
      if (value.indexOf('.') !== -1) {
        value = Math.floor(value)
      }
      if (value === '0') {
        this.setState({
          selectedDays: ''
        })
      }
      this.props.loadSurveysListNew({last_id: 'none', number_of_records: 10, first_page: 'first', days: value})
    } else if (value === '') {
      this.setState({selectedDays: ''})
      this.props.loadSurveysListNew({last_id: 'none', number_of_records: 10, first_page: 'first', days: '0'})
    }
  }
  displayData (n, surveys) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > surveys.length) {
      limit = surveys.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = surveys[i]
      index++
    }
    this.setState({surveysData: data})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadSurveysListNew({last_id: 'none', number_of_records: 10, first_page: 'first', days: this.state.selectedDays === '' ? '0' : this.state.selectedDays})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadSurveysListNew({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.surveys.length > 0 ? this.props.surveys[this.props.surveys.length - 1]._id : 'none', number_of_records: 10, first_page: 'next', days: this.state.selectedDays === '' ? '0' : this.state.selectedDays})
    } else {
      this.props.loadSurveysListNew({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.surveys.length > 0 ? this.props.surveys[0]._id : 'none', number_of_records: 10, first_page: 'previous', days: this.state.selectedDays === '' ? '0' : this.state.selectedDays })
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.surveys)
  }

  gotoView (survey) {
    this.props.history.push({
      pathname: `/viewsurveydetail`,
      state: survey._id
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.surveys && nextProps.count) {
      this.displayData(0, nextProps.surveys)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({ surveysData: [], totalLength: 0 })
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
    if (((nextProps.subscribers && nextProps.subscribers.length === 0) ||
    (nextProps.pages && nextProps.pages.length === 0))
  ) {
    this.refs.zeroModal.click()
  }
  }

  showAlert (message, type) {
    this.msg.show(message, {
      time: 1500,
      type: type
    })
  }

  gotoResults (survey) {
    this.props.history.push({
      pathname: `/surveyResult`,
      state: survey
    })
  }
  showDialogDelete (id) {
    this.setState({deleteid: id})
  }
  gotoCreate () {
    this.props.history.push({
      pathname: `/addsurvey`
    })
  }
  sendSurvey (survey) {
    let currentPageSubscribers = this.props.subscribers.filter(subscriber => subscriber.pageId.pageId === survey.segmentationPageIds[0])
    survey.subscribersCount = currentPageSubscribers.length
    survey.isApprovedForSMP = this.state.isApprovedForSMP
    let segmentationValues = []
    for (let i = 0; i < survey.segmentationTags; i++) {
      for (let j = 0; j < this.props.tags.length; j++) {
        if (survey.segmentationTags[i] === this.props.tags[j]._id) {
          segmentationValues.push(this.props.tags[j].tag)
        }
      }
    }
    var res = checkConditions(survey.segmentationPageIds, survey.segmentationGender, survey.segmentationLocale, segmentationValues, this.props.subscribers)
    if (res === false) {
      this.msg.error('No subscribers match the selected criteria')
    } else {
      this.props.sendsurvey(survey, this.msg)
      this.setState({ pageNumber: 0 })
    }
  }
  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='videoSurvey' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoSurvey">videoMessengerRefModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoSurvey" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Survey Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.setState({
                      openVideo: false
                    })}}>
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                {this.state.openVideo && <YouTube
                  videoId='bizOCjXE6tM'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
              />
                }
                </div>
              </div>
            </div>
          </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="upgrade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Upgrade to Pro
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>This feature is not available in free account. Kindly updrade your account to use this feature.</p>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button className='btn btn-primary' onClick={() => this.goToSettings()}>
                      Upgrade to Pro
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='zeroModal' data-toggle="modal" data-target="#zeroModal">ZeroModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="zeroModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                {(this.props.pages && this.props.pages.length === 0)
                  ? <AlertMessageModal type='page' />
                  : <AlertMessageModal type='subscriber' />
                }
                <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div>
                  <YouTube
                    videoId='9kY3Fmj_tbM'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: {
                        autoplay: 0
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)', paddingTop:'150px' }} className="modal fade" id="send" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Send Survey
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
								  </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
              <span
                className={this.state.subscriberCount === 0 ? 'm--font-boldest m--font-danger' : 'm--font-boldest m--font-success'}
                style={{marginLeft: '10px'}}>
                This Survey will be sent to {this.state.subscriberCount} out of {this.state.totalSubscribersCount} subscriber(s).
              { this.state.subscriberCount === 0 &&
              <div>
                <br/>
                <br/>
                <span style={{ color: 'black', paddingLeft:'20px' }}>
                Because of Either reason:
                </span>
                  <ol style={{ color: 'black', fontWeight:'300' }}>
                  <li>None of your subscribers have 24 hour window session active. The session will automatically become active when your subscriber messages.</li>
                  <li>No subscriber match the selected criteria.</li>
                </ol>
                </div>
              }

            </span>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <br />
                  <div style={{ display: 'inline-block', padding: '5px'}}>
                    <button style={{ color: 'white'}} disabled={this.state.subscriberCount === 0 ? true : null} onClick={() => {this.sendSurvey(this.state.savesurvey)}} className='btn btn-primary' data-dismiss="modal" aria-label="Close">
                    Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Surveys</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {
            this.props.pages && this.props.pages.length === 0
            ? <AlertMessage type='page' />
          : this.props.subscribers && this.props.subscribers.length === 0 &&
            <AlertMessage type='subscriber' />
          }
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding surveys? Here is the <a href='https://kibopush.com/surveys/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this<a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
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
                  {
                    this.props.user.permissions['create_surveys'] &&
                    <div className='m-portlet__head-tools'>
                      {
                        this.props.subscribers && this.props.subscribers.length === 0
                        ? <a href='#/'>
                          <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled>
                            <span>
                              <i className='la la-plus' />
                              <span>
                                Create New
                              </span>
                            </span>
                          </button>
                        </a>
                        : <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' data-toggle="modal" data-target="#createSurvey">
                          <span>
                            <i className='la la-plus' />
                            <span>
                              Create New
                            </span>
                          </span>
                        </button>
                        }
                    </div>
                  }
                </div>
                <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="createSurvey" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div style={{ display: 'block' }} className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Create Survey
									            </h5>
                        <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">
                            &times;
											          </span>
                        </button>
                      </div>
                      <div style={{ color: 'black' }} className="modal-body">
                        <p>To create a new survey from scratch, click on Create New Survey. To use a template survey and modify it, click on Use Template</p>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                          <div style={{ display: 'inline-block', padding: '5px' }}>
                            <button className='btn btn-primary' onClick={() => this.gotoCreate()} data-dismiss='modal'>
                              Create New Survey
                            </button>
                          </div>
                          <div style={{ display: 'inline-block', padding: '5px' }}>
                            {/* this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_C' */}
                            <button
                              onClick={() => this.props.history.push({pathname: '/showTemplateSurveys'})}
                              className='btn btn-primary'
                              data-dismiss='modal'
                            >
                              Use Template
                            </button>
                            {/*: <button onClick={this.showProDialog} className='btn btn-primary'>
                                    Use Template&nbsp;&nbsp;&nbsp;
                                    <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                                      <span style={{color: '#34bfa3'}}>PRO</span>
                                    </span>
                                  </button>
                                */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="deleteSurvey" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div style={{ display: 'block' }} className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Delete Survey
                        </h5>
                        <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">
                            &times;
                          </span>
                        </button>
                      </div>
                      <div style={{ color: 'black' }} className="modal-body">
                        <p>Are you sure you want to delete this survey?</p>
                        <button style={{ float: 'right' }}
                          className='btn btn-primary btn-sm'
                          onClick={() => {
                            let loadData = {}
                            loadData = { last_id: 'none', number_of_records: 10, first_page: 'first', days: this.state.selectedDays === '' ? '0' : this.state.selectedDays }
                            this.props.deleteSurvey(this.state.deleteid, this.msg, loadData)
                          }}
                          data-dismiss='modal'>Delete
                      </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    <div className='col-xl-8 order-2 order-xl-1' />
                    <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                    </div>
                  </div>
                  <div className='form-row'>
                    <div className='form-group col-md-6' />
                    <div className='form-group col-md-6' style={{display: 'flex', float: 'right'}}>
                      <span style={{marginLeft: '70px'}} htmlFor='example-text-input' className='col-form-label'>
                        Show records for last:&nbsp;&nbsp;
                      </span>
                      <div style={{width: '200px'}}>
                        <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays === '0' ? '' : this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
                      </div>
                      <span htmlFor='example-text-input' className='col-form-label'>
                      &nbsp;&nbsp;days
                      </span>
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
                          {/* <th>Seen</th> */}
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
                            {/* <td>{survey.seen}</td> */}
                            <td>{survey.responses}</td>
                            <td>
                              <button className='btn btn-primary btn-sm'
                                style={{float: 'left', margin: 2}}
                                onClick={() => this.gotoView(survey)}>View
                              </button>
                              { this.props.subscribers && this.props.subscribers.length === 0
                                ? <span>
                                  {
                                    this.props.user.plan['surveys_reports'] && this.props.user.permissions['view_survey_reports'] &&
                                    <button className='btn btn-primary btn-sm'
                                      style={{float: 'left', margin: 2}}
                                      onClick={() => this.gotoResults(survey)}>
                                      Report
                                    </button>
                                  }
                                  <button className='btn btn-primary btn-sm'
                                    style={{float: 'left', margin: 2}}
                                    onClick={() => this.props.sendsurvey(
                                        survey, this.msg)} disabled> Send
                                  </button>
                                </span>
                          : <span>
                            {
                              this.props.user.plan['surveys_reports'] && this.props.user.permissions['view_survey_reports'] &&
                              <button className='btn btn-primary btn-sm'
                                style={{float: 'left', margin: 2}}
                                onClick={() => this.gotoResults(survey)}>
                                Report
                              </button>
                            }
                            {
                              this.props.user.permissions['resend_surveys'] &&
                              <button className='btn btn-primary btn-sm'
                                style={{float: 'left', margin: 2}}
                                data-toggle="modal" data-target="#send"
                                onClick={() => {
                                  this.saveSurvey(survey)
                                }}>
                                Send
                            </button>
                            }
                          </span>
                        } {
                          this.props.user.permissions['delete_surveys'] &&
                          <button className='btn btn-primary btn-sm'
                            style={{float: 'left', margin: 2}}
                            onClick={() => this.showDialogDelete(survey._id)}
                            data-toggle="modal" data-target="#deleteSurvey">
                          Delete
                      </button>
                    }

                            </td>
                          </tr>
                    ))
                  }
                      </tbody>
                    </table>
                    <ReactPaginate
                      previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a href='#/'>...</a>}
                      breakClassName={'break-me'}
                      pageCount={Math.ceil(this.state.totalLength / 10)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      forcePage={this.state.pageNumber}
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
    )
  }
}

function mapStateToProps (state) {
  console.log('survey state', state)
  return {
    surveys: (state.surveysInfo.surveys),
    pages: (state.pagesInfo.pages),
    count: (state.surveysInfo.count),
    subscribers: (state.subscribersInfo.subscribers),
    successMessage: (state.surveysInfo.successMessage),
    errorMessage: (state.surveysInfo.errorMessage),
    successTime: (state.surveysInfo.successTime),
    errorTime: (state.surveysInfo.errorTime),
    user: (state.basicInfo.user),
    tags: (state.tagsInfo.tags),
    subscribersCount: (state.subscribersInfo.subscribersCount)

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    { saveSurveyInformation: saveSurveyInformation,loadSurveysListNew: loadSurveysListNew, sendsurvey: sendsurvey, loadSubscribersList: loadSubscribersList, deleteSurvey: deleteSurvey, loadTags: loadTags, loadMyPagesListNew: loadMyPagesListNew, getSubscriberCount: getSubscriberCount}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Survey)
