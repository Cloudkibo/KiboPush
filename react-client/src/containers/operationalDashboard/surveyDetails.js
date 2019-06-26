import React from 'react'
import { loadSurveyDetails } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Response from '../survey/Response'

class SurveyDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      surveyDetailsData: [],
      totalLength: 0,
      subscribersData: [],
      subscribersDataAll: [],
      totalLengthSubscriber: 0,
      searchValue: '',
      filteredData: ''
    }
    this.displayData = this.displayData.bind(this)
    this.backToUserDetails = this.backToUserDetails.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  searchSubscriber (event) {
    this.setState({searchValue: event.target.value})
    var filtered = []
    var data = this.props.location.state.data.subscriber
    if (this.state.filteredData !== '') {
      data = this.state.filteredData
    }
    for (let i = 0; i < data.length; i++) {
      var fullName = data[i].firstName + ' ' + data[i].lastName
      if (data[i].firstName.toLowerCase().includes((event.target.value).toLowerCase()) || data[i].lastName.toLowerCase().includes((event.target.value).toLowerCase()) || fullName.toLowerCase().includes((event.target.value).toLowerCase())) {
        filtered.push(data[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLengthSubscriber: filtered.length })
  }

  displayData (n, subscribers) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > subscribers.length) {
      limit = subscribers.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = subscribers[i]
      index++
    }
    this.setState({subscribersData: data, subscribersDataAll: subscribers})
  }
  handlePageClick (data) {
    this.displayData(data.selected, this.state.subscribersDataAll)
  }

  backToUserDetails () {
    if (this.props.location.state) {
      this.props.history.push({
        pathname: `/operationalDashboard`
      })
    } else {
      const user = this.props.currentUser
      this.props.history.push({
        pathname: `/userDetails`,
        state: user
      })
    }
  }

  componentDidMount () {
    if (this.props.location.state) {
      this.props.loadSurveyDetails(this.props.location.state._id)
      // this.displayData(0, this.props.location.state.data.subscriber)
      // this.setState({ totalLengthSubscriber: this.props.location.state.data.subscriber.length })
    } else if (this.props.currentSurvey) {
      const id = this.props.currentSurvey._id
      this.props.loadSurveyDetails(id)
    }
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Survey Detail`
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>
            {this.props.survey &&
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
                      <h3 className='m-subheader__title' style={{marginTop: '15px'}}>{this.props.survey[0].title}</h3>
                      <p><b>Description: </b>{this.props.survey[0].description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            }
          </div>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12 col-md-12 col-sm-8 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__body'>
                  <div className='col-xl-12'>
                    <h4>Survey Questions</h4>
                    <ul className='list-group'>
                      {
                        this.props.questions &&
                        this.props.questions.map((c) => (
                          <div className='card'>
                            <li
                              className='list-group-item'
                              style={{cursor: 'pointer'}}
                              key={c._id}
                            >
                              <strong>Q. {c.statement}</strong>
                            </li>
                            {this.props.responses && this.props.responses.length > 0
                            ? <Response responses={this.props.responses.filter(
                              (d) => d.questionId._id === c._id)}
                              question={c} />
                            : <ol>
                              {c.options.map((c,index) => (
                                <li style={{marginLeft: '30px'}}
                                  key={index}
                                >{c}
                                </li>
                                  ))}
                            </ol>
                          }
                          </div>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          { /* this.props.location.state && this.props.location.state.data.subscriber.length > 0 &&
          <div className='row'>

            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Subscribers
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    <div className='col-xl-12'>
                      <div className='form-group m-form__group row align-items-center'>
                        <div className='col-md-12'>
                          <div className='m-input-icon m-input-icon--left'>
                            <input type='text' style={{width: '33%'}} className='form-control m-input m-input--solid' value={this.state.searchValue} placeholder='Search...' id='generalSearch' onChange={this.searchSubscriber} />
                            <span className='m-input-icon__icon m-input-icon__icon--left'>
                              <span><i className='la la-search' /></span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {this.state.subscribersData && this.state.subscribersData.length > 0
                    ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data' style={{width: '-webkit-fill-available'}}>
                      <table className='m-datatable__table'
                        id='m-datatable--27866229129' style={{
                          display: 'block',
                          height: 'auto',
                          overflowX: 'auto'
                        }}>
                        <thead className='m-datatable__head'>
                          <tr className='m-datatable__row'
                            style={{height: '53px'}}>
                            <th data-field='Profile Picture'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Profile Picture</span>
                            </th>
                            <th data-field='Name'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Name</span>
                            </th>
                            <th data-field='Page'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Page</span>
                            </th>
                            <th data-field='seen'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Seen</span>
                            </th>
                            <th data-field='responded'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Responded</span>
                            </th>
                            <th data-field='Locale'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Locale</span>
                            </th>
                            <th data-field='Gender'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Gender</span>
                            </th>
                          </tr>
                        </thead>

                        <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                          {
                        this.state.subscribersData.map((subscriber, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='Profile Picture'
                              className='m-datatable__cell'>
                              <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                <img alt='pic'
                                  src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                                  className='m--img-rounded m--marginless m--img-centered' width='60' height='60'
                              />
                              </span>
                            </td>

                            <td data-field='Name'
                              className='m-datatable__cell'>
                              <span
                                style={{width: '100px', overflow: 'inherit'}}>{subscriber.firstName} {subscriber.lastName}</span>
                            </td>

                            <td data-field='Page'
                              className='m-datatable__cell'>
                              <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                {subscriber.page}
                              </span>
                            </td>
                            <td data-field='seen'
                              className='m-datatable__cell'>
                              {subscriber.seen === true
                              ? <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                true
                              </span>
                              : <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                false
                              </span>
                            }
                            </td>
                            <td data-field='responded'
                              className='m-datatable__cell'>
                              {subscriber.responded === true
                              ? <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                true
                              </span>
                              : <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                false
                              </span>
                            }
                            </td>
                            <td data-field='Locale' className='m-datatable__cell'><span style={{width: '100px', color: 'white'}} className='m-badge m-badge--brand'>{subscriber.locale}</span></td>
                            <td data-field='Gender' className='m-datatable__cell'><span style={{width: '100px', color: 'white'}} className='m-badge m-badge--brand'>{subscriber.gender}</span></td>
                          </tr>
                        ))
                      }
                        </tbody>
                      </table>
                      <ReactPaginate previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLengthSubscriber / 4)}
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
                </div>
              </div>
            </div>
          </div>
          */ }
          <div style={{'overflow': 'auto'}}>
            <button className='btn btn-primary btn-sm' onClick={() => this.backToUserDetails()} style={{ float: 'right', margin: '20px' }}>Back
            </button>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    survey: (state.backdoorInfo.survey),
    responses: (state.backdoorInfo.responses),
    questions: (state.backdoorInfo.questions),
    currentUser: (state.backdoorInfo.currentUser),
    currentSurvey: (state.backdoorInfo.currentSurvey)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadSurveyDetails: loadSurveyDetails},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveyDetails)
