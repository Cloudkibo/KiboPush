import React from 'react'
import PropTypes from 'prop-types'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class ChatAreaHead extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      pendingResponseValue: ''
    }
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.showSearch = this.showSearch.bind(this)
    this.showDialogPending = this.showDialogPending.bind(this)
    this.closeDialogPending = this.closeDialogPending.bind(this)
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  showSearch () {
    this.props.showSearch()
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  showDialogPending (value) {
    this.setState({isShowingModalPending: true, pendingResponseValue: value })
  }

  closeDialogPending () {
    this.setState({isShowingModalPending: false, pendingResponseValue: ''})
  }

  render () {
    return (
      <div style={{padding: '1.3rem', borderBottom: '1px solid #ebedf2'}}>
        {
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
                    this.props.changeStatus(e, 'resolved', this.props.activeSession._id)
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
        }
        {
          this.state.isShowingModalPending &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialogPending}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialogPending}>
              <h3>{this.state.pendingResponseValue ? 'Add ' : 'Remove '}Pending Response</h3>
              <p>{this.state.pendingResponseValue ? 'Are you sure you want to mark this session as pending response?' : 'Are you sure you want to remove this session as pending response?'}</p>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={(e) => {
                    this.props.removePending(this.props.activeSession, this.state.pendingResponseValue)
                    this.closeDialogPending()
                  }}>
                    Yes
                  </button>
                </div>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={this.closeDialogPending}>
                    No
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        {(this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D')
        ? <button style={{backgroundColor: 'white'}} className='btn'>Status: {this.props.activeSession.is_assigned ? 'Assigned' : 'Unassigned'}</button>
        : <button style={{backgroundColor: 'white'}} className='btn'></button>
        }
      {
          this.props.activeSession.status === 'new'
          ? <div style={{float: 'right'}}>
            {this.props.activeSession.pendingResponse
            ? <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={() => this.showDialogPending(false)} data-tip='Remove Pending Flag' className='la la-user-times' />
            : <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={() => this.showDialogPending(true)} data-tip='Add Pending Flag' className='la la-user-plus' />
            }
            <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={this.showSearch} data-tip='Search' className='la la-search' />
            <i style={{cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold'}} onClick={this.showDialog} data-tip='Mark as done' className='la la-check' />
          </div>
          : <div style={{float: 'right'}}>
            {this.props.activeSession.pendingResponse
            ? <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={() => this.showDialogPending(false)} data-tip='Remove Pending Flag' className='la la-user-times' />
            : <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={() => this.showDialogPending(true)} data-tip='Add Pending Flag' className='la la-user-plus' />
            }
            <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={this.showSearch} data-tip='Search' className='la la-search' />
            <i style={{cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold'}} data-tip='Reopen' onClick={(e) => {
              this.props.changeStatus(e, 'new', this.props.activeSession._id)
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
  'changeStatus': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired
}

export default ChatAreaHead
