import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadPollsList } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import Select from 'react-select'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

class PollsInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('constructor pollsinfo', props.userID)
    props.loadPollsList(props.userID)
    this.state = {
      PollData: [],
      totalLength: 0,
      filterOptions: [
        { value: 10, label: '10 days' },
        { value: 30, label: '30 days' }],
      selectedFilterValue: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchPolls = this.searchPolls.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.filterByDays = this.filterByDays.bind(this)
    this.gotoViewPoll = this.gotoViewPoll.bind(this)
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

  displayData (n, poll) {
    console.log('one', poll)
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
    console.log('in displayData of userPolls', this.state.PollData)
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.polls)
  }
  componentWillReceiveProps (nextProps) {
    console.log('userPolls componentWillReceiveProps is called')
    if (nextProps.polls) {
      console.log('Polls Updated', nextProps.polls)
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
    console.log('Selected: ' + JSON.stringify(val))
    if (!val) {
      this.setState({selectedFilterValue: null})
      this.displayData(0, this.props.polls)
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
  }

  gotoViewPoll (poll) {
    console.log(poll)
  }

  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              <h4>Polls</h4><br />
              { this.props.polls && this.props.polls.length > 0
              ? <div className='table-responsive'>
                <form>
                  <div className='form-row' style={{display: 'flex'}}>
                    <div style={{display: 'inline-block'}} className='form-group col-md-8'>
                      <label> Search </label>
                      <input type='text' placeholder='Search Polls' className='form-control' onChange={this.searchPolls} />
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
                  this.state.PollData && this.state.PollData.length > 0
                  ? <div>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Platform</th>
                          <th>Descripton</th>
                          <th>Created at</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.PollData.map((poll, i) => (
                            <tr>
                              <td>{poll.platform}</td>
                              <td>{poll.statement}</td>
                              <td>{handleDate(poll.datetime)}</td>
                              <td> <button className='btn btn-primary btn-sm'
                                style={{float: 'left', margin: 2}}
                                onClick={() => this.gotoViewPoll(poll)}>
                              View
                              </button></td>
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
  console.log('user polls', state)
  return {
    polls: state.PollsInfo.polls
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadPollsList: loadPollsList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PollsInfo)
