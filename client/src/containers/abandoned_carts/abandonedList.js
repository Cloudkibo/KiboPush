/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadBotsList, createBot, deleteBot, loadAnalytics, updateCartStatus } from '../../redux/actions/smart_replies.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import AlertContainer from 'react-alert'

class AbandonedList extends React.Component {
  constructor (props, context) {
    props.loadBotsList()
    props.loadAnalytics()
    props.loadMyPagesList()
    super(props, context)
    this.state = {
      botsData: [],
      totalLength: 0,
      isShowingModal: false,
      isShowingModalDelete: false,
      deleteid: '',
      name: '',
      pageSelected: '',
      isActive: true,
      error: false,
      filterValue: '',
      searchValue: '',
      createBotDialogButton: false,
      pageNumber: 0,
      filter: false,
      pages: [],
      showDropDown: false
    }
    this.gotoCreate = this.gotoCreate.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    console.log('nextprops in bots.js', nextProps)
    if (nextProps.bots && nextProps.bots.length > 0) {
      this.setState({ totalLength: nextProps.bots.length })
    } else {
      this.setState({ botsData: [], totalLength: 0 })
    }
    if (nextProps.pages && nextProps.pages.length > 0 && nextProps.bots) {
      // this.state.pageSelected = nextProps.pages[0]._id
    }
  }

  gotoCreate () {
    if (this.state.name === '') {
      this.setState({ error: true })
    } else {
      var botName = this.state.name.trim()
      botName = botName.replace(/\s+/g, '-')
      this.props.createBot({ botName: botName, pageId: this.state.pageSelected, isActive: this.state.isActive })
      browserHistory.push({
        pathname: `/createBot`
      })
    }
  }

  handlePageClick () {
    console.log('Need to handle the page click logic here')
  }

  handleStatusChange (shopId, statusValue) {
    // TODO
    // It will receive the shopID which it will send to API endpoint to update the value
    this.setState({isActive: statusValue})
    console.log('set the status: ' + statusValue)
    this.props.updateCartStatus({shopId: shopId, isActive: statusValue}, this.msg)
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Abandoned Carts</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding abandoned carts? Here is the <a href='http://kibopush.com/bots/' target='_blank'>documentation</a>.
                Or check out this <a>video tutorial</a>
            </div>
          </div>

          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Abandoned Carts
                        </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflow: 'inherit' }}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{ height: '53px' }}>
                          <th data-field='name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '125px' }}>Subscriber Name</span>
                          </th>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '125px' }}>Page Name</span>
                          </th>
                          <th data-field='value'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '125px' }}>Cart Value</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '125px' }}>Status</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{ textAlign: 'center' }}>
                        <tr className='m-datatable__row m-datatable__row--even'
                          style={{ height: '55px' }}>
                          <td data-field='name' className='m-datatable__cell'><span style={{ width: '125px' }}>Dayem Siddiqui</span></td>
                          <td data-field='page' className='m-datatable__cell'><span style={{ width: '125px' }}>KiboPush</span></td>
                          <td data-field='value' className='m-datatable__cell'><span style={{ width: '125px' }}>$230</span></td>
                          <td data-field='status' className='m-datatable__cell'>
                            <div className='m-widget4__ext' style={{ width: '125px' }}>
                              <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                  {
                                    // TODO
                                    // We will modify this after the dayem code merging. It will iterate over carts list
                                    // and check the status - hence visualize on screen
                                    this.state.isActive ? 'Active' : 'Not Active'
                                  }
                                </button>
                                <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                                  <a className='dropdown-item' onClick={() => { this.handleStatusChange('5b5dbb52a8c5bcde181e9205', true) }}>
                                    Active
                                    </a>
                                  <a className='dropdown-item' onClick={() => { this.handleStatusChange('5b5dbb52a8c5bcde181e9205', false) }}>
                                    Not Active
                                    </a>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className='pagination'>
                      <ReactPaginate previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
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
    )
  }
}

function mapStateToProps (state) {
  console.log('state', state)
  return {
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    bots: (state.botsInfo.bots),
    count: (state.botsInfo.count),
    analytics: (state.botsInfo.analytics)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadBotsList: loadBotsList,
      loadMyPagesList: loadMyPagesList,
      createBot: createBot,
      deleteBot: deleteBot,
      loadAnalytics: loadAnalytics,
      updateCartStatus: updateCartStatus
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AbandonedList)
