/* eslint-disable no-useless-constructor */
import React from 'react'
class dataObjectsCount extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div className='container'>
        { this.props.objectsData !== null && this.props.length > 0
        ? <div className='row'>
          <main
            className='col-xl-4 push-xl-4 col-lg-12 push-lg-0 col-md-12 col-sm-12 col-xs-12'>
            <div id='users' className='ui-block' style={{height: '50px'}} data-mh='friend-groups-item'>
              <div className='friend-item friend-groups' style={{height: '100px'}}>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    {
                    this.props.objectsData.UsersCount && this.props.objectsData.UsersCount.length > 0 &&
                    <p><b>{this.props.objectsData.UsersCount[0].count}</b></p>
                    }
                    <p><b>Users</b></p>
                  </div>
                </div>
              </div>
            </div>
            <div id='subscribers' className='ui-block' data-mh='friend-groups-item' style={{height: '50px'}}>
              <div className='friend-item friend-groups' style={{height: '100px'}}>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    {
                    this.props.objectsData.SubscribersCount && this.props.objectsData.SubscribersCount.length > 0 &&
                    <p><b>{this.props.objectsData.SubscribersCount[0].count}</b></p>
                    }
                    <p><b>Subscribers</b></p>
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
                    {
                    this.props.objectsData.PagesCount && this.props.objectsData.PagesCount.length > 0 &&
                    <p><b>{this.props.objectsData.PagesCount[0].count}</b></p>
                    }
                    <p><b>Pages</b></p>
                  </div>
                </div>
              </div>
            </div>
            <div id='surveys' className='ui-block' data-mh='friend-groups-item' style={{height: '50px'}}>
              <div className='friend-item friend-groups' style={{height: '100px'}}>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    {
                    this.props.objectsData.SurveysCount && this.props.objectsData.SurveysCount.length > 0 &&
                    <p><b>{this.props.objectsData.SurveysCount[0].count}</b></p>
                    }
                    <p><b>Surveys</b></p>
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
                    {
                    this.props.objectsData.PollsCount && this.props.objectsData.PollsCount.length > 0 &&
                    <p><b>{this.props.objectsData.PollsCount[0].count}</b></p>
                    }
                    <p><b>Polls</b></p>
                  </div>
                </div>
              </div>
            </div>

            <div id='broadcasts' className='ui-block' data-mh='friend-groups-item' style={{height: '50px'}}>
              <div className='friend-item friend-groups' style={{height: '100px'}}>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    {
                    this.props.objectsData.BroadcastsCount && this.props.objectsData.BroadcastsCount.length > 0 &&
                    <p><b>{this.props.objectsData.BroadcastsCount[0].count}</b></p>
                    }
                    <p><b>Broadcasts</b></p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
        : <p>No data to display </p>
        }
      </div>
    )
  }
}

export default dataObjectsCount
