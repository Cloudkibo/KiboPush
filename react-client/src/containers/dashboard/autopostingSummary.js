/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts'
import {loadAutopostingSummary} from '../../redux/actions/dashboard.actions'
import {loadAutopostingSummaryForBackdoor} from '../../redux/actions/backdoor.actions'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import IconStack from '../../components/Dashboard/IconStackForAutoposting'
import moment from 'moment'
import LISTWIDGET from '../../components/Dashboard/listWidget'

class AutopostingSummary extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      days: 30,
      showDaysDropDown: false,
      data: [],
      isShowingModal: false
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.prepareLineChartData = this.prepareLineChartData.bind(this)
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.changeDays = this.changeDays.bind(this)

    if (this.props.backdoor) {
      this.props.loadAutopostingSummaryForBackdoor({days: 30})
    } else {
      this.props.loadAutopostingSummary({days: 30})
    }
  }
  componentWillReceiveProps (nextprops) {
    console.log('in componentWillReceiveProps of autopostingSummary', nextprops)
    if (nextprops.autopostingSummary &&
      (nextprops.autopostingSummary.wordpressAutopostingGraph.length > 0 ||
        nextprops.autopostingSummary.twitterAutopostingGraph.length > 0 ||
        nextprops.autopostingSummary.facebookAutopostingGraph.length > 0 ||
        nextprops.autopostingSummary.rssFeedAutopostingGraph.length > 0
      )) {
        if (nextprops.autopostingSummary.twitterAutopostingGraph && nextprops.autopostingSummary.twitterAutopostingGraph.length > 0) {
          var twitterData = this.includeZeroCounts(nextprops.autopostingSummary.twitterAutopostingGraph)
        }
        if (nextprops.autopostingSummary.facebookAutopostingGraph && nextprops.autopostingSummary.facebookAutopostingGraph.length > 0) {
          var facebookData = this.includeZeroCounts(nextprops.autopostingSummary.facebookAutopostingGraph)
        }
        if (nextprops.autopostingSummary.wordpressAutopostingGraph && nextprops.autopostingSummary.wordpressAutopostingGraph.length > 0) {
          var wordpressData = this.includeZeroCounts(nextprops.autopostingSummary.wordpressAutopostingGraph)
        }
        if (nextprops.autopostingSummary.rssFeedAutopostingGraph && nextprops.autopostingSummary.rssFeedAutopostingGraph.length > 0) {
          var rssFeedData = this.includeZeroCounts(nextprops.autopostingSummary.rssFeedAutopostingGraph)
        }
        console.log('twitterData', twitterData)
        console.log('facebookData', facebookData)
        console.log('wordpressData', wordpressData)
        let dataChart = this.prepareLineChartData(twitterData, facebookData, wordpressData, rssFeedData)
        console.log('dataChart', dataChart)
        this.setState({data: dataChart})
      }
  }
  includeZeroCounts (data) {
    var dataArray = []
    var days = this.state.days
    var index = 0
    var varDate = moment()
    for (var i = 0; i < days; i++) {
      for (var j = 0; j < data.length; j++) {
        var recordId = data[j]._id
        var date = `${recordId.year}-${recordId.month}-${recordId.day}`
        var loopDate = moment(varDate).format('YYYY-MM-DD')
        if (moment(date).isSame(loopDate, 'day')) {
          var d = {}
          d.date = loopDate
          d.count = data[j].count
          dataArray.push(d)
          varDate = moment(varDate).subtract(1, 'days')
          index = 0
          break
        }
        index++
      }
      if (index === data.length) {
        var obj = {}
        obj.date = varDate.format('YYYY-MM-DD')
        obj.count = 0
        dataArray.push(obj)
        varDate = moment(varDate).subtract(1, 'days')
        index = 0
      }
    }
    return dataArray.reverse()
  }
  prepareLineChartData (twitter, facebook, wordpress, rssFeed) {
    var dataChart = []
    if (twitter && twitter.length > 0) {
      for (var i = 0; i < twitter.length; i++) {
        var record = {}
        record.date = twitter[i].date
        if (facebook && facebook.length > 0) {
          record.facebookCount = facebook[i].count
        } else {
          record.facebookCount = 0
        }
        if (wordpress && wordpress.length > 0) {
          record.wordpressCount = wordpress[i].count
        } else {
          record.wordpressCount = 0
        }
        if (rssFeed && rssFeed.length > 0) {
          record.rssFeedCount = rssFeed[i].count
        } else {
          record.rssFeedCount = 0
        }
        record.twitterCount = twitter[i].count
        dataChart.push(record)
      }
    } else if (facebook && facebook.length > 0) {
      for (var j = 0; j < facebook.length; j++) {
        var record1 = {}
        record1.date = facebook[j].date
        if (twitter && twitter.length > 0) {
          record1.twitterCount = twitter[j].count
        } else {
          record1.twitterCount = 0
        }
        if (wordpress && wordpress.length > 0) {
          record1.wordpressCount = wordpress[j].count
        } else {
          record1.wordpress = 0
        }
        if (rssFeed && rssFeed.length > 0) {
          record1.rssFeedCount = rssFeed[j].count
        } else {
          record1.rssFeedCount = 0
        }
        record1.facebookCount = facebook[j].count
        dataChart.push(record1)
      }
    } else if (wordpress && wordpress.length > 0) {
      for (var k = 0; k < wordpress.length; k++) {
        var record2 = {}
        record2.date = wordpress[k].date
        if (facebook && facebook.length > 0) {
          record2.facebookCount = facebook[k].count
        } else {
          record2.facebookCount = 0
        }
        if (twitter && twitter.length > 0) {
          record2.twitterCount = twitter[k].count
        } else {
          record2.twitterCount = 0
        }
        if (rssFeed && rssFeed.length > 0) {
          record2.rssFeedCount = rssFeed[k].count
        } else {
          record2.rssFeedCount = 0
        }
        record2.wordpressCount = wordpress[k].count
        dataChart.push(record2)
      }
    } else if (rssFeed && rssFeed.length > 0) {
     for (var l = 0; l < rssFeed.length; l++) {
       var record3 = {}
       record3.date = rssFeed[l].date
       if (facebook && facebook.length > 0) {
         record3.facebookCount = facebook[l].count
       } else {
         record3.facebookCount = 0
       }
       if (twitter && twitter.length > 0) {
         record3.twitterCount = twitter[l].count
       } else {
         record3.twitterCount = 0
       }
       if (wordpress && wordpress.length > 0) {
         record3.wordpressCount = wordpress[l].count
       } else {
         record3.wordpressCount = 0
       }
       record3.rssFeedCount = rssFeed[l].count
       dataChart.push(record3)
     }
   }
    return dataChart
  }
  onKeyDown (e) {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }
  changeDays (e) {
    this.setState({days: e.target.value})
    if (this.props.backdoor) {
      this.props.loadAutopostingSummaryForBackdoor({days: e.target.value})
    } else {
      this.props.loadAutopostingSummary({days: e.target.value})
    }
  }
  render () {
    console.log('backdoor', this.props.backdoor)
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>Autoposting</h3>
              </div>
            </div>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <form className='m-form m-form--fit m-form--label-align-right'>
                    <div className='m-portlet__body'>
                      <div className='form-group m-form__group row'>
                        <span htmlFor='example-text-input' className='col-form-label'>
                          Show records for last:&nbsp;&nbsp;
                        </span>
                        <div>
                          <input id='example-text-input' type='number' min='0' step='1' value={this.state.days} className='form-control' onKeyDown={this.onKeyDown} onChange={this.changeDays} />
                        </div>
                        <span htmlFor='example-text-input' className='col-form-label'>
                        &nbsp;&nbsp;days
                      </span>
                      </div>
                    </div>
                  </form>
                </li>
              </ul>
            </div>
          </div>
          <div className='m-portlet__body'>
          {this.props.autopostingSummary &&
            <div className='m-widget21'>
            <div className='row'>
              <div className='col-1'></div>
              <div className='col-5'>
                <IconStack
                  path='/autoposting'
                  icon='fa fa-twitter'
                  title='Twitter'
                  connected={this.props.autopostingSummary.twitterAutoposting}
                  received={this.props.autopostingSummary.twitterAutopostingsCame}
                  sent={this.props.autopostingSummary.twitterAutopostingsSent}
                  iconStyle='success'
                  connectedText='Accounts'
                  otherText='Tweets'
                />
              <div className='m--space-30' ></div>
              </div>
              <div className='col-5'>
                <IconStack
                  path='/autoposting'
                  icon='fa fa-facebook-f'
                  title='Facebook'
                  connected={this.props.autopostingSummary.facebookAutoposting}
                  received={this.props.autopostingSummary.facebookAutopostingsCame}
                  sent={this.props.autopostingSummary.facebookAutopostingsSent}
                  iconStyle='danger'
                  connectedText='Pages'
                  otherText='Posts'
                />
              <div className='m--space-30' ></div>
              </div>
              <div className='col-1'></div>
            </div>
            <div className='row'>
              <div className='col-1'></div>
              <div className='col-5'>
                <IconStack
                  path='/autoposting'
                  icon='fa fa-wordpress'
                  title='Wordpress'
                  connected={this.props.autopostingSummary.wordpressAutoposting}
                  received={this.props.autopostingSummary.wordpressAutopostingsCame}
                  sent={this.props.autopostingSummary.wordpressAutopostingsSent}
                  iconStyle='info'
                  connectedText='Channels'
                  otherText='Posts'
                />
              <div className='m--space-30' ></div>
              </div>
              <div className='col-5'>
                <IconStack
                  path='/autoposting'
                  icon='fa fa-feed fa-2x'
                  title='RSS'
                  connected={this.props.autopostingSummary.rssFeedAutoposting}
                  received={this.props.autopostingSummary.rssFeedAutopostingCame}
                  sent={this.props.autopostingSummary.rssFeedAutopostingSent}
                  iconStyle='warning'
                  connectedText='Feeds'
                  otherText='Feeds'
                />
              <div className='m--space-30' ></div>
              </div>
              <div className='col-1'></div>
            </div>
            <br />
            <center>
              {this.state.data.length > 0
              ? <LineChart width={600} height={300} data={this.state.data}>
                <XAxis dataKey='date' />
                <YAxis />
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip />
                <Legend />
                  <Line type='monotone' dataKey='twitterCount' name='Subscriber reach through Tweets Sent' stroke='#34bfa3' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='facebookCount' name='Subscriber reach through Facbook Posts Sent' stroke='#f4516c' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='wordpressCount' name='Subscriber reach through Wordpress Posts Sent' stroke='#5bc0de' activeDot={{r: 8}} />
                  <Line type='monotone' dataKey='rssFeedCount' name='Subscriber reach through RSS Feeds Sent' stroke='#ffb822' activeDot={{r: 8}} />
                </LineChart>
              : <span>No reports to show for the applied filters</span>
            }
            </center>
            <br />
            <br />
            <div className='m-widget5'>
              <LISTWIDGET
                imageUrl='https://cdn.cloudkibo.com/public/img/tweetsmoderation.png'
                title='Tweets Moderation'
                description='Analytics about tweets you moderated'
                stats={[
                  {stat: 'Tweets Moderated', value: this.props.autopostingSummary.tweetsForwarded + this.props.autopostingSummary.tweetsIgnored},
                  {stat: 'Tweets Forwarded', value: this.props.autopostingSummary.tweetsForwarded},
                  {stat: 'Tweets Ignored', value: this.props.autopostingSummary.tweetsIgnored}
                ]}
              />
              <LISTWIDGET
                imageUrl='https://cdn.cloudkibo.com/public/img/twittertofacebook.png'
                title='Tweets Published on Facebook'
                description='Analytics about tweets you autopost on Facebook page(s)'
                stats={[
                  {stat: 'Posts Published', value: this.props.autopostingSummary.posts},
                  {stat: 'Likes / Post', value: this.props.autopostingSummary.posts !== 0 && this.props.autopostingSummary.likes !== 0 ? parseInt(this.props.autopostingSummary.likes / this.props.autopostingSummary.posts, 10) : 0},
                  {stat: 'Comments / Post', value: this.props.autopostingSummary.posts !== 0 && this.props.autopostingSummary.comments !== 0 ? parseInt(this.props.autopostingSummary.comments / this.props.autopostingSummary.posts, 10) : 0}
                ]}
              />
            </div>
          </div>
        }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    autopostingSummary: (state.dashboardInfo.autopostingSummary),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadAutopostingSummary: loadAutopostingSummary,
    loadAutopostingSummaryForBackdoor: loadAutopostingSummaryForBackdoor
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AutopostingSummary)
