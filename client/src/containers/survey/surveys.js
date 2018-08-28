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
import { bindActionCreators } from 'redux'
import { Link, browserHistory } from 'react-router'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import YouTube from 'react-youtube'
import { checkConditions } from '../polls/utility'
import {loadTags} from '../../redux/actions/tags.actions'
import { loadMyPagesListNew } from '../../redux/actions/pages.actions'
import AlertMessageModal from '../../components/alertMessages/alertMessageModal'
import AlertMessage from '../../components/alertMessages/alertMessage'

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
      isShowingModal: false,
      isShowingZeroSubModal: this.props.subscribers && this.props.subscribers.length === 0,
      isShowingZeroPageModal: this.props.pages && this.props.pages.length === 0,
      isShowingModalDelete: false,
      deleteid: '',
      selectedDays: '0',
      pageNumber: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.showZeroSubDialog = this.showZeroSubDialog.bind(this)
    this.closeZeroSubDialog = this.closeZeroSubDialog.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.sendSurvey = this.sendSurvey.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
  }

  componentDidMount () {
    document.title = 'KiboPush | Survey'
  }
  componentWillMount () {
    this.props.loadSubscribersList()
    this.props.loadTags()
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  showZeroSubDialog () {
    this.setState({isShowingZeroSubModal: true})
  }

  closeZeroSubDialog () {
    this.setState({isShowingZeroSubModal: false, isShowingZeroPageModal: false})
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
      this.props.loadSurveysListNew({last_id: 'none', number_of_records: 10, first_page: 'first', days: this.state.selectedDays})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadSurveysListNew({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.surveys.length > 0 ? this.props.surveys[this.props.surveys.length - 1]._id : 'none', number_of_records: 10, first_page: 'next', days: this.state.selectedDays})
    } else {
      this.props.loadSurveysListNew({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.surveys.length > 0 ? this.props.surveys[0]._id : 'none', number_of_records: 10, first_page: 'previous', days: this.state.selectedDays})
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

  componentWillReceiveProps (nextProps) {
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
  sendSurvey (survey) {
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
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='bizOCjXE6tM'
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
        {
          (this.state.isShowingZeroSubModal || this.state.isShowingZeroPageModal) &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeZeroSubDialog}>
            <ModalDialog style={{width: '700px', top: '75px'}}
              onClose={this.closeZeroSubDialog}>
              {this.state.isShowingZeroPageModal
              ? <AlertMessageModal type='page' />
            : <AlertMessageModal type='subscriber' />
            }
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
            </ModalDialog>
          </ModalContainer>
        }
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
                                this.props.deleteSurvey(this.state.deleteid, this.msg, {last_id: 'none', number_of_records: 10, first_page: 'first', days: this.state.selectedDays})
                                this.closeDialogDelete()
                              }}>Delete
                            </button>
                          </ModalDialog>
                        </ModalContainer>
                      }
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
                    <ReactPaginate
                      previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a>...</a>}
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
    tags: (state.tagsInfo.tags)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadSurveysListNew: loadSurveysListNew, sendsurvey: sendsurvey, loadSubscribersList: loadSubscribersList, deleteSurvey: deleteSurvey, loadTags: loadTags, loadMyPagesListNew: loadMyPagesListNew}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Survey)
