/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';

class Dashboard extends React.Component {
  render() {
    return (
     <div className="container">
	 <br/><br/><br/><br/><br/><br/>
        <div className="row">
          <main className="col-xl-6 push-xl-3 col-lg-12 push-lg-0 col-md-12 col-sm-12 col-xs-12">
            <div className="ui-block">
              <div className="ui-block-title">
                <h6 className="title">Activity Feed</h6>
              </div>
              <ul className="widget w-twitter">
                <li className="twitter-item">
                  <a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Create Ticket<div className="ripple-container" /></a>
                  <a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Instant Reply<div className="ripple-container" /></a>
                  <a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Ignore<div className="ripple-container" /></a>
                  <div className="author-folder">
                    <img src="img/badge8.png" alt="avatar" />
                    <div className="author">
                      <a href="#" className="author-name">Jared</a>
                      <a href="#" className="group">From Twitter</a>
                    </div>
                  </div>
                  <p>Tomorrow with the agency we will run 5 km for charity. Come and give us your support! <a href="#" className="link-post">#Daydream5K</a></p>
                  <span className="post__date">
                    <time className="published" dateTime="2017-03-24T18:18">
                      2 hours ago
                    </time>
                  </span>
                </li>
                <li className="twitter-item">
                  <a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Create Ticket<div className="ripple-container" /></a>
                  <a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Instant Reply<div className="ripple-container" /></a>
                  <a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Ignore<div className="ripple-container" /></a>
                  <div className="author-folder">
                    <img src="img/badge8.png" alt="avatar" />
                    <div className="author">
                      <a href="#" className="author-name">Dinesh Chugtai</a>
                      <a href="#" className="group">From Facebook</a>
                    </div>
                  </div>
                  <p>Check out the new website of “The Bebop Bar”! <a href="#" className="link-post">bytle/thbp53f</a></p>
                  <span className="post__date">
                    <time className="published" dateTime="2017-03-24T18:18">
                      16 hours ago
                    </time>
                  </span>
                </li>
                <li className="twitter-item">
                  <a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Create Ticket<div className="ripple-container" /></a>
                  <a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Instant Reply<div className="ripple-container" /></a>
                  <a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Ignore<div className="ripple-container" /></a>
                  <div className="author-folder">
                    <img src="img/badge8.png" alt="avatar" />
                    <div className="author">
                      <a href="#" className="author-name">Jack Barker</a>
                      <a href="#" className="group">Facebook Review</a>
                    </div>
                  </div>
                  <p>The Sunday is the annual agency camping trip and I still haven’t got a tent  <a href="#" className="link-post">#TheWild #Indoors</a></p>
                  <span className="post__date">
                    <time className="published" dateTime="2017-03-24T18:18">
                      Yesterday
                    </time>
                  </span>
                </li>
              </ul>
            </div>
            <a id="load-more-button" href="#" className="btn btn-control btn-more" data-load-link="items-to-load.html" data-container="newsfeed-items-grid"><svg className="olymp-three-dots-icon"><use xlinkHref="icons/icons.svg#olymp-three-dots-icon" /></svg></a>
          </main>
          <aside className="col-xl-3 pull-xl-6 col-lg-6 pull-lg-0 col-md-6 col-sm-12 col-xs-12">
            <div className="ui-block" data-mh="pie-chart" style={{height: 381}}>
              <div className="ui-block-title">
                <div className="h6 title">Activity Chart</div>
                <a href="#" className="more"><svg className="olymp-three-dots-icon"><use xlinkHref="#olymp-three-dots-icon" /></svg></a>
              </div>
              <div className="ui-block-content">
                <div className="chart-with-statistic">
                  <ul className="statistics-list-count">
                    <li>
                      <div className="points">
                        <span>
                          <span className="statistics-point bg-purple" />
                          Tickets
                        </span>
                      </div>
                      <div className="count-stat">8</div>
                    </li>
                    <li>
                      <div className="points">
                        <span>
                          <span className="statistics-point bg-breez" />
                          Instant Replies
                        </span>
                      </div>
                      <div className="count-stat">5</div>
                    </li>
                    <li>
                      <div className="points">
                        <span>
                          <span className="statistics-point bg-primary" />
                          Ignore
                        </span>
                      </div>
                      <div className="count-stat">49</div>
                    </li>
                  </ul>
                  <div className="chart-js chart-js-pie-color"><iframe className="chartjs-hidden-iframe" tabIndex={-1} style={{display: 'block', overflow: 'hidden', border: 0, margin: 0, top: 0, left: 0, bottom: 0, right: 0, height: '100%', width: '100%', position: 'absolute', pointerEvents: 'none', zIndex: -1}} />
                    <canvas id="pie-color-chart" width={175} height={175} style={{display: 'block', width: 175, height: 175}} />
                    <div className="general-statistics">17
                      <span>Last Month Posts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <aside className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <div className="ui-block">
              <div className="widget w-birthday-alert">
                <div className="icons-block">
                </div>
                <div className="content">
                  <div className="author-thumb">
                    <img src="/img/author-page.jpg" alt="author" />
                  </div>
                  <a href="#" className="h4 title">Welcome Richard!</a>
                  <p>Hope you are having a good day at Pied Piper! ;). Click the button below to check out where your brand
                    was mentioned.
                  </p>
                  <a href="#" className="btn btn-blue btn-sm">See Mentions<div className="ripple-container" /></a>
                </div>
              </div>
            </div>
            <div className="ui-block">
              <div className="ui-block-title">
                <div className="h6 title">Public Brand Sentiment</div>
                <a href="#" className="more"><svg className="olymp-three-dots-icon"><use xlinkHref="#olymp-three-dots-icon" /></svg></a>
              </div>
              <div className="ui-block-content">
                <div className="points">
                  <span>
                    <span className="statistics-point bg-primary" />
                    Negative
                  </span>
                  <span>
                    <span className="statistics-point bg-yellow" />
                    Positive
                  </span>
                </div>
                <div className="chart-js chart-js-two-bars"><iframe className="chartjs-hidden-iframe" tabIndex={-1} style={{display: 'block', overflow: 'hidden', border: 0, margin: 0, top: 0, left: 0, bottom: 0, right: 0, height: '100%', width: '100%', position: 'absolute', pointerEvents: 'none', zIndex: -1}} />
                  <canvas id="two-bars-chart" width={292} height={219} style={{display: 'block', width: 292, height: 219}} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>


    );
  }
}

export default Dashboard;
