/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';
import { Link } from 'react-router';


class Dashboard extends React.Component {

	 componentDidMount() {
		require('../../../public/js/jquery-3.2.0.min.js');
		require('../../../public/js/jquery.min.js');
		var addScript = document.createElement('script');
		addScript.setAttribute('src', '../../../js/theme-plugins.js');
		document.body.appendChild(addScript);
		addScript = document.createElement('script');
		addScript.setAttribute('src', '../../../js/material.min.js');
		document.body.appendChild(addScript);
		addScript = document.createElement('script');
		addScript.setAttribute('src', '../../../js/main.js');
		document.body.appendChild(addScript);
	}


	
  render() {
    return (
     <div className="container">
	 <br/><br/><br/><br/><br/><br/>
        <div className="row">
          <main className="col-xl-6 push-xl-3 col-lg-12 push-lg-0 col-md-12 col-sm-12 col-xs-12">
          <div className="ui-block" data-mh="friend-groups-item">
                <div className="friend-item friend-groups">
                  <div className="friend-item-content">              
                    <div className="friend-avatar">
                        <h1>24</h1>
                      <div className="author-content">
                        <Link to="subscribers" className="h5 author-name">Subscribers</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             <div className="ui-block" data-mh="pie-chart" style={{height: 381}}>
              <div className="ui-block-title">
                <div className="h6 title">Activity Chart</div>
                <a href="#" className="more"><svg className="olymp-three-dots-icon"><use xlinkHref="#olymp-three-dots-icon" /></svg></a>
              </div>
              <div>
                <div className="ui-block-content">
                  <div className="chart-with-statistic">
                    <ul className="statistics-list-count">
                      <li>
                        <div className="points">
                          <span>
                            <span className="statistics-point bg-purple" />
                            Polls
                          </span>
                        </div>
                        <div className="count-stat">8</div>
                      </li>
                      <li>
                        <div className="points">
                          <span>
                            <span className="statistics-point bg-breez" />
                            Messages
                          </span>
                        </div>
                        <div className="count-stat">5</div>
                      </li>
                      <li>
                        <div className="points">
                          <span>
                            <span className="statistics-point bg-primary" />
                            Surveys
                          </span>
                        </div>
                        <div className="count-stat">49</div>
                      </li>
                    </ul>
                    <div className="chart-js chart-js-pie-color"><iframe className="chartjs-hidden-iframe" tabIndex={-1} style={{display: 'block', overflow: 'hidden', border: 0, margin: 0, top: 0, left: 0, bottom: 0, right: 0, height: '100%', width: '100%', position: 'absolute', pointerEvents: 'none', zIndex: -1}} />
                      <canvas id="pie-color-chart" width={175} height={175} style={{display: 'block', width: 175, height: 175}} />
                      <div className="general-statistics">17
                        <span>Total Broadcasts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </main>
          <aside className="col-xl-3 pull-xl-6 col-lg-6 pull-lg-0 col-md-6 col-sm-12 col-xs-12">
          <div className="ui-block" data-mh="friend-groups-item">
                <div className="friend-item friend-groups">
                  <div className="friend-item-content">              
                    <div className="friend-avatar">
                        <h1>24</h1>
                      <div className="author-content">
                        <a href="#" className="h5 author-name">Pages</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <div className="ui-block">
				<div className="ui-block-title">
					<h6 className="title">Recent Broadcasts</h6>
				</div>

				<ol className="widget w-playlist">
					<li>
						<div className="playlist-thumb">
							<img src="img/playlist6.jpg" alt="thumb-composition" />
							<div className="overlay"></div>
							<a href="#" className="play-icon">
								<svg className="olymp-music-play-icon-big"><use  xlinkHref="icons/icons-music.svg#olymp-music-play-icon-big"></use></svg>
							</a>
						</div>

						<div className="composition">
							<a href="#" className="composition-name">The Past Starts Slow...</a>
							<a href="#" className="composition-author">System of a Revenge</a>
						</div>

						<div className="composition-time">
							<time className="published" dateTime="2017-03-24T18:18">3:22</time>
							<div className="more"><svg className="olymp-three-dots-icon"><use  xlinkHref="icons/icons.svg#olymp-three-dots-icon"></use></svg>
								<ul className="more-dropdown">
									<li>
										<a href="#">Add Song to Player</a>
									</li>
									<li>
										<a href="#">Add Playlist to Player</a>
									</li>
								</ul>
							</div>
						</div>

					</li>

					<li>
						<div className="playlist-thumb">
							<img src="img/playlist7.jpg" alt="thumb-composition" />
							<div className="overlay"></div>
							<a href="#" className="play-icon">
								<svg className="olymp-music-play-icon-big"><use  xlinkHref="icons/icons-music.svg#olymp-music-play-icon-big"></use></svg>
							</a>
						</div>

						<div className="composition">
							<a href="#" className="composition-name">The Pretender</a>
							<a href="#" className="composition-author">Kung Fighters</a>
						</div>

						<div className="composition-time">
							<time className="published" dateTime="2017-03-24T18:18">5:48</time>
							<div className="more"><svg className="olymp-three-dots-icon"><use  xlinkHref="icons/icons.svg#olymp-three-dots-icon"></use></svg>
								<ul className="more-dropdown">
									<li>
										<a href="#">Add Song to Player</a>
									</li>
									<li>
										<a href="#">Add Playlist to Player</a>
									</li>
								</ul>
							</div>
						</div>

					</li>
					<li>
						<div className="playlist-thumb">
							<img src="img/playlist8.jpg" alt="thumb-composition" />
							<div className="overlay"></div>
							<a href="#" className="play-icon">
								<svg className="olymp-music-play-icon-big"><use  xlinkHref="icons/icons-music.svg#olymp-music-play-icon-big"></use></svg>
							</a>
						</div>

						<div className="composition">
							<a href="#" className="composition-name">Blood Brothers</a>
							<a href="#" className="composition-author">Iron Maid</a>
						</div>

						<div className="composition-time">
							<time className="published" dateTime="2017-03-24T18:18">3:06</time>
							<div className="more"><svg className="olymp-three-dots-icon"><use  xlinkHref="icons/icons.svg#olymp-three-dots-icon"></use></svg>
								<ul className="more-dropdown">
									<li>
										<a href="#">Add Song to Player</a>
									</li>
									<li>
										<a href="#">Add Playlist to Player</a>
									</li>
								</ul>
							</div>
						</div>

					</li>
					<li>
						<div className="playlist-thumb">
							<img src="img/playlist9.jpg" alt="thumb-composition" />
							<div className="overlay"></div>
							<a href="#" className="play-icon">
								<svg className="olymp-music-play-icon-big"><use  xlinkHref="icons/icons-music.svg#olymp-music-play-icon-big"></use></svg>
							</a>
						</div>

						<div className="composition">
							<a href="#" className="composition-name">Seven Nation Army</a>
							<a href="#" className="composition-author">The Black Stripes</a>
						</div>

						<div className="composition-time">
							<time className="published" dateTime="2017-03-24T18:18">6:17</time>
							<div className="more"><svg className="olymp-three-dots-icon"><use xlinkHref="icons/icons.svg#olymp-three-dots-icon"></use></svg>
								<ul className="more-dropdown">
									<li>
										<a href="#">Add Song to Player</a>
									</li>
									<li>
										<a href="#">Add Playlist to Player</a>
									</li>
								</ul>
							</div>
						</div>

					</li>
					<li>
						<div className="playlist-thumb">
							<img src="img/playlist10.jpg" alt="thumb-composition" />
							<div className="overlay"></div>
							<a href="#" className="play-icon">
								<svg className="olymp-music-play-icon-big"><use  xlinkHref="icons/icons-music.svg#olymp-music-play-icon-big"></use></svg>
							</a>
						</div>

						<div className="composition">
							<a href="#" className="composition-name">Killer Queen</a>
							<a href="#" className="composition-author">Archiduke</a>
						</div>

						<div className="composition-time">
							<time className="published" dateTime="2017-03-24T18:18">5:40</time>
							<div className="more"><svg className="olymp-three-dots-icon"><use  xlinkHref="icons/icons.svg#olymp-three-dots-icon"></use></svg>
								<ul className="more-dropdown">
									<li>
										<a href="#">Add Song to Player</a>
									</li>
									<li>
										<a href="#">Add Playlist to Player</a>
									</li>
								</ul>
							</div>
						</div>

					</li>
				</ol>
			</div>
          </aside>
          <aside className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <div className="ui-block" data-mh="friend-groups-item">
                <div className="friend-item friend-groups">
                  <div className="friend-item-content">              
                    <div className="friend-avatar">
                        <h1>24</h1>
                      <div className="author-content">
                        <a href="#" className="h5 author-name">Scheduled Broadcasts</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <div className="ui-block">
              <div className="widget w-birthday-alert">
                <div className="icons-block">
                </div>
                <div className="content">
                  <div className="author-thumb">
                    <img src="/img/author-page.jpg" alt="author" />
                  </div>
                  <a href="#" className="h4 title">Welcome Richard!</a>
                  <p>Hope you are having a good day at Pied Piper! ;). Click the button below to start sending broadcasts.
                  </p>
                  <a href="#" className="btn btn-blue btn-sm">See Broadcasts<div className="ripple-container" /></a>
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
