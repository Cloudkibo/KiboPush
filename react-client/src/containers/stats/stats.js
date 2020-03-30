/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { bindActionCreators } from 'redux'

class Stats extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadSubscribersList()
  }

  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'http://cdn.cloudkibo.com/public/js/selectize.min.js')
    document.body.appendChild(addScript)
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Stats`;
  }

  render () {
    return (
      <div>
        <Header />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div>
            <div className='container'>
              <br />
              <div className='row'>
                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div className='ui-block'>
                    <div className='ui-block-content'>
                      <ul className='statistics-list-count'>
                        <li>
                          <div className='points'>
                            <span>
                          Last Month Boadcasts
                        </span>
                          </div>
                          <div className='count-stat'>28
                            <span className='indicator positive'> + 4</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div className='ui-block'>
                    <div className='ui-block-content'>
                      <ul className='statistics-list-count'>
                        <li>
                          <div className='points'>
                            <span>
                          Last Month Polls
                        </span>
                          </div>
                          <div className='count-stat'>450
                            <span className='indicator negative'> - 12</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div className='ui-block'>
                    <div className='ui-block-content'>
                      <ul className='statistics-list-count'>
                        <li>
                          <div className='points'>
                            <span>
                          Last Month Surveys
                        </span>
                          </div>
                          <div className='count-stat'>16
                            <span className='indicator positive'> + 1</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div className='ui-block'>
                    <div className='ui-block-content'>
                      <ul className='statistics-list-count'>
                        <li>
                          <div className='points'>
                            <span>
                          Last Months Subscribers
                        </span>
                          </div>
                          <div className='count-stat'>390
                            <span className='indicator positive'> + 2</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-12 col-sm-12 col-xs-12'>
                  <div className='ui-block responsive-flex'>
                    <div className='ui-block-title'>
                      <div className='h6 title'>Monthly Chart of Subscriberss
                      </div>
                      <select className='without-border'>
                        <option value='LY'>LAST YEAR (2016)</option>
                        <option value='CUR'>CURRENT YEAR (2017)</option>
                      </select>
                      <a href='#/' className='more'>
                        <svg className='olymp-three-dots-icon'>
                          <use
                            xlinkHref='icons/icons.svg#olymp-three-dots-icon' />
                        </svg>
                      </a>
                    </div>
                    <div className='ui-block-content'>
                      <div className='chart-js chart-js-one-bar'>
                        <canvas id='one-bar-chart' width={1400} height={380} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-8 col-lg-8 col-md-7 col-sm-12 col-xs-12'>
                  <div className='ui-block responsive-flex' data-mh='pie-chart'>
                    <div className='ui-block-title'>
                      <div className='h6 title'>Monthly Broadcasts and
                        Subscribers
                      </div>
                      <select className='without-border'>
                        <option value='CUR'>LAST 3 MONTH</option>
                        <option value='LY'>LAST YEAR (2016)</option>
                      </select>
                      <div className='points align-right'>
                        <span>
                          <span className='statistics-point bg-primary' />
                      Broadcasts
                    </span>
                        <span>
                          <span className='statistics-point bg-green' />
                      Subscribers
                    </span>
                      </div>
                      <a href='#/' className='more'>
                        <svg className='olymp-three-dots-icon'>
                          <use
                            xlinkHref='icons/icons.svg#olymp-three-dots-icon' />
                        </svg>
                      </a>
                    </div>
                    <div className='ui-block-content'>
                      <div className='chart-js chart-js-line-graphic'>
                        <canvas id='line-graphic-chart' width={730}
                          height={300} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-5 col-sm-12 col-xs-12'>
                  <div className='ui-block' data-mh='pie-chart'>
                    <div className='ui-block-title'>
                      <div className='h6 title'>Activity Chart</div>
                      <a href='#/' className='more'>
                        <svg className='olymp-three-dots-icon'>
                          <use
                            xlinkHref='icons/icons.svg#olymp-three-dots-icon' />
                        </svg>
                      </a>
                    </div>
                    <div className='ui-block-content'>
                      <div className='chart-with-statistic'>
                        <ul className='statistics-list-count'>
                          <li>
                            <div className='points'>
                              <span>
                                <span className='statistics-point bg-purple' />
                            Broadcasts Sent
                          </span>
                            </div>
                            <div className='count-stat'>8</div>
                          </li>
                          <li>
                            <div className='points'>
                              <span>
                                <span className='statistics-point bg-breez' />
                            Subscribers
                          </span>
                            </div>
                            <div className='count-stat'>5</div>
                          </li>
                          <li>
                            <div className='points'>
                              <span>
                                <span className='statistics-point bg-primary' />
                            Polls
                          </span>
                            </div>
                            <div className='count-stat'>49</div>
                          </li>
                          <li>
                            <div className='points'>
                              <span>
                                <span className='statistics-point bg-yellow' />
                            Surveys
                          </span>
                            </div>
                            <div className='count-stat'>36</div>
                          </li>
                        </ul>
                        <div className='chart-js chart-js-pie-color'>
                          <canvas id='pie-color-chart' width={180}
                            height={180} />
                          <div className='general-statistics'>17
                            <span>Last Month Posts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='row'>
                <div
                  className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12'>
                  <div className='ui-block'>
                    <div className='ui-block-title'>
                      <div className='h6 title'>Push to Click Ratio</div>
                      <a href='#/' className='more'>
                        <svg className='olymp-three-dots-icon'>
                          <use
                            xlinkHref='icons/icons.svg#olymp-three-dots-icon' />
                        </svg>
                      </a>
                    </div>
                    <div className='ui-block-content'>
                      <div className='circle-progress circle-pie-chart'>
                        <div className='pie-chart' data-value='0.68'
                          data-startcolor='#38a9ff' data-endcolor='#317cb6'>
                          <div className='content'><span>%</span></div>
                        </div>
                      </div>
                      <div className='chart-text'>
                        <h6>Push:Click Ratio</h6>
                        <p>68% of subscribers clicked your link.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-xs-12'>
                  <div className='ui-block'>
                    <div className='ui-block-title'>
                      <div className='h6 title'>Geolocation data Of
                        subscribers
                      </div>
                      <a href='#/' className='more'>
                        <svg className='olymp-three-dots-icon'>
                          <use
                            xlinkHref='icons/icons.svg#olymp-three-dots-icon' />
                        </svg>
                      </a>
                    </div>
                    <div className='ui-block-content'>
                      <div className='world-statistics'>
                        <div className='world-statistics-img'>
                          <img src='img/world-map.png' alt='map' />
                        </div>
                        <ul className='country-statistics'>
                          <li>
                            <img src='img/flag1.jpg' alt='flag' />
                            <span className='country'>United States</span>
                            <span className='count-stat'>86.134</span>
                          </li>
                          <li>
                            <img src='img/flag2.jpg' alt='flag' />
                            <span className='country'>Mexico</span>
                            <span className='count-stat'>35.136</span>
                          </li>
                          <li>
                            <img src='img/flag3.jpg' alt='flag' />
                            <span className='country'>France</span>
                            <span className='count-stat'>12.600</span>
                          </li>
                          <li>
                            <img src='img/flag4.jpg' alt='flag' />
                            <span className='country'>Spain</span>
                            <span className='count-stat'>9.471</span>
                          </li>
                          <li>
                            <img src='img/flag5.jpg' alt='flag' />
                            <span className='country'>Ireland</span>
                            <span className='count-stat'>8.058</span>
                          </li>
                          <li>
                            <img src='img/flag6.jpg' alt='flag' />
                            <span className='country'>Argentina</span>
                            <span className='count-stat'>5.653</span>
                          </li>
                          <li>
                            <img src='img/flag7.jpg' alt='flag' />
                            <span className='country'>Ecuador</span>
                            <span className='count-stat'>2.924</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-lg-12 col-sm-12 col-xs-12'>
                  <div className='ui-block responsive-flex'>
                    <div className='ui-block-title'>
                      <div className='h6 title'>Trend Analysis
                        Subscribers:Clicks Ratio
                      </div>
                      <select className='without-border'>
                        <option value='LY'>LAST YEAR (2016)</option>
                        <option value={2}>CURRENT YEAR (2017)</option>
                      </select>
                      <a href='#/' className='more'>
                        <svg className='olymp-three-dots-icon'>
                          <use
                            xlinkHref='icons/icons.svg#olymp-three-dots-icon' />
                        </svg>
                      </a>
                    </div>
                    <div className='ui-block-content'>
                      <div className='chart-js chart-js-line-chart'>
                        <canvas id='line-chart' width={1400} height={380} />
                      </div>
                    </div>
                    <hr />
                    <div
                      className='ui-block-content display-flex content-around'>
                      <div className='chart-js chart-js-small-pie'>
                        <canvas id='pie-small-chart' width={90} height={90} />
                      </div>
                      <div className='points points-block'>
                        <span>
                          <span className='statistics-point bg-breez' />
                      Yearly Likes
                    </span>
                        <span>
                          <span className='statistics-point bg-yellow' />
                      Yearly Comments
                    </span>
                      </div>
                      <div className='text-stat'>
                        <div className='count-stat'>2.758</div>
                        <div className='title'>Total Likes</div>
                        <div className='sub-title'>This Year</div>
                      </div>
                      <div className='text-stat'>
                        <div className='count-stat'>5.420,7</div>
                        <div className='title'>Average Likes</div>
                        <div className='sub-title'>By Month</div>
                      </div>
                      <div className='text-stat'>
                        <div className='count-stat'>42.973</div>
                        <div className='title'>Total Comments</div>
                        <div className='sub-title'>This Year</div>
                      </div>
                      <div className='text-stat'>
                        <div className='count-stat'>3.581,1</div>
                        <div className='title'>Average Comments</div>
                        <div className='sub-title'>By Month</div>
                      </div>
                    </div>
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
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadSubscribersList: loadSubscribersList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Stats)
