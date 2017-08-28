import React from 'react'

class UserGuideWorkflows extends React.Component {
  render () {
    return (
      <div style={{float: 'left', width: '600px', marginTop: 50}}>
        <h2> Workflows </h2>
        <p> This feature allows you to generate automated responses when subscriber uses the certain keyword in his message. </p>
        <br />
        <h4> How to create a workflow? </h4>
        <p>You need to perform the following steps o create a workflow:</p>
        <ol>
          <li>Click on workflows from the sidebar.</li>
          <img src='./img/userGuide/workflows.png' width='600px' />
          <br />
          <li>On Polls page, click on create poll button.</li>
          <li>You will be redirected to create poll page. Fill in the information and click on Create button. </li>
          <img src='./img/userGuide/createWorkflow.png' width='600px' />
        </ol>
        <br />
        <h4> How to edit a workflow? </h4>
        <p>For editing a workflow:</p>
        <ol>
          <li>Click on workflows from the sidebar.</li>
          <img src='./img/userGuide/workflows.png' width='600px' />
          <br />
          <li>On Workflows page, you will see all the created workflows.</li>
          <li>Select a workflow you want to edit and click on Edit button.</li>
          <li>You will be redirected to edit workflow page. Here you can edit the workflow.</li>
          <li>Once you are done with the editing click on Save Changes button to save the changes.</li>
          <img src='./img/userGuide/editWorkflow.png' width='600px' />
        </ol>
        <br />
        <h4> How to disable a workflow? </h4>
        <p>To disable a workflow, follow the steps given below:</p>
        <ol>
          <li>Click on Workflows from the sidebar.</li>
          <img src='./img/userGuide/workflows.png' width='600px' />
          <br />
          <li>Select the workflow you want to disable and click on disable button.</li>
        </ol>
      </div>
    )
  }
}

export default UserGuideWorkflows
