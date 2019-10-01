/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Setup from './setup'
import OptInActions from './optInActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Tab extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentTab: 'optInActions'
    }
    this.changeTab = this.changeTab.bind(this)
  }

  changeTab (value) {
    this.setState({currentTab: value})
  }

  componentDidMount () {
  }

  render () {
    return (
      <div className='col-md-12 col-lg-12 col-sm-12'>
        <ul className='nav nav-tabs m-tabs-line m-tabs-line--right' role='tablist' style={{float: 'none'}}>
          <li className='nav-item m-tabs__item'>
            <a className='nav-link m-tabs__link active' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.changeTab('optInActions')}>
              Opt-In Actions
            </a>
          </li>
          <li className='nav-item m-tabs__item'>
            <a className='nav-link m-tabs__link' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.changeTab('setup')}>
              Setup
            </a>
          </li>
        </ul>
        <br />
        <div className='tab-content'>
          <div className='tab-pane fade active in' id='tab_1'>
            {this.state.currentTab === 'setup'
            ? <Setup />
            : <OptInActions module={this.props.module} selectedMessengerCode={this.props.messengerCode} />
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Tab)
