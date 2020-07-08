import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadChatbots } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'

class ChatBots extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      chatbotData: [],
      totalLength: 0,
      selectedDays: 10,
      pageNumber: 0,
      showChatBots: false
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.toggle = this.toggle.bind(this)
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Chat Bots by Days`
  }
  toggle () {
    this.setState({showChatBots: !this.state.showChatBots}, () => {
      if (this.state.showChatBots) {
        this.props.loadChatbots({last_id: 'none', number_of_records: 10, first_page: 'first', days: this.state.selectedDays})
      }
    })
  }
  displayData (n, chatbots) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > chatbots.length) {
      limit = chatbots.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = chatbots[i]
      index++
    }
    this.setState({chatbotData: data})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadChatbots({last_id: 'none', number_of_records: 10, first_page: 'first', days: parseInt(this.state.selectedDays)})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadChatbots({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.chatbots.length > 0 ? this.props.chatbots[this.props.chatbots.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        days: parseInt(this.state.selectedDays)})
    } else {
      this.props.loadChatbots({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.chatbots.length > 0 ? this.props.chatbots[0]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        days: parseInt(this.state.selectedDays)})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.chatbots)
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.chatbots && nextProps.count) {
      this.displayData(0, nextProps.chatbots)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({chatbotData: [], totalLength: 0})
    }
  }

  onDaysChange (event) {
    this.setState({selectedDays: event.target.value, pageNumber: 0})
    if (event.target.value === '' ) {
      this.props.loadChatbots({
        last_id: this.props.chatbots.length > 0 ? this.props.chatbots[this.props.chatbots.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'first',
        days: ''})
    } else if (parseInt(event.target.value) > 0) {
      this.props.loadChatbots({
        last_id: this.props.chatbots.length > 0 ? this.props.chatbots[this.props.chatbots.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'first',
        days: parseInt(event.target.value)
      })
    }
  }

  render () {
    return (
      <div className='row'>
        <div
          className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Chat Bots
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                  <li className='nav-item m-tabs__item' />
                  <li className='nav-item m-tabs__item' />
                  <li className='m-portlet__nav-item'>
                    <div data-portlet-tool='toggle' className='m-portlet__nav-link m-portlet__nav-link--icon' title='' data-original-title='Collapse' onClick={this.toggle}>
                      {this.state.showChatBots
                      ? <i className='la la-angle-up' style={{cursor: 'pointer'}} />
                    : <i className='la la-angle-down' style={{cursor: 'pointer'}} />
                  }
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {this.state.showChatBots &&
            <div className='m-portlet__body'>
              <div className='row align-items-center'>
                <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                  <div className='form-row'>
                    <div className='form-group col-md-6' >
                    </div>
                    <div className='form-group col-md-6' style={{display: 'flex', float: 'right'}}>
                      <span style={{marginLeft: '70px'}} htmlFor='example-text-input' className='col-form-label'>
                        Show records for last:&nbsp;&nbsp;
                      </span>
                      <div style={{width: '200px'}}>
                        <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
                      </div>
                      <span htmlFor='example-text-input' className='col-form-label'>
                      &nbsp;&nbsp;days
                      </span>
                    </div>
                  </div>
                  {
                    this.state.chatbotData && this.state.chatbotData.length > 0
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
                            <th data-field='title'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px'}}>Page Name</span></th>
                            <th data-field='subscribers'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px'}}>New Subscribers</span></th>
                            <th data-field='triggers'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px'}}>Triggers Matched</span></th>
                            <th data-field='date'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px'}}>Created At</span></th>
                          </tr>
                        </thead>
                        <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                          {
                            this.state.chatbotData.map((chatbot, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='title' className='m-datatable__cell'>
                                  <span
                                    style={{width: '100px'}}>{chatbot.pageId.pageName}</span></td>
                                  <td data-field='subscribers' className='m-datatable__cell'>
                                  <span style={{width: '100px'}}>{chatbot.stats ? chatbot.stats.newSubscribers : 0}</span></td>
                                <td data-field='triggers'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '100px'}}>{chatbot.stats ? chatbot.stats.triggerWordsMatched : 0}</span></td>
                                <td data-field='date'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '100px'}}>{handleDate(chatbot.datetime)}</span></td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                      <ReactPaginate previousLabel={'previous'}
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
                    : <p> No data to display </p>
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
    chatbots: state.backdoorInfo.chatbots,
    count: state.backdoorInfo.chatbotCount
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadChatbots: loadChatbots},dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBots)
