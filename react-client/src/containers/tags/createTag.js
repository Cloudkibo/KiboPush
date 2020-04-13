import React from 'react'
import { createTag, renameTag } from '../../redux/actions/tags.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'

class CreateTag extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      name: this.props.tag ? this.props.tag.tag : '',
      closeModal: ''
    }
    this.nameHandleChange = this.nameHandleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleCreateResponse = this.handleCreateResponse.bind(this)
    this.handleUpdateResponse = this.handleUpdateResponse.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps CreateTag', nextProps)
    if (nextProps.tag) {
      this.setState({ 
          name: nextProps.tag.tag
      })
    } else {
        this.setState({ 
            name: ''
        })
    }
  }

  nameHandleChange (event) {
    this.setState({name: event.target.value})
  }

  onSubmit (event) {
    event.preventDefault()
    //debugger;
    if (this.props.tag) {
        let data = { 
            'tag': this.props.tag.tag, 
            'newTag': this.state.name
        }
        this.props.renameTag(data, this.handleUpdateResponse)
    } else {
        this.props.createTag(this.state.name.toLowerCase(), this.handleCreateResponse)
    }
  }

  handleUpdateResponse (res) {
    if (res.status === 'success' && res.payload) {
        this.msg.success('Tag has been changed')
        this.setState({closeModal: 'modal'}, () => {
            document.getElementById('create').click()
            this.setState({closeModal: '', name: ''})
        })
      } else {
        this.setState({closeModal: ''})
        if (res.status === 'failed' && res.description) {
          this.msg.error(`Unable to edit tag name. ${res.description}`)
        } else {
          this.msg.error('Unable to edit tag name')
        }
      }
  }

  handleCreateResponse (res) {
    if (res.status === 'success' && res.payload) {
        this.msg.success('New Tag Created')
        this.setState({closeModal: 'modal'}, () => {
            document.getElementById('create').click()
            this.setState({closeModal: '', name: ''})
        })
    } else {
        this.msg.error(res.description)
        this.setState({closeModal: ''})
    }
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
        <div style={{ transform: 'translate(0, 0)', marginLeft: '500px' }} className='modal-dialog' role='document'>
          <div className='modal-content' style={{ width: '400px' }} >
            <div style={{ display: 'block', height: '70px', textAlign: 'left' }} className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                {this.props.tag ? 'Update Tag' : 'Create New Tag'}
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
                  <div className='col-12'>
                    <div className='m-form__group m-form__group--inline'>
                      <div className='' style={{textAlign: 'left', marginTop: '10px'}}>
                        <label>Tag Name:</label><i className='la la-question-circle' data-toggle='tooltip' title='Name of the tag' />
                      </div>
                      <input type='text' id='name' className='form-control m-input' value={this.state.name} onChange={this.nameHandleChange} required />
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button id='create' type='submit' className='btn btn-primary' data-dismiss={this.state.closeModal}>{this.props.tag ? 'Update' : 'Create'}</button>
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
    createTag,
    renameTag
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTag)
