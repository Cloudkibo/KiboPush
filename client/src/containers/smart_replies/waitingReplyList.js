/* eslint-disable no-useless-constructor */
import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { loadAllSubscribersListNew } from '../../redux/actions/subscribers.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import ReactPaginate from 'react-paginate'

class WaitingReplyList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      subscribersData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.openChat = this.openChat.bind(this)
    props.loadAllSubscribersListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: '', gender_value: '', page_value: '', locale_value: '', tag_value: '', status_value: ''}})
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.subscribers && nextProps.count) {
      this.displayData(0, nextProps.subscribers)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({subscribersData: [], subscribersDataAll: [], totalLength: 0})
    }
  }

  openChat (subscriber) {
    this.props.history.push({
      pathname: `/liveChat`,
      state: {subscriberToRespond: subscriber}
    })
  }
  displayData (n, subscribers) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > subscribers.length) {
      limit = subscribers.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = subscribers[i]
      index++
    }
    this.setState({subscribersData: data, subscribersDataAll: subscribers})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.state.subscribersDataAll)
  }

  searchSubscriber (event) {
    var filtered = []
    for (let i = 0; i < this.props.listDetail.length; i++) {
      if (this.props.listDetail[i].firstName.toLowerCase().includes((event.target.value).toLowerCase()) || this.props.listDetail[i].lastName.toLowerCase().includes((event.target.value).toLowerCase())) {
        filtered.push(this.props.listDetail[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div className='m-portlet m-portlet-mobile '>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Subscribers waiting for response
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      { this.state.subscribersData && this.state.subscribersData.length > 0
                        ? <div>
                          <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                            <div className='row align-items-center'>
                              <div className='col-xl-12 order-2 order-xl-1'>
                                <div className='form-group m-form__group row align-items-center'>
                                  <div className='col-md-4'>
                                    <div className='m-input-icon m-input-icon--left'>
                                      <input type='text' className='form-control m-input m-input--solid' placeholder='Search...' id='generalSearch' onChange={this.searchSubscriber} />
                                      <span className='m-input-icon__icon m-input-icon__icon--left'>
                                        <span><i className='la la-search' /></span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                            <table className='m-datatable__table'
                              id='m-datatable--27866229129' style={{
                                display: 'block',
                                height: 'auto',
                                overflowX: 'auto'
                              }}>
                              <thead className='m-datatable__head'>
                                <tr className='m-datatable__row'
                                  style={{height: '53px'}}>
                                  <th data-field='Profile Picture'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Profile Picture</span>
                                  </th>
                                  <th data-field='Name'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Name</span>
                                  </th>
                                  <th data-field='Page'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Page</span>
                                  </th>
                                  <th data-field='PhoneNumber'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>PhoneNumber</span>
                                  </th>
                                  <th data-field='Source'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Source</span>
                                  </th>
                                  <th data-field='Gender'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '50px', overflow: 'inherit'}}>Gender</span>
                                  </th>
                                  <th data-field='Locale'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Locale</span>
                                  </th>
                                  <th data-field='redirect'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px', overflow: 'inherit'}}> Click to Respond</span>
                                  </th>
                                </tr>
                              </thead>

                              <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                                {
                              this.state.subscribersData.map((subscriber, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{height: '55px'}} key={i}>
                                  <td data-field='Profile Picture'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>
                                      <img alt='pic'
                                        src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                                        className='m--img-rounded m--marginless m--img-centered' width='60' height='60'
                                    />
                                    </span>
                                  </td>

                                  <td data-field='Name'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>{subscriber.firstName} {subscriber.lastName}</span>
                                  </td>

                                  <td data-field='Page'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.pageId.pageName}
                                    </span>
                                  </td>
                                  <td data-field='phoneNumber'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.phoneNumber}
                                    </span>
                                  </td>
                                  <td data-field='source'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.isSubscribedByPhoneNumber ? 'PhoneNumber' : 'Other'}
                                    </span>
                                  </td>
                                  <td data-field='Gender' className='m-datatable__cell'>
                                    <span style={{width: '50px'}}>
                                      {
                                        subscriber.gender === 'male' ? (<i className='la la-male' style={{color: subscriber.isSubscribed ? '#716aca' : '#818a91'}} />) : (<i className='la la-female' style={{color: subscriber.isSubscribed ? '#716aca' : '#818a91'}} />)
                                      }
                                    </span>
                                  </td>
                                  <td data-field='Locale' className='m-datatable__cell'><span style={{width: '100px', overflow: 'inherit'}}className='m-badge m-badge--brand'>{subscriber.locale}</span></td>
                                  <td data-field='redirect' className='m-datatable__cell'><span style={{overflow: 'inherit'}}>
                                    <button className='btn btn-primary btn-sm'
                                      style={{margin: 2}} onClick={() => this.openChat(subscriber)}>
                                      Start Conversation
                                  </button></span></td>
                                </tr>
                              ))
                            }
                              </tbody>
                            </table>
                            <ReactPaginate previousLabel={'previous'}
                              nextLabel={'next'}
                              breakLabel={<a>...</a>}
                              breakClassName={'break-me'}
                              pageCount={Math.ceil(this.state.totalLength / 4)}
                              marginPagesDisplayed={1}
                              pageRangeDisplayed={3}
                              onPageChange={this.handlePageClick}
                              containerClassName={'pagination'}
                              subContainerClassName={'pages pagination'}
                              activeClassName={'active'} />

                          </div>
                        </div>
                      : <div className='table-responsive'>
                        <p> No data to display </p>
                      </div>
                    }
                    </div>
                    <div className='m-portlet__foot m-portlet__foot--fit'>
                      <div className='m-form__actions m-form__actions' style={{padding: '30px'}}>
                        <Link to='/' className='btn btn-primary'>
                          Back
                        </Link>
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
  return {
    pages: (state.pagesInfo.pages),
    subscribers: (state.subscribersInfo.subscribers),
    count: (state.subscribersInfo.count)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadAllSubscribersListNew: loadAllSubscribersListNew
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WaitingReplyList)
