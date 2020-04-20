/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import {getInsights} from '../../redux/actions/sponsoredMessaging.actions'
import IconStack from '../../components/Dashboard/IconStack'
import CardBox from '../../components/Dashboard/CardBox'
import { UncontrolledTooltip } from 'reactstrap'

class AdInsights extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
  }
  this.props.getInsights(this.props.location.state.sponsoredMessage.adId)
}

componentDidMount () {
  console.log('state in insights', this.props.location.state.sponsoredMessage)
}

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <Link to='/sponsoredMessaging' className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill pull-right'>
            Back
          </Link>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Ad Insights</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <span className='m-portlet__head-text'>
                      <b style={{fontWeight: 'bold'}}>Ad Name:</b> {this.props.insights && this.props.insights.ad_name ? this.props.insights.ad_name : '-'}
                    </span>
                  </div>
                  <div className='m-portlet__head-caption'>
                    <span className='m-portlet__head-text'>
                      <b style={{fontWeight: 'bold'}}>Start Date:</b> {this.props.insights && this.props.insights.date_start ? this.props.insights.date_start : '-'}
                    </span>
                  </div>
                  <div className='m-portlet__head-caption'>
                    <span className='m-portlet__head-text'>
                      <b style={{fontWeight: 'bold'}}>Stop Date:</b> {this.props.insights && this.props.insights.date_stop ? this.props.insights.date_stop : '-'}
                    </span>
                  </div>
                  <div className='m-portlet__head-caption'>
                    <span className='m-portlet__head-text'>
                      <b style={{fontWeight: 'bold'}}>Account Currency:</b> {this.props.insights && this.props.insights.account_currency ? this.props.insights.account_currency : '-'}
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <div className='m-portlet'>
              <div className='m-portlet__body' style={{height: '312px'}}>
                <div className='tab-content' style={{paddingTop: '30px', paddingBottom: '30px'}}>
                    <div className='row'>
                      <div className='col-md-6'>
                        <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='impressions'>
                          <span>The number of times your ads were on screen</span>
                        </UncontrolledTooltip>
                        <IconStack
                          path='/'
                          state={{}}
                          icon='la la-mobile-phone'
                          title={this.props.insights && this.props.insights.impressions ? this.props.insights.impressions : '0'}
                          subtitle='Impressions'
                          iconStyle='success'
                          iconHeight='50px'
                          iconWidth='50px'
                          id='impressions'
                        />
                      </div>
                      <div className='col-md-6'>
                        <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='reach'>
                          <span>The number of people who saw your ads at least once</span>
                        </UncontrolledTooltip>
                        <IconStack
                          path='/'
                          state={{}}
                          icon='la la-eye'
                          title={this.props.insights && this.props.insights.reach ? this.props.insights.reach : '0'}
                          subtitle='Reach'
                          iconStyle='brand'
                          iconHeight='50px'
                          iconWidth='50px'
                          id='reach'
                        />
                      </div>
                    </div>
                    <br /><br /><br /><br />
                    <div className='row'>
                      <div className='col-md-6'>
                        <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='clicks'>
                          <span>The number of clicks on your ads</span>
                        </UncontrolledTooltip>
                        <IconStack
                          path='/'
                          state={{}}
                          icon='la la-mouse-pointer'
                          title={this.props.insights && this.props.insights.clicks ? this.props.insights.clicks : '0'}
                          subtitle='Clicks'
                          iconStyle='warning'
                          iconHeight='50px'
                          iconWidth='50px'
                          id='clicks'
                        />
                      </div>
                      <div className='col-md-6'>
                        <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='uniqueClicks'>
                          <span>The number of people who performed a click (all)</span>
                        </UncontrolledTooltip>
                        <IconStack
                          path='/'
                          state={{}}
                          icon='la la-hand-pointer-o'
                          title={this.props.insights && this.props.insights.unique_clicks ? this.props.insights.unique_clicks : '0'}
                          subtitle='Unique Clicks'
                          iconStyle='danger'
                          iconHeight='50px'
                          iconWidth='50px'
                          id='uniqueClicks'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='m-portlet__body'>
                <div className='row'>
                  <div className='col-md-6'>
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='amountSpent'>
                      <span>The estimated total amount of money you've spent on your campaign, ad set or ad during its schedule</span>
                    </UncontrolledTooltip>
                    <CardBox
                      style={`accent`}
                      value={this.props.insights && this.props.insights.spend ? this.props.insights.spend : '0'}
                      label='Amount Spent'
                      id='amountSpent'
                    />
                  </div>
                  <div className='col-md-6' >
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='cpm'>
                      <span>The average cost for 1,000 impressions</span>
                    </UncontrolledTooltip>
                    <CardBox
                      style={`danger`}
                      value={this.props.insights && this.props.insights.cpm ? this.props.insights.cpm : '0'}
                      label='Cost Per Mile (CPM)'
                      id='cpm'
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='cpp'>
                      <span>The average cost to reach 1,000 people</span>
                    </UncontrolledTooltip>
                    <CardBox
                      style={`warning`}
                      value={this.props.insights && this.props.insights.cpp ? this.props.insights.cpp : '0'}
                      label='Cost Per Rating Point (CPP)'
                      id='cpp'
                    />
                  </div>
                  <div className='col-md-6' >
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='ctr'>
                      <span>The percentage of times people saw your ad and performed a click</span>
                    </UncontrolledTooltip>
                    <CardBox
                      style={`success`}
                      value={this.props.insights && this.props.insights.ctr ? this.props.insights.ctr : '0'}
                      label='Click Through Rate (CTR)'
                      id='ctr'
                    />
                  </div>
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
  return {
    insights: (state.sponsoredMessagingInfo.insights),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getInsights,
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AdInsights)
