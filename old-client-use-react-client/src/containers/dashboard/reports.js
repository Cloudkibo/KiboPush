/* eslint-disable no-useless-constructor */
import React from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'
class Reports extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onKeyDown = this.onKeyDown.bind(this)
  }
  onKeyDown (e) {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }
  render () {
    const url = window.location.hostname
    return (
      <center>
        {this.props.lineChartData && this.props.lineChartData.length > 0
        ? <LineChart width={600} height={300} data={this.props.lineChartData}>
          <XAxis dataKey='date' />
          <YAxis />
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          <Legend />
          {
            url.includes('kiboengage.cloudkibo.com') &&
            <Line type='monotone' dataKey='broadcastscount' name='Broadcasts' stroke='#8884d8' activeDot={{r: 8}} />
          }
          {
            url.includes('kiboengage.cloudkibo.com') &&
            <Line type='monotone' dataKey='pollscount' name='Polls' stroke='#82ca9d' activeDot={{r: 8}} />
          }
          {
            url.includes('kiboengage.cloudkibo.com') &&
            <Line type='monotone' dataKey='surveyscount' name='Surveys' stroke='#FF7F50' activeDot={{r: 8}} />
          }
          {
            url.includes('kibochat.cloudkibo.com') &&
            <Line type='monotone' dataKey='sessionscount' name='Sessions' stroke='#A11644' activeDot={{r: 8}} />
          }
        </LineChart>
        : <span>No reports to show for the applied filters. Please change the filters</span>
      }
      </center>
    )
  }
}

export default Reports
