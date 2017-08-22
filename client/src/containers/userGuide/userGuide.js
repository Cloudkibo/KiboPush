import React from 'react'
import { Link } from 'react-router'
import SideNav, { Nav, NavText } from 'react-sidenav'

class UserGuide extends React.Component {
  render () {
    return (
      <div>
        <nav className='navbar navbar-light bg-faded'>
          <a className='navbar-brand' href=''><img src='./img/kibopush.png' width='200' height='50' /></a>
        </nav>
        <div style={{float: 'left', marginTop: 50}}>
          <SideNav highlightColor='#E91E63' defaultSelected='gettingStarted'>
            <Nav id='gettingStarted'>
              <NavText><Link to='/userGuide' > Getting Started </Link></NavText>
            </Nav>
            <Nav id='broadcats'>
              <NavText><Link to='/userGuide-broadcasts' > Broadcasts </Link></NavText>
            </Nav>
            <Nav id='surveys'>
              <NavText><Link to='/userGuide-surveys' > Surveys </Link></NavText>
            </Nav>
            <Nav id='workflows'>
              <NavText><Link to='/userGuide-workflows' > Workflows </Link></NavText>
            </Nav>
            <Nav id='polls'>
              <NavText><Link to='/userGuide-polls' > Polls </Link></NavText>
            </Nav>
          </SideNav>
        </div>
        <div style={{float: 'left', width: '600px', marginTop: 50}}>
          <h2> User Guide </h2>
          <p> Welcome to KiboPush user guide. This guide will walk you through the features of KiboPush. Like how you can connect Facebook pages, how you can send broadcasts, how you can invite subscribers, etc. </p>
          <br />
          <p>When you first using the service, you won’t be able to use any of the features until you:</p>
          <ol>
            <li>connect one or more Facebook pages</li>
            <li>have at least one subscriber</li>
          </ol>
          <br />
          <h4> How to connect Facebook pages? </h4>
          <p>When you sign up, you will be automatically redirect to Add Pages screen where you can connect pages by just clicking on the connect button displaying along the page name.</p>
          <img src='./img/userGuide/addPages.png' width='600px' />
          <br />
          <p>In case you have skipped it by mistake the you can connect pages using the following steps:</p>
          <ol>
            <li>Click on pages from the sidebar.</li>
            <img src='./img/userGuide/pages.png' width='600px' />
            <br />
            <li>On Pages screen, click on Add Pages button.</li>
            <li>You will be redirected to add pages screen. Here you can connect any Facebook pages you want to connect.</li>
            <img src='./img/userGuide/addPages.png' width='600px' />
          </ol>
        </div>
      </div>
    )
  }
}

export default UserGuide
