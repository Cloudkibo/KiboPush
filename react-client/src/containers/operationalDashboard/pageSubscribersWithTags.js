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
      pageSubscribersDataSorted: {},
      totalSubscribers: 0,
      totalLength: 0,
      pageNumber: 0,
      searchValue: '',
      unassignedTagsValue: '',
      assignedTagsValue: '',
      statusValue: '',
      filter: false,
      filteredData: [],
      pageOwners: [],
      currentPageOwner: '',
      connectedUser: null
    }
    // props.loadSubscribersWithTags({
    //     pageId: this.props.location.state.pageId,
    //     subscriberName: this.state.searchValue,
    //     unassignedTag: this.state.unassignedTagsValue,
    //     assignedTag: this.state.assignedTagsValue,
    //     status: this.state.statusValue,
    //     pageNumber: 1
    // })
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
    this.getDataMessage = this.getDataMessage.bind(this)
    this.dataLoaded = false
    this.usersLoaded = false
  }

  onPageOwnerSelect (event) {
      console.log('changing pageOwner', event.target.value)
      this.usersLoaded = true
      this.setState({currentPageOwner: event.target.value, pageNumber: 0}, () => {
        this.applyNecessaryFilters()
      })
  }

  onUserNameSearch (event) {
      this.setState({searchValue: event.target.value, pageNumber: 0}, () => {
          this.applyNecessaryFilters()
      })
  }

  onAssignedTagsSearch (event) {
      this.setState({assignedTagsValue: event.target.value, pageNumber: 0}, () => {
        this.applyNecessaryFilters()
    })
  }

  onUnassignedTagsSearch (event) {
      this.setState({unassignedTagsValue: event.target.value, pageNumber: 0}, () => {
        this.applyNecessaryFilters()
    })
  }

  onStatusFilter (event) {
      this.setState({statusValue: event.target.value, pageNumber: 0}, () => {
        this.applyNecessaryFilters()
    })
  }

  applyNecessaryFilters() {
    //debugger;
    this.props.loadSubscribersWithTags({
        pageId: this.props.location.state.pageId,
        pageOwner: this.state.currentPageOwner,
        subscriberName: this.state.searchValue,
        unassignedTag: this.state.unassignedTagsValue,
        assignedTag: this.state.assignedTagsValue,
        status: this.state.statusValue !== 'all' ? this.state.statusValue : '',
        pageNumber: this.state.pageNumber+1
    })
  }   

  applyUserFilter (data, search) {
    return data.filter(x => (x.subscriber.firstName).toLowerCase().includes(search.toLowerCase()) || (x.subscriber.lastName).toLowerCase().includes(search.toLowerCase()))
  }

  applyAssignedFilter (data, search) {
    return data.filter(x => {
        for (let i = 0; i < x.assignedTags.length; i++) {
            let tagName = x.assignedTags[i].tag
            if (tagName.toLowerCase().includes(search.toLowerCase())) {
                return true
            }
        }
    })
  }

  applyUnassignedFilter (data, search) {
    return data.filter(x => {
        for (let i = 0; i < x.unassignedTags.length; i++) {
            let tagName = x.unassignedTags[i].tag
            if (tagName.toLowerCase().includes(search.toLowerCase())) {
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
    this.setState({pageNumber: data.selected}, () => {
        this.applyNecessaryFilters()
    })
  }

  unique(array, propertyName) {
    return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.pageSubscribers) {
        this.dataLoaded = true
        if (nextProps.pageSubscribers.length === 0) {
            this.setState({ pageSubscribersData: [], totalLength: 0 })
        } else {
            this.setState({ pageSubscribersData: nextProps.pageSubscribers.subscriberData, totalLength: nextProps.pageSubscribers.totalSubscribers })
        }
    }
    if (nextProps.pageUsers) {
        console.log('recieved page users', nextProps.pageUsers)
        let pageSubscribersDataSorted = this.state.pageSubscribersDataSorted
        let totalSubscribers = 0
        let connectedUser = this.state.connectedUser
        for (let i = 0; i < nextProps.pageUsers.length; i++) {
            let pageUser = nextProps.pageUsers[i]
            if (pageUser.connected) {
                connectedUser = pageUser.user._id
            }
            totalSubscribers += pageUser.subscribers.length
            pageSubscribersDataSorted[pageUser.user._id] = pageUser.subscribers
        }
        let pageOwners = nextProps.pageUsers.map(pageUser => pageUser.user)
        this.setState({connectedUser, totalSubscribers, pageOwners, pageSubscribersDataSorted})
    }
  }

  getDataMessage () {
      if (this.usersLoaded) {
          if (!this.dataLoaded) {
            return 'Loading subscribers'
          } else {
              if (this.state.pageSubscribersData.length === 0) {
                  return 'No subscribers found'
              }
          }
      } else {
          return 'Please select a page owner'
      }
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
                        <span className="m-badge m-badge--brand m-badge--wide" style={{marginBottom: '5px', display: 'inline', marginLeft: '10px', display: 'inline', fontSize: '0.8em'}}>{this.state.pageSubscribersDataSorted[this.state.currentPageOwner] && this.state.pageSubscribersDataSorted[this.state.currentPageOwner].length} Subscribers</span>
                        
                        <div style={{marginTop: '20px', width: '440px'}} className="panel-group" id="accordion">
                            <div className="panel panel-default">
                              <div id={`panel-heading`} className="panel-heading">
                                <h4 className="panel-title" style={{fontSize: '22px', textAlign: 'center'}}>
                                  <a data-toggle="collapse" data-parent="#accordion" href={`#collapse`}>Summary</a>
                                </h4>
                              </div>
                              <div id={`collapse`} className={"panel-collapse collapse"}>
                                <div className="panel-body">
                                    <div style={{maxHeight: '200px', width: '400px', overflowY: 'scroll', fontSize: '0.8em', border: 'solid darkgray 1px', padding: '10px', marginBottom: '10px'}}>
                                        {
                                            this.state.pageOwners.length > 0 && this.state.pageOwners.map(pageOwner => {
                                                return (<p><a style={{cursor: 'pointer', color: pageOwner._id === this.state.connectedUser ? 'green' : ''}} onClick={() => this.onPageOwnerSelect({target: {value: pageOwner._id}})}>{pageOwner.email}</a>: 
                                                            <span className="m-badge m-badge--brand m-badge--wide" style={{marginBottom: '5px', display: 'inline', marginLeft: '10px', display: 'inline'}}>
                                                                {this.state.pageSubscribersDataSorted && this.state.pageSubscribersDataSorted[pageOwner._id].length} subscribers
                                                            </span>
                                                        </p>)
                                            })
                                        }
                                    </div> 
                                    <p style={{marginTop: '20px', fontSize: '1em'}}>Total: 
                                        <span className="m-badge m-badge--brand m-badge--wide" style={{fontSize: '1em', marginBottom: '5px', display: 'inline', marginLeft: '10px', display: 'inline'}}>
                                            {this.state.totalSubscribers} subscribers
                                        </span>
                                    </p>
                                </div>
                              </div>
                            </div>
                          </div>  
                      </h3>
                    

                        
                      <div style={{textAlign: 'right', marginBottom: '30px', marginTop: '30px', marginLeft: '150px'}}>
                        <h6 style={{marginRight: '140px'}}>Select Page Owner:</h6>
                        <select style={{width: '280px'}} className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.currentPageOwner} onChange={this.onPageOwnerSelect}>
                            <option value='' disabled>Select Page Owner</option>
                            {
                                this.state.pageOwners.map(pageOwner => <option value={pageOwner._id}>{pageOwner.email}</option>)
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
                      

                    {this.state.currentPageOwner && 
                        <div>
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
                    }
                      
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
                            <h4 style={{margin: '20px', textAlign: 'center'}}> {this.getDataMessage()} </h4>
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
