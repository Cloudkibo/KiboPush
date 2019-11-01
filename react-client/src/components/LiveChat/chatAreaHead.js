import React from 'react'
import PropTypes from 'prop-types'

class ChatAreaHead extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  render() {
    return (
      <div style={{ padding: '1.3rem', borderBottom: '1px solid #ebedf2' }}>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="resolveChatSession" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Resolve Chat Session
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to resolve this chat session?</p>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button className='btn btn-primary' onClick={(e) => {
                      this.changeStatus(e, 'resolved', this.props.activeSession._id)
                    }}
                    data-dismiss="modal">
                      Yes
                  </button>
                  </div>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button className='btn btn-primary' data-dismiss="modal">
                      No
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button style={{ backgroundColor: 'white' }} className='btn'>Status: {this.props.activeSession.is_assigned ? 'Assigned' : 'Unassigned'}</button>
        {
          this.props.activeSession.status === 'new'
            ? <div style={{ float: 'right' }}>
              <i style={{ cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px' }} onClick={this.props.showSearch} data-tip='Search' className='la la-search' />
              <i style={{ cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold' }} data-tip='Mark as done' className='la la-check' data-toggle="modal" data-target="#resolveChatSession" />
            </div>
            : <div style={{ float: 'right' }}>
              <i style={{ cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px' }} onClick={this.props.showSearch} data-tip='Search' className='la la-search' />
              <i style={{ cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold' }} data-tip='Reopen' onClick={(e) => {
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
