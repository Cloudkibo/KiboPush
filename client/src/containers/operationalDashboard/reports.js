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
              <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                <li className='nav-item m-tabs__item' />
                <li className='nav-item m-tabs__item' />
                <li className='nav-item m-tabs__item'>
                  <form className='m-form m-form--fit m-form--label-align-right'>
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
                </li>
              </ul>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='tab-content'>
              <center>
                <LineChart width={600} height={300} data={this.props.lineChartData}>
                  <XAxis dataKey='date' />
                  <YAxis />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='broadcastscount' name='Broadcasts' stroke='#8884d8' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='pollscount' name='Polls' stroke='#82ca9d' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='surveyscount' name='Surveys' stroke='#FF7F50' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='sessionscount' name='Sessions' stroke='#A11644' activeDot={{r: 8}} />
                </LineChart>
              </center>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Reports
