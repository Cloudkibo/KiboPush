import React from 'react'
import { Link } from 'react-router'
import SideNav, { Nav, NavText } from 'react-sidenav'

class UserGuideBroadcasts extends React.Component {
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
          <h2> Broadcasts </h2>
          <p> This feature allows you to broadcast messages to your Messenger subscribers. You can send engaging contents, videos, images, links, etc. </p>
          <br />
          <h4> How to create a broadcast? </h4>
          <p>You need to perform the following steps o create a broadcast:</p>
          <ol>
            <li>Click on broadcasts from the sidebar.</li>
            <img src='./img/userGuide/broadcasts.png' width='600px' />
            <br />
            <li>On Broadcasts page, click on create broadcast button.</li>
            <li>You will be redirected to create broadcast page. Type the message, attach any attachments if you want, and click on Create Broadcast button. </li>
            <img src='./img/userGuide/createBroadcast.png' width='600px' />
          </ol>
          <br />
          <h4> How to edit a broadcast? </h4>
          <p>For editing a broadcast:</p>
          <ol>
            <li>Click on broadcasts from the sidebar.</li>
            <img src='./img/userGuide/broadcasts.png' width='600px' />
            <br />
            <li>On Broadcasts page, you will see all the created broadcasts.</li>
            <li>Select a broadcast you want to edit and click on Edit button.</li>
            <li>You will be redirected to edit broadcast page. Here you can edit the broadcast.</li>
            <li>Once you are done with the editing click on Save Broadcast button to save the changes.</li>
            <img src='./img/userGuide/editBroadcast.png' width='600px' />
          </ol>
          <br />
          <h4> How to send a broadcast? </h4>
          <p>To send a broadcast, follow the steps given below:</p>
          <ol>
            <li>Click on Broadcasts from the sidebar.</li>
            <img src='./img/userGuide/broadcasts.png' width='600px' />
            <br />
            <li>Select the broadcast you want to send and click on send button.</li>
          </ol>
        </div>
      </div>
    )
  }
}

export default UserGuideBroadcasts
