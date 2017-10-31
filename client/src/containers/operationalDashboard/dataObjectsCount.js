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
                    this.props.objectsData.UsersCount &&
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
                    this.props.objectsData.SubscribersCount &&
                    <p><b>{this.props.objectsData.SubscribersCount[0].count}</b></p>
                    }
                    <p><b>Subscribers</b></p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        : <p>No data to display </p>
        }
      </div>
    )
  }
}

export default dataObjectsCount
