/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class AbandonedCarts extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  componentWillReceiveProps (nextProps) {
  }

  gotoList () {
      browserHistory.push({
        pathname: `/createBot`
      })
  }

  gotoInstall(){
  }

  render () {
   return
  }
}

function mapStateToProps (state) {
  console.log('state', state)
  return {
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    bots: (state.botsInfo.bots),
    count: (state.botsInfo.count),
    analytics: (state.botsInfo.analytics)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadBotsList: loadBotsList,
      loadMyPagesList: loadMyPagesList,
      createBot: createBot,
      deleteBot: deleteBot,
      loadAnalytics: loadAnalytics
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AbandonedCarts)
