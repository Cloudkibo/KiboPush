/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadSubscribersWithTags, loadPageUsers } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class PageSubscribersWithTags extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pageSubscribersData: [],
      totalLength: 0,
      pageNumber: 0,
      searchValue: '',
      unassignedTagsValue: '',
      assignedTagsValue: '',
      statusValue: '',
      filter: false,
      filteredData: [],
      pageOwners: []
    }
    props.loadSubscribersWithTags(this.props.location.state.pageId)
    props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: '',
        connected_filter: '',
        type_filter: '',
        admin_filter: ''
    })
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.onUserNameSearch = this.onUserNameSearch.bind(this)
    this.onAssignedTagsSearch = this.onAssignedTagsSearch.bind(this)
    this.onUnassignedTagsSearch = this.onUnassignedTagsSearch.bind(this)
    this.onStatusFilter = this.onStatusFilter.bind(this)
    this.applyNecessaryFilters = this.applyNecessaryFilters.bind(this)
    this.applyUserFilter = this.applyUserFilter.bind(this)
    this.applyAssignedFilter = this.applyAssignedFilter.bind(this)
    this.applyUnassignedFilter = this.applyUnassignedFilter.bind(this)
    this.applyStatusFilter = this.applyStatusFilter.bind(this)
    this.onPageOwnerSelect = this.onPageOwnerSelect.bind(this)
    console.log('this.props in pageSubscribersWithTags', this.props)
  }

  onPageOwnerSelect (event) {
      this.setState({currentPageOwner: event.target.value}, () => {
        this.applyNecessaryFilters()
      })
  }

  onUserNameSearch (event) {
      this.setState({searchValue: event.target.value}, () => {
          this.applyNecessaryFilters()
      })
  }

  onAssignedTagsSearch (event) {
      this.setState({assignedTagsValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
  }

  onUnassignedTagsSearch (event) {
      this.setState({unassignedTagsValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
  }

  onStatusFilter (event) {
      this.setState({statusValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
  }

  applyNecessaryFilters() {
    //debugger;
    let filteredData = this.state.pageSubscribersDataSorted[this.state.currentPageOwner]
    let filter = false
    if (this.state.searchValue !== '') {
      filteredData = this.applyUserFilter(filteredData, this.state.searchValue)
      filter = true
    }
    if (this.state.unassignedTagsValue !== '') {
      filteredData = this.applyUnassignedFilter(filteredData, this.state.unassignedTagsValue)
      filter = true
    }
    if (this.state.assignedTagsValue !== '') {
      filteredData = this.applyAssignedFilter(filteredData, this.state.assignedTagsValue)
      filter = true
    }
    if (this.state.statusValue !== '' && this.state.statusValue !== 'all') {
      console.log(`applying search filter ${this.state.searchValue} ${JSON.stringify(filteredData)}`)
      filteredData = this.applyStatusFilter(filteredData, this.state.statusValue)
      filter = true
    }
    console.log('after applying filters', filteredData)
    this.setState({filteredData, filter, totalLength: filteredData.length})
    this.displayData(0, filteredData)
  }   

  applyUserFilter (data, search) {
    return data.filter(x => x.subscriber.firstName.includes(search) || x.subscriber.lastName.includes(search))
  }

  applyAssignedFilter (data, search) {
    return data.filter(x => {
        for (let i = 0; i < x.assignedTags.length; i++) {
            let tagName = x.assignedTags[i].tag
            if (tagName.includes(search)) {
                return true
            }
        }
    })
  }

  applyUnassignedFilter (data, search) {
    return data.filter(x => {
        for (let i = 0; i < x.unassignedTags.length; i++) {
            let tagName = x.unassignedTags[i].tag
            if (tagName.includes(search)) {
                return true
            }
        }
    })
  }

  applyStatusFilter (data, search) {
    return data.filter(x => {
        if (search === 'correct') {
            return x.unassignedTags.length === 0
        } else if (search === 'incorrect') {
            return x.unassignedTags.length > 0
        }
    })
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

    document.title = `${title} | Page Subscribers Tags`
    //this.displayData(0, this.props.pageSubscribers)
  }

  displayData (n, pageSubscribers) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > pageSubscribers.length) {
      limit = pageSubscribers.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pageSubscribers[i]
      index++
    }
    this.setState({pageSubscribersData: data})
  }

  handlePageClick (data) {
    this.setState({pageNumber: data.selected})
    if (!this.state.filter) {
        this.displayData(data.selected, this.props.pageSubscribers)
    } else {
        this.displayData(data.selected, this.state.filteredData)
    }
  }

  unique(array, propertyName) {
    return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
  }

  componentWillReceiveProps (nextProps) {
    let pageSubscribersDataSorted = {}
    if (nextProps.pageSubscribers) {
      console.log('nextProps.pageSubscribers', nextProps.pageSubscribers)
      if (nextProps.pageUsers) {
        let pageOwners = nextProps.pageUsers.map(pageUser => pageUser.user)
        for (let i = 0; i < pageOwners.length; i++) {
            pageSubscribersDataSorted[pageOwners[i]._id] = nextProps.pageSubscribers.filter(sub => sub.subscriber.pageOwner._id === pageOwners[i]._id)
        }
        console.log('pageSubscribersData sorted', pageSubscribersDataSorted)
        console.log('pageOwners', pageOwners)
        let currentPageOwner = ''
        if (pageOwners.length > 0) {
            for (let i = 0; i < pageOwners.length; i++) {
                if (pageSubscribersDataSorted[pageOwners[i]._id] && pageSubscribersDataSorted[pageOwners[i]._id].length > 0) {
                    currentPageOwner = pageOwners[i]._id
                }
            }
            if (currentPageOwner === '') {
                currentPageOwner = pageOwners[0]._id
            }
          this.displayData(0, pageSubscribersDataSorted[currentPageOwner])
        } else {
          this.displayData(0, [])
        }
        this.setState({ currentPageOwner, pageOwners, totalLength: nextProps.pageSubscribers.length, pageSubscribersDataSorted })
      }
    }
    // if (nextProps.pageUsers) {
    //     if (!pageSubscribersDataSorted) {
    //         pageSubscribersDataSorted = this.state.pageSubscribersDataSorted
    //     }
    //     for (let i = 0; i < nextProps.pageUsers.length; i++) {
    //         if (!pageSubscribersDataSorted[nextProps.pageUsers.user._id]) {
    //             pageSubscribersDataSorted[nextProps.pageUsers.user._id] = []
    //         }
    //     }
    //     for (let i = 0; i < )
    //     this.setState({ pageSubscribersDataSorted })
    // }
  }

  render () {
    console.log('pageSubscribersWithTags state', this.state)
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
                    <div style={{marginTop: '30px'}} className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {this.props.location.state.pageName} Subscribers
                        <span className="m-badge m-badge--brand m-badge--wide" style={{marginBottom: '5px', display: 'inline', marginLeft: '10px', display: 'inline', fontSize: '0.8em'}}>{this.state.pageSubscribersData.length} Subscribers</span>
                        
                        <div style={{marginTop: '20px'}} className="panel-group" id="accordion">
                            <div className="panel panel-default">
                              <div id={`panel-heading`} className="panel-heading">
                                <h4 className="panel-title" style={{fontSize: '22px'}}>
                                  <a data-toggle="collapse" data-parent="#accordion" href={`#collapse`}>Summary</a>
                                </h4>
                              </div>
                              <div id={`collapse`} className={"panel-collapse collapse"}>
                                <div className="panel-body">
                                    <div style={{maxHeight: '200px', overflowY: 'scroll', fontSize: '0.8em', border: 'solid black 1px', padding: '10px', marginBottom: '10px'}}>
                                        {
                                            this.state.pageOwners.map(pageOwner => {
                                                return (<p><a style={{cursor: 'pointer'}} onClick={() => this.onPageOwnerSelect({target: {value: pageOwner._id}})}>{pageOwner.name}</a>: 
                                                            <span className="m-badge m-badge--brand m-badge--wide" style={{marginBottom: '5px', display: 'inline', marginLeft: '10px', display: 'inline'}}>
                                                                {this.state.pageSubscribersDataSorted[pageOwner._id].length} subscribers
                                                            </span>
                                                        </p>)
                                            })
                                        }
                                    </div> 
                                    <p style={{marginTop: '20px', fontSize: '1em'}}>Total: 
                                        <span className="m-badge m-badge--brand m-badge--wide" style={{fontSize: '1em', marginBottom: '5px', display: 'inline', marginLeft: '10px', display: 'inline'}}>
                                            {this.props.pageSubscribers && this.props.pageSubscribers.length} subscribers
                                        </span>
                                    </p>
                                </div>
                              </div>
                            </div>
                          </div>  

                        {/* <p style={{marginTop: '15px', fontSize: '0.9em'}}>Summary:</p>
                        <div style={{fontSize: '0.7em', border: 'solid black 1px', padding: '10px', marginBottom: '10px'}}>
                            {
                                this.state.pageOwners.map(pageOwner => {
                                    return (<p>{pageOwner.name}: 
                                                <span className="m-badge m-badge--brand m-badge--wide" style={{marginBottom: '5px', display: 'inline', marginLeft: '10px', display: 'inline'}}>
                                                    {this.state.pageSubscribersDataSorted[pageOwner._id].length} subscribers
                                                </span>
                                            </p>)
                                })
                            }
                        </div> */}
                      </h3>
                    

                        
                      <div style={{textAlign: 'right', marginBottom: '30px', marginTop: '30px', marginLeft: '400px'}}>
                        <h6 style={{marginRight: '30px'}}>Select Page Owner:</h6>
                        <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.currentPageOwner} onChange={this.onPageOwnerSelect}>
                            <option value='' disabled>Select Page Owner</option>
                            {
                                this.state.pageOwners.map(pageOwner => <option value={pageOwner._id}>{pageOwner.name}</option>)
                            }
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div>
                    <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      
                    <div className='form-row'>
                    <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <input type='text' placeholder='Search by user name' className='form-control' value={this.state.searchValue} onChange={this.onUserNameSearch} />
                    </div>
                    <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <input type='text' placeholder='Search assigned tags' className='form-control' value={this.state.assignedTagsValue} onChange={this.onAssignedTagsSearch} />
                    </div>

                    <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <input type='text' placeholder='Search unassigned tags' className='form-control' value={this.state.unassignedTagsValue} onChange={this.onUnassignedTagsSearch} />
                    </div>

                    <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <select className='custom-select' style={{width: '100%'}} value={this.state.statusValue} onChange={this.onStatusFilter} >
                        <option value='' disabled>Filter by status</option>
                        <option value='correct'>correct</option>
                        <option value='incorrect'>incorrect</option>
                        <option value='all'>all</option>
                      </select>
                    </div>
                    </div>
                      
                      
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>User Name</span>
                          </th>
                          <th data-field='assignedTags'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Assigned Tags</span>
                          </th>
                          <th data-field='unassignedTags'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Unassigned Tags</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Status</span>
                          </th>
                        </tr>
                      </thead>

                      { this.state.pageSubscribersData && this.state.pageSubscribersData.length > 0
                        ? (<tbody className='m-datatable__body'>
                        {
                        this.state.pageSubscribersData.map((pageSubscriber, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px', border: 'solid #F4F3FB'}} key={i}>
                            <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{pageSubscriber.subscriber.firstName + ' ' + pageSubscriber.subscriber.lastName}</span></td>
                            <td data-field='assignedTags' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{maxHeight: '150px', width: '150px', overflowY: 'scroll'}}> 
                                    {
                                        pageSubscriber.assignedTags.map(tag => {
                                            return (<span className="m-badge m-badge--brand m-badge--wide" style={{marginBottom: '5px', display: 'block', marginRight: '10px'}}>{tag.tag}</span>)
                                        })
                                    } 
                                </span>
                            </td>
                            <td data-field='unassignedTags' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{maxHeight: '150px', width: '150px', overflowY: 'scroll'}}> 
                                    {
                                        pageSubscriber.unassignedTags.map(tag => {
                                            return (<span className="m-badge m-badge--brand m-badge--wide" style={{marginBottom: '5px', display: 'block', marginRight: '10px'}}>{tag.tag}</span>)
                                        })
                                    } 
                                </span>
                            </td>
                            <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{width: '100px'}}>
                                    {
                                        pageSubscriber.unassignedTags.length > 0 
                                        ? <span className="m-badge  m-badge--danger m-badge--wide" style={{marginBottom: '5px', display: 'block'}}>Incorrect</span>
                                        : <span className="m-badge  m-badge--success m-badge--wide" style={{marginBottom: '5px', display: 'block'}}>Correct</span>
                                    }
                                </span>
                            </td>
                          </tr>
                        ))
                      }
                      </tbody>) : 
                      <span>
                            <h4 style={{margin: '20px', textAlign: 'center'}}> No Subscribers Found </h4>
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
  //console.log(state.backdoorInfo.subscribersWithTags)
  return {
    pageSubscribers: (state.backdoorInfo.subscribersWithTags),
    pageUsers: (state.backdoorInfo.pageUsers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadSubscribersWithTags,
    loadPageUsers
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageSubscribersWithTags)
