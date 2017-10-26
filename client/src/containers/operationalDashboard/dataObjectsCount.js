/* eslint-disable no-useless-constructor */
import React from 'react'
class dataObjectsCount extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              { this.props.objectsData !== null
              ? <div className='table-responsive'>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Data Item</th>
                      <th>Total Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Users</td>
                      <td>{this.props.objectsData[0].UsersCount.count}</td>
                    </tr>
                    <tr>
                      <td>Subscribers</td>
                      <td>{this.props.objectsData[0].SubscribersCount.count}</td>
                    </tr>
                    <tr>
                      <td>Pages</td>
                      <td>{this.props.objectsData[0].PagesCount.count}</td>
                    </tr>
                    <tr>
                      <td>Broadcasts</td>
                      <td>{this.props.objectsData[0].BroadcastsCount.count}</td>
                    </tr>
                    <tr>
                      <td>Surveys</td>
                      <td>{this.props.objectsData[0].SurveysCount.count}</td>
                    </tr>
                    <tr>
                      <td>Polls</td>
                      <td>{this.props.objectsData[0].PollsCount.count}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              : <div className='table-responsive'>
                <p> No data to display </p>
              </div>
            }
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default dataObjectsCount
