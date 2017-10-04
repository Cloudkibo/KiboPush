import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadBroadcastsList } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
class BroadcastsInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('constructor', props.userID)
    props.loadBroadcastsList(props.userID)
    this.state = {
      broadcastsData: [],
      totalLength: 0
    }
    //  props.loadBroadcastsList(props.location.this.state)
    // this.submitSurvey = this.submitSurvey.bind(this);
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchBroadcast = this.searchBroadcast.bind(this)
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
    this.setState({broadcastsData: data})
    console.log('in displayData', this.state.broadcastsData)
  }
  handlePageClick (data) {
    this.displayData(data.selected, this.props.broadcasts)
  }
  componentWillReceiveProps (nextProps) {
    console.log('userbroadcasts componentWillReceiveProps is called')
    if (nextProps.broadcasts) {
      console.log('Broadcasts Updated', nextProps.broadcasts)
      this.displayData(0, nextProps.broadcasts)
      this.setState({ totalLength: nextProps.broadcasts.length })
    }
  }
  searchBroadcast (event) {
    var filtered = []
    for (let i = 0; i < this.props.broadcasts.length; i++) {
      if (this.props.broadcasts[i].text.toLowerCase().includes(event.target.value) || this.props.broadcasts[i].text.toUpperCase().includes(event.target.value) || this.props.broadcasts[i].text.includes(event.target.value)) {
        filtered.push(this.props.broadcasts[i])
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
              <h4>Broadcasts</h4><br />
              { this.state.broadcastsData && this.state.broadcastsData.length > 0
              ? <div className='table-responsive'>
                <div>
                  <label> Search </label>
                  <input type='text' placeholder='Search Broadcasts' className='form-control' onChange={this.searchBroadcast} />
                </div>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Type</th>
                      <th>Text</th>
                      <th>Created At</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {
                    this.state.broadcastsData.map((broadcast, i) => (
                      <tr>
                        <td>{broadcast.platform}</td>
                        <td>{broadcast.type}</td>
                        <td>{broadcast.text}</td>
                        <td>{handleDate(broadcast.datetime)}</td>
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
  console.log('user broadcasts', state)
  return {
    broadcasts: state.BroadcastsInfo.broadcasts
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadBroadcastsList: loadBroadcastsList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(BroadcastsInfo)
