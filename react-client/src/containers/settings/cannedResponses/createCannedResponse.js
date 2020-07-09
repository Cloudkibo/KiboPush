import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { createCannedResponses, updateCannedResponse } from '../../../redux/actions/settings.actions'

class cannedResponses extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      closeModal: '',
      responseId: this.props.cannedResponse ? this.props.cannedResponse._id : '',
      cannedCode: this.props.cannedResponse ? this.props.cannedResponse.responseCode : '',
      cannedresponseMessage: this.props.cannedResponse ? this.props.cannedResponse.responseMessage: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.codeHandleChange = this.codeHandleChange.bind(this)
    this.responseMessageHandleChange = this.responseMessageHandleChange.bind(this)
    this.handleCreateResponse = this.handleCreateResponse.bind(this)
    this.handleUpdateResponse = this.handleUpdateResponse.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.cannedResponse) {
      this.setState({ responseId: nextProps.cannedResponse._id, cannedCode: nextProps.cannedResponse.responseCode, cannedresponseMessage: nextProps.cannedResponse.responseMessage })
    }
  }

  handleCreateResponse (res) {
    if (res.status === 'success' && res.payload) {
      this.msg.success(res.payload)
      this.setState({ closeModal: 'modal' }, () => {
        document.getElementById('create').click()
        this.setState({ closeModal: '', cannedCode: '', cannedresponseMessage: '' })
      })
    } else {
      this.msg.error(res.description)
      this.setState({ closeModal: '' })
    }
  }

  handleUpdateResponse (res) {
    if (res.status === 'success' && res.payload) {
      this.msg.success(res.payload)
      this.setState({closeModal: 'modal'}, () => {
        document.getElementById('create').click()
        this.setState({ closeModal: '', cannedCode: '', cannedresponseMessage: '' })
      })
    } else {
      this.setState({ closeModal: '' })
      if (res.status === 'failed' && res.description) {
        this.msg.error(`Unable to edit Canned Response. ${res.description}`)
      } else {
        this.msg.error('Unable to edit Canned Response')
      }
    }
  }

  clear () {

  }

  onSubmit (event) {
    event.preventDefault()
    if (this.props.cannedResponse) {
      let data = {
        responseId: this.state.responseId,
        responseCode: this.state.cannedCode,
        responseMessage: this.state.cannedresponseMessage
      }
      this.props.updateCannedResponse(data, this.handleUpdateResponse)

    } else {
      let data = {
        responseCode: this.state.cannedCode,
        responseMessage: this.state.cannedresponseMessage
      }
      this.props.createCannedResponses(data, this.handleCreateResponse)
    }

  }

  codeHandleChange (event) {
    this.setState({ cannedCode: event.target.value })
  }

  responseMessageHandleChange (event) {
    this.setState({ cannedresponseMessage: event.target.value })
  }

  render () {
    let alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{background: 'rgba(33, 37, 41, 0.6)', zIndex: 99992}} className='modal fade' id='create_modal' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div style={{ transform: 'translate(0, 0)', marginLeft: '400px' }} className='modal-dialog' role='document'>
            <div className='modal-content' style={{ width: '600px' }} >
              <div style={{ display: 'block', height: '70px', textAlign: 'left' }} className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  {this.props.customField ? 'Update Custom Field' : 'Create New Custom Field'}
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', float: 'right' }} type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>
                &times;
                  </span>
                </button>
              </div>
              <form onSubmit={this.onSubmit}>
                <div className='modal-body'>
                  <div className='row'>
                    <div className='col-8'>
                      <div className='m-form__group m-form__group--inline'>
                        <div className='' style={{textAlign: 'left', marginTop: '10px'}}>
                          <label>Canned Code:</label><i className='la la-question-circle' data-toggle='tooltip' title='title of Canned Response' />
                        </div>
                        <input type='text' id='name' className='form-control m-input' value={this.state.cannedCode} onChange={this.codeHandleChange} required />
                      </div>
                    </div>
                    <div className='col-12'>
                      <div className='m-form__group m-form__group--inline'>
                        <div className='' style={{textAlign: 'left', marginTop: '10px'}}>
                          <label>Canned Response</label><i className='la la-question-circle' data-toggle='tooltip' title='Description of Canned Response' />
                        </div>
                        <textarea value={this.state.cannedresponseMessage} onChange={this.responseMessageHandleChange}
                          className='form-control m-input m-input--solid'
                          id='description' rows='3'
                          style={{ height: '100px', resize: 'none' }} required />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='modal-footer'>
                  <button className='btn btn-default' onClick={() => { this.clear() }}>Clear</button>
                  <button id='create' type='submit' className='btn btn-primary' data-dismiss={this.state.closeModal}>{this.props.cannedResponse ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createCannedResponses,
    updateCannedResponse
}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(cannedResponses)