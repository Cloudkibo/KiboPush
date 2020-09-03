/* eslint-disable no-useless-constructor */
import React from 'react'
import IconStack from '../Dashboard/IconStack'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'

class WhatsAppMetrics extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
    console.log('in component', this.props.lineChartData)
    return (
      <div className='m-portlet__body'>
          <div className='row'>
            <div className='col-md-4'>
              <IconStack
                icon='flaticon-business'
                title={this.props.metrics.companiesCount}
                subtitle='Total Companies'
                iconStyle='primary'
                id='companiesCount'
              />
            </div>
            <div className='col-md-4'>
              <IconStack
                icon='fa fa-users'
                title={this.props.metrics.activeSubscribersCount}
                subtitle='Active Subscribers'
                iconStyle='success'
                id='activeSubscribers'
              />
            </div>
            <div className='col-md-4'>
              <IconStack
                icon='fa fa-send'
                title={this.props.metrics.messagesSentCount}
                subtitle='Messages Sent'
                iconStyle='brand'
                id='messagesSent'
              />
            </div>
          </div>
          <div className='m--space-30'></div>
          <div className='row'>
            <div className='col-md-4'>
              <IconStack
                icon='fa fa-edit'
                title={this.props.metrics.templateMessagesSentCount}
                subtitle='Template Messages Sent'
                iconStyle='warning'
                id='templateMessagesSent'
              />
            </div>
            <div className='col-md-4'>
              <IconStack
                icon='fa fa-envelope'
                title={this.props.metrics.messagesReceivedCount}
                subtitle='Messages Received'
                iconStyle='info'
                id='messagesReceived'
              />
            </div>
            <div className='col-md-4'>
              <IconStack
                icon='fa fa-video-camera'
                title={this.props.metrics.zoomMeetingsCount}
                subtitle='Zoom Meetings Created'
                iconStyle='danger'
                id='zoomMeetings'
              />
            </div>
          </div>
          <br/><br/>
            <center>
              {this.props.lineChartData && this.props.lineChartData.length > 0
              ? <LineChart width={600} height={300} data={this.props.lineChartData}>
                  <XAxis dataKey='date' />
                  <YAxis />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='activeSubscribers' name='Active Subscribers' stroke='#5cb85c' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='messagesSent' name='Messages Sent' stroke='#716aca' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='templateMessagesSent' name='Template Messages Sent' stroke='#f0ad4e' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='messagesReceived' name='Messages Received' stroke='#5bc0de' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='zoomMeetings' name='Zoom Meetings' stroke='#d9534f' activeDot={{r: 8}} />
            </LineChart>
              : <span>No reports to show for the applied filters. Please change the filters</span>
            }
          </center>
        </div>
    )
  }
}

export default WhatsAppMetrics
