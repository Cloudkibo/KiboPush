import React from 'react'
import Dropzone from 'react-dropzone'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { saveFileForPhoneNumbers } from '../../redux/actions/growthTools.actions'
import {  AlertList, Alert, AlertContainer } from 'react-bs-notifier'

class CustomerMatching extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { files: [],
      textAreaValue: '',
      fileErrors: [],
      messageErrors : [],
      alertMessage : '',
      type: ''
     }

    this.onTextChange = this.onTextChange.bind(this)
    this.onButtonSubmit = this.onButtonSubmit.bind(this)
    this.validate = this.validate.bind(this)
  }

  onButtonSubmit(e)  {
<<<<<<< HEAD
    if (this.validate()) {
      saveFileForPhoneNumbers(this.state.files, this.state.textAreaValue)
    }
=======
    this.props.saveFileForPhoneNumbers(this.state.files, this.state.textAreaValue)
>>>>>>> ada8c492c00acff2b4314d090131c9790daf7919
  }

  onTextChange(e) {

    this.setState({textAreaValue : e.target.value})
    if (e.target.value) {
      this.setState({ messageErrors : []})
    } else {
      this.setState({
          messageErrors : [{errorMsg :  'Enter an invitation message'}]
      })
    }
  }

  onDrop (files) {
    this.setState({
      files : files,
      fileErrors : []
    })
  }

  validate()  {
    var errors = false
    console.log('validate',this.state)
    if (this.state.files && this.state.files.length < 1) {
          this.setState({
              fileErrors : [{errorMsg :  'Upload a file'}]
          })
          errors = true
      }
    if (this.state.textAreaValue == '' && this.state.textAreaValue.length < 1) {
          this.setState({
              messageErrors : [{errorMsg :  'Enter an invitation message'}]
          })
          errors = true
      }
      return !errors
  }

  componentWillReceiveProps (nextProps) {

    console.log('componentWillReceiveProps is called',nextProps)

    if (nextProps.uploadResponse.successMessage != '') {
      this.setState({
        alertMessage: nextProps.uploadResponse.successMessage,
        type: 'success'
      })
    } else if (nextProps.uploadResponse.errorMessage != '') {
      this.setState({
        alertMessage: nextProps.uploadResponse.errorMessage,
        type: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        type: ''
      })
    }
  }

  render () {

    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <h3>Customer Matching Using Phone Numbers</h3>
                  <br />
                  <h7>Upload a file with .csv extension containing phone numbers of your customers to invite them for a chat on messenger. The
              file should contain a column with the name 'phone_numbers'. This column should list all the customers&#39; phone numbers. The phone number will be used to send him
              an invitation on Facebook Messenger.</h7>
                  <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12 dropzone'>
                    <Dropzone className='file-upload-area' onDrop={this.onDrop.bind(this)} accept='.csv'>
                      <p>Try dropping some files here, or click to select files to upload. Only '.csv' files are accepted</p>
                      <h6>File Selected</h6>
                      <span>
                        {
                         this.state.files.map(f => <span>{f.name} - {f.size} bytes</span>)
                       }
                      </span>
                    </Dropzone>
                    <div className='row'>
                      <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                        <label>File Selected</label>
                        <input type = "text" disabled = 'true' value = { this.state.files[0] ? this.state.files[0].name : '' } style = {{ width : '50%'}}/>
                        <div className = 'col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12 text-help' style = {{color : 'red'}}>
                          {
                           this.state.fileErrors.map(f => <span>{f.errorMsg}</span>)
                          }
                        </div>
                      </div>
                      <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                        <textarea className='textArea'  placeholder='Enter Invitation Message' value = { this.state.textAreaValue } onChange = {this.onTextChange}/>
                        <div className = 'col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12 text-help' style = {{color : 'red'}}>
                            {
                             this.state.messageErrors.map(m => <span>{m.errorMsg}</span>)
                            }
                        </div>
                      </div>
                      <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                        <button className='btn btn-primary' onClick = {this.onButtonSubmit}>Submit</button>
                      </div>
                      {
                        this.state.alertMessage !== '' &&
                        <center>
                          <Alert type={this.state.type}>
                            {this.state.alertMessage}
                          </Alert>
                        </center>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}


function mapStateToProps (state) {
  console.log('in mapStateToProps', state)
  return {
    uploadResponse: state.getFileUploadResponse
    //uploadResponse: {successMessage : 'Your File has been uploaded'}
    //uploadResponse: {errorMessage : 'Your File has errors'}
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({saveFileForPhoneNumbers: saveFileForPhoneNumbers},
    dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(CustomerMatching);
