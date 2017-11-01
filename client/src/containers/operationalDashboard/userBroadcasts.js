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
    if (event.target.value !== '') {
      for (let i = 0; i < this.props.broadcasts.length; i++) {
        if (this.props.broadcasts[i].title && this.props.broadcasts[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
          filtered.push(this.props.broadcasts[i])
        }
      }
    } else {
      filtered = this.props.broadcasts
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }
  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              <h4>Broadcasts</h4><br />
              { this.props.broadcasts && this.props.broadcasts.length > 0
              ? <div className='table-responsive'>
                <div>
                  <label> Search </label>
                  <input type='text' placeholder='Search Broadcasts' className='form-control' onChange={this.searchBroadcast} />
                </div>
                {
                  this.state.broadcastsData && this.state.broadcastsData.length > 0
                  ? <div>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Title</th>
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
                              <td>{broadcast.title ? broadcast.title : ''}</td>
                              <td>{broadcast.payload && broadcast.payload.length > 0 ? broadcast.payload[0].componentType : broadcast.payload ? broadcast.payload.componentType : broadcast.type}</td>
                              <td>{broadcast.payload && broadcast.payload.length > 0 && broadcast.payload[0].componentType === 'text' ? broadcast.payload[0].text : broadcast.text ? broadcast.text : ''}</td>
                              <td>{handleDate(broadcast.datetime)}</td>
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
