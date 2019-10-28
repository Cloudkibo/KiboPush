import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadSurveysList, saveSurveyInformation } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import { Link } from 'react-router-dom'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

class SurveysInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadSurveysList(props.userID, {first_page: 'first', last_id: 'none', number_of_records: 10, filter_criteria: {search_value: '', days: 10}})
    this.state = {
      SurveyData: [],
      totalLength: 0,
      filterOptions: [
        { value: 10, label: '10 days' },
        { value: 30, label: '30 days' }],
      selectedFilterValue: 10,
      searchValue: '',
      pageNumber: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSurveys = this.searchSurveys.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.filterByDays = this.filterByDays.bind(this)
    this.onSurveyClick = this.onSurveyClick.bind(this)
    this.debounce = this.debounce.bind(this)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | User Surveys`
    var typingTimer
    var doneTypingInterval = 300
    var self = this
    let myInput = document.getElementById('searchSurvey')
    myInput.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(self.debounce, doneTypingInterval)
    })
  }

  debounce () {
    var value = document.getElementById('searchSurvey').value
    this.searchSurveys(value)
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
    this.setState({SurveyData: data})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadSurveysList(this.props.userID, {first_page: 'first', last_id: 'none', number_of_records: 10, filter_criteria: {search_value: this.state.searchValue, days: parseInt(this.state.selectedFilterValue)}})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadSurveysList(this.props.userID, {current_page: this.state.pageNumber, requested_page: data.selected, first_page: 'next', last_id: this.props.surveys.length > 0 ? this.props.surveys[this.props.surveys.length - 1]._id : 'none', number_of_records: 10, filter_criteria: {search_value: this.state.searchValue, days: parseInt(this.state.selectedFilterValue)}})
    } else {
      this.props.loadSurveysList(this.props.userID, {current_page: this.state.pageNumber, requested_page: data.selected, first_page: 'previous', last_id: this.props.surveys.length > 0 ? this.props.surveys[0]._id : 'none', number_of_records: 10, filter_criteria: {search_value: this.state.searchValue, days: parseInt(this.state.selectedFilterValue)}})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.surveys)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.surveys && nextProps.count) {
      this.displayData(0, nextProps.surveys)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({SurveyData: [], totalLength: 0})
    }
  }
  searchSurveys (value) {
    this.setState({searchValue: value.toLowerCase()})
    this.props.loadSurveysList(this.props.userID, {first_page: 'first', last_id: this.props.surveys.length > 0 ? this.props.surveys[this.props.surveys.length - 1]._id : 'none', number_of_records: 10, filter_criteria: {search_value: value.toLowerCase(), days: parseInt(this.state.selectedFilterValue)}})
    // var filtered = []
    // for (let i = 0; i < this.props.surveys.length; i++) {
    //   if (this.props.surveys[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
    //     filtered.push(this.props.surveys[i])
    //   }
    // }
    //
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }
  onFilter (e) {
    console.log('val in survey', e.target.value)
    this.setState({ selectedFilterValue: e.target.value, pageNumber: 0 })
    this.props.loadSurveysList(this.props.userID, {first_page: 'first', last_id: this.props.surveys.length > 0 ? this.props.surveys[this.props.surveys.length - 1]._id : 'none', number_of_records: 10, filter_criteria: {search_value: this.state.searchValue, days: parseInt(e.target.value)}})

    // if (!val) {
    //   this.setState({selectedFilterValue: null})
    //   this.displayData(0, this.props.surveys)
    //   this.setState({ totalLength: this.props.surveys.length })
    // } else if (val.value === 10) {
    //   this.filterByDays(10)
    //   this.setState({ selectedFilterValue: val })
    // } else if (val.value === 30) {
    //   this.filterByDays(30)
    //   this.setState({ selectedFilterValue: val })
    // }
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
  onSurveyClick (e, survey) {
    this.props.saveSurveyInformation(survey)
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
            </div>
            <div className='m-portlet__body'>
              <div className='row align-items-center'>
                <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                  <div className='form-group m-form__group row align-items-center'>
                    <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4' style={{marginLeft: '15px'}}>
                    <input type='text' id='searchSurvey' name='searchSurvey' placeholder='Search by Title...' className='form-control m-input m-input--solid' />                      <span className='m-input-icon__icon m-input-icon__icon--left'>
                        <span><i className='la la-search' /></span>
                      </span>
                    </div>
                    <div className='col-md-4 col-lg-4 col-xl-4 row align-items-center' />
                    <div className='m-form__group m-form__group--inline col-md-4 col-lg-4 col-xl-4 row align-items-center'>
                      <div className='m-form__label'>
                        <label>Filter by Last:&nbsp;&nbsp;</label>
                      </div>
                      <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.selectedFilterValue} onChange={this.onFilter}>
                        {
                          this.state.filterOptions.map((locale, i) => (
                            <option value={locale.value}>{locale.label}</option>
                          ))
                        }
                      </select>
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
                              <span style={{width: '150px'}}>Title</span></th>
                            <th data-field='description'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '150px'}}>Descripton</span></th>
                            <th data-field='created'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '150px'}}>Created at</span></th>
                            <th data-field='more'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '150px'}} /></th>
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
                                    style={{width: '150px'}}>{survey.title}</span></td>
                                <td data-field='description'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px'}}>{survey.description}</span></td>
                                <td data-field='created'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px'}}>{handleDate(survey.datetime)}</span></td>
                                <td data-field='more'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px'}}>
                                    <Link onClick={(e) => { let surveySelected = survey; this.onSurveyClick(e, surveySelected) }} to={'/surveyDetails'} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                    View Survey
                                  </Link></span>
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
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.state.pageNumber} />
                    </div>
                    : <p> No data to display. </p>
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
  return {
    surveys: state.backdoorInfo.surveys,
    count: state.backdoorInfo.surveysUserCount

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadSurveysList: loadSurveysList, saveSurveyInformation}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveysInfo)
