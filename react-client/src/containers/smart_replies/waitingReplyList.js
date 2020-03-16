/* eslint-disable no-useless-constructor */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactPaginate from 'react-paginate'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { loadWaitingSubscribers, removeWaitingSubscribers } from '../../redux/actions/smart_replies.actions'
import BACKBUTTON from '../../components/extras/backButton'

class WaitingReplyList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      filterByGender: '',
      filterByPage: '',
      searchValue: '',
      pageSelected: 0,
      totalSubscribersCount: '',
      botId: this.props.location.state.id
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.openChat = this.openChat.bind(this)
    this.onGenderChange = this.onGenderChange.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.backToIntents = this.backToIntents.bind(this)

    props.loadWaitingSubscribers({
      botId: this.props.location.state.id,
      records: 10,
      searchValue: '',
      genderValue: '',
      pageValue: '',
      pagination: {
        step: 'first',
        currentPage: 0
      }
    })
    props.loadMyPagesList()
  }

  onGenderChange (e) {
    this.setState({filterByGender: e.target.value})
    this.props.loadWaitingSubscribers({
      botId: this.state.botId,
      records: 10,
      searchValue: this.state.searchValue,
      genderValue: e.target.value,
      pageValue: this.state.filterByPage,
      pagination: {
        step: 'first',
        currentPage: this.state.pageSelected
      }
    })
  }

  onSearchChange (e) {
    this.setState({searchValue: e.target.value})
    this.props.loadWaitingSubscribers({
      botId: this.state.botId,
      records: 10,
      searchValue: e.target.value,
      genderValue: this.state.filterByGender,
      pageValue: this.state.filterByPage,
      pagination: {
        step: 'first',
        currentPage: this.state.pageSelected
      }
    })
  }

  backToIntents () {
    this.props.history.push({
      pathname: '/intents',
      state: this.props.location.state
    })
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    } else {
      title = 'KiboPush'
    }

    document.title = `${title} | Waiting Subscribers`
  }

  openChat (subscriber, id) {
    this.props.removeWaitingSubscribers(id)
    this.props.history.push({
      pathname: `/liveChat`,
      state: {subscriberToRespond: subscriber}
    })
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadWaitingSubscribers({
        botId: this.state.botId,
        records: 10,
        searchValue: this.state.searchValue,
        genderValue: this.state.filterByGender,
        pageValue: this.state.filterByPage,
        pagination: {
          step: 'first',
          currentPage: 0
        }
      })
    } else {
      this.props.loadWaitingSubscribers({
        botId: this.state.botId,
        records: 10,
        lastId: this.props.waitingSubscribers[this.props.waitingSubscribers.length - 1]._id,
        searchValue: this.state.searchValue,
        genderValue: this.state.filterByGender,
        pageValue: this.state.filterByPage,
        pagination: {
          step: (data.selected > this.state.pageSelected) ? 'next' : 'previous',
          currentPage: this.state.pageSelected,
          requestedPage: data.selected
        }
      })
    }
    this.setState({pageSelected: data.selected})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.waitingSubscribersCount && this.state.totalSubscribersCount === '') {
      this.setState({totalSubscribersCount: nextProps.waitingSubscribersCount})
    }
  }

  render () {
    return (
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
                {
                  this.state.totalSubscribersCount !== '' && this.state.totalSubscribersCount > 0
                  ? <div className='m-portlet__body'>
                    <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                      <div className='row align-items-center'>
                        <div className='col-xl-12 order-2 order-xl-1'>
                          <div className='form-group m-form__group row align-items-center'>
                            <div className='col-md-4'>
                              <div className='m-input-icon m-input-icon--left'>
                                <input type='text' className='form-control m-input m-input--solid' value={this.state.searchValue} placeholder='Search...' id='generalSearch' onChange={this.onSearchChange} />
                                <span className='m-input-icon__icon m-input-icon__icon--left'>
                                  <span><i className='la la-search' /></span>
                                </span>
                              </div>
                            </div>
                            <div className='col-md-4'>
                              <div className='m-form__group m-form__group--inline'>
                                <div className='' style={{marginTop: '10px'}}>
                                  <label style={{width: '60px'}}>Gender:</label>
                                </div>
                                <div className='m-form__control'>
                                  <select className='custom-select' id='m_form_status' style={{width: '200px'}} tabIndex='-98' value={this.state.filterByGender} onChange={this.onGenderChange}>
                                    <option key='' value='' disabled>Filter by Gender...</option>
                                    <option key='' value=''>All</option>
                                    <option key='male' value='male'>Male</option>
                                    <option key='female' value='female'>Female</option>
                                    <option key='other' value='other'>Other</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {
                      this.props.waitingSubscribers && this.props.waitingSubscribers.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table
                          className='m-datatable__table'
                          id='m-datatable--27866229129' style={{
                            display: 'block',
                            height: 'auto',
                            overflowX: 'auto'
                          }}
                        >
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row' style={{height: '53px'}}>
                              <th data-field='Profile Picture' className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px', overflow: 'inherit'}}>Profile Picture</span>
                              </th>
                              <th data-field='Name' className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px', overflow: 'inherit'}}>Name</span>
                              </th>
                              <th data-field='Gender' className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '50px', overflow: 'inherit'}}>Gender</span>
                              </th>
                              <th data-field='Page' className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px', overflow: 'inherit'}}>Page</span>
                              </th>
                              <th data-field='Question' className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px', overflow: 'inherit'}}>Question</span>
                              </th>
                              <th data-field='Intent' className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px', overflow: 'inherit'}}>Intent</span>
                              </th>
                              <th data-field='Redirect' className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '150px', overflow: 'inherit'}}> Click to Respond</span>
                              </th>
                            </tr>
                          </thead>

                          <tbody className='m-datatable__body'>
                            {
                              this.props.waitingSubscribers.map((subscriber, i) => (
                                <tr data-row={i} className='m-datatable__row m-datatable__row--even' style={{height: '55px'}} key={i}>
                                  <td data-field='Profile Picture' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>
                                      <img
                                        alt='pic'
                                        src={subscriber.subscriberId.profilePic ? subscriber.subscriberId.profilePic : ''}
                                        className='m--img-rounded m--marginless m--img-centered' width='60' height='60'
                                      />
                                    </span>
                                  </td>
                                  <td data-field='Name' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>{subscriber.subscriberId.fullName}</span>
                                  </td>
                                  <td data-field='Gender' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{width: '50px', overflow: 'inherit'}}>
                                      {subscriber.subscriberId.gender}
                                    </span>
                                  </td>
                                  <td data-field='Page' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.pageId.pageName}
                                    </span>
                                  </td>
                                  <td data-field='Question' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.question}
                                    </span>
                                  </td>
                                  <td data-field='Intent' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.intentId.name}
                                    </span>
                                  </td>
                                  <td data-field='Redirect' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{width: '150px', overflow: 'inherit'}}>
                                      <button
                                        className='btn btn-primary btn-sm'
                                        style={{margin: 2}}
                                        onClick={() => this.openChat(subscriber.subscriberId, subscriber._id)}
                                      >
                                        Start Conversation
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
                          pageCount={Math.ceil(this.props.waitingSubscribersCount / 10)}
                          marginPagesDisplayed={1}
                          pageRangeDisplayed={3}
                          containerClassName={'pagination'}
                          subContainerClassName={'pages pagination'}
                          activeClassName={'active'}
                        />
                      </div>
                      : <div className='m-portlet__body'>
                        <p> No data to display </p>
                      </div>
                    }
                  </div>
                  : <div className='m-portlet__body'>
                    No data to display
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <BACKBUTTON onBack={this.backToIntents} />
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    waitingSubscribers: (state.botsInfo.waitingSubscribers),
    waitingSubscribersCount: (state.botsInfo.waitingSubscribersCount)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    loadWaitingSubscribers: loadWaitingSubscribers,
    removeWaitingSubscribers: removeWaitingSubscribers
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WaitingReplyList)
