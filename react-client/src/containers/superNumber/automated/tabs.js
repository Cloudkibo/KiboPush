import React from 'react'
import PropTypes from 'prop-types'


class Tabs extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.updateTab = this.updateTab.bind(this)
  }
  updateTab (tab) {
    this.props.updateState({currentTab: tab})
  }

  render () {
    return (
      <div className='m-portlet__head'>
        <div className='m-portlet__head-tools'>
          <ul className='nav nav-tabs m-tabs m-tabs-line m-tabs-line--left m-tabs-line--primary'
            role='tablist' style={{cursor: 'pointer'}}>
            <li className='nav-item m-tabs__item' onClick={() => this.updateTab('settings')}>
              <span className={`nav-link m-tabs__link ${this.props.currentTab === 'settings' && 'active'}`}>
              Settings
            </span>
            </li>
            <li className='nav-item m-tabs__item' onClick={() => this.updateTab('messageLogs')}>
              <span className={`nav-link m-tabs__link ${this.props.currentTab === 'messageLogs' && 'active'}`}>
              Message Logs
            </span>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

Tabs.propTypes = {
  'currentTab': PropTypes.string.isRequired,
  'updateState': PropTypes.func.isRequired
}

export default Tabs
