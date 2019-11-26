/* eslint-disable no-useless-constructor */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactPaginate from 'react-paginate'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { loadTags } from '../../redux/actions/tags.actions'
import { loadUnansweredQuestions } from '../../redux/actions/smart_replies.actions'
import { allLocales } from '../../redux/actions/subscribers.actions'

class UnansweredQueries extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      questionsList: [],
      totalLength: 0,
      tagOptions: [],
      locales: [],
      filterByGender: '',
      filterByLocale: '',
      filterByPage: '',
      filterByTag: '',
      searchValue: '',
      filteredData: ''
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.getDateAndTime = this.getDateAndTime.bind(this)
    this.backToIntents = this.backToIntents.bind(this)
    props.loadUnansweredQuestions(this.props.location.state)
    props.loadMyPagesList()
    props.allLocales()
  }

  backToIntents () {
    this.props.history.push({
      pathname: '/intents',
      state: this.props.location.state
    })
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Unanswered Queries`
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.unansweredQueriesList) {
      // console.log('unanswered questions list ' + JSON.stringify(nextProps.unansweredQueriesList))
      nextProps.unansweredQueriesList.sort(function (a, b) {
        return new Date(b.datetime) - new Date(a.datetime)
      })
      this.displayData(0, nextProps.unansweredQueriesList)
      this.setState({ totalLength: nextProps.unansweredQueriesList.length })
    } else {
      var emptyList = []
      this.displayData(0, emptyList)
    }
    if (nextProps.tags) {
      var tagOptions = []
      for (var i = 0; i < nextProps.tags.length; i++) {
        tagOptions.push({ 'value': nextProps.tags[i].tag, 'label': nextProps.tags[i].tag })
      }
      this.setState({
        tagOptions: tagOptions
      })
    }
    if (nextProps.locales) {
      this.setState({ locales: nextProps.locales })
    }
  }

  displayData (n, questions) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > questions.length) {
      limit = questions.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = questions[i]
      index++
    }
    data.sort(function (a, b) {
      return new Date(b.datetime) - new Date(a.datetime)
    })
    this.setState({questionsList: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.unansweredQueriesList)
  }

  getDateAndTime (timestamp) {
    let date = new Date(timestamp)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper' style={{ width: '150%' }}>
        <div className='m-content'>
          <div className='m-portlet m-portlet-mobile '>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Unanswered Questions
                      </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>

              {this.state.questionsList && this.state.questionsList.length > 0
                ? <div>
                  <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table'
                      id='m-datatable--27866229129' style={{
                        display: 'block',
                        height: 'auto',
                        overflowX: 'auto'
                      }}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{ height: '53px' }}>
                          <th data-field='Profile Picture'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '300px', overflow: 'inherit' }}>Questions</span>
                          </th>
                          <th data-field='Name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '100px', overflow: 'inherit' }}>Bot Name</span>
                          </th>
                          <th data-field='Page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '100px', overflow: 'inherit' }}>Confidence Score</span>
                          </th>
                          <th data-field='PhoneNumber'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '100px', overflow: 'inherit' }}>Date</span>
                          </th>
                        </tr>
                      </thead>

                      <tbody className='m-datatable__body' style={{ textAlign: 'center' }}>
                        {
                          this.state.questionsList.map((question, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{ height: '55px' }} key={i}>

                              <td data-field='Name'
                                className='m-datatable__cell'>
                                <span
                                  style={{ width: '300px', overflow: 'inherit' }}>{question.Question ? question.Question : 'Question statement missing'}</span>
                              </td>

                              <td data-field='Page'
                                className='m-datatable__cell'>
                                <span
                                  style={{ width: '100px', overflow: 'inherit' }}>
                                  {question.botId.botName ? question.botId.botName : 'Bot name not is missing'}
                                </span>
                              </td>
                              <td data-field='phoneNumber'
                                className='m-datatable__cell'>
                                <span
                                  style={{ width: '100px', overflow: 'inherit' }}>
                                  {question.Confidence ? Math.round(question.Confidence * 100) + '%' : 'No Answer Found'}
                                </span>
                              </td>
                              <td data-field='source'
                                className='m-datatable__cell'>
                                <span
                                  style={{ width: '100px', overflow: 'inherit' }}>
                                  {this.getDateAndTime(question.datetime)}
                                </span>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                    <ReactPaginate previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a href='#/'>...</a>}
                      breakClassName={'break-me'}
                      pageCount={Math.ceil(this.state.totalLength / 10)}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'} />

                  </div>
                </div>
                : <div className='table-responsive'>
                  <p> No data to display </p>
                </div>
              }
            </div>
            <div className='m-portlet__foot m-portlet__foot--fit'>
              <div className='m-form__actions m-form__actions' style={{ padding: '30px' }}>
                <a href='#/'
                  onClick={this.backToIntents}
                  className='btn btn-primary'>Back</a>
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
    pages: (state.pagesInfo.pages),
    tags: (state.tagsInfo.tags),
    locales: (state.subscribersInfo.locales),
    count: (state.subscribersInfo.count),
    unansweredQueriesList: (state.botsInfo.unansweredQueriesList)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    loadTags: loadTags,
    allLocales: allLocales,
    loadUnansweredQuestions: loadUnansweredQuestions
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UnansweredQueries)
