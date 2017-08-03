/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';

class Header extends React.Component {
  render() {
    return (
   <header className="header" id="site-header">

	<div className="page-title">
		<h6>Dashboard</h6>
	</div>

	<div className="header-content-wrapper">
		<div className="control-block">
			<div className="author-page author vcard inline-items more">
				<div className="author-thumb">
					<img alt="author" src="img/author-page.jpg" className="avatar" />
					<span className="icon-status online"></span>
					<div className="more-dropdown more-with-triangle">
						<div className="mCustomScrollbar" data-mcs-theme="dark">
							<div className="ui-block-title ui-block-title-small">
								<h6 className="title">Your Account</h6>
							</div>
							<ul className="account-settings">
								<li>
									<a href="29-YourAccount-AccountSettings.html">

										<svg className="olymp-menu-icon"><use xlinkHref="icons/icons.svg#olymp-menu-icon"></use></svg>

										<span>Profile Settings</span>
									</a>
								</li>
								<li>
									<a href="/api/users/logout">
										<svg className="olymp-logout-icon"><use xlinkHref="icons/icons.svg#olymp-logout-icon"></use></svg>

										<span>Log Out</span>
									</a>
								</li>
							</ul>
						</div>

					</div>
				</div>
				<a href="02-ProfilePage.html" className="author-name fn">
					<div className="author-title">
						Richard Henricks <svg className="olymp-dropdown-arrow-icon"><use xlinkHref="icons/icons.svg#olymp-dropdown-arrow-icon"></use></svg>
					</div>
					
				</a>
			</div>

		</div>
	</div>

</header>
    );
  }
}

export default Header;
