import React from 'react'
import {createCustomField} from '../../redux/actions/customFields.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'

class CreateCustomField extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      name: '',
      type: '',
      description: '',
      closeModal: ''
    }
    this.nameHandleChange = this.nameHandleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.typeHandleChange = this.typeHandleChange.bind(this)
    this.descriptionHandleChange = this.descriptionHandleChange.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }
  componentDidMount () {
  }
  nameHandleChange (event) {
    this.setState({name: event.target.value})
  }
  typeHandleChange (event) {
    this.setState({type: event.target.value})
  }
  descriptionHandleChange (event) {
    this.setState({description: event.target.value})
  }
  onSubmit (event) {
    let data = {
      name: this.state.name.toLowerCase(),
      type: this.state.type.toLowerCase(),
      description: this.state.description.toLocaleLowerCase(),
      companyId: '',
      createdBy: ''
    }
    this.props.createCustomField(data, this.handleResponse)
    event.preventDefault()
  }

  handleResponse (res) {
    if (res.status === 'success' && res.payload) {
      this.msg.success('New Custom Field Created')
      this.setState({closeModal: 'modal'})
      document.getElementById('create').click()
      this.setState({closeModal: '', name: '', type: '', description: ''})
    } else {
      this.msg.error(res.description)
      this.setState({closeModal: ''})
    }
  }

  clear () {
    this.setState({name: '', type: '', description: ''})
  }
  render () {
    var alertOptions = {
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
            <div style={{ display: 'block', height: '70px' }} className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                Create New Custom Field
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
                      <div className='' style={{marginTop: '10px'}}>
                        <label>Name:</label><i className='la la-question-circle' data-toggle='tooltip' title='By what name the field will apear!' />
                      </div>
                      <input type='text' id='name' className='form-control m-input' value={this.state.name} onChange={this.nameHandleChange} required />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='m-form__group m-form__group--inline'>
                      <div className='' style={{marginTop: '10px'}}>
                        <label>Type:</label><i className='la la-question-circle' data-toggle='tooltip' title='select any type, according to the nature of data' />
                      </div>
                      <div className='m-form__control'>
                        <select className='custom-select' id='type' value={this.state.type} style={{ width: '250px' }} tabIndex='-98' onChange={this.typeHandleChange} required>
                          <option key='' value='' selected disabled>...Select...</option>
                          <option key='string' value='text'>Text</option>
                          <option key='number' value='number'>Number</option>
                          <option key='date' value='date'>Date</option>
                          <option key='datetime' value='datetime'>Date and Time</option>
                          <option key='boolean' value='true/false'>True/False</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className='col-12'>
                    <div className='m-form__group m-form__group--inline'>
                      <div className='' style={{marginTop: '10px'}}>
                        <label>Description: (Optional)</label><i className='la la-question-circle' data-toggle='tooltip' title='detail about the field for you and other admins' />
                      </div>
                      <textarea value={this.state.description} onChange={this.descriptionHandleChange}
                        className='form-control m-input m-input--solid'
                        id='description' rows='3'
                        style={{height: '100px', resize: 'none'}} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button className='btn btn-default' onClick={() => { this.clear() }}>Clear</button>
                <button id='create' type='submit' className='btn btn-primary' data-dismiss={this.state.closeModal}>Create</button>
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
    createCustomField: createCustomField
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateCustomField)
