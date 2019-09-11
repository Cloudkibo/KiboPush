/* eslint-disable no-undef */

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
      pageOwners: [],
      connectedUser: null
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
    this.dataLoaded = false
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
        let connectedUser = null
        let connectedUserIndex = nextProps.pageUsers.findIndex(pageUser => pageUser.connected)
        if (connectedUserIndex >= 0) {
            connectedUser = nextProps.pageUsers[connectedUserIndex].user._id 
        }
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
        this.setState({ connectedUser, currentPageOwner, pageOwners, totalLength: nextProps.pageSubscribers.length, pageSubscribersDataSorted })
        this.dataLoaded = true
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
        <div className='col-xl-12'>
            <div className='m-portlet m-portlet--full-height '>
            <div className='m-portlet__head'>
                <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                    <h3 className='m-portlet__head-text'>Companies</h3>
                </div>
                </div>
                <div className='m-portlet__head-tools'>
                <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                    <li className='nav-item m-tabs__item' style={{marginTop: '15px'}}>
                    <div className='m-input-icon m-input-icon--left'>
                        <input name='users_search' id='users_search' type='text' placeholder='Search Users...' className='form-control m-input m-input--solid' onChange={this.searchUser} />
                        <span className='m-input-icon__icon m-input-icon__icon--left'>
                        <span><i className='la la-search' /></span>
                        </span>
                    </div>
                    </li>
                    <li className=' nav-item m-tabs__item m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click' aria-expanded='true'>
                    <div id='target' ref={(b) => { this.target = b }} style={{marginTop: '18px', marginLeft: '10px', zIndex: 6}} className='align-center'>
                        <Link onClick={this.handleClick} style={{padding: 10 + 'px', cursor:'pointer'}}> <i className='flaticon flaticon-more' /> </Link>
                        <Popover
                        style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
                        placement='bottom'
                        target={this.target}
                        show={this.state.openPopover}
                        onHide={this.handleClose} >
                        <div>
                            <div>
                            <label style={{color: '#716aca'}}>Filters:</label>
                            <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.genderValue} onChange={this.onFilterByGender}>
                                <option key='Gender' value='' disabled>Filter by gender...</option>
                                <option key='GenderALL' value='all'>All</option>
                                {
                                this.state.genders.map((gender, i) => (
                                <option key={'Gender' + i} value={gender.value}>{gender.label}</option>
                                ))
                            }
                            </select>
                            <br />
                            <select className='custom-select' id='m_form_type' tabIndex='-98' value={this.state.localeValue} onChange={this.onFilterByLocale} style={{marginTop: '10px', width: '155px'}}>
                                <option key='' value='' disabled>Filter by Locale...</option>
                                <option key='ALL' value='all'>ALL</option>
                                {
                                this.props.locales && this.props.locales.map((locale, i) => (
                                <option key={i} value={locale}>{locale}</option>
                                ))
                            }
                            </select>
                            </div>
                            <br />
                            <div>
                            <label style={{color: '#716aca'}}>Actions:</label>
                            <br />
                            <i className='la la-download' />&nbsp;<a onClick={this.getFile} className='m-card-profile__email m-link' style={{cursor: 'pointer'}}>
                            Download Data
                            </a>
                            <br />
                            <i className='la la-envelope-o' />&nbsp;<a onClick={this.sendEmail} className='m-card-profile__email m-link' style={{cursor: 'pointer', marginTop: '5px'}}>
                            Send Weekly Email
                            </a>
                            <br />
                            </div>
                        </div>
                        </Popover>
                    </div>
                    </li>
                </ul>
                </div>
            </div>
            <div className='m-portlet__body'>
                <div className='tab-content'>
                <div className='tab-pane active m-scrollable' role='tabpanel'>
                    <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                    <div style={{height: '393px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                        <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                        <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                            <div className='tab-pane active' id='m_widget5_tab1_content' aria-expanded='true'>
                            {
                                this.state.companyData && this.state.companyData.length > 0
                                ? <div className='m-widget5'>
                                { this.state.companyData.map((user, i) => (
                                    <div className='m-widget5__item' key={i} style={{borderBottom: '.07rem dashed #ebedf2'}}>
                                    <div className='m-widget5__pic'>
                                        <img className='m-widget7__img' alt='pic' src={(user.facebookInfo) ? user.facebookInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} style={{height: '100px', borderRadius: '50%', width: '7rem'}} />
                                    </div>
                                    <div className='m-widget5__content'>
                                        <h4 className='m-widget5__title'>
                                        {user.name}
                                        </h4>
                                        {user.email &&
                                        <span className='m-widget5__desc'>
                                        <b>Email:</b> {user.email}
                                        </span>
                                        }
                                        <br />
                                        <span className='m-widget5__desc'>
                                        <b>Created At:</b> {this.handleDate(user.createdAt)}
                                        </span>
                                        <div className='m-widget5__info'>
                                        <span className='m-widget5__author'>
                                            Gender:&nbsp;
                                        </span>
                                        <span className='m-widget5__info-author m--font-info'>
                                            {user.facebookInfo ? user.facebookInfo.gender : ''}
                                        </span>
                                        <span className='m-widget5__info-label'>
                                        Locale:&nbsp;
                                        </span>
                                        <span className='m-widget5__info-author m--font-info'>
                                            {user.facebookInfo ? user.facebookInfo.locale : ''}
                                        </span>
                                        </div>
                                    </div>
                                    <div className='m-widget5__stats1'>
                                        <span className='m-widget5__number'>
                                        {user.pages}
                                        </span>
                                        <br />
                                        <span className='m-widget5__sales'>
                                        Connected Pages
                                        </span>
                                    </div>
                                    <div className='m-widget5__stats2'>
                                        <span className='m-widget5__number'>
                                        {user.subscribers}
                                        </span>
                                        <br />
                                        <span className='m-widget5__votes'>
                                        Total Subscribers
                                        </span>
                                    </div>
                                    <div className='m-widget5__stats2'>
                                        <br />
                                        <span className='m-widget5__votes'>
                                        <button onClick={() => this.goToBroadcasts(user)} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                        See more
                                        </button>
                                        </span>
                                    </div>
                                    </div>
                                    ))}
                                </div>
                                : <div>No Data to display</div>
                                }
                            {this.state.companyData.length < this.props.count &&
                            <center>
                                <i className='fa fa-refresh' style={{color: '#716aca'}} />&nbsp;
                                <a id='assignTag' className='m-link' style={{color: '#716aca', cursor: 'pointer', marginTop: '20px'}} onClick={this.loadMore}>Load More</a>
                            </center>
                            }
                            </div>
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
