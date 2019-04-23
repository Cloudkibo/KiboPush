/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadContactsList, loadWhatsAppContactsList } from '../../redux/actions/uploadContacts.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
class Contact extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contactsData: [],
      totalLength: 0,
      pageNumber: 0
    }
    if (props.user.platform === 'sms') {
      props.loadContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
    } else {
      props.loadWhatsAppContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
    }

    this.displayData = this.displayData.bind(this)
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
    if (data.selected === 0) {
      if (this.props.user.platform === 'sms') {
        this.props.loadContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
      } else {
        this.props.loadWhatsAppContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
      }
    } else if (this.state.pageNumber < data.selected) {
      if (this.props.user.platform === 'sms') {
        this.props.loadContactsList({
          current_page: this.state.pageNumber,
          requested_page: data.selected,
          last_id: this.props.contacts.length > 0 ? this.props.contacts[this.props.contacts.length - 1]._id : 'none',
          number_of_records: 10,
          first_page: 'next'
        })
      } else {
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
          first_page: 'previous'
        })
      } else {
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

  componentWillReceiveProps (nextProps) {
    if (nextProps.contacts && nextProps.count) {
      this.displayData(0, nextProps.contacts)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({ contactsData: [], totalLength: 0 })
    }
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Subscribers</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding subscribers? Here is the <a href='https://kibopush.com/twilio/' target='_blank'>documentation</a>.
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
                  </div>
                  <div className='m-portlet__body'>
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
                            <span style={{width: '150px'}}>Phone Number</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {this.state.contactsData.map((contact, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='pic' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}><img className='m--img-rounded m--marginless m--img-centered' width='60' height='60' src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg' /></span></td>
                            <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{contact.name}</span></td>
                            <td data-field='number' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{contact.number}</span></td>
                          </tr>
                        ))
                      }
                      </tbody>
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
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadContactsList,
    loadWhatsAppContactsList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Contact)
