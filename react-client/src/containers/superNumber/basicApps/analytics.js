import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'
import PropTypes from 'prop-types'
import IconStack from '../../../components/Dashboard/IconStack'
import moment from 'moment'
import { getStartEndDates } from '../../../utility/utils'

class WidgetAnalytics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        chartData: []
    }
    this.setChartData = this.setChartData.bind(this)
    this.prepareLineChartData = this.prepareLineChartData.bind(this)
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.getDays = this.getDays.bind(this)
  }

  componentDidMount() {
    let {startDate, endDate} = getStartEndDates(parseInt(this.props.selectedDate))
    this.setState({startDate, endDate})
    this.props.fetchWidgetAnalytics({startDate, endDate, widgetType: this.props.widgetType, selectedDate: this.props.selectedDate})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.widgetAnalytics && nextProps.widgetAnalytics.graphDatas) {
        this.setChartData(nextProps.widgetAnalytics.graphDatas)
      }
  }

  getDays () {
    var date1 = new Date(this.props.startDate)
    var date2 = new Date(this.props.endDate)
    var Difference_In_Time = date2.getTime() - date1.getTime()
    return  (Difference_In_Time / (1000 * 3600 * 24))
  }

  setChartData (graphData) {
    let buttonClicks = []
    if (graphData && graphData.length > 0) {
        buttonClicks = this.includeZeroCounts(graphData)
    }
    let dataChart = this.prepareLineChartData(buttonClicks)
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

  prepareLineChartData (buttonClicks) {
    var dataChart = []
    if (buttonClicks && buttonClicks.length > 0) {
      for (var i = 0; i < buttonClicks.length; i++) {
        var record = {}
        record.date = buttonClicks[i].date
        record.buttonClicks = buttonClicks[i].count
        dataChart.push(record)
      }
    }
    return dataChart
  }

  render() {
    return (
      <div>
        {this.props.loading
        ? <span>
            <p> Loading... </p>
          </span>
        : <div>
            <div className='col-md-4'>
                <IconStack
                    icon='fa fa-hand-pointer-o'
                    title={this.props.widgetAnalytics && this.props.widgetAnalytics.clicksCount}
                    subtitle='Button Clicks'
                    iconStyle='primary'
                    id='confirmationCount'
                />
            </div>
            <br/><br/>
            <center>
                {this.state.chartData && this.state.chartData.length > 0 &&
                    <LineChart width={600} height={300} data={this.state.chartData}>
                        <XAxis dataKey='date' />
                        <YAxis allowDecimals={false} />
                        <CartesianGrid strokeDasharray='3 3' />
                        <Tooltip />
                        <Legend />
                        <Line type='monotone' dataKey='buttonClicks' name='Button Clicks' stroke='#5bc0de' activeDot={{r: 8}} />
                    </LineChart>
                }
            </center>
            <br/><br/>
            {this.props.widgetAnalytics && this.props.widgetAnalytics.pageData.length > 0 && 
                <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
                        <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                            style={{ height: '53px' }}>
                            <th data-field='pageUrl'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '250px' }}>Page URL</span>
                            </th>
                            <th data-field='clicks'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Button Clicks</span>
                            </th>
                            </tr>
                        </thead>
                        <tbody className='m-datatable__body'>
                            {this.props.widgetAnalytics.pageData.map((page, i) => (
                                <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{ height: '55px' }} key={i}>
                                <td data-field='pageUrl' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '250px' }}>{page._id}</span></td>
                                <td data-field='clicks' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{page.count}</span></td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            }
        </div>
        }
      </div>
    )
  }
}

WidgetAnalytics.propTypes = {
    'selectedDate': PropTypes.string.isRequired,
    'startDate': PropTypes.string.isRequired,
    'endDate': PropTypes.string.isRequired,
    'fetchWidgetAnalytics': PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    widgetAnalytics: (state.superNumberInfo.widgetAnalytics),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WidgetAnalytics)
