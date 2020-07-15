import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { Popover, PopoverBody} from 'reactstrap'
import { Picker } from 'emoji-mart'
import { createCannedResponses, updateCannedResponse } from '../../../redux/actions/settings.actions'

class cannedResponses extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showPopover: false,
      popoverOptions: {
        placement: 'left',
        target: '_picker_in_cannedResponse',
        content: (<div />)
      },
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
    this.getPicker = this.getPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this.appendUserName = this.appendUserName.bind(this)
    this.togglePopover = this.togglePopover.bind(this)
  }

  setEmoji (emoji) {
    let cannedresponseMessage = `${this.state.cannedresponseMessage}${emoji.native}`
    this.setState({cannedresponseMessage})
  }

  togglePopover () {
    this.setState({showPopover: !this.state.showPopover})
  }

  appendUserName (nameType) {
    let cannedresponseMessage = `${this.state.cannedresponseMessage}{{user_${nameType}_name}}`
    this.setState({cannedresponseMessage})
  }

  openPicker (type) {
    const popoverOptions = {
      placement: 'left',
      target: `_${type}_picker_canned`
    }
    this.getPicker(type, popoverOptions)
  }

  getPicker (type, popoverOptions) {
    console.log('type', type)
    switch (type) {
      case 'emoji':
        popoverOptions.content = (
          <Picker
            style={{paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
            emojiSize={24}
            perLine={6}
            skin={1}
            set='facebook'
            showPreview={false}
            showSkinTones={false}
            custom={[]}
            autoFocus={false}
            onClick={(emoji) => this.setEmoji(emoji)}
          />
        )
        break
      case 'user':
        popoverOptions.content = (
          <div>
            <span style={{cursor: 'pointer'}} onClick={() => this.appendUserName('first')}>First Name</span>
            <div className='m--space-10' />
            <span style={{cursor: 'pointer'}} onClick={() => this.appendUserName('last')}>Last Name</span>
            <div className='m--space-10' />
            <span style={{cursor: 'pointer'}} onClick={() => this.appendUserName('full')}>Full Name</span>
          </div>
        )
        break
      default:
    }
    console.log('popoverOptions.content', popoverOptions.content)
    this.setState({
      showPopover: true,
      popoverOptions
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.cannedResponse) {
      this.setState({ responseId: nextProps.cannedResponse._id, cannedCode: nextProps.cannedResponse.responseCode, cannedresponseMessage: nextProps.cannedResponse.responseMessage })
    } else {
      this.setState({ responseId: '', cannedCode: '', cannedresponseMessage: '' })
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

  close () {
    this.setState({closeModal: 'modal'}, () => {
      document.getElementById('create').click()
      this.setState({ closeModal: '', cannedCode: '', cannedresponseMessage: '' })
    })
  }

  onSubmit (event) {
    event.preventDefault()
    if (this.props.cannedResponse) {
      let dataexist = this.props.cannedResponses.filter((cannedResponse, i)=> {
        if(cannedResponse.responseCode.toLowerCase() === this.state.cannedCode.toLowerCase() && i !== this.props.index) {
           return cannedResponse
        }
      })
      console.log('dataexist', dataexist)
      if(dataexist.length===0) {
      let data = {
        responseId: this.state.responseId,
        responseCode: this.state.cannedCode,
        responseMessage: this.state.cannedresponseMessage
      }
      this.props.updateCannedResponse(data, this.handleUpdateResponse)
  } else {
    this.msg.error(`unable to edit Canned Message. ${this.state.cannedCode} Canned Code already exists`)
  }
    } else {
      let dataexist = this.props.cannedResponses.filter(cannedResponse=> cannedResponse.responseCode.toLowerCase() === this.state.cannedCode.toLowerCase())
      if(dataexist.length === 0) { 
      let data = {
        responseCode: this.state.cannedCode,
        responseMessage: this.state.cannedresponseMessage
      }
      this.props.createCannedResponses(data, this.handleCreateResponse)
      } else {
        this.msg.error(`${this.state.cannedCode} Canned Code already exists`)
      }
    }

  }

  codeHandleChange (event) {
    let str = event.target.value
    str = str.split(' ').join('')
    this.setState({ cannedCode: str })
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
        <div style={{background: 'rgba(33, 37, 41, 0.6)'}} className='modal fade' id='create_modal' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div style={{ transform: 'translate(0, 0)', marginLeft: '400px' }} className='modal-dialog' role='document'>
            <div className='modal-content' style={{ width: '600px' }} >
              <div style={{ display: 'block', height: '70px', textAlign: 'left' }} className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  {this.props.cannedResponse ? 'Update Canned Message' : 'Create New Canned Message'}
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
                      <div className='form-group m-form__group'>
                      <label for='Canned Code'>
                            Canned Code:
												</label>
                        <i className='la la-question-circle' data-toggle='tooltip' title='Code of canned response' />
                        <div class="input-group m-input-group">
                        <span class="input-group-addon" id="basic-addon1">
														/
													</span>
                        <input type='text' id='name' className='form-control m-input' value={this.state.cannedCode} onChange={this.codeHandleChange} maxlength='30' required />
                      </div>
                      </div>
                    </div>
                    <div className='col-12'>
                      <div className='m-form__group m-form__group--inline'>
                        <div className='' style={{textAlign: 'left', marginTop: '10px'}}>
                          <label>Canned Response</label><i className='la la-question-circle' data-toggle='tooltip' title='Message of canned response' />
                        </div>
                        <textarea value={this.state.cannedresponseMessage} onChange={this.responseMessageHandleChange}
                          className='form-control m-input m-input--solid'
                          id='description' rows='3'
                          style={{ height: '100px', resize: 'none' }} maxlength='500' required />
                        <span style={{position: 'absolute', bottom: 0, right: '10px'}}>
                        <i
                          style={{fontSize: '20px', margin: '5px', cursor: 'pointer'}}
                          className='fa fa-user'
                          id='_user_picker_canned'
                          onClick={() => {this.openPicker('user')}}
                        />
                        <i
                          style={{fontSize: '20px', margin: '5px', cursor: 'pointer', marginRight:'10px'}}
                          className='fa fa-smile-o'
                          id='_emoji_picker_canned'
                          onClick={() => {this.openPicker('emoji')}}
                        />
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
                <div className='modal-footer'>
                  <button className='btn btn-default' onClick={() => { this.close() }}>Close</button>
                  <button id='create' type='submit' className='btn btn-primary' data-dismiss={this.state.closeModal}>{this.props.cannedResponse ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div id='_picker_in_cannedResponse'>
          <Popover
            container={document.getElementsByClassName('narcissus_17w311v')[0]}
            className='greetingPopover'
            placement={this.state.popoverOptions.placement}
            isOpen={this.state.showPopover}
            target={this.state.popoverOptions.target}
            toggle={this.togglePopover}
          >
            <PopoverBody>
              {this.state.popoverOptions.content}
            </PopoverBody>
          </Popover>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    cannedResponses: state.settingsInfo.cannedResponses
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createCannedResponses,
    updateCannedResponse
}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(cannedResponses)