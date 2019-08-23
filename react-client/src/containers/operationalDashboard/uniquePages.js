import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadUniquePages } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'

class UniquePages extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      uniquePagesData: [],
      totalLength: 0,
      searchValue: '',
      filter: true,
      pageNumber: 0,
      showUniquePages: false
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchUniquePages = this.searchUniquePages.bind(this)
    this.onBroadcastClick = this.onBroadcastClick.bind(this)
    this.toggle = this.toggle.bind(this)
    this.props.loadUniquePages({pageNumber: 1})
  }

  toggle () {
    this.props.loadUniquePages({pageNumber: 1})
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

  displayData (n, uniquePages) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > uniquePages.length) {
      limit = uniquePages.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = uniquePages[i]
      index++
    }
    this.setState({uniquePagesData: data})
  }

  handlePageClick (data) {
    this.props.loadUniquePages({pageNumber: data.selected+1})
    this.setState({pageNumber: data.selected+1})
    this.displayData(data.selected, this.props.uniquePages)
  }

  searchUniquePages (event) {
    this.setState({searchValue: event.target.value.toLowerCase()})
    if (event.target.value !== '') {
      this.setState({filter: true})
      this.props.loadUniquePages({pageName: event.target.value})
    } else {
      this.props.loadUniquePages({pageNumber: this.state.pageNumber})
    }
  }

  onBroadcastClick (broadcast) {
    browserHistory.push({
      pathname: `/viewBroadcastDetail`,
      state: {title: broadcast.title, payload: broadcast.payload, data: broadcast}
    })
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
                    Pages and Permissions
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                  <li className='nav-item m-tabs__item' />
                  <li className='nav-item m-tabs__item' />
                  <li className='m-portlet__nav-item'>
                    <a data-portlet-tool='toggle' className='m-portlet__nav-link m-portlet__nav-link--icon' title='' data-original-title='Collapse' onClick={this.toggle}>
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
                {
                  this.props.uniquePages && this.props.uniquePages.length > 0
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
                          <th data-field='actions'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Actions</span></th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                        {
                          this.props.uniquePages.map((uniquePage, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
                              <td data-field='pageName'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>{uniquePage.pageName}</span></td>
                              <td data-field='connectedBy' className='m-datatable__cell'>
                                <span style={{width: '120px'}}>{uniquePage.connectedBy.name}</span></td>
                              <td data-field='actions'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>
                                    <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                        View Users
                                    </button>
                                    <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                        View Permissions
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
                      breakLabel={<a>...</a>}
                      breakClassName={'break-me'}
                      pageCount={Math.ceil(this.props.uniquePages.length / 10)}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                      forcePage={this.state.pageNumber} />
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
