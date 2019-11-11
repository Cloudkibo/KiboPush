import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadUniquePages } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class UniquePages extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      filter: true,
      pageNumber: 1,
      showUniquePages: false,
      connectedFacebook: '',
      pageName: ''
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleFilterByFBConnected = this.handleFilterByFBConnected.bind(this)
    this.searchUniquePages = this.searchUniquePages.bind(this)
    this.toggle = this.toggle.bind(this)
    this.goToUsers = this.goToUsers.bind(this)
    this.goToPermissions = this.goToPermissions.bind(this)
    this.goToPageTags = this.goToPageTags.bind(this)
    this.goToPageAdmins = this.goToPageAdmins.bind(this)
    //this.props.loadUniquePages({pageNumber: 1, connectedFacebook: '', pageName: ''})
  }

  goToUsers (pageId, pageName) {
    this.props.browserHistory.push({
        pathname: '/backdoorPageUsers',
        state: {
          pageId: pageId,
          pageName: pageName
        }
      })
  }

  goToPageAdmins (pageId, pageName) {
    this.props.browserHistory.push({
        pathname: '/backdoorPageAdmins',
        state: {
          pageId: pageId,
          pageName: pageName
        }
      })
  }

  goToPermissions (pageId, pageName) {
    this.props.browserHistory.push({
        pathname: '/backdoorPagePermissions',
        state: {
          pageId: pageId,
          pageName: pageName
        }
      })
  }

  goToPageTags (pageId, pageName) {
    this.props.browserHistory.push({
        pathname: '/backdoorPageTags',
        state: {
            pageId: pageId,
            pageName: pageName
        }
      })
  }

  goToSubscribersWithTags (pageId, pageName) {
    this.props.browserHistory.push({
        pathname: '/backdoorPageSubscribersWithTags',
        state: {
            pageId: pageId,
            pageName: pageName
        }
      })
  }

  toggle () {
    this.props.loadUniquePages({pageNumber: 1, pageName: this.state.pageName, connectedFacebook: this.state.connectedFacebook})
    this.setState({showUniquePages: !this.state.showUniquePages})
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Unique Pages`
  }


  handlePageClick (data) {
    this.props.loadUniquePages({pageNumber: data.selected+1,  pageName: this.state.pageName, connectedFacebook: this.state.connectedFacebook})
    this.setState({pageNumber: data.selected+1})
  }

  searchUniquePages (event) {
    this.setState({pageName: event.target.value})
    if (event.target.value !== '') {
      this.props.loadUniquePages({pageName: event.target.value, connectedFacebook: this.state.connectedFacebook})
    } else {
      this.props.loadUniquePages({pageNumber: this.state.pageNumber, pageName: '', connectedFacebook: this.state.connectedFacebook})
    }
  }

  handleFilterByFBConnected (e) {
    if (e.target.value === 'true') {
      this.setState({connectedFacebook: true})
      this.props.loadUniquePages({pageName: this.state.pageName, connectedFacebook: true})
    } else if (e.target.value === 'false') {
      this.setState({connectedFacebook: false})
      this.props.loadUniquePages({pageName: this.state.pageName, connectedFacebook: false})
    } else {
      this.setState({connectedFacebook: ''})
      this.props.loadUniquePages({pageName: this.state.pageName, connectedFacebook: ''})
    }
  }

  render () {
    console.log('uniquePages state', this.state)
    return (
      <div className='row'>
        <div
          className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Pages and Permissions&nbsp;&nbsp;&nbsp;
                    {this.props.uniquePages && this.props.uniquePages.totalCount &&
                      <span className='m-badge m-badge--wide m-badge--primary'>{`${this.props.uniquePages.totalCount} Pages`}</span>
                    }
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                  <li className='nav-item m-tabs__item' />
                  <li className='nav-item m-tabs__item' />
                  <li className='m-portlet__nav-item'>
                    <a href='#/' data-portlet-tool='toggle' className='m-portlet__nav-link m-portlet__nav-link--icon' title='' data-original-title='Collapse' onClick={this.toggle}>
                      {this.state.showUniquePages
                      ? <i className='la la-angle-up' style={{cursor: 'pointer'}} />
                    : <i className='la la-angle-down' style={{cursor: 'pointer'}} />
                  }
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {this.state.showUniquePages &&
            <div className='m-portlet__body'>
              <div className='row align-items-center'> <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                <div className='form-row'>
                  <div className='form-group col-md-6' >
                    <input type='text' style={{marginBottom: '20px'}} placeholder='Search by Page Name...' className='form-control m-input m-input--solid' onChange={this.searchUniquePages} value={this.state.pageName} />
                    <span className='m-input-icon__icon m-input-icon__icon--left' />
                  </div>
                  <div className='form-group col-md-6'>
                    <div className='m-form__group m-form__group--inline'>
                      <div className='m-form__control'>
                        <select className='custom-select' style={{ width: '500px' }} id='m_form_type' tabIndex='-98' value={this.state.connectedFacebook} onChange={this.handleFilterByFBConnected}>
                          <option key='' value='' disabled>Filter by Connected on Facebook</option>
                          <option key='true' value='true'>True</option>
                          <option key='false' value='false'>False</option>
                          <option key='all' value=''>All</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  this.props.uniquePages && this.props.uniquePages.data && this.props.uniquePages.data.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table'
                      id='m-datatable--27866229129' style={{
                        display: 'block',
                        height: 'auto',
                        overflowX: 'auto'
                      }}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='pageName'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Page Name</span></th>
                          <th data-field='records'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Records</span></th>
                          <th data-field='connectedBy'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Connected By</span></th>
                          <th data-field='connectedfb'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Connected on Facebook</span></th>
                          <th data-field='actions'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Actions</span></th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                        {
                          this.props.uniquePages.data.map((uniquePage, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
                              <td data-field='pageName'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>{uniquePage.pageName}</span></td>

                               <td data-field='records' className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>{uniquePage.count}</span></td>
                              <td data-field='connectedBy' className='m-datatable__cell'>
                                <span style={{width: '120px'}}>{uniquePage.connectedBy ? uniquePage.connectedBy.name : 'Not connected'}</span></td>
                              <td data-field='connectedfb' className='m-datatable__cell'>
                                <span style={{width: '120px'}}>{uniquePage.connectedFacebook ? 'True' : 'False'}</span></td>
                            <td data-field='actions'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>
                                    <button onClick={() => this.goToUsers(uniquePage.pageId, uniquePage.pageName)} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                        View Users
                                    </button>
                                    <button onClick={() => this.goToPermissions(uniquePage.pageId, uniquePage.pageName)} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                        View Permissions
                                    </button>
                                    <button onClick={() => this.goToPageTags(uniquePage.pageId, uniquePage.pageName)} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                        View Tags
                                    </button>
                                    <button onClick={() => this.goToSubscribersWithTags(uniquePage.pageId, uniquePage.pageName)} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                        View Subscribers
                                    </button>
                                    <button onClick={() => this.goToPageAdmins(uniquePage.pageId, uniquePage.pageName)} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                        View Admins
                                    </button>
                                </span>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                    <ReactPaginate previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a href='#/'>...</a>}
                      breakClassName={'break-me'}
                      pageCount={Math.ceil(this.props.uniquePages.totalCount / 10)}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                      forcePage={this.state.pageNumber-1} />
                  </div>
                  : <p> No data to display. </p>
                }
              </div>
              </div>
            </div>
          }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    uniquePages: state.backdoorInfo.uniquePages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadUniquePages}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UniquePages)
