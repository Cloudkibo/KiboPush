import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadPollsList, saveCurrentPoll } from '../../redux/actions/backdoor.actions'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

class PollsInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadPollsList(props.userID)
    this.state = {
      PollData: [],
      totalLength: 0,
      filterOptions: [
        { value: 10, label: '10 days' },
        { value: 30, label: '30 days' }],
      selectedFilterValue: 10
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchPolls = this.searchPolls.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.filterByDays = this.filterByDays.bind(this)
    this.gotoViewPoll = this.gotoViewPoll.bind(this)
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
  }

  displayData (n, poll) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > poll.length) {
      limit = poll.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = poll[i]
      index++
    }
    this.setState({PollData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.polls)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.polls) {
      this.displayData(0, nextProps.polls)
      this.setState({ totalLength: nextProps.polls.length })
    }
  }
  searchPolls (event) {
    var filtered = []
    for (let i = 0; i < this.props.polls.length; i++) {
      if (this.props.polls[i].statement.toLowerCase().includes(event.target.value.toLowerCase())) {
        filtered.push(this.props.polls[i])
      }
    }

    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilter (val) {
    if (!val) {
      this.setState({selectedFilterValue: null})
      this.displayData(0, this.props.polls)
      this.setState({ totalLength: this.props.polls.length })
    } else if (val === 10) {
      this.filterByDays(10)
      this.setState({ selectedFilterValue: val })
    } else if (val === 30) {
      this.filterByDays(30)
      this.setState({ selectedFilterValue: val })
    }
  }

  filterByDays (val) {
    var data = []
    var index = 0
    this.props.polls.map((poll) => {
      let pollDate = moment(poll.datetime, 'YYYY-MM-DD')
      const end = moment(moment(), 'YYYY-MM-DD')
      const start = moment(moment().subtract(val, 'days'), 'YYYY-MM-DD')
      const range = moment.range(start, end)
      if (range.contains(pollDate)) {
        data[index] = poll
        index = index + 1
      }
    })
    this.displayData(0, data)
    this.setState({ totalLength: data.length })
  }

  gotoViewPoll (poll) {
    this.props.saveCurrentPoll(poll)
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
                    Polls
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='row align-items-center'>
                { this.props.polls && this.props.polls.length > 0
              ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                <div className='form-group m-form__group row align-items-center'>
                  <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4' style={{marginLeft: '15px'}}>
                    <input type='text' placeholder='Search by Descripton...' className='form-control m-input m-input--solid' onChange={this.searchPolls} />
                    <span className='m-input-icon__icon m-input-icon__icon--left'>
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
                  this.state.PollData && this.state.PollData.length > 0
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
                          <th data-field='platform'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Platform</span></th>
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
                          this.state.PollData.map((poll, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
                              <td data-field='platform'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '150px'}}>{poll.platform}</span></td>
                              <td data-field='description'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '150px'}}>{poll.statement}</span></td>
                              <td data-field='created'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '150px'}}>{handleDate(poll.datetime)}</span></td>
                              <td data-field='more'
                                className='m-datatable__cell'>
                                <span style={{width: '150px'}}>
                                  <Link className='btn btn-primary btn-sm'
                                    to='/viewPollDetail'
                                    style={{float: 'left', margin: 2}}
                                    onClick={() => this.gotoViewPoll(poll)}>
                              View Poll
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
    polls: state.PollsInfo.polls
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    { loadPollsList: loadPollsList,
      saveCurrentPoll: saveCurrentPoll }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PollsInfo)
