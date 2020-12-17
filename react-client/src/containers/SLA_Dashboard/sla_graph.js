/* eslint-disable no-useless-constructor */
import React from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from "recharts"
import moment from "moment"

const responseTimeColor = "#8884d8"

const resolveTimeColor = "#82ca9d"

class SLAGraph extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedValue: "10 days",
      chartData: false
    }
  }

  render() {
    return (
      <div className="tab-content">
        {this.props.graphData && this.props.graphData.length > 0 ? (
          <div className="row">
            <div className="col-md-4 col-lg-4 col-sm-4">
              <div className="m-widget1" style={{ paddingTop: "1.2rem" }}>
                <div className="m-widget1__item">
                  <div className="row m-row--no-padding align-items-center">
                    <div className="col">
                      <h3 className="m-widget1__title">Avg. Response Time</h3>
                    </div>
                    <div className="col m--align-right">
                      <span style={{ fontSize: "1.2rem", fontWeight: "500", color: responseTimeColor }}>
                        {moment.duration(this.props.avgResponseTime, "seconds").locale("en").humanize()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="m-widget1__item">
                  <div className="row m-row--no-padding align-items-center">
                    <div className="col">
                      <h3 className="m-widget1__title">Avg. Resolve Time</h3>
                    </div>
                    <div className="col m--align-right">
                      <span style={{ fontSize: "1.2rem", fontWeight: "500", color: resolveTimeColor }}>
                        {moment.duration(this.props.avgResolveTime, "seconds").locale("en").humanize()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-8 col-lg-8 col-sm-8">
              <LineChart width={550} height={300} data={this.props.graphData}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgResponseTime"
                  name="Avg. Response Time"
                  stroke={responseTimeColor}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="avgResolveTime"
                  name="Avg. Resolve Time"
                  stroke={resolveTimeColor}
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
