import React from 'react'
import PropTypes from 'prop-types'

class Notifications extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.getNotificationItem = this.getNotificationItem.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
  }

  getNotificationItem (notification) {
    if (notification.seen === true) {
      return (
        <div className='m-list-timeline__item m-list-timeline__item--read'>
          <span className='m-list-timeline__badge' />
          <span
            className='m-list-timeline__text'
            onClick={() => this.props.gotoView(notification.category.id, notification._id)}
            style={{ cursor: 'pointer' }}
          >
            {notification.message}
          </span>
          <span className='m-list-timeline__time' style={{ width: '100px' }}>
            {notification.date}
          </span>
        </div>
      )
    } else {
      return (
        <div className='m-list-timeline__item'>
          <span className='m-list-timeline__badge m-list-timeline__badge--brand' />
          <span
            className='m-list-timeline__text'
            onClick={() => this.props.gotoView(notification.category.id, notification._id, notification.category.type, true)}
            style={{ cursor: 'pointer' }}
          >
            {notification.message}
          </span>
          <span className='m-list-timeline__time' style={{ width: '100px' }}>
            {notification.date}
          </span>
        </div>
      )
    }
  }

  onLoadMore () {
    const lastId = this.props.notifications[this.props.notifications.length - 1]._id
    this.props.fetchNotifications(lastId)
  }

  render() {
    return (
      <li style={{ marginRight: '10px', padding: '0' }} className='m-nav__item m-topbar__notifications m-topbar__notifications--img m-dropdown m-dropdown--large m-dropdown--header-bg-fill m-dropdown--arrow m-dropdown--align-center m-dropdown--mobile-full-width' data-dropdown-toggle='click' data-dropdown-persistent="true" aria-expanded="true">
        <span className='m-nav__link m-dropdown__toggle' id='m_topbar_notification_icon'>
          {
            this.props.unreadNotifications > 0 &&
            <span className='m-nav__link-badge m-badge m-badge--dot m-badge--dot-small m-badge--danger' />
          }
          {
            this.props.unreadNotifications > 0
            ? <span className='m-nav__link-icon m-animate-shake'>
              <i className='flaticon-music-2' />
            </span>
            : <span className='m-nav__link-icon'>
              <i className='flaticon-music-2' />
            </span>
          }
        </span>
        <div className='m-dropdown__wrapper'>
          <span className='m-dropdown__arrow m-dropdown__arrow--center' />
          <div className='m-dropdown__inner'>
            <div className='m-dropdown__header' style={{ background: 'assets/app/media/img/misc/notification_bg.jpg', backgroundSize: 'cover', height: '100px' }}>
              <div className='m--align-center'>
                {
                  this.props.unreadNotifications && this.props.unreadNotifications > 0
                  ? <span className='m-dropdown__header-title'>
                    {this.props.unreadNotifications} Unread
                  </span>
                  : <span className='m-dropdown__header-title'>
                    No New
                  </span>
                }
                <span className='m-dropdown__header-subtitle'>
                  Notifications
                </span>
              </div>
              {
                this.props.user && this.props.user.platform === 'messenger' &&
                <div className='m--align-right' style={{position: 'relative', top: '-40px'}}><i onClick={this.props.goToSettings} style={{fontSize: '2rem', cursor: 'pointer', color: 'white'}} className='la la-gear'/></div>
              }
            </div>
            {
              this.props.notifications.length > 0 &&
              <div className='m-dropdown__body'>
                <div className='m-dropdown__content'>
                  <div className='tab-content'>
                    <div className='tab-pane active' id='topbar_notifications_notifications' role='tabpanel' aria-expanded='true'>
                      <div className='tab-pane active m-scrollable' role='tabpanel'>
                        <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                          <div style={{ height: '300px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom' }} className='m-messenger__messages'>
                            <div style={{ position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr' }}>
                              <div style={{ position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto' }} >
                                <div className='m-list-timeline m-list-timeline--skin-light'>
                                  <div className='m-list-timeline__items'>
                                    {
                                      this.props.notifications.map((notification, i) => (
                                        this.getNotificationItem(notification)
                                      ))
                                    }
                                  </div>
                                  {
                                    this.props.loadingMoreNotifications
                                    ? <div className='align-center'>
                                      <center>
                                        <div className="m-loader" style={{ width: "30px", display: "inline-block" }}></div>
                                        <span>Loading...</span>
                                      </center>
                                    </div>
                                    : this.props.totalNotifications > 0 &&
                                    this.props.totalNotifications > this.props.notifications.length &&
                                    <center style={{ marginBottom: '15px' }}>
                                      <i className='fa fa-refresh' style={{ color: '#716aca' }} />&nbsp;
                                      <button
                                        id='load-more-chat-sessions'
                                        className='m-link'
                                        style={{
                                          color: '#716aca',
                                          cursor: 'pointer',
                                          marginTop: '20px',
                                          border: 'none'
                                        }}
                                        onClick={this.onLoadMore}
                                      >
                                        Load More
                                      </button>
                                    </center>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </li>
    )
  }
}

Notifications.propTypes = {
  'notifications': PropTypes.array.isRequired,
  'unreadNotifications': PropTypes.number.isRequired,
  'totalNotifications': PropTypes.number.isRequired,
  'user': PropTypes.object.isRequired,
  'gotoView': PropTypes.func.isRequired,
  'goToSettings': PropTypes.func.isRequired,
  'loadingMoreNotifications': PropTypes.bool.isRequired,
  'fetchNotifications': PropTypes.func.isRequired
}

export default Notifications
