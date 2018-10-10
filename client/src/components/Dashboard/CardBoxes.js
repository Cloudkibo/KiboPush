/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'

class CardBoxes extends React.Component {
  render () {
    return (
      <div className='col-xl-12'>
        <div className='row m-row--full-height'>
          <div className='col-sm-3 col-md-3 col-lg-3'>
            <div className='m-portlet m-portlet--border-bottom-brand'>
              <div className='m-portlet__body'>
                <div className='m-widget26'>
                  <div className='m-widget26__number'>
                    {this.props.data.totalPages ? this.props.data.totalPages : 0}
                    <small>
                      Total Pages
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-3 col-md-3 col-lg-3'>
            <div className='m-portlet m-portlet--border-bottom-success'>
              <div className='m-portlet__body'>
                <div className='m-widget26'>
                  <div className='m-widget26__number'>
                    {this.props.data.pages ? this.props.data.pages : 0}
                    <small>
                      Connected Pages
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-3 col-md-3 col-lg-3'>
            <div className='m-portlet m-portlet--border-bottom-danger'>
              <div className='m-portlet__body'>
                <div className='m-widget26'>
                  <div className='m-widget26__number'>
                    {this.props.data.subscribers ? this.props.data.subscribers : 0}
                    <small>
                      Subscribers
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-3 col-md-3 col-lg-3'>
            <div className='m-portlet m-portlet--border-bottom-accent'>
              <div className='m-portlet__body'>
                <div className='m-widget26'>
                  <div className='m-widget26__number'>
                    {this.props.data.unreadCount ? this.props.data.unreadCount : 0}
                    <small>
                      New Messages
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CardBoxes
