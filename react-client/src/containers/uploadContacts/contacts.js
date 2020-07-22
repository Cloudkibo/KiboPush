/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'

import { fetchContactLists } from '../../redux/actions/contacts.actions'
import { loadContactsList, loadWhatsAppContactsList, editSubscriberWhatsApp, editSubscriberSms, syncContacts } from '../../redux/actions/uploadContacts.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import AlertContainer from 'react-alert'
import Select from 'react-select'
import YouTube from 'react-youtube'

class Contact extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      contactsData: [],
      totalLength: 0,
      pageNumber: 0,
      contact: '',
      isShowingModalEdit: false,
      name: '',
      subscriber_Lastid: 0,
      lastButtonClick:'none',
      current_page: 0,
      requested_page: 0,
      list: null,
      status: null,
      searchValue: '',
      openVideo: false
    }
    if (props.user.platform === 'sms') {
      props.fetchContactLists()
      props.loadContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
    } else {
      props.loadWhatsAppContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
    }
    this.editSubscriber = this.editSubscriber.bind(this)
    this.loadSubscribers = this.loadSubscribers.bind(this)
    this.changeName = this.changeName.bind(this)
    this.showEdit = this.showEdit.bind(this)
    this.closeEdit = this.closeEdit.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.getUserGuideLink = this.getUserGuideLink.bind(this)
    this.syncContacts = this.syncContacts.bind(this)
    this.getLists = this.getLists.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handleFilterByList = this.handleFilterByList.bind(this)
    this.handleFilterByStatus = this.handleFilterByStatus.bind(this)
    this.loadContacts = this.loadContacts.bind(this)
    this.searchTimer = null
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }

  loadContacts () {
    this.props.loadContactsList({
      last_id: 'none',
      number_of_records: 10,
      first_page: 'first',
      search_value: this.state.searchValue,
      status_value: this.state.status ? this.state.status.value : '',
      list_value: this.state.list ? this.state.list.value : ''
    })
  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoContacts.click()
  }

  searchSubscriber (e) {
    if (this.searchTimer) {
        clearTimeout(this.searchTimer)
    }
    this.setState({searchValue: e.target.value}, () => {
      this.searchTimer = setTimeout(() => {
        this.loadContacts()
      }, 500)
    })
  }

  handleFilterByStatus (status) {
    this.setState({status}, () => {
      this.loadContacts()
    })
  }

  handleFilterByList (list) {
    this.setState({list}, () => {
      this.loadContacts()
    })
  }

  syncContacts () {
    this.props.syncContacts({twilio: {
      accountSID: this.props.automated_options.twilio.accountSID,
      authToken: this.props.automated_options.twilio.authToken
    }}, this.msg)
  }

  getUserGuideLink () {
    let link = 'https://kibopush.com'
    if (this.props.user.platform === 'sms') {
      link = `${link}/twilio`
    } else if (this.props.user.platform === 'whatsApp') {
      link = `${link}/subscribers-whatsapp`
    }
    return link
  }

  changeName (e) {
    this.setState({name: e.target.value})
  }

  editSubscriber () {
    if (this.state.name === '') {
      this.msg.error('Subscriber name cannot be empty')
    } else {
      if (this.props.user.platform === 'whatsApp') {
        this.props.editSubscriberWhatsApp(this.state.contact._id, {name: this.state.name}, this.msg)
      } else if (this.props.user.platform === 'sms') {
        this.props.editSubscriberSms(this.state.contact._id, {name: this.state.name}, this.msg)
      }
      this.closeEdit()
    }
  }

  loadSubscribers () {
    if(this.state.requested_page !== 0) {
      if(this.state.lastButtonClick === 'next') {
        this.props.loadWhatsAppContactsList({
          current_page: this.state.current_page,
          requested_page: this.state.requested_page,
          last_id: this.state.subscriber_Lastid,
          number_of_records: 10,
          first_page: 'next'
        })
      }
      else if(this.state.lastButtonClick === 'previous') {
        this.props.loadWhatsAppContactsList({
          current_page: this.state.current_page,
          requested_page: this.state.requested_page,
          last_id: this.state.subscriber_Lastid,
          number_of_records: 10,
          first_page: 'previous'
        })
      }

    }
    else {
      this.props.loadWhatsAppContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
    }
  }

  showEdit (contact) {
    this.setState({contact: contact, isShowingModalEdit: true, name: contact.name})
  }

  closeEdit () {
    this.setState({isShowingModalEdit: false, name: ''})
  }

  displayData (n, contacts) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > contacts.length) {
      limit = contacts.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = contacts[i]
      index++
    }
    this.setState({contactsData: data})
  }

  handlePageClick (data) {
    console.log('data.selected', data.selected)
    if (data.selected === 0) {
      if (this.props.user.platform === 'sms') {
        this.props.loadContactsList({
          last_id: 'none',
          number_of_records: 10,
          first_page: 'first',
          search_value: this.state.searchValue,
          status_value: this.state.status ? this.state.status.value : '',
          list_value: this.state.list ? this.state.list.value : ''
        })
      } else {
        this.setState({requested_page: data.selected})
        this.props.loadWhatsAppContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
      }
    } else if (this.state.pageNumber < data.selected) {
      if (this.props.user.platform === 'sms') {
        this.props.loadContactsList({
          current_page: this.state.pageNumber,
          requested_page: data.selected,
          last_id: this.props.contacts.length > 0 ? this.props.contacts[this.props.contacts.length - 1]._id : 'none',
          number_of_records: 10,
          first_page: 'next',
          search_value: this.state.searchValue,
          status_value: this.state.status ? this.state.status.value : '',
          list_value: this.state.list ? this.state.list.value : ''
        })
      } else {
        this.setState({current_page: this.state.pageNumber, requested_page: data.selected, lastButtonClick: 'next', subscriber_Lastid: this.props.contacts[this.props.contacts.length - 1]._id})
        this.props.loadWhatsAppContactsList({
          current_page: this.state.pageNumber,
          requested_page: data.selected,
          last_id: this.props.contacts.length > 0 ? this.props.contacts[this.props.contacts.length - 1]._id : 'none',
          number_of_records: 10,
          first_page: 'next'
        })
      }
    } else {
      if (this.props.user.platform === 'sms') {
        this.props.loadContactsList({
          current_page: this.state.pageNumber,
          requested_page: data.selected,
          last_id: this.props.contacts.length > 0 ? this.props.contacts[0]._id : 'none',
          number_of_records: 10,
          first_page: 'previous',
          search_value: this.state.searchValue,
          status_value: this.state.status ? this.state.status.value : '',
          list_value: this.state.list ? this.state.list.value : ''
        })
      } else {
        this.setState({current_page: this.state.pageNumber, requested_page: data.selected, lastButtonClick: 'previous', subscriber_Lastid: this.props.contacts[0]._id})
        this.props.loadWhatsAppContactsList({
          current_page: this.state.pageNumber,
          requested_page: data.selected,
          last_id: this.props.contacts.length > 0 ? this.props.contacts[0]._id : 'none',
          number_of_records: 10,
          first_page: 'previous'
        })
      }
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.contacts)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Subscribers`
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.contacts && nextProps.count) {
      this.displayData(0, nextProps.contacts)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({ contactsData: [], totalLength: 0 })
    }
  }

  getLists (subscriber) {
    let lists = []
    if (subscriber.listIds && this.props.contactLists) {
      for (let i = 0; i < subscriber.listIds.length; i++) {
        let list = this.props.contactLists.find(l => l._id === subscriber.listIds[i])
        if (list) {
          lists.push(list.name)
        }
      }
    }
    if (lists.length >= 1) {
      return lists.join(', ')
    } else {
      return '-'
    }
  }

  render () {
    var subscribedStyle = {
      width: '100px',
      overflow: 'inherit'
    }
    var unsubscribedStyle = {
      width: '100px',
      overflow: 'inherit',
      color: '#818a91'
    }
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="editSubscriber" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Edit Subscriber
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Subscriber Name:</p>
              <input className='form-control m-input' onChange={this.changeName} value={this.state.name} />
              <br />
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={this.editSubscriber}
                data-dismiss='modal'>Save
              </button>
                </div>
              </div>
            </div>
          </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Subscribers</h3>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='videoContacts' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoContacts">videoContacts</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoContacts" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
            <div style={{ display: 'block'}} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Subscribers in Whatsapp
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  this.setState({
                    openVideo: false
                  })}}>
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
              {this.state.openVideo && <YouTube
                  videoId='shKW_0z7VTw'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
                }
              </div>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding subscribers? Here is the <a href={this.getUserGuideLink()} target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <h3 className='m-portlet__head-text'>
                          Subscribers
                        </h3>
                      </div>
                    </div>
                    { this.props.user.platform === 'sms' &&
                    <div className='m-portlet__head-tools'>
                    <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.syncContacts}>
                        <span>
                          <i className='la la-refresh' />
                          <span>
                            Sync contacts with Twilio
                          </span>
                        </span>
                      </button>
                    </div>
                    }
                  </div>
                  <div className='m-portlet__body'>
                    {
                      this.props.user.platform === 'sms' &&
                      <div className='row filters' style={{ marginBottom: '25px', display: 'flex' }}>
                        <div className='col-4'>
                          <div className='m-input-icon m-input-icon--left'>
                            <input type='text' className='form-control' value={this.state.searchValue} placeholder='Search...' id='generalSearch' onChange={this.searchSubscriber} />
                            <span className='m-input-icon__icon m-input-icon__icon--left'>
                              <span><i className='la la-search' /></span>
                            </span>
                          </div>
                        </div>

                        <div className='col-4'>
                          <Select
                              isClearable
                              isSearchable
                              options={this.props.contactLists ? this.props.contactLists.map(list => { return {value: list._id, label: list.name} }).filter(x => x.value !== 'master') : []}
                              onChange={this.handleFilterByList}
                              value={this.state.list}
                              placeholder='Filter by List'
                            />
                        </div>

                        <div className='col-4'>
                          <Select
                            isClearable
                            isSearchable
                            options={[{label: 'Subscribed', value: true}, {label: 'Unsubscribed', value: false}]}
                            onChange={this.handleFilterByStatus}
                            value={this.state.status}
                            placeholder='Filter by Status'
                          />
                        </div>
                      </div>
                    }

                  { this.state.contactsData && this.state.contactsData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='pic'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Subscriber Pic</span>
                          </th>
                          <th data-field='name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Name</span>
                          </th>
                          <th data-field='number'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Phone Number</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Status</span>
                          </th>
                          {
                            this.props.user.platform === 'sms' &&
                            <th data-field='lists'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px'}}>Lists</span>
                            </th>
                          }
                          <th data-field='edit'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {this.state.contactsData.map((contact, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='pic' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}><img alt='' className='m--img-rounded m--marginless m--img-centered' width='60' height='60' src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg' /></span></td>
                            <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={contact.isSubscribed ? subscribedStyle : unsubscribedStyle}>{contact.name}</span></td>
                            <td data-field='number' className='m-datatable__cell--center m-datatable__cell'><span style={contact.isSubscribed ? subscribedStyle : unsubscribedStyle}>{contact.number}</span></td>
                            <td data-field='status' className='m-datatable__cell--center m-datatable__cell'><span style={contact.isSubscribed ? subscribedStyle : unsubscribedStyle}>{contact.isSubscribed ? 'Subscribed' : 'Unsubscribed'}</span></td>
                            {
                              this.props.user.platform === 'sms' &&  <td data-field='lists' className='m-datatable__cell--center m-datatable__cell'><span style={contact.isSubscribed ? subscribedStyle : unsubscribedStyle}>{this.getLists(contact)}</span></td>
                            }
                            <td data-field='actions' className='m-datatable__cell'>
                              <span style={{width: '100px'}}>
                                <button style={{border: 'none', marginLeft: '30px'}} data-toggle="modal" data-target="#editSubscriber" onClick={() => this.showEdit(contact)} className="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit">
                                  <i className="la la-edit" />
                                </button>
                              </span>
                            </td>
                          </tr>
                        ))
                      }
                      </tbody>
                    </table>
                    <div className='pagination'>
                      <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a href='#/'>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.state.pageNumber} />
                    </div>
                  </div>
                  : <span>
                    <p> No data to display </p>
                  </span>
                }
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
    contacts: (state.contactsInfo.contacts),
    count: (state.contactsInfo.count),
    user: (state.basicInfo.user),
    automated_options: (state.basicInfo.automated_options),
    contactLists: (state.contactsInfo.contactLists)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadContactsList,
    loadWhatsAppContactsList,
    editSubscriberWhatsApp,
    editSubscriberSms,
    syncContacts,
    fetchContactLists
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Contact)
