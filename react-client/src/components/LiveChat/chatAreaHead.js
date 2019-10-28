import React from 'react'
import PropTypes from 'prop-types'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class ChatAreaHead extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false
    }
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  render () {
    return (
      <div style={{padding: '1.3rem', borderBottom: '1px solid #ebedf2'}}>
        {/*
          this.state.isShowingModal &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialog}>
              <h3>Resolve Chat Session</h3>
              <p>Are you sure you want to resolve this chat session?</p>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={(e) => {
                    this.changeStatus(e, 'resolved', this.props.activeSession._id)
                    this.closeDialog()
                  }}>
                    Yes
                  </button>
                </div>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={this.closeDialog}>
                    No
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        */}
        <button style={{backgroundColor: 'white'}} className='btn'>Status: {this.props.activeSession.is_assigned ? 'Assigned' : 'Unassigned'}</button>
        {
          this.props.activeSession.status === 'new'
          ? <div style={{float: 'right'}}>
            <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={this.props.showSearch} data-tip='Search' className='la la-search' />
            <i style={{cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold'}} onClick={this.showDialog} data-tip='Mark as done' className='la la-check' />
          </div>
          : <div style={{float: 'right'}}>
            <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={this.props.showSearch} data-tip='Search' className='la la-search' />
            <i style={{cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold'}} data-tip='Reopen' onClick={(e) => {
              this.changeStatus(e, 'new', this.props.activeSession._id)
            }} className='fa fa-envelope-open-o' />
          </div>
        }
      </div>
    )
  }
}

ChatAreaHead.propTypes = {
  'activeSession': PropTypes.object.isRequired,
  'showSearch': PropTypes.func.isRequired,
  'changeStatus': PropTypes.func.isRequired
}

export default ChatAreaHead
