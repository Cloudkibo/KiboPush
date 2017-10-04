import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router'
import { loadPageSubscribersList } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class PageSubscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    const pageName = this.props.params.pageName
    const id = this.props.params.id
    props.loadPageSubscribersList(id)
    this.state = {
      pageName: pageName,
      pageSubscribersData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
<<<<<<< HEAD
    this.backToUserDetails = this.backToUserDetails.bind(this)
  }
  backToUserDetails() {
    const user = this.props.currentUser
    console.log('back to user details', user, this.props)
    this.props.history.push({
      pathname: `/userDetails`,
      state: user
    })
=======
    this.searchSubscribers = this.searchSubscribers.bind(this)
>>>>>>> a2900c9d850358798db6722ee6a69519fdf5cd10
  }

  displayData (n, pageSubscribers) {
    console.log(n, pageSubscribers)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > pageSubscribers.length) {
      limit = pageSubscribers.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pageSubscribers[i]
      index++
    }
    console.log('data[index]', data)
    this.setState({pageSubscribersData: data})
    console.log('in displayData', this.state.pageSubscribersData)
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.pageSubscribers)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.pageSubscribers) {
      console.log('Page Subscribers Updated', nextProps.pageSubscribers)
      this.displayData(0, nextProps.pageSubscribers)
      this.setState({ totalLength: nextProps.pageSubscribers.length })
    }
  }
  searchSubscribers (event) {
    var filtered = []
    console.log('length', this.props.pageSubscribers)
    for (let i = 0; i < this.props.pageSubscribers.length; i++) {
      if (this.props.pageSubscribers[i].firstName.toLowerCase().includes(event.target.value.toLowerCase()) || this.props.pageSubscribers[i].lastName.toLowerCase().includes(event.target.value.toLowerCase())) {
        filtered.push(this.props.pageSubscribers[i])
      }
    }
    if (filtered && filtered.length > 0) {
      this.displayData(0, filtered)
      this.setState({ totalLength: this.state.pageSubscribersData.length })
    }
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

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <h3>{ this.state.pageName }</h3><br />
                  <h4>Subscribers List</h4>
                  { this.state.pageSubscribersData && this.state.pageSubscribersData.length > 0
                  ? <div className='table-responsive'>
                    <div>
                      <label> Search </label>
                      <input type='text' placeholder='Search Subscribers' className='form-control' onChange={this.searchSubscribers} />
                    </div>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Subscriber</th>
                          <th>Email</th>
                          <th>Gender</th>
                          <th>Locale</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {
                        this.state.pageSubscribersData.map((subscriber, i) => (
                          <tr>
                            <td>{subscriber.firstName}{' '}{subscriber.lastName}</td>
                            <td>{subscriber.email}</td>
                            <td>{subscriber.gender}</td>
                            <td>{subscriber.locale}</td>
                          </tr>
                        ))
                      }
                      </tbody>
                    </table>
                    <ReactPaginate previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a href=''>...</a>}
                      breakClassName={'break-me'}
                      pageCount={Math.ceil(this.state.totalLength / 5)}
                      marginPagesDisplayed={2}
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
<<<<<<< HEAD
              <div className='back-button' style={{float:'right', margin:2}}>
                <button className='btn btn-primary btn-sm' onClick={() => this.backToUserDetails()}>Back
                </button>
=======
              <div className='back-button' style={{float: 'right'}}>
                <Link className='btn btn-primary btn-sm'>Back
                </Link>
>>>>>>> a2900c9d850358798db6722ee6a69519fdf5cd10
              </div>
            </main>

          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('in mapStateToProps for pageSubscribers', state)
  return {
    pageSubscribers: (state.PageSubscribersInfo.pageSubscribers),
    currentUser : (state.getCurrentUser.currentUser)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadPageSubscribersList: loadPageSubscribersList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageSubscribers)
