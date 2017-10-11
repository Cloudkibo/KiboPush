import React from 'react'

class UserGuideBroadcasts extends React.Component {
  render () {
    return (
      <div style={{float: 'left', width: '600px', marginTop: 50}}>
        <h2> Conversations </h2>
        <p> This feature allows you to broadcast messages to your Messenger subscribers. You can send engaging contents, videos, images, links, etc. </p>
        <br />
        <h4> How to create and send conversations? </h4>
        <p>To create and send conversation follow the steps given below:</p>
        <ol>
          <li>Click on conversations from the sidebar.</li>
          <img src='./img/userGuide/convos1.png' width='600px' />
          <br />
          <li>On Conversations page, click on send conversation button.</li>
          <img src='./img/userGuide/convos2.png' width='600px' />
          <br />
          <li>You will be redirected to create conversation page. Folow the three step process, by moving your mouse towards red glowing circle, to understand the objects. You can send a component separately or with combination of other components as well. </li>
          <img src='./img/userGuide/convos3.png' width='600px' />
          <br />
          <li> Select the components you want to send. Enter text, attach attachments, select targeting, edit conversation title if you want.</li>
          <li>To preview your conversation, click on the Test Conversation button. It will send the convrsation to your messenger account. There you can preview the conversation and see how it will be shown to your subscribers.</li>
          <img src='./img/userGuide/convos4.png' width='600px' />
          <br />
          <li>When you are ready to send the conversations to your subscribers, click on the Send Conversation button.</li>
          <img src='./img/userGuide/convos5.png' width='600px' />
        </ol>
      </div>
    )
  }
}

export default UserGuideBroadcasts
