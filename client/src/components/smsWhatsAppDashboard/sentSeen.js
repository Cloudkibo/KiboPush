/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import IconStack from '../Dashboard/IconStack'
import ProgressBar from '../Dashboard/ProgressBar'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'

class ProgressBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      showDaysDropDown: false,
      days: 30
    }
    this.calculateProgressRates = this.calculateProgressRates.bind(this)
    this.showDaysDropDown = this.showDaysDropDown.bind(this)
    this.hideDaysDropDown = this.hideDaysDropDown.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.changeDays = this.changeDays.bind(this)
  }
  onKeyDown (e) {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }
  changeDays (e) {
    this.setState({days: e.target.value})
    this.props.loadSentSeen({days: e.target.value})
  }
  showDaysDropDown () {
    this.setState({showDaysDropDown: true})
  }
  hideDaysDropDown () {
    this.setState({showDaysDropDown: false})
  }
  calculateProgressRates (url) {
    if (this.props.platform === 'whatsApp' && url.includes('kiboengage.cloudkibo.com')) {
      var progressRates = {}
      progressRates.broadcastSeenConvertRate = this.props.sentSeenData.broadcastsSent !== 0 ? ((this.props.sentSeenData.broadcastsSeen / this.props.sentSeenData.broadcastsSent) * 100).toFixed(1) + '%' : '0%'
      return progressRates
    }
  }

  render () {
    const url = window.location.hostname
    var rates = this.calculateProgressRates(url)
    console.log('this.props.sentSeenGraph', this.props.sentSeenGraph)
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <form className='m-form m-form--fit m-form--label-align-right'>
                    <div className='m-portlet__body'>
                      <div className='form-group m-form__group row'>
                        <span htmlFor='example-text-input' className='col-form-label'>
                          Show records for last:&nbsp;&nbsp;
                        </span>
                        <div>
                          <input id='example-text-input' type='number' min='0' step='1' value={this.state.days} className='form-control' onKeyDown={this.onKeyDown} onChange={this.changeDays} />
                        </div>
                        <span htmlFor='example-text-input' className='col-form-label'>
                        &nbsp;&nbsp;days
                      </span>
                      </div>
                    </div>
                  </form>
                </li>
              </ul>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='tab-content'>
              <div className='row'>
                <div className='col-4'>
                  {url.includes('kibochat.cloudkibo.com')
                  ? <IconStack
                    path={this.props.platform === 'whatsApp' ? '/whatsAppChat' : 'smsChat'}
                    state={{}}
                    icon='flaticon-chat-1 m--font-light'
                    title={this.props.sentSeenData.sessions !== null ? this.props.sentSeenData.sessions : 0}
                    subtitle='Sessions'
                    iconStyle='success'
                  />
                : <IconStack
                  path={this.props.platform === 'whatsApp' ? '/whatsAppBroadcasts' : 'smsBroadcasts'}
                  state={{}}
                  icon='flaticon-paper-plane'
                  title={this.props.sentSeenData.broadcastsSent !== null ? this.props.sentSeenData.broadcastsSent : 0}
                  subtitle='Broadcasts Sent'
                  iconStyle='success'
                />
              }
                  <div className='m--space-30' />
                  {this.props.platform === 'whatsApp' && (url.includes('kiboengage.cloudkibo.com') || url.includes('3021')) &&
                    <ProgressBar
                      rate={rates.broadcastSeenConvertRate}
                      label='Seen rate'
                      progressStyle='success' />
                  }
                </div>
                <div className='col-8'>
                  {this.props.sentSeenGraph.length > 0
                  ? <LineChart width={600} height={300} data={this.props.sentSeenGraph}>
                    <XAxis dataKey='date' />
                    <YAxis />
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip />
                    <Legend />
                    {
                      url.includes('kiboengage.cloudkibo.com') &&
                      <Line type='monotone' dataKey='count' name='Broadcasts' stroke='#8884d8' activeDot={{r: 8}} />
                    }
                    {
                      url.includes('kibochat.cloudkibo.com') &&
                      <Line type='monotone' dataKey='count' name='Sessions' stroke='#A11644' activeDot={{r: 8}} />
                    }
                  </LineChart>
                  : <span>No records to show for the applied filter</span>
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

export default ProgressBox
