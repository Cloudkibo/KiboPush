/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import AbandonedList from './abandonedList'
import InstallApp from './installApp'
import AbandonedList from './abandonedList'

class AbandonedCarts extends React.Component {
  componentWillReceiveProps (nextProps) {
  }

  /* return <AbandonedList /> */
  render () {
    return <AbandonedList />
  }
}

function mapStateToProps (state) {
  console.log('state', state)
  return {
    // pages: (state.pagesInfo.pages),
    // user: (state.basicInfo.user),
    // bots: (state.botsInfo.bots),
    // count: (state.botsInfo.count),
    // analytics: (state.botsInfo.analytics)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {

    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AbandonedCarts)
