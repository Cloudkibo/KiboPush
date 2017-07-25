/**
 * Created by sojharo on 20/07/2017.
 */

import React, {Component} from 'react';
import { Link } from 'react-router';

class Sidebar extends Component {


  render() {
    return (
      <div className="fixed-sidebar">
	<div className="fixed-sidebar-left sidebar--small" id="sidebar-left">
		<Link to="02-ProfilePage.html" className="logo">
			<img src="img/logo.png" alt="Olympus" />
		</Link>

		<div className="mCustomScrollbar" data-mcs-theme="dark">
			<ul className="left-menu">
				<li>
					<a className="js-sidebar-open">
						<svg className="olymp-menu-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="OPEN MENU"><use xlinkHref="icons/icons.svg#olymp-menu-icon"></use></svg>
					</a>
				</li>
				<li>
					<Link to="dashboard">
						<svg className="olymp-newsfeed-icon left-menu-icon" data-toggle="tooltip" data-placement="right" title="" data-original-title="DASHBOARD"><use xlinkHref="icons/icons.svg#olymp-newsfeed-icon"></use></svg>
					</Link>
				</li>
				<li>
					<Link to="subscribers">
						<svg className="olymp-star-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="SUBSCRIBERS"><use xlinkHref="icons/icons.svg#olymp-happy-faces-icon"></use></svg>
					</Link>
				</li>
				<li>
					<Link to="broadcasts">
						<svg className="olymp-badge-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="BROADCASTS"><use xlinkHref="icons/icons.svg#olymp-badge-icon"></use></svg>
					</Link>
				</li>
				<li>
					<Link to="pages">
						<svg className="olymp-calendar-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="PAGES"><use xlinkHref="icons/icons.svg#olymp-calendar-icon"></use></svg>
					</Link>
				</li>
				<li>
					<Link to="login">
						<svg className="olymp-happy-faces-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="Login"><use xlinkHref="icons/icons.svg#olymp-star-icon" ></use></svg>
					</Link>
				</li>
				<li>
					<Link to="18-MusicAndPlaylists.html">
						<svg className="olymp-headphones-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="MUSIC&PLAYLISTS"><use xlinkHref="icons/icons.svg#olymp-headphones-icon"></use></svg>
					</Link>
				</li>
				<li>
					<Link to="19-WeatherWidget.html">
						<svg className="olymp-weather-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="WEATHER APP"><use xlinkHref="icons/icons.svg#olymp-weather-icon"></use></svg>
					</Link>
				</li>
			

				<li>
					<Link to="25-FriendsBirthday.html">
						<svg className="olymp-cupcake-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="Friends Birthdays"><use xlinkHref="icons/icons.svg#olymp-cupcake-icon"></use></svg>
					</Link>
				</li>
				<li>
					<Link to="26-Statistics.html">
						<svg className="olymp-stats-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="Account Stats"><use xlinkHref="icons/icons.svg#olymp-stats-icon"></use></svg>
					</Link>
				</li>
				<li>
					<Link to="27-ManageWidgets.html">
						<svg className="olymp-manage-widgets-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="Manage Widgets"><use xlinkHref="icons/icons.svg#olymp-manage-widgets-icon"></use></svg>
					</Link>
				</li>
			</ul>
		</div>
	</div>

	<div className="fixed-sidebar-left sidebar--large" id="sidebar-left-1">
		<Link to="02-ProfilePage.html" className="logo">
			<img src="img/logo.png" alt="Olympus" />
			<h6 className="logo-title">olympus</h6>
		</Link>

		<div className="mCustomScrollbar" data-mcs-theme="dark">
			<ul className="left-menu">
				<li>
					<Link to="#" className="js-sidebar-open">
						<svg className="olymp-close-icon left-menu-icon"><use xlinkHref="icons/icons.svg#olymp-close-icon"></use></svg>
						<span className="left-menu-title">Collapse Menu</span>
					</Link>
				</li>
				<li>
					<Link to="dashboard">
						<svg className="olymp-newsfeed-icon left-menu-icon" data-toggle="tooltip" data-placement="right" title="" data-original-title="DASHBOARD"><use xlinkHref="icons/icons.svg#olymp-newsfeed-icon"></use></svg>
						<span className="left-menu-title">DASHBOARD</span>
					</Link>
				</li>
				<li>
					<Link to="subscribers">
						<svg className="olymp-happy-faces-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="SUBSCRIBERS"><use xlinkHref="icons/icons.svg#olymp-happy-faces-icon"></use></svg>
						<span className="left-menu-title">SUBSCRIBERS</span>
					</Link>
				</li>
				<li>
					<Link to="broadcasts">
						<svg className="olymp-badge-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="Community Badges"><use xlinkHref="icons/icons.svg#olymp-badge-icon"></use></svg>
						<span className="left-menu-title">BROADCASTS</span>
					</Link>
				</li>
				<li>
					<Link to="pages">
						<svg className="olymp-calendar-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="CALENDAR AND EVENTS"><use xlinkHref="icons/icons.svg#olymp-calendar-icon"></use></svg>
						<span className="left-menu-title">PAGES</span>
					</Link>
				</li>
				<li>
					<Link to="login">
						<svg className="olymp-star-icon left-menu-icon"   data-toggle="tooltip" data-placement="right" title="" data-original-title="LOGIN"><use xlinkHref="icons/icons.svg#olymp-star-icon"></use></svg>
						<span className="left-menu-title">Login</span>
					</Link>
				</li>
				
				<li>
					<Link to="18-MusicAndPlaylists.html">
						<svg className="olymp-headphones-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="MUSIC&PLAYLISTS"><use xlinkHref="icons/icons.svg#olymp-headphones-icon"></use></svg>
						<span className="left-menu-title">Music & Playlists</span>
					</Link>
				</li>
				<li>
					<Link to="19-WeatherWidget.html">
						<svg className="olymp-weather-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="WEATHER APP"><use xlinkHref="icons/icons.svg#olymp-weather-icon"></use></svg>
						<span className="left-menu-title">Weather App</span>
					</Link>
				</li>
			
				<li>
					<Link to="25-FriendsBirthday.html">
						<svg className="olymp-cupcake-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="Friends Birthdays"><use xlinkHref="icons/icons.svg#olymp-cupcake-icon"></use></svg>
						<span className="left-menu-title">Friends Birthdays</span>
					</Link>
				</li>
				<li>
					<Link to="26-Statistics.html">
						<svg className="olymp-stats-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="Account Stats"><use xlinkHref="icons/icons.svg#olymp-stats-icon"></use></svg>
						<span className="left-menu-title">Account Stats</span>
					</Link>
				</li>
				<li>
					<Link to="27-ManageWidgets.html">
						<svg className="olymp-manage-widgets-icon left-menu-icon"  data-toggle="tooltip" data-placement="right" title="" data-original-title="Manage Widgets"><use xlinkHref="icons/icons.svg#olymp-manage-widgets-icon"></use></svg>
						<span className="left-menu-title">Manage Widgets</span>
					</Link>
				</li>
			</ul>

			<div className="profile-completion">

				<div className="skills-item">
					<div className="skills-item-info">
						<span className="skills-item-title">Profile Completion</span>
						<span className="skills-item-count"><span className="count-animate" data-speed="1000" data-refresh-interval="50" data-to="76" data-from="0"></span><span className="units">76%</span></span>
					</div>
					<div className="skills-item-meter">
						<span className="skills-item-meter-active bg-primary" style={{width: 76}}></span>
					</div>
				</div>

				<span>Complete <Link to="#">your profile</Link> so people can know more about you!</span>

			</div>
		</div>
	</div>
</div>
    );
  }
}

export default Sidebar;
