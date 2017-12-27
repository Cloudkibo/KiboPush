import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadSurveysList, loadCategoriesList } from '../../redux/actions/templates.actions'
import { saveSurveyInformation } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import { Link } from 'react-router'

class templateSurveys extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadSurveysList()
    props.loadCategoriesList()
    this.state = {
      surveysData: [],
      surveysDataAll: [],
      totalLength: 0,
      filterValue: ''
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSurvey = this.searchSurvey.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onSurveyClick = this.onSurveyClick.bind(this)
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
  onSurveyClick (e, survey) {
    console.log('Survey Click', survey)
    this.props.saveSurveyInformation(survey)
  }
  displayData (n, broadcasts) {
    console.log('one', broadcasts)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > broadcasts.length) {
      limit = broadcasts.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = broadcasts[i]
      index++
    }
    console.log('data[index]', data)
    this.setState({surveysData: data, surveysDataAll: broadcasts})
    console.log('in displayData', this.state.surveysData)
  }
  handlePageClick (data) {
    this.displayData(data.selected, this.state.surveysDataAll)
  }
  componentWillReceiveProps (nextProps) {
    console.log('userbroadcasts componentWillReceiveProps is called')
    if (nextProps.surveys) {
      console.log('surveys Updated', nextProps.surveys)
      this.displayData(0, nextProps.surveys)
      this.setState({ totalLength: nextProps.surveys.length })
    }
  }
  searchSurvey (event) {
    var filtered = []
    if (event.target.value !== '') {
      for (let i = 0; i < this.props.surveys.length; i++) {
        if (this.props.surveys[i].title && this.props.surveys[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
          filtered.push(this.props.surveys[i])
        }
      }
    } else {
      filtered = this.props.surveys
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilter (e) {
    console.log(e.target.value)
    this.setState({filterValue: e.target.value})
    var filtered = []
    if (e.target.value !== '') {
      for (let i = 0; i < this.props.surveys.length; i++) {
        if (e.target.value === 'all') {
          if (this.props.surveys[i].category.length > 1) {
            filtered.push(this.props.surveys[i])
          }
        } else {
          for (let j = 0; j < this.props.surveys[i].category.length; j++) {
            if (this.props.surveys[i].category[j] === e.target.value) {
              filtered.push(this.props.surveys[i])
            }
          }
        }
      }
    } else {
      filtered = this.props.surveys
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  render () {
    console.log('surevys')
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
                <Link to='/createSurvey' >
                  <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                    <span>
                      <i className='la la-plus' />
                      <span>
                        Create Survey
                      </span>
                    </span>
                  </button>
                </Link>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='row align-items-center'>
                { this.props.surveys && this.props.surveys.length > 0
              ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                <div className='form-group m-form__group row align-items-center'>
                  <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4' style={{marginLeft: '15px'}}>
                    <input type='text' placeholder='Search by Title...' className='form-control m-input m-input--solid' onChange={(event) => { this.searchSurvey(event) }} />
                    <span className='m-input-icon__icon m-input-icon__icon--left'>
                      <span><i className='la la-search' /></span>
                    </span>
                  </div>
                  <div className='col-md-4 col-lg-4 col-xl-4 row align-items-center' />
                  <div className='m-form__group m-form__group--inline col-md-4 col-lg-4 col-xl-4 row align-items-center'>
                    <div className='m-form__label'>
                      <label>Category:&nbsp;&nbsp;</label>
                    </div>
                    <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.filterValue} onChange={this.onFilter}>
                      <option value='' disabled>Filter by Category...</option>
                      <option value=''>All</option>
                      {
                        this.props.categories.map((category, i) => (
                          <option value={category.name}>{category.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                {
                  this.state.surveysData && this.state.surveysData.length > 0
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
                            <span style={{width: '150px'}}>Title</span>
                          </th>
                          <th data-field='description'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Description</span>
                          </th>
                          <th data-field='category'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Category</span>
                          </th>
                          <th data-field='created'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Created At</span>
                          </th>
                          <th data-field='seemore'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}} />
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                        {
                          this.state.surveysData.map((survey, i) => (
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
                              <td data-field='category' className='m-datatable__cell'>
                                <span style={{width: '150px'}}>{survey.category.join(
                            ',')}</span>
                              </td>
                              <td data-field='created'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '150px'}}>{handleDate(survey.datetime)}</span></td>
                              <td data-field='seemore'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '150px'}}><Link onClick={(e) => { let surveySelected = survey; this.onSurveyClick(e, surveySelected) }} to={'/viewSurvey'} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                  View Survey
                                </Link></span></td>
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
  return {
    surveys: state.templatesInfo.surveys,
    categories: state.templatesInfo.categories
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadSurveysList: loadSurveysList,
      loadCategoriesList: loadCategoriesList,
      saveSurveyInformation}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(templateSurveys)
