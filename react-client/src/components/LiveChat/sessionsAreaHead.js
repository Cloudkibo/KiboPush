import React from 'react'
import PropTypes from 'prop-types'

class SessionsAreaHead extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      filter: false,
      searchValue: '',
      pageValue: '',
      sortValue: -1,
      unreadMessages: false,
      pendingResponse: false
    }
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handlePageFilter = this.handlePageFilter.bind(this)
    this.handleUnreadFilter = this.handleUnreadFilter.bind(this)
    this.handlePendingFilter = this.handlePendingFilter.bind(this)
  }

  showDropDown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false, pageValue: '', unreadMessages: false, pendingResponse: false, filter: false})
    let data = {
      first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter: false,
      filter_criteria: {
        sort_value: this.state.sortValue,
        page_value: '',
        search_value: this.state.searchValue,
        pendingResponse: false,
        unreadMessages: false
      }
    }
    if (this.props.module === 'WHATSAPP') {
      data = {first_page: true,
        last_id: 'none',
        number_of_records: 10,
        filter: true,
        filter_criteria: {sort_value: this.state.sortValue, search_value: this.state.searchValue, pendingResponse: false, unreadCount: false}
      }
    }
    this.props.fetchSessions(data)
    this.props.updateState(data)
  }

  handleSearch (e) {
    let data = {
      first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter: true,
      filter_criteria: {
        sort_value: this.state.sortValue,
        page_value: this.state.pageValue,
        search_value: e.target.value.toLowerCase(),
        pendingResponse: this.state.pendingResponse,
        unreadMessages: this.state.unreadMessages
      }
    }
    if (this.props.module === 'WHATSAPP') {
      data = {first_page: true,
        last_id: 'none',
        number_of_records: 10,
        filter: true,
        filter_criteria: {sort_value: this.state.sortValue, search_value: e.target.value.toLowerCase(), pendingResponse: this.state.pendingResponse, unreadCount: this.state.unreadMessages}
      }
    }
    this.setState({searchValue: e.target.value.toLowerCase(), filter: true})
    this.props.fetchSessions(data)
    this.props.updateState(data)
  }

  handleSort (value) {
    // let data = {sortValue: value, filter: true}
    // this.setState(data)
    // this.props.updateState(data)
    // if (value === -1) {
    //   this.props.openSessions.sort(function (a, b) {
    //     return new Date(b.last_activity_time) - new Date(a.last_activity_time)
    //   })
    //   this.props.closeSessions.sort(function (a, b) {
    //     return new Date(b.last_activity_time) - new Date(a.last_activity_time)
    //   })
    // } else if (value === 1) {
    //   this.props.openSessions.sort(function (a, b) {
    //     return new Date(a.last_activity_time) - new Date(b.last_activity_time)
    //   })
    //   this.props.closeSessions.sort(function (a, b) {
    //     return new Date(a.last_activity_time) - new Date(b.last_activity_time)
    //   })
    // }

    this.setState({sortValue: value, filter: true})
    let data = {
      first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter: true,
      filter_criteria: {
        sort_value: value,
        page_value: this.state.pageValue,
        search_value: this.state.searchValue,
        pendingResponse: this.state.pendingResponse,
        unreadMessages: this.state.unreadMessages
      }
    }
    if (this.props.module === 'WHATSAPP') {
      data = {first_page: true,
        last_id: 'none',
        number_of_records: 10,
        filter: true,
        filter_criteria: {sort_value: value, search_value: this.state.searchValue, pendingResponse: this.state.pendingResponse, unreadCount: this.state.unreadMessages}
      }
    }
    this.props.fetchSessions(data)
    this.props.updateState(data)

  }

  handlePageFilter (value) {
    if (value === this.state.pageValue) {
      this.setState({pageValue: '', filter: true})
      let data = {
        first_page: true,
        last_id: 'none',
        number_of_records: 10,
        filter: true,
        filter_criteria: {
          sort_value: this.state.sortValue,
          page_value: '',
          search_value: this.state.searchValue,
          pendingResponse: this.state.pendingResponse,
          unreadMessages: this.state.unreadMessages
        }
      }
      this.props.fetchSessions(data)
      this.props.updateState(data)
    } else {
      let data = {
        first_page: true,
        last_id: 'none',
        number_of_records: 10,
        filter: true,
        filter_criteria: {
          sort_value: this.state.sortValue,
          page_value: value,
          search_value: this.state.searchValue,
          pendingResponse: this.state.pendingResponse,
          unreadMessages: this.state.unreadMessages
        }
      }
      this.setState({pageValue: value, filter: true})
      this.props.fetchSessions(data)
      this.props.updateState(data)
    }
  }

  handlePendingFilter (e) {
    this.setState({pendingResponse: e, filter: true})
    let data = {
      first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter: true,
      filter_criteria: {
        sort_value: this.state.sortValue,
        page_value: this.state.pageValue,
        search_value: this.state.searchValue,
        pendingResponse: e,
        unreadMessages: this.state.unreadMessages
      }
    }
    if (this.props.module === 'WHATSAPP') {
      data = {first_page: true,
        last_id: 'none',
        number_of_records: 10,
        filter: true,
        filter_criteria: {sort_value: this.state.sortValue, search_value: this.state.searchValue, pendingResponse: e, unreadCount: this.state.unreadMessages}
      }
    }
    this.props.fetchSessions(data)
    this.props.updateState(data)
  }

  handleUnreadFilter (e) {
    this.setState({unreadMessages: e, filter: true})
    let data = {
      first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter: true,
      filter_criteria: {
        sort_value: this.state.sortValue,
        page_value: this.state.pageValue,
        search_value: this.state.searchValue,
        pendingResponse: this.state.pendingResponse,
        unreadMessages: e
      }
    }
    if (this.props.module === 'WHATSAPP') {
      data = {first_page: true,
        last_id: 'none',
        number_of_records: 10,
        filter: true,
        filter_criteria: {sort_value: -1, search_value: '', pendingResponse: false, unreadCount: e}
      }
    }
    this.props.fetchSessions(data)
    this.props.updateState(data)
  }

  render () {
    return (
      <div className='m-portlet__head'>
        <div style={{paddingTop: '20px'}} className='row'>
          <div className='col-md-10'>
            <div className='m-input-icon m-input-icon--left'>
              <input type='text' onChange={this.handleSearch} className='form-control m-input m-input--solid' placeholder='Search...' id='generalSearch' />
              <span className='m-input-icon__icon m-input-icon__icon--left'>
                <span><i className='la la-search' /></span>
              </span>
            </div>
          </div>
          <div style={{paddingLeft: 0}} className='col-md-2'>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <a className='m-portlet__nav-link m-portlet__nav-link--icon m-dropdown__toggle'>
                    <i onClick={this.showDropDown} style={{cursor: 'pointer', fontSize: '40px'}} className='la la-ellipsis-h' />
                  </a>
                  {
                    this.state.showDropDown &&
                    <div className='m-dropdown__wrapper'>
                      <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                      <div className='m-dropdown__inner'>
                        <div className='m-dropdown__body'>
                          <div className='m-dropdown__content'>
                            <ul className='m-nav'>
                              <li className='m-nav__section m-nav__section--first'>
                                <span className='m-nav__section-text'>
                                  Sort By:
                                </span>
                              </li>
                              <li className='m-nav__item'>
                                <a onClick={() => this.handleSort(1)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  {
                                    this.state.sortValue === 1
                                    ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                      <i className='la la-check' /> Oldest to Newest
                                    </span>
                                    : <span className='m-nav__link-text'>
                                      Oldest to Newest
                                    </span>
                                  }
                                </a>
                              </li>
                              <li className='m-nav__item'>
                                <a onClick={() => this.handleSort(-1)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  {
                                    this.state.sortValue === -1
                                    ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                      <i className='la la-check' /> Newest to Oldest
                                    </span>
                                    : <span className='m-nav__link-text'>
                                      Newest to Oldest
                                    </span>
                                  }
                                </a>
                              </li>
                              <li className='m-nav__section m-nav__section--first'>
                                <span className='m-nav__section-text'>
                                  Filter by:
                                </span>
                              </li>
                              <li className='m-nav__item'>
                                <a onClick={() => this.handleUnreadFilter(this.state.unreadMessages ? false : true)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  {
                                    this.state.unreadMessages
                                    ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                      <i className='la la-check' /> Unread Messages
                                    </span>
                                    : <span className='m-nav__link-text'>
                                      Unread Messages
                                    </span>
                                  }
                                </a>
                              </li>
                              <li className='m-nav__item'>
                                <a onClick={() => this.handlePendingFilter(this.state.pendingResponse ? false : true)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  {
                                    this.state.pendingResponse
                                    ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                      <i className='la la-check' /> Pending Sessions
                                    </span>
                                    : <span className='m-nav__link-text'>
                                      Pending Sessions
                                    </span>
                                  }
                                </a>
                              </li>
                              {
                                this.props.pages.map((page, i) => (
                                  <li key={page.pageId} className='m-nav__item'>
                                    <a onClick={() => this.handlePageFilter(page._id)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                      {
                                        page._id === this.state.pageValue
                                        ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                          <i className='la la-check' /> {page.pageName}
                                        </span>
                                        : <span className='m-nav__link-text'>
                                          {page.pageName}
                                        </span>
                                      }
                                    </a>
                                  </li>
                                ))
                              }
                            { (this.state.pageValue !== '' || this.state.unreadMessages !== '' || this.state.pendingResponse !== '') &&
                            <li className='m-nav__item'>
                              <a onClick={this.hideDropDown} style={{borderColor: '#f4516c', color: '#f4516c'}} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
                                    Remove Filters
                              </a>
                            </li>
                            }
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SessionsAreaHead.propTypes = {
  'openSessions': PropTypes.array.isRequired,
  'closeSessions': PropTypes.array.isRequired,
  'pages': PropTypes.array.isRequired,
  'fetchSessions': PropTypes.func.isRequired,
  'updateState': PropTypes.func.isRequired
}

export default SessionsAreaHead
