/* eslint-disable no-useless-constructor */
import React from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'
class Reports extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedValue: '10 days',
      chartData: false
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.week && this.state.selectedValue === '10 days') {
      this.setState({chartData: this.transformData(nextProps.week)})
    }
  }

  transformData (data) {
    if (data) {
      let transformed = data.map((item) => {
        return {
          date: item.createdAt.slice(0, 10),
          surveyscount: item.totalSurveys,
          pollscount: item.totalPolls,
          broadcastscount: item.totalBroadcasts,
          sessionscount: 0
        }
      })
      // Removing duplicate dates
      let temp = {}
      let newArr = transformed.reverse()
      for (let a = 0; a < newArr.length; a++) {
        let item = newArr[a]
        temp[item.date] = item
      }
      transformed = Object.values(temp)
      return transformed
    } else {
      return {}
    }
  }

  onChange (event) {
    this.setState({selectedValue: event.target.value})
    switch (event.target.value) {
      case '10 days':
        console.log('Weekly Data', this.transformData(this.props.week))
        this.setState({chartData: this.transformData(this.props.week)})
        break
      case '30 days':
        console.log('Monthly Data', this.transformData(this.props.month))
        this.setState({chartData: this.transformData(this.props.month)})
        break
      case '1 year':
        console.log('One Year Data')
        break

      default:
        break
    }
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
                      <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.selectedValue} onChange={this.onChange.bind(this)}>
                        <option value='' disabled>Filter by last</option>
                        <option value='10 days'>10 days</option>
                        <option value='30 days'>30 days</option>
                      </select>
                    </div>
                  </form>
                </li>
              </ul>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='tab-content'>
              {this.state.chartData && this.state.chartData.length > 0
              ? <center>
                <LineChart width={600} height={300} data={this.state.chartData}>
                  <XAxis dataKey='date' />
                  <YAxis />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='broadcastscount' name='Broadcasts' stroke='#8884d8' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='pollscount' name='Polls' stroke='#82ca9d' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='surveyscount' name='Surveys' stroke='#FF7F50' activeDot={{r: 8}} />
                </LineChart>
              </center>
               : <center>
                No data for selected number of days
              </center>
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Reports
