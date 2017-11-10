/* eslint-disable no-useless-constructor */
import React from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'
class Reports extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div style={{boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', margin: '10px', borderRadius: '5px', border: '1px solid #ccc'}} className='card'>
        <div style={{width: '100%', padding: '1rem'}} className='card-block'>
          <div style={{display: 'inline-block', padding: '20px'}}>
            <h4 className='card-title'><i className={this.props.iconClassName} aria-hidden='true' /> {this.props.title}</h4>
          </div>
          <div className='pull-right' style={{display: 'inline-block', padding: '10px'}}>
            <div style={{width: '100%', textAlign: 'center'}}>
              <div onClick={() => this.props.hideContent(this.props.title)} style={{cursor: 'pointer', display: 'inline-block', padding: '10px'}}>
                <h4><i className='fa fa-chevron-circle-up' aria-hidden='true' /></h4>
              </div>
              <div style={{display: 'inline-block', padding: '10px'}} />
            </div>
          </div>
          <div className='row'>
            <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges' style={{textAlign: 'center'}}>
                  <LineChart width={600} height={300} data={this.props.lineChartData} margin={{top: 5, right: 20, left: 20, bottom: 5}}>
                    <XAxis dataKey='date' />
                    <YAxis />
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='count' stroke='#8884d8' activeDot={{r: 8}} />
                  </LineChart>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default Reports
