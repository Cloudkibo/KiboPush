import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadSmsDashboardData } from '../../redux/actions/smsDashboard.actions'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'

import CARDBOX from '../../components/Dashboard/CardBox'

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      showDropDown: false,
      selectedDays: '30',
      cardData: {},
      graphdata: []
    }
    this.toggleDropDown = this.toggleDropDown.bind(this)
    this.applyDateFilter = this.applyDateFilter.bind(this)
    this.setStats = this.setStats.bind(this)
    this.calculateSum = this.calculateSum.bind(this)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = 'KiboPush'
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Dashboard`

    this.props.loadSmsDashboardData(this.state.selectedDays, this.setStats)
  }

  setStats (res) {
    if (res.status === 'success') {
      const data = res.payload
      if (data.length > 0) {
        const cardData = {
          contacts: this.calculateSum('contacts', data),
          messagesSent: this.calculateSum('messagesSent', data),
          messagesReceived: this.calculateSum('messagesReceived', data)
        }
        this.setState({loading: false, cardData, graphdata: data})
      } else {
        this.setState({loading: false, cardData: {}, graphdata: []})
      }
    } else {
      this.setState({loading: false, cardData: {}, graphdata: []})
    }
  }

  calculateSum (key, array) {
    return array.reduce((a, b) => a + (b[key] || 0), 0)
  }

  toggleDropDown () {
    this.setState({showDropDown: !this.state.showDropDown})
  }

  applyDateFilter (e) {
    const days = `${e.target.value}`
    this.setState({loading: true, selectedDays: days, showDropDown: false})
    this.props.loadSmsDashboardData(days, this.setStats)
  }

  render() {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Dashboard</h3>
            </div>
            <div>
              <span className="m-subheader__daterange" id="m_dashboard_daterangepicker" onClick={this.toggleDropDown}>
                <span className="m-subheader__daterange-label">
                  <span className="m-subheader__daterange-title"></span>
                  <span className="m-subheader__daterange-date m--font-brand">Last {this.state.selectedDays} days</span>
                </span>
                <a href='#/' className="btn btn-sm btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill">
                  <i className="la la-angle-down"></i>
                </a>
              </span>
              {
                this.state.showDropDown &&
                <div className="daterangepicker dropdown-menu ltr opensleft" style={{display: 'block', top: '142px', right: '29.9999px', left: 'auto', marginTop: '8px', border: 'none'}}>
                  <div className="ranges">
                    <ul onClick={this.applyDateFilter}>
                      <li data-range-key="7"  value='7' className={this.state.selectedDays === '7' ? 'active' : ''}>Last 7 days</li>
                      <li data-range-key="30" value='30' className={this.state.selectedDays === '30' ? 'active' : ''}>Last 30 days</li>
                      <li data-range-key="90" value='90' className={this.state.selectedDays === '90' ? 'active' : ''}>Last 90 days</li>
                    </ul>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className='m-content'>
          {
            /* eslint-disable */
            this.state.loading
            ? <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh'
            }}>
              <div className="m-spinner m-spinner--brand m-spinner--lg" />
            </div>
            : <div>
              <div className='row'>
                <div className='col-md-4'>
                  <CARDBOX
                    style='success'
                    value={this.state.cardData.contacts || 0}
                    label='Total Contacts'
                    id='__sms_contacts'
                  />
                </div>
                <div className='col-md-4'>
                  <CARDBOX
                    style='accent'
                    value={this.state.cardData.messagesSent || 0}
                    label='Messages Sent'
                    id='__sms_messages_sent'
                  />
                </div>
                <div className='col-md-4'>
                  <CARDBOX
                    style='warning'
                    value={this.state.cardData.messagesReceived || 0}
                    label='Messages Received'
                    id='__sms_messages_received'
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
                  <div className='m-portlet m-portlet--full-height '>
                    <div className='m-portlet__body'>
                      {
                        this.state.graphdata.length > 0
                        ? <LineChart width={1000} height={300} data={this.state.graphdata}>
                          <XAxis dataKey='date' />
                          <YAxis />
                          <CartesianGrid strokeDasharray='3 3' />
                          <Tooltip />
                          <Legend />
                          <Line type='monotone' dataKey='messagesSent' name='Messages Sent' stroke='#8884d8' activeDot={{r: 8}} />
                          <Line type='monotone' dataKey='messagesReceived' name='Messages Received' stroke='#82ca9d' activeDot={{r: 8}} />
                        </LineChart>
                        : <div>No data to display</div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            /* eslint-enable */
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    isMobile: (state.basicInfo.isMobile)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadSmsDashboardData
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
