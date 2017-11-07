/* eslint-disable no-useless-constructor */
import React from 'react'
class dataObjectsCount extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div className='container'>
        {
          this.props.objectsData !== null && this.props.length > 0
          ? <div>
            <div className='row'>
              <div className='col-xl-4 col-sm-12'>
                <div className='op-dash-card text-white op-dash-bg-primary op-dash-o-hidden h-100'>
                  <div className='op-dash-card-body'>
                    <div className='op-dash-card-body-icon'>
                      <i className='fa fa-fw fa-users' />
                    </div>
                    <div className='dashboard-huge'>{(this.props.objectsData.UsersCount && this.props.objectsData.UsersCount.length > 0) ? this.props.objectsData.UsersCount[0].count : 0}</div>
                    <div className='mr-5'>Users!</div>
                  </div>
                </div>
              </div>
              <div className='col-xl-4 col-sm-12'>
                <div className='op-dash-card text-white op-dash-bg-warning op-dash-o-hidden h-100'>
                  <div className='op-dash-card-body'>
                    <div className='op-dash-card-body-icon'>
                      <i className='fa fa-fw fa-facebook' />
                    </div>
                    <div className='dashboard-huge'>{(this.props.objectsData.PagesCount && this.props.objectsData.PagesCount.length > 0) ? this.props.objectsData.PagesCount[0].count : 0}</div>
                    <div className='mr-5'>Pages!</div>
                  </div>
                </div>
              </div>
              <div className='col-xl-4 col-sm-12'>
                <div className='op-dash-card text-white op-dash-bg-success op-dash-o-hidden h-100'>
                  <div className='op-dash-card-body'>
                    <div className='op-dash-card-body-icon'>
                      <i className='fa fa-fw fa-users' />
                    </div>
                    <div className='dashboard-huge'>{(this.props.objectsData.SubscribersCount && this.props.objectsData.SubscribersCount.length > 0) ? this.props.objectsData.SubscribersCount[0].count : 0}</div>
                    <div className='mr-5'>Subscribers!</div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className='row'>
              <div className='col-xl-4 col-sm-12'>
                <div className='op-dash-card text-white op-dash-bg-purple op-dash-o-hidden h-100'>
                  <div className='op-dash-card-body'>
                    <div className='op-dash-card-body-icon'>
                      <i className='fa fa-fw fa-bullhorn' />
                    </div>
                    <div className='dashboard-huge'>{(this.props.objectsData.BroadcastsCount && this.props.objectsData.BroadcastsCount.length > 0) ? this.props.objectsData.BroadcastsCount[0].count : 0}</div>
                    <div className='mr-5'>Broadcasts!</div>
                  </div>
                </div>
              </div>
              <div className='col-xl-4 col-sm-12'>
                <div className='op-dash-card text-white op-dash-bg-danger op-dash-o-hidden h-100'>
                  <div className='op-dash-card-body'>
                    <div className='op-dash-card-body-icon'>
                      <i className='fa fa-fw fa-list' />
                    </div>
                    <div className='dashboard-huge'>{(this.props.objectsData.PollsCount && this.props.objectsData.PollsCount.length > 0) ? this.props.objectsData.PollsCount[0].count : 0}</div>
                    <div className='mr-5'>Polls!</div>
                  </div>
                </div>
              </div>
              <div className='col-xl-4 col-sm-12'>
                <div className='op-dash-card text-white op-dash-bg-grey op-dash-o-hidden h-100'>
                  <div className='op-dash-card-body'>
                    <div className='op-dash-card-body-icon'>
                      <i className='fa fa-fw fa-list-alt' />
                    </div>
                    <div className='dashboard-huge'>{(this.props.objectsData.SurveysCount && this.props.objectsData.SurveysCount.length > 0) ? this.props.objectsData.SurveysCount[0].count : 0}</div>
                    <div className='mr-5'>Surveys!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        : <p>No data to display </p>
        }
      </div>
    )
  }
}

export default dataObjectsCount
