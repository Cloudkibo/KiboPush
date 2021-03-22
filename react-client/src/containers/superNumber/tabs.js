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
            {this.props.showMessageLogs &&
            <li className='nav-item m-tabs__item' onClick={() => this.updateTab('messageLogs')}>
              <span className={`nav-link m-tabs__link ${this.props.currentTab === 'messageLogs' && 'active'}`}>
              Message Logs
            </span>
            </li>
            }
            {this.props.showAnalytics &&
            <li className='nav-item m-tabs__item' onClick={() => this.updateTab('analytics')}>
              <span className={`nav-link m-tabs__link ${this.props.currentTab === 'analytics' && 'active'}`}>
              Analytics
            </span>
            </li>
            }
          </ul>
            <ul className='nav nav-tabs m-tabs m-tabs-line m-tabs-line--right m-tabs-line--primary'>
              {this.props.showViewInStore &&
                <li className='nav-item m-tabs__item'>
                  <a href={this.props.storeUrl} target='_blank' rel='noopener noreferrer'
                    className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                    style={{marginTop: '12px', color: 'white'}}>
                    <span>
                      <i className='fa fa-external-link' />
                      <span>
                            View in Store
                          </span>
                    </span>
                </a>
                </li>
              }
              {this.props.showSave &&
                <li className='nav-item m-tabs__item'>
                  <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                  style={{marginTop: '12px'}} onClick={this.props.onSave}>
                      Save
                </button>
                </li>
              }
            </ul>
        </div>
      </div>
    )
  }
}

Tabs.propTypes = {
  'currentTab': PropTypes.string.isRequired,
  'updateState': PropTypes.func.isRequired,
  'onSave': PropTypes.func.isRequired,
  'showSave': PropTypes.bool,
  'showMessageLogs': PropTypes.bool,
  'showViewInStore': PropTypes.bool,
  'showAnalytics': PropTypes.bool,
  'storeUrl': PropTypes.string,
}

export default Tabs
