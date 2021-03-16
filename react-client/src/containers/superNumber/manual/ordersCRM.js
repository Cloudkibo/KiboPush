import React from 'react'
import { connect } from 'react-redux'
import { fetchOrders, fetchTemplates, sendManualMessage } from '../../../redux/actions/superNumber.actions'
import { fetchShopifyStore } from '../../../redux/actions/commerce.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import AlertContainer from 'react-alert'
import INFO from './info'
import SENDMESSAGEMODAL from './sendMessageModal'
import { handleDate } from '../../../utility/utils'
import { validatePhoneNumber } from '../../../utility/utils'

class OrdersCRM extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orders: [],
      count: 0,
      pageNumber: 0,
      limit: 10,
      selectedOrder: '',
      selectedTemplateName: '',
      selectedTemplate: '',
      supportNumber: '',
      loadingIntegration: true,
      loadingOrders: true
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.getStatus = this.getStatus.bind(this)
    this.getFulfillmentStatus = this.getFulfillmentStatus.bind(this)
    this.getTags = this.getTags.bind(this)
    this.toggleSendMessageModal = this.toggleSendMessageModal.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.updateState = this.updateState.bind(this)
    this.handleFetchOrders = this.handleFetchOrders.bind(this)
    this.goToCommerceSettings = this.goToCommerceSettings.bind(this)
    this.getCustomerName = this.getCustomerName.bind(this)
    this.refresh = this.refresh.bind(this)
    this.handleFetchStore = this.handleFetchStore.bind(this)

    props.fetchShopifyStore(this.handleFetchStore)
  }

  handleFetchStore () {
    this.setState({loadingIntegration: false})
  }

  goToCommerceSettings() {
    this.props.history.push({
      pathname: '/settings',
      state: { tab: 'commerceIntegration' }
    })
  }

  UNSAFE_componentWillMount() {
    this.props.fetchOrders({limit: this.state.limit}, this.handleFetchOrders)
    this.props.fetchTemplates()
  }

  handleFetchOrders (payload) {
    if (payload.orders && payload.orders.length) {
      this.setState({orders: payload.orders, loadingOrders: false})
    }
  }

  handlePageClick(data) {
    if (data.selected === 0) {
      this.setState({orders: this.props.orders.slice(0, this.state.limit)})
    } else if (this.state.pageNumber < data.selected) {
      let nextOrders = this.props.orders.filter(o => new Date(o.createdAt) < new Date(this.state.orders[this.state.orders.length - 1].createdAt))
      if (nextOrders.length > 0) {
        nextOrders = nextOrders.slice(0, this.state.limit)
        this.setState({orders: nextOrders})
      } else {
        this.props.fetchOrders({nextPageParameters: this.props.nextPageParameters}, this.handleFetchOrders)
      }
    } else {
      let prevOrders = this.props.orders.filter(o => new Date(o.createdAt) > new Date(this.state.orders[0].createdAt))
      prevOrders = prevOrders.slice(Math.max(prevOrders.length - this.state.limit, 0))
      this.setState({orders: prevOrders})
    }
    this.setState({ pageNumber: data.selected })
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Orders CRM`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.count) {
      this.setState({count: nextProps.count})
    }
    if (nextProps.templates && nextProps.templates['ORDER_CONFIRMATION']) {
      this.setState({
        selectedTemplateName: 'ORDER_CONFIRMATION',
        selectedTemplate: nextProps.templates['ORDER_CONFIRMATION']['english']
      })
    }
  }

  getStatus (status) {
    if (status === 'paid') {
      return {text: 'Paid', style: 'success'}
    } else if (status === 'pending') {
      return {text: 'Payment pending', style: 'secondary'}
    } else if (status === 'partially_paid') {
      return {text: 'Partially paid', style: 'info'}
    } else {
      return {text: status, style: 'info'}
    }
  }

  getFulfillmentStatus (status) {
    if (status) {
      return {text: 'Fulfilled', style: 'success'}
    } else {
      return {text: 'Unfulfilled', style: 'secondary'}
    }
  }

  getTags (tags) {
    let payload = []
    if (tags) {
      tags = tags.split(',')
      if (tags.length > 0) {
        for (let i = 0; i < tags.length; i++) {
          payload.push(
            <span className='m-badge m-badge--wide m-badge--secondary' style={{borderRadius: '0', marginBottom: '3px'}}>
              {tags[i]}
            </span>
          )
        }
      }
    } else {
      payload = '-'
    }
    return payload
  }

  toggleSendMessageModal (order) {
    this.setState({
      supportNumber: '',
      selectedOrder: order,
      selectedTemplateName: 'ORDER_CONFIRMATION',
      selectedTemplate: this.props.templates['ORDER_CONFIRMATION']['english']
    })
    this.refs.sendMessage.click()
  }

  updateState (state) {
    this.setState(state)
  }

  handleTemplate (e) {
    this.setState({
      selectedTemplateName: e.target.value,
      selectedTemplate: this.props.templates[e.target.value]['english']
    })
  }

  sendMessage () {
    if (!this.state.supportNumber) {
      this.msg.error('Please enter a WhatsApp support number')
    } else if (!validatePhoneNumber(this.state.supportNumber)) {
      this.msg.error('Please enter a valid WhatsApp number')
    } else if (this.state.selectedTemplateName === 'ORDER_SHIPMENT' && (!this.state.selectedOrder.trackingId || !this.state.selectedOrder.trackingUrl)) {
      this.msg.error('No tracking details available for this order')
    } else {
      this.props.sendManualMessage({
        templateName: this.state.selectedTemplateName,
        template: this.state.selectedTemplate,
        order: this.state.selectedOrder,
        supportNumber: this.state.supportNumber,
        number: this.state.selectedOrder.customerNumber
      }, this.handleSendMessage)
    }
  }

  handleSendMessage (res) {
    if (res.status === 'success') {
      this.refs.sendMessage.click()
      this.msg.success('Message sent susccessfully')
    } else {
      this.msg.error(res.description || res.payload || 'Failed to send message')
    }
  }

  handleNumber (e) {
    this.setState({supportNumber: e.target.value})
  }

  getCustomerName (name) {
    if (!name || !name.trim()){
      return '-'
    } else {
      return name
    }
  }

  refresh () {
    this.setState({pageNumber: 0, loadingOrders: true})
    this.props.fetchOrders({limit: this.state.limit}, this.handleFetchOrders)
  }

  render() {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <a href='#/' style={{ display: 'none' }} ref='sendMessage' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#sendMessage">Send Message</a>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="sendMessage" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{ width: '687px', top: '100' }}>
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Send WhatsAapp Message
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
                <SENDMESSAGEMODAL
                  showSelectTemplate
                  supportNumber={this.state.supportNumber}
                  templates={this.props.templates}
                  selectedTemplateName={this.state.selectedTemplateName}
                  sendMessage={this.sendMessage}
                  templateMessage={this.state.selectedTemplate && this.state.selectedTemplate.text}
                  updateState={this.updateState}
                  showShipment={this.state.selectedOrder.trackingId && this.state.selectedOrder.trackingUrl}
                />
              </div>
            </div>
          </div>
      <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Orders CRM</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <INFO />
          <div className='row'>
            <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <h3 className='m-portlet__head-text'>
                          Orders
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      {!this.state.loadingIntegration && !this.state.loadingOrders && this.props.store &&
                        <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.refresh}>
                        <span>
                          <i className='la la-refresh' />
                          <span>
                            Refresh
                          </span>
                        </span>
                      </button>
                    }
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    {
                      !this.props.store && !this.state.loadingIntegration
                      ? <div>
                        <h6 style={{ textAlign: 'center' }}>
                          You have not integrated an e-commerce provider with KiboPush. Please integrate an e-commerce provider to create a commerce chatbot.
                        </h6>
                        <div style={{ marginTop: '25px', textAlign: 'center' }}>
                          <div onClick={this.goToCommerceSettings} className='btn btn-primary'>
                            Integrate
                        </div>
                        </div>
                      </div>
                      : !this.state.loadingIntegration && !this.state.loadingOrders
                      ? this.state.orders && this.state.orders.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{ height: '53px' }}>
                              <th data-field='orderId'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '50px' }}>Order ID</span>
                              </th>
                              <th data-field='customer'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Customer</span>
                              </th>
                              <th data-field='createdAt'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Created At</span>
                              </th>
                              <th data-field='amount'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Amount</span>
                              </th>
                              <th data-field='status'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '150px' }}>Status</span>
                              </th>
                              <th data-field='tags'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '180px' }}>Tags</span>
                              </th>
                              <th data-field='actions'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '110px' }}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                              this.state.orders.map((order, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{ height: '55px' }} key={i}>
                                  <td data-field='orderId' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '50px' }}>
                                      <a href={order.orderAdminUrl} target='_blank' rel='noopener noreferrer'>#{order.orderNumber}</a>
                                    </span>
                                  </td>
                                  <td data-field='customer' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{this.getCustomerName(order.customerName)}</span></td>
                                  <td data-field='createdAt' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{handleDate(order.createdAt)}</span></td>
                                  <td data-field='amount' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{`${order.currency} ${order.totalPrice}`}</span></td>
                                  <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '150px' }}>
                                    <span className={`m-badge m-badge--wide m-badge--${this.getStatus(order.financialStatus).style}`}>
                                      {this.getStatus(order.financialStatus).text}
                                    </span>
                                    <br />
                                    <span className={`m-badge m-badge--wide m-badge--${this.getFulfillmentStatus(order.fulfillmentStatus).style}`}
                                      style={{marginTop: '3px'}}>
                                      {this.getFulfillmentStatus(order.fulfillmentStatus).text}
                                    </span>
                                  </span></td>
                                  <td data-field='tags' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '180px' }}>{this.getTags(order.tags)}
                                    </span></td>
                                  <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '110px' }}>
                                    {order.customerNumber
                                    ? <button className='btn btn-primary btn-sm'
                                      onClick={() => this.toggleSendMessageModal(order)}>
                                      Send Message
                                    </button>
                                    : 'Phone Unavailable'
                                  }
                                  </span></td>
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
                            marginPagesDisplayed={0}
                            pageRangeDisplayed={0}
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
                      : <span>
                        <p> Loading... </p>
                      </span>
                    }
                  </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    store: (state.commerceInfo.store),
    orders: (state.superNumberInfo.orders),
    count: (state.superNumberInfo.count),
    nextPageParameters: (state.superNumberInfo.nextPageParameters),
    templates: (state.superNumberInfo.templates)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchShopifyStore,
    fetchOrders,
    fetchTemplates,
    sendManualMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OrdersCRM)
