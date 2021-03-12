import React from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'
import PropTypes from 'prop-types'
import IconStack from '../../components/Dashboard/IconStack'
import moment from 'moment'

class PeriodicAnalytics extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      chartData: []
    }
    this.setChartData = this.setChartData.bind(this)
    this.prepareLineChartData = this.prepareLineChartData.bind(this)
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.getDays = this.getDays.bind(this)
  }

  UNSAFE_componentWillMount () {
    if (this.props.graphDatas) {
      this.setChartData(this.props.graphDatas)
    }
  }

  UNSAFE_componentWillReceiveProps (nextprops) {
    if (nextprops.graphDatas) {
      this.setChartData(nextprops.graphDatas)
    }
  }

  getDays () {
    var date1 = new Date(this.props.startDate)
    var date2 = new Date(this.props.endDate)
    var Difference_In_Time = date2.getTime() - date1.getTime()
    return  (Difference_In_Time / (1000 * 3600 * 24))
  }

  setChartData (graphData) {
    let confirmation = []
    let shipment = []
    let abandoned = []
    let cod = []
    if (graphData.confirmation && graphData.confirmation.length > 0) {
      confirmation = this.includeZeroCounts(graphData.confirmation)
    }
    if (graphData.shipment && graphData.shipment.length > 0) {
      shipment = this.includeZeroCounts(graphData.shipment)
    }
    if (graphData.abandoned && graphData.abandoned.length > 0) {
      abandoned = this.includeZeroCounts(graphData.abandoned)
    }
    if (graphData.cod && graphData.cod.length > 0) {
      cod = this.includeZeroCounts(graphData.cod)
    }
    let dataChart = this.prepareLineChartData(
      confirmation, shipment, abandoned, cod)
    this.setState({chartData: dataChart})
  }

  includeZeroCounts (data) {
    var dataArray = []
    var days = this.getDays()
    var index = 0
    var varDate = moment()
    for (var i = 0; i < days; i++) {
      for (var j = 0; j < data.length; j++) {
        var recordId = data[j]._id
        var date = `${recordId.year}-${recordId.month}-${recordId.day}`
        var loopDate = moment(varDate).format('YYYY-MM-DD')
        if (moment(date).isSame(loopDate, 'day')) {
          var d = {}
          d.date = loopDate
          d.count = data[j].count
          dataArray.push(d)
          varDate = moment(varDate).subtract(1, 'days')
          index = 0
          break
        }
        index++
      }
      if (index === data.length) {
        var obj = {}
        obj.date = varDate.format('YYYY-MM-DD')
        obj.count = 0
        dataArray.push(obj)
        varDate = moment(varDate).subtract(1, 'days')
        index = 0
      }
    }
    return dataArray.reverse()
  }

  prepareLineChartData (confirmation, shipment, abandoned, cod) {
    var dataChart = []
    if (confirmation && confirmation.length > 0) {
      for (var i = 0; i < confirmation.length; i++) {
        var record = {}
        record.date = confirmation[i].date
        if (shipment && shipment.length > 0) {
          record.shipment = shipment[i].count
        } else {
          record.shipment = 0
        }
        if (abandoned && abandoned.length > 0) {
          record.abandoned = abandoned[i].count
        } else {
          record.abandoned = 0
        }
        if (cod && cod.length > 0) {
          record.cod = cod[i].count
        } else {
          record.cod = 0
        }
        record.confirmation = confirmation[i].count
        dataChart.push(record)
      }
    } else if (shipment && shipment.length > 0) {
      for (var j = 0; j < shipment.length; j++) {
        var record1 = {}
        record1.date = shipment[j].date
        if (confirmation && confirmation.length > 0) {
          record1.confirmation = confirmation[j].count
        } else {
          record1.confirmation = 0
        }
        if (abandoned && abandoned.length > 0) {
          record1.abandoned = abandoned[j].count
        } else {
          record1.abandoned = 0
        }
        if (cod && cod.length > 0) {
          record1.cod = cod[j].count
        } else {
          record1.cod = 0
        }
        record1.shipment = shipment[j].count
        dataChart.push(record1)
      }
    } else if (abandoned && abandoned.length > 0) {
      for (var k = 0; k < abandoned.length; k++) {
        var record2 = {}
        record2.date = abandoned[k].date
        if (confirmation && confirmation.length > 0) {
          record2.confirmation = confirmation[k].count
        } else {
          record2.confirmation = 0
        }
        if (shipment && shipment.length > 0) {
          record2.shipment = shipment[k].count
        } else {
          record2.shipment = 0
        }
        if (cod && cod.length > 0) {
          record2.cod = cod[k].count
        } else {
          record2.cod = 0
        }
        record2.abandoned = abandoned[k].count
        dataChart.push(record2)
      }
    } else if (cod && cod.length > 0) {
      for (var l = 0; l < cod.length; l++) {
        var record3 = {}
        record3.date = cod[l].date
        if (confirmation && confirmation.length > 0) {
          record3.confirmation = confirmation[l].count
        } else {
          record3.confirmation = 0
        }
        if (shipment && shipment.length > 0) {
          record3.shipment = shipment[l].count
        } else {
          record3.shipment = 0
        }
        if (abandoned && abandoned.length > 0) {
          record3.abandoned = abandoned[l].count
        } else {
          record3.abandoned = 0
        }
        record3.cod = cod[l].count
        dataChart.push(record3)
      }
    }
    return dataChart
  }
  render () {
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>
                  Periodic Analytics
                </h3>
              </div>
            </div>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                <li className='nav-item m-tabs__item' />
                <li className='nav-item m-tabs__item' style={{marginRight: '10px'}}>
                  <div className='form-row'>
                    <div className='col-md-12' style={{ display: 'inherit' }}>
                      <span style={{marginTop: '7px', marginRight: '10px'}}>Type:</span>
                        <div className='col-md-10'>
                          <select onChange={this.props.setAutomated} className="form-control m-input" value={this.props.automated}>
                          <option value={true}>Automated</option>
                          <option value={false}>Manual</option>
                        </select>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          </div>
          <div className='m-portlet__body'>
            <div className='row'>
              <div className='col-md-4'>
                <IconStack
                  icon='fa fa-check-square-o'
                  title={this.props.confirmationCount}
                  subtitle='Order Confirmation Messages'
                  iconStyle='primary'
                  id='confirmationCount'
                />
              </div>
              <div className='col-md-4'>
                <IconStack
                  icon='fa fa-truck'
                  title={this.props.shipmentCount}
                  subtitle='Order Shipment Messages'
                  iconStyle='success'
                  id='shipmentCount'
                />
              </div>
              <div className='col-md-4'>
                <IconStack
                  icon='fa fa-shopping-cart'
                  title={this.props.abandonedCount}
                  subtitle='Abandoned Cart Messages'
                  iconStyle='brand'
                  id='abandonedCount'
                />
              </div>
            </div>
            <div className='m--space-30'></div>
            {this.props.automated &&
              <div className='row'>
                <div className='col-md-4'>
                  <IconStack
                    icon='fa fa-money'
                    title={this.props.codCount}
                    subtitle='COD Order Confirmation Messages'
                    iconStyle='warning'
                    id='codCount'
                  />
                </div>
              </div>
            }
            <br/><br/>
              <center>
                {this.state.chartData && this.state.chartData.length > 0
                ? <LineChart width={600} height={300} data={this.state.chartData}>
                    <XAxis dataKey='date' />
                    <YAxis />
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='confirmation' name='Order Conformation' stroke='#5bc0de' activeDot={{r: 8}} />
                    <Line type='monotone' dataKey='shipment' name='Order Shipment' stroke='#5cb85c' activeDot={{r: 8}} />
                    <Line type='monotone' dataKey='abandoned' name='Abandoned Cart' stroke='#716aca' activeDot={{r: 8}} />
                    {this.props.automated &&
                      <Line type='monotone' dataKey='cod' name='COD Order Confirmation' stroke='#f0ad4e' activeDot={{r: 8}} />
                    }
              </LineChart>
                : <span>No anayltics to show for the applied filters. Please change the filters</span>
              }
            </center>
          </div>
        </div>
      </div>
    )
  }
}

PeriodicAnalytics.propTypes = {
  'setAutomated': PropTypes.func.isRequired,
  'automated': PropTypes.bool.isRequired,
  'confirmationCount': PropTypes.number.isRequired,
  'abandonedCount': PropTypes.number.isRequired,
  'shipmentCount': PropTypes.number.isRequired,
  'codCount': PropTypes.number.isRequired,
  'graphDatas': PropTypes.object.isRequired,
  'startDate': PropTypes.string.isRequired,
  'endDate': PropTypes.string.isRequired,
}

export default PeriodicAnalytics
