import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createMessengerComponent, editMessengerComponent } from '../../redux/actions/messengerComponents.actions'
import AlertContainer from 'react-alert'
import Files from 'react-files'

class Create extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.location.state ? this.props.location.state.messengerComponent.componentName : '',
      category: this.props.location.state ? this.props.location.state.messengerComponent.category : '',
      description: this.props.location.state ? this.props.location.state.messengerComponent.description : '',
      height: this.props.location.state ? this.props.location.state.messengerComponent.preferences.height : 'full',
      sharingEnabled: this.props.location.state ? this.props.location.state.messengerComponent.preferences.sharingEnabled : false,
      file: '',
      loading: false
    }
    this.updateName = this.updateName.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.updateHeight = this.updateHeight.bind(this)
    this.updateSharingEnabled = this.updateSharingEnabled.bind(this)
    this.updateFile = this.updateFile.bind(this)
    this.onSave = this.onSave.bind(this)
    this.handleResponse=this.handleResponse.bind(this)
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Messenger Component`;
  }

  updateName (e) {
    this.setState({name: e.target.value})
  }

  updateCategory (e) {
    this.setState({category: e.target.value})
  }

  updateDescription (e) {
    this.setState({description: e.target.value})
  }

  updateHeight (e) {
    this.setState({height: e.target.value})
  }

  updateSharingEnabled (e) {
    this.setState({sharingEnabled: e})
  }

  updateFile (files) {
    if (files.length > 0) {
      var fileSelected = files[0]
      this.setState({file: fileSelected})
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('nextProps in messengerComponents', nextProps)
  }

  onSave () {
    if (!this.state.name) {
      this.msg.error('Please enter name')
    } else if (!this.state.category) {
      this.msg.error('Please enter category')
    } else if (!this.state.file) {
      this.msg.error('Please select a zip file')
    } else {
      this.setState({loading: true})
      let preferences = {
        height: this.state.height,
        sharingEnabled: this.state.sharingEnabled
      }
      console.log('this.state.file', this.state.file)
      console.log('this.state.name', this.state.name)
      console.log('this.state.category', this.state.category)
      console.log('this.state.height', this.state.height)
      console.log('this.state.sharingEnabled', this.state.sharingEnabled)
      var fileData = new FormData()
      fileData.append('file', this.state.file)
      fileData.append('filename', this.state.file.name)
      fileData.append('filetype', this.state.file.type)
      fileData.append('filesize', this.state.file.size)
      fileData.append('componentName', this.state.name)
      fileData.append('category', this.state.category)
      fileData.append('description', this.state.description)
      fileData.append('preferences', preferences)
      console.log('fileData', fileData)
      this.props.createMessengerComponent(fileData, this.handleResponse)
    }
  }

  handleResponse(res) {
    if (res.status !== 'success') {
      this.msg.error(res.description || 'Failed to save messenger component')
    } else {
      this.msg.success('Saved Successfully')
    }
    this.setState({
      loading: false
    })
  }

  render() {
    let alertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <h3 className='m-portlet__head-text'>
                          {this.props.location.state ? 'Edit' : 'Create'} Messenger Component
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      <ul className='m-portlet__nav'>
                        <li className='m-portlet__nav-item'>
                          <button className='btn btn-secondary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                            onClick={() => {
                              this.props.history.push({
                                pathname: `/messengerComponents`
                              })}}>
                            Cancel
                          </button>
                        </li>
                        <li className='m-portlet__nav-item'>
                          <button className={`btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill ${this.state.loading && 'm-loader m-loader--light m-loader--right'}`} onClick={this.onSave}>
                            Save
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    <div className='m-form'>
                      <div className='form-group m-form__group row'>
                        <div className='col-md-6'>
                          <div id='question' className='form-group m-form__group'>
                            <label className='control-label' style={{fontWeight: '500'}}>Name:</label>
                            <input className='form-control' placeholder='Messenger Component Name'
                              style={{width: '60%'}} value={this.state.name} onChange={(e) => this.updateName(e)} />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div id='question' className='form-group m-form__group'>
                            <label className='control-label' style={{fontWeight: '500'}}>Category:</label>
                            <input className='form-control' placeholder='i.e Commerce'
                              style={{width: '60%'}} value={this.state.category} onChange={(e) => this.updateCategory(e)} />
                          </div>
                        </div>
                      </div>
                      <div id='question' className='form-group m-form__group'>
                        <label className='control-label' style={{fontWeight: '500'}}>Description (Optional):</label>
                        <textarea className='form-control' rows='4'
                          style={{width: '81%'}} value={this.state.description} onChange={(e) => this.updateDescription(e)} />
                      </div>
                      <div id='question' className='form-group m-form__group'>
                        <label className='control-label' style={{marginBottom: '10px', fontWeight: '500'}}>Webview Height:</label><br />
                          <div className="m-radio-inline" style={{display: 'inline'}}>
          									<label className="m-radio" style={{fontWeight: 'lighter'}}>
          										<input
                                type='radio'
                                value='compact'
                                onChange={this.updateHeight}
                                onClick={this.updateHeight}
                                checked={this.state.height === 'compact'}
                              />
                              Compact
                              <span></span>
          									</label>
          									<label className="m-radio" style={{fontWeight: 'lighter'}}>
          										<input
                                type='radio'
                                value='tall'
                                onChange={this.updateHeight}
                                onClick={this.updateHeight}
                                checked={this.state.height === 'tall'}
                               />
                              Tall
          										<span></span>
          									</label>
                            <label className="m-radio" style={{fontWeight: 'lighter'}}>
          										<input
                                type='radio'
                                value='full'
                                onChange={this.updateHeight}
                                onClick={this.updateHeight}
                                checked={this.state.height === 'full'}
                               />
                             Full
          										<span></span>
          									</label>
          								</div>
                      </div>
                      <div id='question' className='form-group m-form__group row'>
                        <div className='col-md-2 form-group m-form__group'>
                          <label className='control-label' style={{fontWeight: '500'}}>Sharing Enabled:</label>
                        </div>
                        <div className='col-4' style={{marginTop: '-8px', marginLeft: '-30px'}}>
                        <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                          <label>
                            <input type='checkbox' data-switch='true' checked={this.state.sharingEnabled} onChange={() => { this.updateSharingEnabled(!this.state.sharingEnabled)}} />
                            <span></span>
                          </label>
                        </span>
                      </div>
                      </div>
                      <div id='question' className='form-group m-form__group' style={{marginTop: '-10px'}}>
                        <label className='control-label' style={{marginBottom: '10px', fontWeight: '500'}}>Messenger Components Files (in zip file):</label><br />
                          <Files
                            className='file-upload-area'
                            onChange={this.updateFile}
                            accepts={[
                              '.zip']}
                            multiple={false}
                            maxFileSize={25000000}
                            minFileSize={0}
                            clickable>
                            <button style={{ cursor: 'pointer' }} className='btn btn-success'>Upload New</button>
                          </Files>
                      </div>
                      {this.state.file &&
                      <div id='question' className='form-group m-form__group'  style={{marginTop: '-15px'}}>
                        <label className='control-label'>{this.state.file.name}</label><br />
                      </div>
                    }
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    editMessengerComponent,
    createMessengerComponent
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Create)
