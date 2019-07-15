/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getShopifyStores, getOrders } from '../../redux/actions/abandonedCarts.actions'
import InstallApp from './installApp'
import AbandonedList from './abandonedList'
import ReactLoading from 'react-loading'

class AbandonedCarts extends React.Component {
  constructor (props) {
    super(props)
    this.props.getShopifyStores()
    props.getOrders()
  }
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Abandoned Carts`;
  }

  render () {
    if (this.props.isLoading) {
      return <div style={{ paddingLeft: 500 + 'px', paddingTop: 150 + 'px' }}>
        <ReactLoading type={'bars'} color={'#000000'} height={350} width={150} />
        <h1 style={{ marginTop: -150 + 'px' }}> Loading </h1>
      </div>
    }
    else if (this.props.storeList && this.props.storeList.length > 0) {
      return <AbandonedList storeList={this.props.storeList} />
    } else {
      return <InstallApp />
    }
  }
}

function mapStateToProps (state) {
  console.log('state', state)
  return {
    storeList: (state.abandonedInfo.storeList),
    isLoading: (state.abandonedInfo.isLoading),
    orderList: (state.abandonedInfo.orderList)
    // user: (state.basicInfo.user),
    // bots: (state.botsInfo.bots),
    // count: (state.botsInfo.count),
    // analytics: (state.botsInfo.analytics)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      getShopifyStores: getShopifyStores,
      getOrders: getOrders
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AbandonedCarts)
