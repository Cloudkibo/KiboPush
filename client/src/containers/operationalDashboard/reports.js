/* eslint-disable no-useless-constructor */
import React from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'
class Reports extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>Reports</h3>
              </div>
            </div>
            <div className='m-portlet__head-tools'>
              <form className='m-form m-form--fit m-form--label-align-right' style={{marginLeft: '550px'}}>
                <div className='m-portlet__body'>
                  <div className='form-group m-form__group row'>
                    <label htmlFor='example-text-input' className='col-form-label'>
                      Show records for last:&nbsp;&nbsp;
                    </label>
                    <div>
                      <input id='example-text-input' type='number' min='0' step='1' value={this.props.selectedDays} className='form-control' onChange={this.props.onDaysChange} />
                    </div>
                    <label htmlFor='example-text-input' className='col-form-label'>
                    &nbsp;&nbsp;days
                  </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='tab-content'>
              <LineChart width={600} height={300} data={this.props.lineChartData} style={{marginLeft: '220px'}}>
                <XAxis dataKey='date' />
                <YAxis />
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='broadcastscount' stroke='#8884d8' activeDot={{r: 8}} />
                <Line type='monotone' dataKey='pollscount' stroke='#82ca9d' activeDot={{r: 8}} />
                <Line type='monotone' dataKey='surveyscount' stroke='#FF7F50' activeDot={{r: 8}} />
              </LineChart>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Reports
