import React from 'react'
import PropTypes from 'prop-types'
import DropdownItem from './dropdownItem'

class Header extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      typingInterval: 1000,
      filterSearch: this.props.filterSearch
    }
    console.log('Header constructor')
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handlePageFilter = this.handlePageFilter.bind(this)
    this.handleUnreadFilter = this.handleUnreadFilter.bind(this)
    this.handlePendingFilter = this.handlePendingFilter.bind(this)
    this.removeFilters = this.removeFilters.bind(this)
  }

  removeFilters () {
      if (this.state.filterSearch) {
          this.setState({filterSearch: ''})
      }
      this.props.removeFilters()
  }

  componentDidMount () {
    let typingTimer
    let doneTypingInterval = this.state.typingInterval
    let input = document.getElementById(`generalSearch`)
    input.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(() => {
          this.props.updateFilterSearch(this.state.filterSearch)
      }, doneTypingInterval)
    })
    input.addEventListener('keydown', () => {clearTimeout(typingTimer)})
  }

  showDropDown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
  }

  handleSearch (e) {
    this.setState({filterSearch: e.target.value})
  }

  handleSort (value) {
    this.props.updateFilterSort(value)
  }

  handlePageFilter (value) {
    if (value === this.props.filterPage) {
        this.props.updateFilterPage('')
    } else {
        this.props.updateFilterPage(value)
    }
  }

  handlePendingFilter () {
    this.props.updateFilterPending(!this.props.filterPending)
  }

  handleUnreadFilter () {
    this.props.updateFilterUnread(!this.props.filterUnread)
  }

  render () {
    return (
      <div className='m-portlet__head'>
        <div style={{paddingTop: '20px'}} className='row'>
          <div className='col-md-10'>
            <div className='m-input-icon m-input-icon--left'>
              <input type='text' value={this.state.filterSearch} onChange={this.handleSearch} className='form-control m-input m-input--solid' placeholder='Search...' id='generalSearch' />
              <span className='m-input-icon__icon m-input-icon__icon--left'>
                <span><i className='la la-search' /></span>
              </span>
            </div>
          </div>
          <div style={{paddingLeft: 0}} className='col-md-2'>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <a href='#/' className='m-portlet__nav-link m-portlet__nav-link--icon m-dropdown__toggle'>
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
                                <DropdownItem
                                    selected={this.props.filterSort === 1}
                                    option='Oldest to Newest'
                                    action={() => this.handleSort(1)} 
                                />

                                <DropdownItem
                                    selected={this.props.filterSort === -1}
                                    option='Newest to Oldest'
                                    action={() => this.handleSort(-1)} 
                                />

                              <li className='m-nav__section m-nav__section--first'>
                                <span className='m-nav__section-text'>
                                  Filter by:
                                </span>
                              </li>
                             
                                <DropdownItem
                                    selected={this.props.filterUnread}
                                    option='Unread Messages'
                                    action={() => this.handleUnreadFilter()} 
                                />

                                <DropdownItem
                                    selected={this.props.filterPending}
                                    option='Pending Sessions'
                                    action={() => this.handlePendingFilter()} 
                                />

                              {
                                this.props.pages.map((page, i) => (
                                    <DropdownItem
                                        selected={page._id === this.props.filterPage}
                                        option={page.pageName}
                                        action={() => this.handlePageFilter(page._id)} 
                                    />
                                ))
                              }
                            { (this.props.filterPage !== '' || this.props.filterUnread !== '' || this.props.filterPending !== '') &&
                            <li className='m-nav__item'>
                              <span onClick={this.removeFilters} style={{borderColor: '#f4516c', color: '#f4516c'}} 
                                className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
                                    Remove Filters
                              </span>
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

Header.propTypes = {
  'pages': PropTypes.array.isRequired,
  'filterPage': PropTypes.string.isRequired,
  'filterSort': PropTypes.number.isRequired,
  'filterSearch': PropTypes.string.isRequired,
  'filterPending': PropTypes.bool.isRequired,
  'filterUnread': PropTypes.bool.isRequired,
  'updateFilterPage': PropTypes.func.isRequired,
  'updateFilterSort': PropTypes.func.isRequired,
  'updateFilterSearch': PropTypes.func.isRequired,
  'updateFilterPending': PropTypes.func.isRequired,
  'updateFilterUnread': PropTypes.func.isRequired,
  'removeFilters': PropTypes.func.isRequired
}

export default Header
