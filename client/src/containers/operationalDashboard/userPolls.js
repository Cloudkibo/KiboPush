import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadPollsList } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'

class PollsInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('constructor pollsinfo', props.userID)
    props.loadPollsList(props.userID)
    this.state = {
      PollData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchPolls = this.searchPolls.bind(this)
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
      if (this.props.polls[i].statement.toLowerCase().includes(event.target.value) || this.props.polls[i].statement.toUpperCase().includes(event.target.value) || this.props.polls[i].statement.includes(event.target.value)) {
        filtered.push(this.props.polls[i])
      }
    }
    if (filtered && filtered.length > 0) {
      this.displayData(0, filtered)
      this.setState({ totalLength: filtered.length })
    }
  }
  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              <h4>Polls</h4><br />
              { this.state.PollData && this.state.PollData.length > 0
              ? <div className='table-responsive'>
                <div>
                  <label> Search </label>
                  <input type='text' placeholder='Search Polls' className='form-control' onChange={this.searchPolls} />
                </div>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Descripton</th>
                      <th>Created at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                    this.state.PollData.map((poll, i) => (
                      <tr>
                        <td>{poll.platform}</td>
                        <td>{poll.statement}</td>
                        <td>{handleDate(poll.datetime)}</td>
                      </tr>
                    ))
                  }
                  </tbody>
                </table>
                <ReactPaginate previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={<a href=''>...</a>}
                  breakClassName={'break-me'}
                  pageCount={Math.ceil(this.state.totalLength / 4)}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
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
