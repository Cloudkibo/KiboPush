/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ChatBox from './chatBox'
import Header from './header'
import TitleBlock from './titleBlock'

class DemoSSA extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  componentWillMount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default'
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  render () {
    return (
      <div>
        <Header />
        <div style={{margin: '0px'}} className='m-grid__item m-grid__item--fluid m-wrapper'>
          <div style={{padding: '25px'}} className='m-content'>
            <div className='m-portlet__body'>
              <div style={{margin: 'auto'}} className='row'>
                <div className='col-2'>
                  &nbsp;
                </div>
                <div className='col-8'>
                  <div className='row'>
                    <div className='col-6'>
                      <TitleBlock />
                    </div>
                    <div className='col-6'>
                      <ChatBox />
                    </div>
                  </div>
                </div>
                <div className='col-2'>
                  &nbsp;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(DemoSSA)
