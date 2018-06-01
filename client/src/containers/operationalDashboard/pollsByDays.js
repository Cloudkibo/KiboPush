import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadPollsByDays, saveCurrentPoll } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import { browserHistory } from 'react-router'

class PollsInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    //  props.loadPollsByDays({last_id: 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: '', days: 10}})
    this.state = {
      PollData: [],
      totalLength: 0,
      filterOptions: [
        { value: 10, label: '10 days' },
        { value: 30, label: '30 days' }],
      selectedFilterValue: 10,
      selectedDays: 10,
      filter: true,
      searchValue: '',
      showPolls: false
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchPolls = this.searchPolls.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onPollClick = this.onPollClick.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
    this.props.loadPollsByDays({last_id: 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: '', days: 10}})
    this.setState({showPolls: !this.state.showPolls})
  }
  displayData (n, polls) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > polls.length) {
      limit = polls.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = polls[i]
      index++
    }
    this.setState({PollData: data})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadPollsByDays({last_id: 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, days: this.state.selectedDays}})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadPollsByDays({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 10, first_page: 'next', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, days: this.state.selectedDays}})
    } else {
      this.props.loadPollsByDays({last_id: this.props.polls.length > 0 ? this.props.polls[0]._id : 'none', number_of_records: 10, first_page: 'previous', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, days: this.state.selectedDays}})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.polls)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.polls && nextProps.count) {
      this.displayData(0, nextProps.polls)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({PollData: [], totalLength: 0})
    }
  }
  searchPolls (event) {
    this.setState({searchValue: event.target.value.toLowerCase()})
    if (event.target.value !== '') {
      this.setState({filter: true})
      this.props.loadPollsByDays({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: event.target.value.toLowerCase(), days: this.state.selectedDays}})
    } else {
      this.props.loadPollsByDays({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: '', days: this.state.selectedDays}})
    }
    // var filtered = []
    // for (let i = 0; i < this.props.polls.length; i++) {
    //   if (this.props.polls[i].statement.toLowerCase().includes(event.target.value.toLowerCase())) {
    //     filtered.push(this.props.polls[i])
    //   }
    // }
    //
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }
  onFilter (val) {
    if (!val) {
      this.setState({selectedFilterValue: null})
      this.displayData(0, this.props.polls)
      this.setState({ totalLength: this.props.polls.length })
    } else if (val.value === 10) {
      this.filterByDays(10)
      this.setState({ selectedFilterValue: val })
    } else if (val.value === 30) {
      this.filterByDays(30)
      this.setState({ selectedFilterValue: val })
    }
  }
  onDaysChange (event) {
    this.setState({selectedDays: event.target.value, pageNumber: 0})
    if (event.target.value !== '') {
      this.setState({filter: true})
      this.props.loadPollsByDays({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, days: event.target.value}})
    } else {
      this.props.loadPollsByDays({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, days: ''}})
    }
    // var defaultVal = 10
    // var value = e.target.value
    // this.setState({selectedDays: value})
    // if (value && value !== '') {
    //   if (value.indexOf('.') !== -1) {
    //     value = Math.floor(value)
    //   }
    //   this.props.loadPollsByDays(value)
    // } else if (value === '') {
    //   this.setState({selectedDays: defaultVal})
    //   this.props.loadPollsByDays(defaultVal)
    // }
  }
  onPollClick (poll) {
    this.props.saveCurrentPoll(poll)
    browserHistory.push({
      pathname: `/viewPollDetail`,
      state: {_id: poll._id, data: poll}
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
                    Polls
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                  <li className='nav-item m-tabs__item' />
                  <li className='nav-item m-tabs__item' />
                  <li className='m-portlet__nav-item'>
                    <a data-portlet-tool='toggle' className='m-portlet__nav-link m-portlet__nav-link--icon' title='' data-original-title='Collapse' onClick={this.toggle}>
                      {this.state.showPolls
                      ? <i className='la la-angle-up' style={{cursor: 'pointer'}} />
                    : <i className='la la-angle-down' style={{cursor: 'pointer'}} />
                  }
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {this.state.showPolls &&
            <div className='m-portlet__body'>
              <div className='row align-items-center'>
                <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                  <div className='form-row'>
                    <div className='form-group col-md-6' ><input type='text' placeholder='Search by Title...' className='form-control m-input m-input--solid' onChange={this.searchPolls} />
                      <span className='m-input-icon__icon m-input-icon__icon--left' />
                    </div>
                    <div className='form-group col-md-6' style={{display: 'flex', float: 'right'}}>
                      <span style={{marginLeft: '70px'}} htmlFor='example-text-input' className='col-form-label'>
                        Show records for last:&nbsp;&nbsp;
                      </span>
                      <div style={{width: '200px'}}>
                        <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
                      </div>
                      <span htmlFor='example-text-input' className='col-form-label'>
                      &nbsp;&nbsp;days
                      </span>
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
                              <span style={{width: '50px'}}>Sent</span></th>
                            <th data-field='seen'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '50px'}}>Seen</span></th>
                            <th data-field='responded'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px'}}>Responded</span></th>
                            <th data-field='more'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '120px'}} /></th>
                          </tr>
                        </thead>
                        <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                          {
                            this.state.PollData.map((poll, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='title'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '120px'}}>{poll.statement}</span></td>
                                { poll.user[0] && (poll.user[0].plan === 'plan_A' || poll.user[0].plan === 'plan_B')
                              ? <td data-field='user' className='m-datatable__cell'>
                                <span style={{width: '120px'}}>{poll.user[0].name}</span></td>
                                : <td data-field='user' className='m-datatable__cell'>
                                  <span style={{width: '120px'}}>{poll.company[0].companyName}</span></td>}
                                <td data-field='page' className='m-datatable__cell'>
                                  <span style={{width: '120px'}}>{poll.page.join(',')}</span></td>
                                <td data-field='created'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '120px'}}>{handleDate(poll.datetime)}</span></td>
                                <td data-field='sent'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '50px'}}>{poll.sent}</span></td>
                                <td data-field='seen'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '50px'}}>{poll.seen}</span></td>
                                <td data-field='responded'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '100px'}}>{poll.responded}</span></td>
                                <td data-field='more'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '120px'}}>
                                    <button onClick={() => this.onPollClick(poll)} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
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
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.state.pageNumber} />
                    </div>
                    : <p> No data to display </p>
                  }
                </div>
              </div>
            </div>
          }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    polls: state.backdoorInfo.polls,
    count: state.backdoorInfo.pollsCount

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadPollsByDays: loadPollsByDays, saveCurrentPoll: saveCurrentPoll}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PollsInfo)
