/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getAnalytics } from '../../redux/actions/abandonedCarts.actions'

class Analytics extends React.Component {
  constructor (props) {
    super(props)
    this.props.getAnalytics()
  }
  render () {
    return (
      <div className='row'>
        <div className='col-sm-8'>
          <div className='m-portlet m-portlet--full-height m-portlet--skin-light m-portlet--fit'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text substring-dashboard'>
                    { (this.props.storeList && this.props.storeList.length > 0) ? this.props.storeList[0].shopUrl : '' }
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='m-widget21'>
                <div className='row'>
                  <div className='col-xl-4'>
                    <div className='m-widget21__item'>
                      <span className='m-widget21__icon'>
                        <a href='#/' className='btn btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                          <i className='la la-shopping-cart  m--font-light' />
                        </a>
                      </span>
                      <div className='m-widget21__info'>
                        <span className='m-widget21__title'>
                          {
                        (this.props.analytics && this.props.analytics.totalAbandonedCarts) ? this.props.analytics.totalAbandonedCarts : 0
                        }
                        </span>
                        <br />
                        <span className='m-widget21__sub'>
                          Abandoned Carts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-4'>
                    <div className='m-widget21__item'>
                      <span className='m-widget21__icon'>
                        <a href='#/' className='btn btn-accent m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                          <i className='fa flaticon-cart m--font-light' />
                        </a>
                      </span>
                      <div className='m-widget21__info'>
                        <span className='m-widget21__title'>
                          {
                             (this.props.analytics && this.props.analytics.totalPurchasedCarts) ? this.props.analytics.totalPurchasedCarts : 0
                          }
                        </span>
                        <br />
                        <span className='m-widget21__sub'>
                          Purchased Carts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-4'>
                    <div className='m-widget21__item'>
                      <span className='m-widget21__icon'>
                        <a href='#/' className='btn btn-warning m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                          <i className='la la-money  m--font-light' />
                        </a>
                      </span>
                      <div className='m-widget21__info'>
                        <span className='m-widget21__title'>
                          {
                            (this.props.analytics && this.props.analytics.totalExtraSales) ? '$' + this.props.analytics.totalExtraSales : '$0'
                         }
                        </span>
                        <br />
                        <span className='m-widget21__sub'>
                          Extra Sales
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='m--space-30' />
                <div className='m-widget15'>
                  <div className='m-widget15__item'>
                    <span style={{fontSize: '1.1rem', fontWeight: '600', color: '#6f727d'}}>
                      {
                             (this.props.analytics && this.props.analytics.totalPurchasedCarts) ? Math.round((this.props.analytics.totalPurchasedCarts / this.props.analytics.totalAbandonedCarts * 100)) + '%' : 0 + '%'
                      }
                    </span>
                    <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                    Conversion Rate
                  </span>
                    <div className='m--space-10' />
                    <div className='progress m-progress--sm' style={{height: '6px'}}>
                      {
                      (this.props.analytics)
                      ? <div className='progress-bar bg-success' role='progressbar' style={{width: ((this.props.analytics.totalPurchasedCarts / this.props.analytics.totalAbandonedCarts) * 100) + '%'}} aria-valuenow={((this.props.analytics.totalPurchasedCarts / this.props.analytics.totalAbandonedCarts) * 100)} aria-valuemin='0' aria-valuemax='100' />
                      : <div className='progress-bar bg-success' role='progressbar' style={{width: 0 + '%'}} aria-valuenow={0} aria-valuemin='0' aria-valuemax='100' />
                    }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-sm-4'>
          <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-danger'>
            <div className='m-portlet__body'>
              <div className='m-widget26'>
                <div className='m-widget26__number'>
                  {
                 (this.props.analytics && this.props.analytics.totalClicks) ? this.props.analytics.totalClicks : 0
                  }
                  <small>
                Total Clicks
              </small>
                </div>
              </div>
            </div>
          </div>
          <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-success'>
            <div className='m-portlet__body'>
              <div className='m-widget26'>
                <div className='m-widget26__number'>
                  {
                  (this.props.analytics && this.props.analytics.totalPushSent) ? this.props.analytics.totalPushSent : 0
                 }
                  <small>
                Push Sent
              </small>
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
  console.log('state', state)
  return {
    storeList: (state.abandonedInfo.storeList),
    isLoading: (state.abandonedInfo.isLoading),
    analytics: (state.abandonedInfo.analytics)
    // user: (state.basicInfo.user),
    // bots: (state.botsInfo.bots),
    // count: (state.botsInfo.count),
    // analytics: (state.botsInfo.analytics)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      getAnalytics: getAnalytics
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Analytics)
