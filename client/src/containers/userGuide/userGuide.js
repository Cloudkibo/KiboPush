import React from 'react'
import SideNav, { Nav, NavText } from 'react-sidenav'
// eslint-disable-next-line no-unused-vars
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import UserGuideBroadcasts from './userGuideBroadcasts'
import UserGuidePolls from './userGuidePolls'
import UserGuideSurveys from './userGuideSurveys'
import UserGuideWorkflows from './userGuideWorkflows'

class UserGuide extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showGettingStarted: true,
      showBroadcasts: false,
      showSurveys: false,
      showWorkflows: false,
      showPolls: false,
      colorGS: '#E91E63',
      colorB: 'black',
      colorS: 'black',
      colorW: 'black',
      colorP: 'black'
    }
    this.selectItem = this.selectItem.bind(this)
  }

  selectItem (value) {
    switch (value) {
      case 'gettingStarted':
        this.setState({
          showGettingStarted: true,
          showBroadcasts: false,
          showSurveys: false,
          showWorkflows: false,
          showPolls: false,
          colorGS: '#E91E63',
          colorB: 'black',
          colorS: 'black',
          colorW: 'black',
          colorP: 'black'
        })
        break
      case 'broadcasts':
        this.setState({
          showGettingStarted: false,
          showBroadcasts: true,
          showSurveys: false,
          showWorkflows: false,
          showPolls: false,
          colorGS: 'black',
          colorB: '#E91E63',
          colorS: 'black',
          colorW: 'black',
          colorP: 'black'
        })
        break
      case 'surveys':
        this.setState({
          showGettingStarted: false,
          showBroadcasts: false,
          showSurveys: true,
          showWorkflows: false,
          showPolls: false,
          colorGS: 'black',
          colorB: 'black',
          colorS: '#E91E63',
          colorW: 'black',
          colorP: 'black'
        })
        break
      case 'polls':
        this.setState({
          showGettingStarted: false,
          showBroadcasts: false,
          showSurveys: false,
          showWorkflows: false,
          showPolls: true,
          colorGS: 'black',
          colorB: 'black',
          colorS: 'black',
          colorW: 'black',
          colorP: '#E91E63'
        })
        break
      case 'workflows':
        this.setState({
          showGettingStarted: false,
          showBroadcasts: false,
          showSurveys: false,
          showWorkflows: true,
          showPolls: false,
          colorGS: 'black',
          colorB: 'black',
          colorS: 'black',
          colorW: '#E91E63',
          colorP: 'black'
        })
    }
  }

  render () {
    return (
      <div>
        <nav className='navbar navbar-light bg-faded'>
          <a className='navbar-brand' href=''><img src='./img/kibopush.png' width='200' height='50' /></a>
        </nav>
        <div style={{float: 'left', marginTop: 50}}>
          <SideNav onItemSelection={this.selectItem}>
            <Nav id='gettingStarted'>
              <NavText style={{color: this.state.colorGS}}> Getting Started </NavText>
            </Nav>
            <Nav id='broadcasts'>
              <NavText style={{color: this.state.colorB}}> Conversations </NavText>
            </Nav>
            <Nav id='surveys'>
              <NavText style={{color: this.state.colorS}}> Surveys </NavText>
            </Nav>
            <Nav id='workflows'>
              <NavText style={{color: this.state.colorW}}> Workflows </NavText>
            </Nav>
            <Nav id='polls'>
              <NavText style={{color: this.state.colorP}}> Polls </NavText>
            </Nav>
          </SideNav>
        </div>
        {
          this.state.showGettingStarted &&
          <div style={{float: 'left', width: '600px', marginTop: 50}}>
            <h2> Getting Started </h2>
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
            <br />
            <h4> How to disconnect Facebook pages? </h4>
            <p>To disconnect any page follow these steps:</p>
            <ol>
              <li>Click on pages from the sidebar.</li>
              <img src='./img/userGuide/pages.png' width='600px' />
              <br />
              <li>On Pages screen, click on Add Pages button.</li>
              <li>You will be redirected to add pages screen. Here you will see all of your pages. The pages you have connected will show a disconnect button along with the name.</li>
              <img src='./img/userGuide/disconnectPages.png' width='600px' />
              <br />
              <li>Select the page you want to disconnect and click on disconnect button.</li>
            </ol>
            <br />
            <h4> How to invite subscribers? </h4>
            <p>There are two ways through which you can invite subscribers.</p>
            <ol>
              <li>Go to subscribers page. Click on the Invite Subscribers button.
                <br />
                <img src='./img/userGuide/InviteSubscribersButton.png' width='600px' />
                <br />
                <br />
                Select page from dropdown and use the link you get to invite subscribers.
                <br />
                <img src='./img/userGuide/InviteSubscribersSelectPage1.png' width='600px' />
                <br />
                <br />
                <img src='./img/userGuide/InviteSubscribersSelectPage2.png' width='600px' />
                <br />
                <br />
              </li>
              <li>Go to Pages. Click on the Invite Subscribers button along the page on which you want people to become subscribers.
                <br />
                <img src='./img/userGuide/InviteSubscribersButton2.png' width='600px' />
                <br />
                <br />
                Use the link you get to invite subscribers.
                <br />
                <img src='./img/userGuide/InviteSubscribersSelectPage2.png' width='600px' />
                <br />
                <br />
              </li>
            </ol>
          </div>
        }
        {
          this.state.showBroadcasts &&
            <UserGuideBroadcasts />
        }
        {
          this.state.showSurveys &&
            <UserGuideSurveys />
        }
        {
          this.state.showWorkflows &&
            <UserGuideWorkflows />
        }
        {
          this.state.showPolls &&
            <UserGuidePolls />
        }
      </div>
    )
  }
}

export default UserGuide
