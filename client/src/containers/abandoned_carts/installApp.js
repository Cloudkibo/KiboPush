/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadBotsList, createBot, deleteBot, loadAnalytics } from '../../redux/actions/smart_replies.actions'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'

class InstallApp extends React.Component {
  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>

          <div className='row'>
            <div className='col-xl-12'>
              <div style={{margin: 150 + 'px', textAlign: 'center'}}>
                <h1> KiboPush </h1>
                <h1> Install Shopify App </h1>
                <br />
                <input autoFocus className='form-control m-input' type='text' placeholder='Shop Url e.g. mystore.myshopify.com' ref='domain' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }} />
                <br />
                <select style={{height: '45px', width: 80 + '%'}}>
                  <option>Page 1</option>
                  <option>Page 2</option>
                  <option>Page 3</option>
                </select>
                <br />
                <br />
                <button type='button' className='btn  btn-success btn-lg' style={{marginTop: 25 + 'px'}}>Install</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
export default connect(mapStateToProps, mapDispatchToProps)(InstallApp)
