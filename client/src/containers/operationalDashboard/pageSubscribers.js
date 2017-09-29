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
    const pageId = this.props.params.pageId
    const id = this.props.params.id

    props.loadPageSubscribersList(id)
    this.state = {
      pageSubscribersData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
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
            <h4>Subscribers List</h4>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  { this.state.pageSubscribersData && this.state.pageSubscribersData.length > 0
                  ? <div className='table-responsive'>
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
    pageSubscribers: state.PageSubscribersInfo.subscribers
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadPageSubscribersList: loadPageSubscribersList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageSubscribers)
