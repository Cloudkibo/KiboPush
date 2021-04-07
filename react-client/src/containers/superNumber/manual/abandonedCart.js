import React from 'react'
import { connect } from 'react-redux'
import { fetchCheckouts, fetchTemplates, sendManualMessage } from '../../../redux/actions/superNumber.actions'
import { fetchShopifyStore } from '../../../redux/actions/commerce.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import AlertContainer from 'react-alert'
import INFO from './info'
import SENDMESSAGEMODAL from './sendMessageModal'
import { handleDate } from '../../../utility/utils'
import { validatePhoneNumber } from '../../../utility/utils'

class AbandonedCart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checkouts: [],
      count: 0,
      pageNumber: 0,
      limit: 10,
      selectedTemplateName: 'ABANDONED_CART_RECOVERY',
      language: 'english',
      selectedTemplate: '',
      supportNumber: '',
      loadingIntegration: true,
      loadingCheckouts: true
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.toggleSendMessageModal = this.toggleSendMessageModal.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.updateState = this.updateState.bind(this)
    this.handleFetchCheckouts = this.handleFetchCheckouts.bind(this)
    this.goToCommerceSettings = this.goToCommerceSettings.bind(this)
    this.getCustomerName = this.getCustomerName.bind(this)
    this.refresh = this.refresh.bind(this)
    this.handleFetchStore = this.handleFetchStore.bind(this)

    props.fetchShopifyStore(this.handleFetchStore)
  }

  handleFetchStore () {
    this.setState({loadingIntegration: false})
  }

  refresh () {
    this.setState({pageNumber: 0, loadingCheckouts: true})
    this.props.fetchCheckouts({limit: this.state.limit}, this.handleFetchCheckouts)
  }

  goToCommerceSettings() {
    this.props.history.push({
      pathname: '/settings',
      state: { tab: 'commerceIntegration' }
    })
  }

  UNSAFE_componentWillMount() {
    this.props.fetchCheckouts({limit: this.state.limit}, this.handleFetchCheckouts)
    this.props.fetchTemplates({type: 'ABANDONED_CART_RECOVERY'})
  }

  handleFetchCheckouts (payload) {
    if (payload.checkouts && payload.checkouts.length) {
      this.setState({checkouts: payload.checkouts, loadingCheckouts: false})
    }
  }

  handlePageClick(data) {
    if (data.selected === 0) {
      this.setState({checkouts: this.props.checkouts.slice(0, this.state.limit)})
    } else if (this.state.pageNumber < data.selected) {
      let nextCheckouts = this.props.checkouts.filter(o => new Date(o.created_at) > new Date(this.state.checkouts[this.state.checkouts.length - 1].created_at))
      if (nextCheckouts.length > 0) {
        nextCheckouts = nextCheckouts.slice(0, this.state.limit)
        this.setState({checkouts: nextCheckouts})
      } else {
        this.props.fetchCheckouts({nextPageParameters: this.props.nextPageParameters}, this.handleFetchCheckouts)
      }
    } else {
      let prevCheckouts = this.props.checkouts.filter(o => new Date(o.created_at) < new Date(this.state.checkouts[0].created_at))
      prevCheckouts = prevCheckouts.slice(Math.max(prevCheckouts.length - this.state.limit, 0))
      this.setState({checkouts: prevCheckouts})
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

    document.title = `${title} | AbandonedCart Cart`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.count) {
      this.setState({count: nextProps.count})
    }
    if (nextProps.templates && nextProps.templates[this.state.language]) {
      this.setState({
        selectedTemplateName: 'ABANDONED_CART_RECOVERY',
        selectedTemplate: nextProps.templates[this.state.language]
      })
    }
  }

  toggleSendMessageModal (checkout) {
    this.setState({
      supportNumber: '',
      selectedCheckout: checkout,
      selectedTemplate: this.props.templates[this.state.language]
    })
    this.refs.sendMessage.click()
  }

  updateState (state) {
    this.setState(state)
  }

  handleTemplate (e) {
    this.setState({
      selectedTemplate: this.props.templates[this.state.language]
    })
  }

  sendMessage () {
    if (!this.state.supportNumber) {
      this.msg.error('Please enter a WhatsApp support number')
    } else if (!validatePhoneNumber(this.state.supportNumber)) {
      this.msg.error('Please enter a valid WhatsApp number')
    } else {
      this.props.sendManualMessage({
        templateName: this.state.selectedTemplateName,
        template: this.state.selectedTemplate,
        checkout: this.state.selectedCheckout,
        supportNumber: this.state.supportNumber,
        number: this.state.selectedCheckout.customerNumber
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
                  supportNumber={this.state.supportNumber}
                  templates={this.props.templates}
                  selectedTemplateName={this.state.selectedTemplateName}
                  sendMessage={this.sendMessage}
                  updateState={this.updateState}
                  templateMessage={this.state.selectedTemplate && this.state.selectedTemplate.text}
                />
              </div>
            </div>
          </div>
      <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Abandoned Cart</h3>
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
                          Abandoned Carts
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      {!this.state.loadingIntegration && !this.state.loadingCheckouts && this.props.store &&
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
                      : !this.state.loadingIntegration && !this.state.loadingCheckouts
                      ? this.props.store && this.state.checkouts && this.state.checkouts.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{ height: '53px' }}>
                              <th data-field='checkoutId'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '150px' }}>Checkout ID</span>
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
                                <span style={{ width: '120px' }}>Status</span>
                              </th>
                              <th data-field='actions'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '150px' }}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                              this.state.checkouts.map((checkout, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{ height: '55px' }} key={i}>
                                  <td data-field='checkoutId' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '150px' }}>
                                      <a href={checkout.checkout_admin_url} target='_blank' rel='noopener noreferrer'>#{checkout.checkoutId}</a>
                                    </span>
                                  </td>
                                  <td data-field='customer' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{this.getCustomerName(checkout.customerName)}</span></td>
                                  <td data-field='createdAt' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{handleDate(checkout.created_at)}</span></td>
                                  <td data-field='amount' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{`${checkout.currency} ${checkout.totalPrice}`}</span></td>
                                  <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '120px' }}>
                                    <span className={`m-badge m-badge--wide m-badge--secondary`}>
                                      Not Recovered
                                    </span>
                                  </span></td>
                                  <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '150px' }}>
                                    {checkout.customerNumber
                                    ? <button className='btn btn-primary btn-sm'
                                      onClick={() => this.toggleSendMessageModal(checkout)}>
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
    checkouts: (state.superNumberInfo.checkouts),
    count: (state.superNumberInfo.checkoutCount),
    nextPageParameters: (state.superNumberInfo.checkoutNextPageParameters),
    templates: (state.superNumberInfo.templates)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchCheckouts,
    fetchTemplates,
    sendManualMessage,
    fetchShopifyStore
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AbandonedCart)
