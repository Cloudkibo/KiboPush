import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadSurveysByDays, saveSurveyInformation } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import { browserHistory } from 'react-router'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

class SurveysInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('constructor surveyinfo', props.userID)
    props.loadSurveysByDays(0)
    this.state = {
      SurveyData: [],
      totalLength: 0,
      filterOptions: [
        { value: 10, label: '10 days' },
        { value: 30, label: '30 days' }],
      selectedFilterValue: 10,
      selectedDays: 10
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSurveys = this.searchSurveys.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.filterByDays = this.filterByDays.bind(this)
    this.onSurveyClick = this.onSurveyClick.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
  }

  componentDidMount () {
    console.log('componentDidMount called in ViewSurveyDetail')
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
    console.log('componentDidMount called in ViewSurveyDetail Finished')
  }

  displayData (n, surveys) {
    console.log('surveys:', surveys)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > surveys.length) {
      limit = surveys.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = surveys[i]
      index++
    }
    console.log('data', data)
    this.setState({SurveyData: data})
    console.log('in displayData', this.state.SurveyData)
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.surveys)
  }
  componentWillReceiveProps (nextProps) {
    console.log('userSurveys componentWillReceiveProps is called')
    if (nextProps.surveys) {
      console.log('Surveys Updated', nextProps.surveys)
      this.displayData(0, nextProps.surveys)
      this.setState({ totalLength: nextProps.surveys.length })
    }
  }
  searchSurveys (event) {
    var filtered = []
    for (let i = 0; i < this.props.surveys.length; i++) {
      console.log('props surveys', this.props.surveys[i])
      if (this.props.surveys[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
        filtered.push(this.props.surveys[i])
      }
    }

    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }
  onFilter (val) {
    if (!val) {
      this.setState({selectedFilterValue: null})
      this.displayData(0, this.props.surveys)
      this.setState({ totalLength: this.props.surveys.length })
    } else if (val.value === 10) {
      console.log('Selected:', val)
      this.filterByDays(10)
      this.setState({ selectedFilterValue: val })
    } else if (val.value === 30) {
      this.filterByDays(30)
      this.setState({ selectedFilterValue: val })
    }
  }
  onDaysChange (e) {
    var defaultVal = 10
    var value = e.target.value
    this.setState({selectedDays: value})
    console.log('On days change', value)
    if (value && value !== '') {
      if (value.indexOf('.') !== -1) {
        value = Math.floor(value)
      }
      this.props.loadSurveysByDays(value)
    } else if (value === '') {
      this.setState({selectedDays: defaultVal})
      this.props.loadSurveysByDays(defaultVal)
    }
  }
  filterByDays (val) {
    var data = []
    var index = 0
    this.props.surveys.map((survey) => {
      let surveyDate = moment(survey.datetime, 'YYYY-MM-DD')
      const end = moment(moment(), 'YYYY-MM-DD')
      const start = moment(moment().subtract(val, 'days'), 'YYYY-MM-DD')
      const range = moment.range(start, end)
      if (range.contains(surveyDate)) {
        data[index] = survey
        index = index + 1
      }
    })
    this.displayData(0, data)
    this.setState({ totalLength: data.length })
  }
  onSurveyClick (survey) {
    browserHistory.push({
      pathname: `/surveyDetails`,
      state: {_id: survey._id}
    })
  }

  render () {
    return (
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
                <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                  <li className='nav-item m-tabs__item' />
                  <li className='nav-item m-tabs__item' />
                  <li className='nav-item m-tabs__item'>
                    <form className='m-form m-form--fit m-form--label-align-right'>
                      <div className='m-portlet__body'>
                        <div className='form-group m-form__group row'>
                          <label htmlFor='example-text-input' className='col-form-label'>
                            Show records for last:&nbsp;&nbsp;
                          </label>
                          <div>
                            <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
                          </div>
                          <label htmlFor='example-text-input' className='col-form-label'>
                          &nbsp;&nbsp;days
                        </label>
                        </div>
                      </div>
                    </form>
                  </li>
                </ul>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='row align-items-center'>
                { this.props.surveys && this.props.surveys.length > 0
              ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                <div className='form-group m-form__group row align-items-center'>
                  <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4' style={{marginLeft: '15px'}}>
                    <input type='text' placeholder='Search by Title...' className='form-control m-input m-input--solid' onChange={this.searchSurveys} />
                    <span className='m-input-icon__icon m-input-icon__icon--left'>
                      <span><i className='la la-search' /></span>
                    </span>
                  </div>
                </div>
                {
                  this.state.SurveyData && this.state.SurveyData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table'
                      id='m-datatable--27866229129' style={{
                        display: 'block',
                        height: 'auto',
                        overflowX: 'auto'
                      }}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='title'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Title</span></th>
                          <th data-field='user'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>User/Company Name</span></th>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Page</span></th>
                          <th data-field='created'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Created At</span></th>
                          <th data-field='sent'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Sent</span></th>
                          <th data-field='seen'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Seen</span></th>
                          <th data-field='responded'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Responded</span></th>
                          <th data-field='more'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}} /></th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                        {
                          this.state.SurveyData.map((survey, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
                              <td data-field='title'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>{survey.title}</span></td>
                              { (survey.user[0].plan === 'plan_A' || survey.user[0].plan === 'plan_B')
                              ? <td data-field='user' className='m-datatable__cell'>
                                <span style={{width: '120px'}}>{survey.user[0].name}</span></td>
                                : <td data-field='user' className='m-datatable__cell'>
                                  <span style={{width: '120px'}}>{survey.company[0].companyName}</span></td>}
                              <td data-field='page' className='m-datatable__cell'>
                                <span style={{width: '120px'}}>{survey.page.join(',')}</span></td>
                              <td data-field='created'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>{handleDate(survey.datetime)}</span></td>
                              <td data-field='sent'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>{survey.sent}</span></td>
                              <td data-field='seen'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>{survey.seen}</span></td>
                              <td data-field='responded'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>{survey.responded}</span></td>
                              <td data-field='more'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>
                                  <button onClick={() => this.onSurveyClick(survey)} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                  View
                                </button></span>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                    <ReactPaginate previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a>...</a>}
                      breakClassName={'break-me'}
                      pageCount={Math.ceil(this.state.totalLength / 4)}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'} />
                  </div>
                  : <p> No search results found. </p>
                }
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
    )
  }
}

function mapStateToProps (state) {
  console.log('user survey', state)
  return {
    surveys: state.surveysPollsBroadcasts.surveys
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadSurveysByDays: loadSurveysByDays, saveSurveyInformation}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveysInfo)
