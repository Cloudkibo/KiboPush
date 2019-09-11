/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadPageUsers, loadPageAdmins } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class PageAdmins extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pageAdmins: [],
      pageAdminData: [],
      totalLength: 0,
      pageNumber: 0,
      searchValue: '',
      kiboValue: '',
      emailValue: ''
    }
    props.loadPageUsers({
      pageId: this.props.location.state.pageId,
      search_value: '',
      connected_filter: '',
      type_filter: '',
      admin_filter: true
    })
    props.loadPageAdmins(this.props.location.state.pageId)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.onNameSearch = this.onNameSearch.bind(this)
    this.onKiboFilter = this.onKiboFilter.bind(this)
    this.onEmailSearch = this.onEmailSearch.bind(this)
    this.applyNecessaryFilters = this.applyNecessaryFilters.bind(this)
    this.applyNameFilter = this.applyNameFilter.bind(this)
    this.applyKiboFilter = this.applyKiboFilter.bind(this)
    this.applyEmailFilter = this.applyEmailFilter.bind(this)
  }

  onNameSearch (event) {
      this.setState({searchValue: event.target.value}, () => {
          this.applyNecessaryFilters()
      })
  }

  onEmailSearch (event) {
    this.setState({emailValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
}

  onKiboFilter (event) {
    this.setState({kiboValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
}

  
  applyNameFilter (data, search) {
    return data.filter(x => x.name.includes(search))
  }
  
  applyEmailFilter (data, search) {
    return data.filter(x => x.email && x.email.includes(search))
  }

  applyKiboFilter (data, search) {
    return data.filter(x => {
        if (search === 'onKiboPush') {
            return !!x.email
        } else if (search === 'offKiboPush') {
            return !x.email
        }
    })
  }

  applyNecessaryFilters() {
    //debugger;
    let filteredData = this.state.pageAdmins
    let filter = false
    if (this.state.searchValue !== '') {
      filteredData = this.applyNameFilter(filteredData, this.state.searchValue)
      filter = true
    }
    if (this.state.emailValue !== '') {
      filteredData = this.applyEmailFilter(filteredData, this.state.emailValue)
      filter = true
    }
    if (this.state.kiboValue !== '' && this.state.kiboValue !== 'all') {
      filteredData = this.applyKiboFilter(filteredData, this.state.kiboValue)
      filter = true
    }

    console.log('after applying filters', filteredData)
    this.setState({filteredData, filter, totalLength: filteredData.length})
    this.displayData(0, filteredData)
  }   

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  componentDidMount () {
    this.scrollToTop()

    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Page Users`
  }

  displayData (n, pageUsers) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > pageUsers.length) {
      limit = pageUsers.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pageUsers[i]
      index++
    }
    this.setState({pageAdminData: data})
  }

  handlePageClick (data) {
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.pageUsers)
  }

  unique(array) {
    return array.filter((e, i) => array.findIndex(a => a.user.facebookInfo.fbId === e.user.facebookInfo.fbId) === i);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.pageUsers) {
        if (nextProps.pageAdmins) {
            let uniquePageAdmins = this.unique(nextProps.pageUsers)
            let pageAdmins = []
            for (let i = 0; i < nextProps.pageAdmins.length; i++) {
                for (let j = 0; j < uniquePageAdmins.length; j++) {
                    if (nextProps.pageAdmins[i].name === uniquePageAdmins[j].user.facebookInfo.name) {
                        pageAdmins[i] = uniquePageAdmins[j].user.facebookInfo
                        break
                    }
                }
                if (!pageAdmins[i]) {
                    pageAdmins[i] = nextProps.pageAdmins[j]
                }
            }
            console.log('pageAdmins', pageAdmins)
            this.displayData(0, pageAdmins)
            this.setState({ totalLength: pageAdmins.length, pageAdmins })
        }
    }
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {this.props.location.state.pageName}&nbsp;&nbsp;&nbsp;
                        <span className='m-badge m-badge--wide m-badge--primary'>{this.state.pageAdmins.length} Admins</span>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div>
                    <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      
                    <div>
                        <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                            <input type='text' placeholder='Search by facebook name' className='form-control' value={this.state.searchValue} onChange={this.onNameSearch} />
                        </div>

                        <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                            <select className='custom-select' style={{width: '100%'}} value={this.state.kiboValue} onChange={this.onKiboFilter} >
                                <option value='' disabled>Filter by KiboPush status</option>
                                <option value='onKiboPush'>on KiboPush</option>
                                <option value='offKiboPush'>not on KiboPush</option>
                                <option value='all'>all</option>
                            </select>
                        </div>

                        <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                            <input type='text' placeholder='Search by email' className='form-control' value={this.state.emailValue} onChange={this.onEmailSearch} />
                        </div>

                    </div>
                      
                      
                      
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Facebook Name</span>
                          </th>
                          <th data-field='kibopush'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>On KiboPush</span>
                          </th>
                          <th data-field='email'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Email</span>
                          </th>
                        </tr>
                      </thead>

                      {
                          this.state.pageAdminData && this.state.pageAdminData.length > 0
                            ?                      
                             (<tbody className='m-datatable__body'>
                            {
                            this.state.pageAdminData.map((pageAdmin, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='name' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{width: '150px'}}>{pageAdmin.name}</span>
                                </td>
                                <td data-field='kibopush' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{width: '150px'}}>{pageAdmin.email ? 'True' : 'False'}</span>
                                </td>
                                <td data-field='email' className='m-datatable__cell--center m-datatable__cell'>
                                    <span>{pageAdmin.email ? pageAdmin.email :  '-'}</span>
                                </td>
                          </tr>
                            ))
                          }
                          </tbody>) : 
                          <span>
                            <h4 style={{margin: '20px', textAlign: 'center'}}> No Admins Found </h4>
                          </span>
                      }
                    </table>
                    <div className='pagination'>
                      <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        forcePage={this.state.pageNumber}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'} />
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pageUsers: (state.backdoorInfo.pageUsers),
    pageUsersCount: (state.backdoorInfo.pageUsersCount),
    pageAdmins: (state.backdoorInfo.pageAdmins)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPageUsers,
    loadPageAdmins
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageAdmins)
