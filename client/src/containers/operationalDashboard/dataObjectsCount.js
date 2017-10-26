/* eslint-disable no-useless-constructor */
import React from 'react'
import { Link } from 'react-router'
class dataObjectsCount extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div className='container'>
      <div className='row'>
        <main
          className='col-xl-4 push-xl-4 col-lg-12 push-lg-0 col-md-12 col-sm-12 col-xs-12'>
          <div id='subscribers' className='ui-block' style={{height: '50px'}} data-mh='friend-groups-item'>
            <div className='friend-item friend-groups' style={{height: '100px'}}>
              <div className='friend-item-content'>
                <div className='friend-avatar'>
                  <p>Subscribers</p>
                  <p>Users</p>
                </div>
              </div>
            </div>
          </div>

          <div id='polls' className='ui-block' data-mh='friend-groups-item' style={{height: '50px'}}>
            <div className='friend-item friend-groups' style={{height: '100px'}}>
              <div className='friend-item-content'>
                <div className='friend-avatar'>
                  <p>Polls</p>
                  <p>Subscribers</p>
                </div>
              </div>
            </div>
          </div>

        </main>
        <aside
          className='col-xl-4 pull-xl-4 col-lg-6 pull-lg-0 col-md-6 col-sm-12 col-xs-12'>
          <div id='pages' className='ui-block' data-mh='friend-groups-item' style={{height: '50px'}}>
            <div className='friend-item friend-groups' style={{height: '100px'}}>
              <div className='friend-item-content'>
                <div className='friend-avatar'>
                  <p>Pages</p>
                  <p>Pages</p>
                </div>
              </div>
            </div>
          </div>

          <div id='surveys' className='ui-block' data-mh='friend-groups-item' style={{height: '50px'}}>
            <div className='friend-item friend-groups' style={{height: '100px'}}>
              <div className='friend-item-content'>
                <div className='friend-avatar'>
                  <p>Surveys</p>
                  <p>Surveys</p>
                  <div className='author-content'>
                    <Link to='/surveys'
                      className='h5 author-name'>Surveys</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </aside>
        <aside className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12'>
          <div id='scheduled' className='ui-block' data-mh='friend-groups-item' style={{height: '50px'}}>
            <div className='friend-item friend-groups' style={{height: '100px'}}>
              <div className='friend-item-content'>
                <div className='friend-avatar'>
                  <p>Surveys</p>
                  <p>Polls</p>
                  <div className='author-content'>
                    <Link to='#' className='h5 author-name'>Scheduled
                      Broadcasts</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id='broadcasts' className='ui-block' data-mh='friend-groups-item' style={{height: '50px'}}>
            <div className='friend-item friend-groups' style={{height: '100px'}}>
              <div className='friend-item-content'>
                <div className='friend-avatar'>
                  <p>Broadcasts</p>
                  <p>Broadcasts</p>
                  <div className='author-content'>
                    <Link to='/broadcasts' className='h5 author-name'>Broadcasts</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </aside>
      </div>
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              { this.props.objectsData !== null && this.props.length > 0
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
                      <td>{this.props.objectsData[0].UsersCount}</td>
                      <td>{this.props.objectsData[0].UsersCount}</td>
                    </tr>
                    <tr>
                      <td>Subscribers</td>
                      <td>{this.props.objectsData[0].SubscribersCount}</td>
                    </tr>
                    <tr>
                      <td>Broadcasts</td>
                      <td>{this.props.objectsData[0].BroadcastsCount}</td>
                    </tr>
                    <tr>
                      <td>Surveys</td>
                      <td>{this.props.objectsData[0].SurveysCount}</td>
                    </tr>
                    <tr>
                      <td>Polls</td>
                      <td>{this.props.objectsData[0].PollsCount}</td>
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
    </div>
    )
  }
}

export default dataObjectsCount
