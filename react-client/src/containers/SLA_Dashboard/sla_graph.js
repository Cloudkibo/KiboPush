/* eslint-disable no-useless-constructor */
import React from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'
import moment from 'moment'

const avgResponseTimeColor = '#8884d8'
const avgResolveTimeColor = '#82ca9d'
const maxResponseTimeColor = '#d9534f'

class SLAGraph extends React.Component {
  render() {
    return (
      <div className='tab-content'>
        {this.props.graphData && this.props.graphData.length > 0 ? (
          <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
              <div className='m-widget1' style={{ paddingTop: '1.2rem' }}>
                <div className='m-widget1__item'>
                  <div className='row m-row--no-padding align-items-center'>
                    <div className='col'>
                      <h3 className='m-widget1__title'>Avg. Response Time</h3>
                    </div>
                    <div className='col m--align-right'>
                      <span style={{ fontSize: '1.2rem', fontWeight: '500', color: avgResponseTimeColor }}>
                        {moment.duration(this.props.avgResponseTime, 'seconds').locale('en').humanize()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='m-widget1__item'>
                  <div className='row m-row--no-padding align-items-center'>
                    <div className='col'>
                      <h3 className='m-widget1__title'>Avg. Resolve Time</h3>
                    </div>
                    <div className='col m--align-right'>
                      <span style={{ fontSize: '1.2rem', fontWeight: '500', color: avgResolveTimeColor }}>
                        {moment.duration(this.props.avgResolveTime, 'seconds').locale('en').humanize()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='m-widget1__item'>
                  <div className='row m-row--no-padding align-items-center'>
                    <div className='col'>
                      <h3 className='m-widget1__title'>Max Response Time</h3>
                    </div>
                    <div className='col m--align-right'>
                      <span style={{ fontSize: '1.2rem', fontWeight: '500', color: maxResponseTimeColor }}>
                        {moment.duration(this.props.maxResponseTime, 'seconds').locale('en').humanize()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-md-8 col-lg-8 col-sm-8'>
              <LineChart width={550} height={300} data={this.props.graphData}>
                <XAxis dataKey='date' />
                <YAxis />
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='avgResponseTime'
                  name='Avg. Response Time'
                  stroke={avgResponseTimeColor}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type='monotone'
                  dataKey='avgResolveTime'
                  name='Avg. Resolve Time'
                  stroke={avgResolveTimeColor}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type='monotone'
                  dataKey='maxResponseTime'
                  name='Max Response Time'
                  stroke={maxResponseTimeColor}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </div>
          </div>
        ) : (
          <center>No data for past {this.props.days} days</center>
        )}
      </div>
    )
  }
}

export default SLAGraph