import React from 'react'
import PropTypes from 'prop-types'

class DeleteWithPassword extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      password: ''
    }
    this.onPasswordChange = this.onPasswordChange.bind(this)
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({password: ''})
  }
  onPasswordChange(e) {
    this.setState({ password: e.target.value })
  }
  render () {
    return (
      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id={this.props.id} ref='disconnectWhatsApp' tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
          <div className="modal-content">
            <div style={{ display: 'block' }} className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {this.props.title}
              </h5>
              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div style={{ color: 'black' }} className="modal-body">
              <p>{this.props.content}</p>
              <br />
              <div className='form-group m-form__group row' style={{marginLeft: '0px'}}>
              <label className= 'm-checkbox'>
              <input
                type="checkbox"
                onChange={this.props.handleCheckbox}
                checked={this.props.retainData}
              />
              <span />
              </label>
               <span className='control-label' style= {{marginLeft: '0px'}}>Grant KiboPush consent to retain Data for 60 days:</span>
              </div>
              <div id='question' className='form-group m-form__group'>
                <span className='control-label'>If you wish to proceed, please enter your password below:</span>
                <input className='form-control' type='password' placeholder='Enter password here'
                  value={this.state.password} onChange={this.onPasswordChange} />
              </div>
              <button style={{ float: 'right' }}
                className='btn btn-primary btn-sm'
                disabled={this.state.password === ''}
                onClick={() => {
                  this.props.deleteWithPassword(this.state.password)
                }}>Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
DeleteWithPassword.propTypes = {
  'id': PropTypes.string.isRequired,
  'title': PropTypes.string.isRequired,
  'content': PropTypes.string.isRequired,
  'deleteWithPassword': PropTypes.func.isRequired
}
export default DeleteWithPassword
