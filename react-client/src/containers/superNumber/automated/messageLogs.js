import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { handleDate } from '../../../utility/utils'

class MessageLogs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messageLogs: [],
      count: 0,
      pageNumber: 0,
      limit: 10,
      loadingMessageLogs: true
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.getStatus = this.getStatus.bind(this)
    this.handleFetchMessageLogs = this.handleFetchMessageLogs.bind(this)
  }

  handleFetchMessageLogs (res) {
    this.setState({loadingMessageLogs: false})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.fetchMessageLogs({
        last_id: 'none',
        number_of_records: this.state.limit,
        first_page: 'first',
      }, this.handleFetchMessageLogs)
    } else if (this.state.pageNumber < data.selected) {
      this.props.fetchMessageLogs({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.messageLogs.length > 0 ? this.props.messageLogs[this.props.messageLogs.length - 1]._id : 'none',
        number_of_records: this.state.limit,
        first_page: 'next'}, this.handleFetchMessageLogs)
    } else {
      this.props.fetchMessageLogs({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.messageLogs.length > 0 ? this.props.messageLogs[0]._id : 'none',
        number_of_records: this.state.limit,
        first_page: 'previous'}, this.handleFetchMessageLogs)
    }
    this.setState({pageNumber: data.selected})
  }

  componentDidMount() {
    this.props.fetchMessageLogs({
      last_id: 'none',
      number_of_records: this.state.limit,
      first_page: 'first'
    }, this.handleFetchMessageLogs)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.count) {
      this.setState({count: nextProps.count})
    }
    if (nextProps.messageLogs) {
      this.setState({
        messageLogs: nextProps.messageLogs,
      })
    }
  }

  getStatus (status) {
    if (status === 'not-recovered') {
      return {text: 'Not recovered', style: 'secondary'}
    } else if (status === 'recovered') {
      return {text: 'Recovered', style: 'success'}
    } else if (status === 'confirmed') {
      return {text: 'Confirmed', style: 'success'}
    } else if (status === 'no-response') {
      return {text: 'No Response', style: 'secondary'}
    } else if (status === 'cancelled') {
      return {text: 'Cancelled', style: 'danger'}
    }
  }

  render() {
    return (
      <div>
        {this.state.loadingMessageLogs
        ? <span>
            <p> Loading... </p>
          </span>
        : this.state.messageLogs.length === 0
        ? <span>
            <p> No data to display </p>
          </span>
        : <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
            <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
              <thead className='m-datatable__head'>
                <tr className='m-datatable__row'
                  style={{ height: '53px' }}>
                  <th data-field='orderId'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                    <span style={{ width: '120px' }}>ID</span>
                  </th>
                  <th data-field='customer'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                    <span style={{ width: '100px' }}>Customer</span>
                  </th>
                  <th data-field='createdAt'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                    <span style={{ width: '100px' }}>Date</span>
                  </th>
                  <th data-field='amount'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                    <span style={{ width: '100px' }}>Amount</span>
                  </th>
                  { this.props.type === 'orders' &&
                  <th data-field='status'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                    <span style={{ width: '160px' }}>Template</span>
                  </th>
                  }
                  { this.props.type === 'abandonedCart' &&
                  <th data-field='status'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                    <span style={{ width: '150px' }}>Status</span>
                  </th>
                  }
                  <th data-field='tags'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                    <span style={{ width: '100px' }}>Message</span>
                  </th>
                </tr>
              </thead>
              <tbody className='m-datatable__body'>
                {
                  this.state.messageLogs.map((messageLog, i) => (
                    <tr data-row={i}
                      className='m-datatable__row m-datatable__row--even'
                      style={{ height: '55px' }} key={i}>
                      <td data-field='orderId' className='m-datatable__cell--center m-datatable__cell'>
                        <span style={{ width: '120px' }}>
                          <a href={messageLog.url} target='_blank' rel='noopener noreferrer'>{messageLog.id}</a>
                        </span>
                      </td>
                      <td data-field='customer' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{messageLog.customerName}</span></td>
                      <td data-field='createdAt' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{handleDate(messageLog.datetime)}</span></td>
                      <td data-field='amount' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{`${messageLog.currency} ${messageLog.amount}`}</span></td>
                      { this.props.type === 'abandonedCart' &&
                      <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                        <span style={{ width: '150px' }}>
                        {<span className={`m-badge m-badge--wide m-badge--${this.getStatus(messageLog.status).style}`}>
                          {this.getStatus(messageLog.status).text}
                        </span>}
                      </span></td>
                      }
                      { this.props.type === 'orders' &&
                      <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                      <span style={{ width: '160px' }}>
                        {messageLog.messageType}
                      </span></td>
                      }
                    <td data-field='amount' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>Sent</span></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className='pagination'>
              <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={<a href={() => false}>...</a>}
                breakClassName={'break-me'}
                pageCount={Math.ceil(this.state.count / this.state.limit)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                forcePage={this.state.pageNumber}
                onPageChange={this.handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'} />
            </div>
          </div>

        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageLogs)
