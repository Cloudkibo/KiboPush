import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadSurveysList } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import Select from 'react-select'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

class SurveysInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('constructor surveyinfo', props.userID)
    props.loadSurveysList(props.userID)
    this.state = {
      SurveyData: [],
      totalLength: 0,
      filterOptions: [
        { value: 10, label: '10 days' },
        { value: 30, label: '30 days' }],
      selectedFilterValue: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSurveys = this.searchSurveys.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.filterByDays = this.filterByDays.bind(this)
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
    console.log('Selected: ' + JSON.stringify(val))
    if (!val) {
      this.setState({selectedFilterValue: null})
      this.displayData(0, this.props.surveys)
    } else if (val.value === 10) {
      console.log('Selected:', val.value)
      this.filterByDays(10)
      this.setState({ selectedFilterValue: val.value })
    } else if (val.value === 30) {
      this.filterByDays(30)
      this.setState({ selectedFilterValue: val.value })
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
  }

  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              <h4>Surveys</h4><br />
              { this.props.surveys && this.props.surveys.length > 0
              ? <div className='table-responsive'>
                <form>
                  <div className='form-row' style={{display: 'flex'}}>
                    <div style={{display: 'inline-block'}} className='form-group col-md-8'>
                      <label> Search </label>
                      <input type='text' placeholder='Search Survey' className='form-control' onChange={this.searchSurveys} />
                    </div>
                    <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                      <label> Filter </label>
                      <Select
                        name='form-field-name'
                        options={this.state.filterOptions}
                        onChange={this.onFilter}
                        placeholder='Filter by last:'
                        value={this.state.selectedFilterValue}
                        clearValueText='Filter by:'
                      />
                    </div>
                  </div>
                </form>
                {
                  this.state.SurveyData && this.state.SurveyData.length > 0
                  ? <div>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Descripton</th>
                          <th>Created at</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.SurveyData.map((survey, i) => (
                            <tr>
                              <td>{survey.title}</td>
                              <td>{survey.description}</td>
                              <td>{handleDate(survey.datetime)}</td>
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
        </main>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('user survey', state)
  return {
    surveys: state.SurveysInfo.surveys
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadSurveysList: loadSurveysList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveysInfo)
