import React from 'react'
import { Link } from 'react-router'
import SideNav, { Nav, NavText } from 'react-sidenav'

class UserGuidePolls extends React.Component {
  render () {
    return (
      <div>
        <nav className='navbar navbar-light bg-faded'>
          <a className='navbar-brand' href=''><img src='./img/kibopush.png' width='200' height='50' /></a>
        </nav>
        <div style={{float: 'left', marginTop: 50}}>
          <SideNav highlightColor='#E91E63'>
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
          <h2> Polls </h2>
          <p> This feature allows you to create and send polls to your Messenger subscribers. On the basis of their response you can understand your customers’ interests and preferences. </p>
          <br />
          <h4> How to create a poll? </h4>
          <p>You need to perform the following steps to create a poll:</p>
          <ol>
            <li>Click on surveys from the sidebar.</li>
            <img src='./img/userGuide/polls.png' width='600px' />
            <br />
            <li>On Polls page, click on create poll button.</li>
            <li>You will be redirected to create poll page. Fill in the information and click on Create Poll button. </li>
            <img src='./img/userGuide/createPoll.png' width='600px' />
          </ol>
          <br />
          <h4> How to send a survey? </h4>
          <p>To send a poll, follow the steps given below:</p>
          <ol>
            <li>Click on Polls from the sidebar.</li>
            <img src='./img/userGuide/polls.png' width='600px' />
            <br />
            <li>Select the poll you want to send and click on send button.</li>
          </ol>
          <br />
          <h4> How to see the poll report? </h4>
          <p>Follow the following steps to see the poll report:</p>
          <ol>
            <li>Click on Polls from the sidebar.</li>
            <li>Select the poll whose report you want to see and click on report button.</li>
            <li>You will be redirected to poll report page where you can see the full report.</li>
          </ol>
        </div>
      </div>
    )
  }
}

export default UserGuidePolls
